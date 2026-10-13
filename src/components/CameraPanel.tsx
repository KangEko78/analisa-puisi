import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Camera, CameraOff, FlipHorizontal, Eye, AlertCircle, RefreshCw, UserCheck, ShieldCheck, Mic } from 'lucide-react';

interface CameraPanelProps {
  studentName: string;
  studentClass: string;
  isPracticing: boolean;
  micLevel?: number;
  isRecordingAudio?: boolean;
  videoRefForwarded?: React.MutableRefObject<HTMLVideoElement | null>;
  onStudentInfoChange: (name: string, studentClass: string) => void;
}

export const CameraPanel: React.FC<CameraPanelProps> = ({
  studentName,
  studentClass,
  isPracticing,
  micLevel = 0,
  isRecordingAudio = false,
  videoRefForwarded,
  onStudentInfoChange,
}) => {
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const videoRef = videoRefForwarded || localVideoRef;
  const streamRef = useRef<MediaStream | null>(null);

  const [isCameraActive, setIsCameraActive] = useState<boolean>(true);
  const [isMirrored, setIsMirrored] = useState<boolean>(true);
  const [showEyeGuide, setShowEyeGuide] = useState<boolean>(true);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isLoadingCamera, setIsLoadingCamera] = useState<boolean>(false);
  const [isEditingStudent, setIsEditingStudent] = useState<boolean>(false);
  const [tempName, setTempName] = useState<string>(studentName);
  const [tempClass, setTempClass] = useState<string>(studentClass);

  const stopAllTracks = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        track.stop();
      });
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, []);

  const startCamera = useCallback(async () => {
    setIsLoadingCamera(true);
    setCameraError(null);
    stopAllTracks();

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Browser atau perangkat ini belum mendukung akses kamera video.');
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1920, max: 3840 },
          height: { ideal: 1080, max: 2160 },
          facingMode: 'user',
        },
        audio: false, // strictly no audio recorded or transmitted
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play().catch(() => {
          // Play request might be interrupted
        });
      }
      setIsCameraActive(true);
    } catch (err: unknown) {
      console.warn('Camera access issue:', err);
      let errorMsg = 'Gagal mengakses kamera.';
      if (err instanceof DOMException) {
        if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
          errorMsg = 'Izin kamera ditolak. Harap izinkan akses kamera di ikon gembok bilah alamat peramban.';
        } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
          errorMsg = 'Kamera tidak ditemukan. Pastikan webcam terpasang pada port USB IFP.';
        } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
          errorMsg = 'Kamera sedang digunakan oleh aplikasi lain di IFP. Tutup aplikasi tersebut dan coba lagi.';
        } else {
          errorMsg = `Akses kamera terhalang: ${err.message}`;
        }
      }
      setCameraError(errorMsg);
      setIsCameraActive(false);
    } finally {
      setIsLoadingCamera(false);
    }
  }, [stopAllTracks]);

  // Clean up on component unmount and page unload
  useEffect(() => {
    startCamera();

    const handleBeforeUnload = () => {
      stopAllTracks();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      stopAllTracks();
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [startCamera, stopAllTracks]);

  const handleToggleCamera = () => {
    if (isCameraActive) {
      stopAllTracks();
      setIsCameraActive(false);
      setCameraError(null);
    } else {
      startCamera();
    }
  };

  const handleSaveStudent = (e: React.FormEvent) => {
    e.preventDefault();
    onStudentInfoChange(tempName.trim() || 'Siswa Pembaca', tempClass.trim() || 'Kelas VIII');
    setIsEditingStudent(false);
  };

  return (
    <div className="flex flex-col h-full min-h-0 bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl relative">
      {/* Panel Top Header */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900/90 border-b border-slate-800 backdrop-blur z-20 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <h2 className="text-xs sm:text-sm font-semibold tracking-wide text-slate-200 uppercase font-display">
              Cermin Kamera Siswa
            </h2>
          </div>
          <span className="text-slate-600 hidden sm:inline">|</span>
          <span className="text-[11px] text-slate-400 font-mono hidden sm:inline">
            {isCameraActive ? 'LIVE 4K' : 'NONAKTIF'}
          </span>
        </div>

        {/* Action controls */}
        <div className="flex items-center gap-2">
          {/* Eye Contact Guide Toggle */}
          <button
            type="button"
            onClick={() => setShowEyeGuide(!showEyeGuide)}
            title="Panduan Tatapan Mata Penonton"
            className={`px-3 py-1.5 text-xs font-medium rounded-lg flex items-center gap-1.5 transition-colors ${
              showEyeGuide
                ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                : 'bg-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Garis Tatap Panggung</span>
          </button>

          {/* Mirror Flip Toggle */}
          <button
            type="button"
            onClick={() => setIsMirrored(!isMirrored)}
            title="Cerminkan Tampilan Kamera"
            className={`px-3 py-1.5 text-xs font-medium rounded-lg flex items-center gap-1.5 transition-colors ${
              isMirrored
                ? 'bg-slate-800 text-sky-300 border border-sky-500/30'
                : 'bg-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <FlipHorizontal className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Cermin: {isMirrored ? 'Aktif' : 'Normal'}</span>
          </button>

          {/* Camera On/Off Toggle Button */}
          <button
            type="button"
            onClick={handleToggleCamera}
            disabled={isLoadingCamera}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all shadow-sm ${
              isCameraActive
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30'
                : 'bg-emerald-600 text-white hover:bg-emerald-500'
            }`}
          >
            {isLoadingCamera ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : isCameraActive ? (
              <CameraOff className="w-3.5 h-3.5" />
            ) : (
              <Camera className="w-3.5 h-3.5" />
            )}
            <span>{isCameraActive ? 'Matikan Kamera' : 'Nyalakan Kamera'}</span>
          </button>
        </div>
      </div>

      {/* Video Viewport Stage */}
      <div className="relative flex-1 min-h-0 bg-black flex items-center justify-center overflow-hidden">
        {/* Real Live Video */}
        <video
          ref={videoRef}
          playsInline
          autoPlay
          muted
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            isCameraActive ? 'opacity-100' : 'opacity-0 absolute pointer-events-none'
          } ${isMirrored ? 'scale-x-[-1]' : ''}`}
        />

        {/* When Camera is OFF or ERROR */}
        {!isCameraActive && (
          <div className="flex flex-col items-center justify-center p-8 text-center max-w-md z-10">
            {cameraError ? (
              <div className="bg-rose-950/60 border border-rose-800/80 p-6 rounded-2xl text-rose-200 space-y-4 shadow-xl">
                <AlertCircle className="w-12 h-12 text-rose-400 mx-auto" />
                <h3 className="text-base font-semibold text-rose-100 font-display">
                  Pemberitahuan Akses Kamera
                </h3>
                <p className="text-sm leading-relaxed text-rose-300">
                  {cameraError}
                </p>
                <div className="pt-2 flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={startCamera}
                    className="w-full py-2.5 px-4 bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold rounded-xl transition-colors shadow-md flex items-center justify-center gap-2"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    Coba Hubungkan Kembali Kamera
                  </button>
                  <p className="text-xs text-rose-400/80">
                    Aplikasi tetap dapat digunakan dengan membaca teks teleprompter tanpa kamera.
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-slate-900/80 border border-slate-800 p-8 rounded-2xl text-slate-300 space-y-4 max-w-sm shadow-xl">
                <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
                  <CameraOff className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-white font-display">
                  Kamera Sedang Dinonaktifkan
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Nyalakan kamera untuk melihat gestur tubuh, mimik wajah, dan kontak mata siswa di depan kelas saat membaca puisi.
                </p>
                <button
                  type="button"
                  onClick={startCamera}
                  className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-xl transition-colors shadow-md flex items-center justify-center gap-2"
                >
                  <Camera className="w-4 h-4" />
                  Aktifkan Kamera Sekarang
                </button>
              </div>
            )}
          </div>
        )}

        {/* Theatrical Eye Guide / Stage Alignment Overlay */}
        {isCameraActive && showEyeGuide && (
          <div className="absolute inset-0 pointer-events-none z-10 flex flex-col justify-between">
            {/* Rule of Thirds - Top Eye Level Horizon */}
            <div className="w-full pt-[30%] relative">
              <div className="w-full border-t border-dashed border-amber-400/40 relative">
                <div className="absolute left-6 -top-2.5 bg-amber-500/90 text-slate-950 font-bold px-2 py-0.5 rounded text-[10px] tracking-wider uppercase font-mono shadow-sm">
                  Garis Tatapan Mata Penonton (Eye-Line)
                </div>
                <div className="absolute right-6 -top-2.5 bg-slate-900/90 text-amber-300/90 border border-amber-400/30 px-2 py-0.5 rounded text-[10px] font-mono">
                  Jaga pandangan sejajar garis ini
                </div>
              </div>
            </div>

            {/* Vertical Center Guideline */}
            <div className="absolute inset-y-0 left-1/2 w-px border-l border-dashed border-sky-400/20" />

            {/* Stage Horizon / Posture Guideline */}
            <div className="w-full pb-8 px-6 text-center">
              <span className="inline-block px-3 py-1 bg-black/60 backdrop-blur-md rounded-full text-slate-400 text-xs border border-white/10">
                Posisikan wajah & dada di tengah bingkai panggung
              </span>
            </div>
          </div>
        )}

        {/* Privacy & Safety Badge (Non-recording assurance) + Mic Activity */}
        <div className="absolute bottom-4 left-4 z-20 flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-black/70 backdrop-blur border border-slate-700/60 text-[11px] text-slate-300 font-mono">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Kamera Live (Video Tidak Direkam)</span>
          </div>

          {/* Real-time Microphone Audio Activity Meter */}
          {isRecordingAudio && (
            <div className="flex items-center gap-2 px-2.5 py-1 rounded-md bg-slate-950/80 backdrop-blur border border-amber-500/40 text-[11px] text-amber-300 font-mono">
              <Mic className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span>Audio Aktif:</span>
              <div className="w-14 h-2 bg-slate-800 rounded-full overflow-hidden flex items-center">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 via-amber-400 to-rose-500 transition-all duration-75"
                  style={{ width: `${Math.max(8, micLevel)}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Live Practice Status Indicator */}
        {isPracticing && (
          <div className="absolute top-4 right-4 z-20 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-600/90 text-white font-mono text-xs font-bold shadow-lg animate-pulse">
            <span className="w-2 h-2 rounded-full bg-white" />
            LATIHAN BERLANGSUNG
          </div>
        )}

        {/* Student Name Card (Editable on touch) */}
        <div className="absolute top-4 left-4 z-20">
          {isEditingStudent ? (
            <form
              onSubmit={handleSaveStudent}
              className="bg-slate-900/95 border border-slate-700 p-3 rounded-xl shadow-xl flex flex-col gap-2 min-w-[240px]"
            >
              <div className="text-[11px] font-semibold text-slate-300">Ubah Data Siswa:</div>
              <input
                type="text"
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                placeholder="Nama Siswa"
                className="px-2.5 py-1 text-xs bg-slate-950 border border-slate-700 rounded text-white focus:outline-none focus:border-amber-500"
                autoFocus
              />
              <input
                type="text"
                value={tempClass}
                onChange={(e) => setTempClass(e.target.value)}
                placeholder="Kelas (contoh: VIII B)"
                className="px-2.5 py-1 text-xs bg-slate-950 border border-slate-700 rounded text-white focus:outline-none focus:border-amber-500"
              />
              <div className="flex gap-2 justify-end pt-1">
                <button
                  type="button"
                  onClick={() => setIsEditingStudent(false)}
                  className="px-2 py-1 text-xs text-slate-400 hover:text-white"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-3 py-1 text-xs font-semibold bg-amber-500 text-slate-950 rounded hover:bg-amber-400"
                >
                  Simpan
                </button>
              </div>
            </form>
          ) : (
            <button
              type="button"
              onClick={() => {
                setTempName(studentName);
                setTempClass(studentClass);
                setIsEditingStudent(true);
              }}
              title="Ketuk untuk ubah nama siswa"
              className="group flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/85 backdrop-blur-md border border-slate-700/80 text-left hover:border-amber-500/50 transition-all shadow-md"
            >
              <div className="w-7 h-7 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300">
                <UserCheck className="w-3.5 h-3.5" />
              </div>
              <div>
                <div className="text-xs font-bold text-white leading-tight group-hover:text-amber-300 transition-colors">
                  {studentName}
                </div>
                <div className="text-[10px] text-slate-400 font-mono">
                  {studentClass} · Ketuk untuk ganti
                </div>
              </div>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
