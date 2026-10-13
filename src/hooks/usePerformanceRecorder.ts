import { useState, useRef, useCallback } from 'react';

export interface PerformanceRecorderState {
  isRecording: boolean;
  audioBlob: Blob | null;
  audioBase64: string | null;
  audioMimeType: string;
  audioSize: number;
  snapshots: string[];
  micLevel: number; // 0 - 100 (for live audio activity meter)
  micError: string | null;
}

export function usePerformanceRecorder() {
  const [state, setState] = useState<PerformanceRecorderState>({
    isRecording: false,
    audioBlob: null,
    audioBase64: null,
    audioMimeType: 'audio/webm',
    audioSize: 0,
    snapshots: [],
    micLevel: 0,
    micError: null,
  });

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioStreamRef = useRef<MediaStream | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const snapshotsRef = useRef<string[]>([]);

  // Capture static image snapshot from live video element (NOT video recording)
  const captureSnapshot = useCallback((videoEl: HTMLVideoElement | null) => {
    if (!videoEl || videoEl.videoWidth === 0 || videoEl.videoHeight === 0) return;

    try {
      const canvas = document.createElement('canvas');
      // Scale down to lightweight dimensions (480px max width for facial expression)
      const scale = Math.min(1, 480 / videoEl.videoWidth);
      canvas.width = Math.round(videoEl.videoWidth * scale);
      canvas.height = Math.round(videoEl.videoHeight * scale);

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.drawImage(videoEl, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.65);

      // Extract pure base64 without prefix
      const commaIdx = dataUrl.indexOf(',');
      const pureBase64 = commaIdx !== -1 ? dataUrl.slice(commaIdx + 1) : dataUrl;

      snapshotsRef.current.push(pureBase64);
      // Keep up to 3 most representative snapshots
      if (snapshotsRef.current.length > 3) {
        snapshotsRef.current.shift();
      }
      setState((prev) => ({ ...prev, snapshots: [...snapshotsRef.current] }));
    } catch (e) {
      console.warn('Gagal mengambil cuplikan foto:', e);
    }
  }, []);

  // Start Audio Recording
  const startRecording = useCallback(async () => {
    audioChunksRef.current = [];
    snapshotsRef.current = [];

    setState((prev) => ({
      ...prev,
      isRecording: false,
      audioBlob: null,
      audioBase64: null,
      audioSize: 0,
      snapshots: [],
      micLevel: 0,
      micError: null,
    }));

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Peramban tidak mendukung perekaman audio.');
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      audioStreamRef.current = stream;

      // Determine best supported mimeType
      let mimeType = 'audio/webm';
      if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
        mimeType = 'audio/webm;codecs=opus';
      } else if (MediaRecorder.isTypeSupported('audio/mp4')) {
        mimeType = 'audio/mp4';
      } else if (MediaRecorder.isTypeSupported('audio/ogg')) {
        mimeType = 'audio/ogg';
      }

      let recorder: MediaRecorder;
      try {
        recorder = new MediaRecorder(stream, { mimeType, audioBitsPerSecond: 32000 });
      } catch {
        recorder = new MediaRecorder(stream, { mimeType });
      }
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      recorder.start(250); // Collect every 250ms chunk for reliable capture

      // Live volume meter via Web Audio API Analyser
      try {
        const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (AudioCtxClass) {
          const audioCtx = new AudioCtxClass();
          audioContextRef.current = audioCtx;
          const source = audioCtx.createMediaStreamSource(stream);
          const analyser = audioCtx.createAnalyser();
          analyser.fftSize = 256;
          source.connect(analyser);
          analyserRef.current = analyser;

          const dataArray = new Uint8Array(analyser.frequencyBinCount);

          const updateVolume = () => {
            if (!analyserRef.current) return;
            analyserRef.current.getByteFrequencyData(dataArray);
            let sum = 0;
            for (let i = 0; i < dataArray.length; i++) {
              sum += dataArray[i];
            }
            const avg = sum / dataArray.length;
            const normalized = Math.min(100, Math.round((avg / 128) * 100));
            setState((prev) => ({ ...prev, micLevel: normalized }));
            animFrameRef.current = requestAnimationFrame(updateVolume);
          };

          animFrameRef.current = requestAnimationFrame(updateVolume);
        }
      } catch (err) {
        console.warn('Web Audio meter init failed:', err);
      }

      // Store normalized IANA MIME type (e.g. audio/webm without codecs suffix)
      const cleanMime = mimeType.split(';')[0].trim();

      setState((prev) => ({
        ...prev,
        isRecording: true,
        audioMimeType: cleanMime,
      }));
    } catch (err: any) {
      console.warn('Microphone access issue:', err);
      let msg = 'Izin mikrofon ditolak atau tidak ditemukan.';
      if (err instanceof DOMException && err.name === 'NotAllowedError') {
        msg = 'Izin mikrofon ditolak oleh pengguna/peramban. Izinkan akses mikrofon untuk analisis AI.';
      }
      setState((prev) => ({
        ...prev,
        isRecording: false,
        micError: msg,
      }));
    }
  }, []);

  // Stop Recording & Compile pure Base64
  const stopRecording = useCallback((): Promise<{
    blob: Blob | null;
    base64: string | null;
    mimeType: string;
    size: number;
    snapshots: string[];
  }> => {
    return new Promise((resolve) => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
        animFrameRef.current = null;
      }

      if (audioContextRef.current) {
        audioContextRef.current.close().catch(() => {});
        audioContextRef.current = null;
      }

      const recorder = mediaRecorderRef.current;
      const stream = audioStreamRef.current;

      const finishAndResolveEmpty = () => {
        if (stream) {
          stream.getTracks().forEach((t) => t.stop());
          audioStreamRef.current = null;
        }
        resolve({
          blob: null,
          base64: null,
          mimeType: state.audioMimeType,
          size: 0,
          snapshots: snapshotsRef.current,
        });
      };

      if (!recorder || recorder.state === 'inactive') {
        finishAndResolveEmpty();
        return;
      }

      recorder.onstop = () => {
        // Stop audio tracks
        if (stream) {
          stream.getTracks().forEach((t) => t.stop());
          audioStreamRef.current = null;
        }

        if (audioChunksRef.current.length === 0) {
          finishAndResolveEmpty();
          return;
        }

        const compiledBlob = new Blob(audioChunksRef.current, {
          type: state.audioMimeType,
        });

        // Convert Blob to pure Base64
        const reader = new FileReader();
        reader.onloadend = () => {
          const dataUrl = (reader.result as string) || '';
          // Strictly separate Base64 data from the Data URL prefix
          const commaIdx = dataUrl.indexOf(',');
          let pureBase64 = commaIdx !== -1 ? dataUrl.slice(commaIdx + 1) : dataUrl;
          // Clean any unwanted whitespace
          pureBase64 = pureBase64.replace(/\s+/g, '');

          // Standard IANA MIME type
          let cleanMime = state.audioMimeType;
          if (cleanMime.includes(';')) {
            cleanMime = cleanMime.split(';')[0].trim();
          }

          setState((prev) => ({
            ...prev,
            isRecording: false,
            audioBlob: compiledBlob,
            audioBase64: pureBase64,
            audioMimeType: cleanMime,
            audioSize: compiledBlob.size,
            micLevel: 0,
          }));

          resolve({
            blob: compiledBlob,
            base64: pureBase64,
            mimeType: cleanMime,
            size: compiledBlob.size,
            snapshots: snapshotsRef.current,
          });
        };

        reader.onerror = () => {
          finishAndResolveEmpty();
        };

        reader.readAsDataURL(compiledBlob);
      };

      recorder.stop();
    });
  }, [state.audioMimeType]);

  const resetRecording = useCallback(() => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    if (audioStreamRef.current) {
      audioStreamRef.current.getTracks().forEach((t) => t.stop());
      audioStreamRef.current = null;
    }
    audioChunksRef.current = [];
    snapshotsRef.current = [];
    setState({
      isRecording: false,
      audioBlob: null,
      audioBase64: null,
      audioMimeType: 'audio/webm',
      audioSize: 0,
      snapshots: [],
      micLevel: 0,
      micError: null,
    });
  }, []);

  return {
    isRecording: state.isRecording,
    audioBlob: state.audioBlob,
    audioBase64: state.audioBase64,
    audioMimeType: state.audioMimeType,
    audioSize: state.audioSize,
    snapshots: state.snapshots,
    micLevel: state.micLevel,
    micError: state.micError,
    startRecording,
    stopRecording,
    resetRecording,
    captureSnapshot,
  };
}
