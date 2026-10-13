import React, { useState, useEffect, useRef, useCallback } from 'react';
import { CameraPanel } from './components/CameraPanel';
import { TeleprompterPanel } from './components/TeleprompterPanel';
import { ControlBar, IfpLayoutMode } from './components/ControlBar';
import { EvaluationModal } from './components/EvaluationModal';
import { PoemSelectorModal } from './components/PoemSelectorModal';
import { GuideModal } from './components/GuideModal';
import { AiConsentModal } from './components/AiConsentModal';
import { AiJudgeReportModal } from './components/AiJudgeReportModal';
import { INITIAL_POEMS } from './data/poems';
import { Poem } from './types/poem';
import { AiJudgeReport, AnalyzeRequestPayload, AnalyzeResponsePayload } from './types/aiJudge';
import { usePerformanceRecorder } from './hooks/usePerformanceRecorder';
import { playCountdownBeep } from './utils/audioCue';
import {
  Sparkles,
  Tv,
  HelpCircle,
  BookOpen,
  Award,
  Layers,
} from 'lucide-react';

export default function App() {
  // Current active poem
  const [currentPoem, setCurrentPoem] = useState<Poem>(INITIAL_POEMS[0]);

  // Student identification
  const [studentName, setStudentName] = useState<string>('Siswa Pembaca');
  const [studentClass, setStudentClass] = useState<string>('Kelas VIII SMP');

  // Teleprompter presentation settings
  const [fontSize, setFontSize] = useState<number>(32); // 24, 32, 40, 48
  const [scrollSpeed, setScrollSpeed] = useState<number>(2); // 1 - 10
  const [showProsodyMarks, setShowProsodyMarks] = useState<boolean>(true);
  const [showEmphasis, setShowEmphasis] = useState<boolean>(true);
  const [showExpressionGuide, setShowExpressionGuide] = useState<boolean>(true);
  const [showLegend, setShowLegend] = useState<boolean>(false);

  // IFP Layout Mode
  const [layoutMode, setLayoutMode] = useState<IfpLayoutMode>('balanced');

  // Performance playback state
  const [isPracticing, setIsPracticing] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [practiceDuration, setPracticeDuration] = useState<number>(0);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const [activeLineId, setActiveLineId] = useState<string | null>(null);

  // Modals state
  const [isEvaluationOpen, setIsEvaluationOpen] = useState<boolean>(false);
  const [isPoemSelectorOpen, setIsPoemSelectorOpen] = useState<boolean>(false);
  const [isGuideOpen, setIsGuideOpen] = useState<boolean>(false);
  const [isConsentModalOpen, setIsConsentModalOpen] = useState<boolean>(false);
  const [isAiJudgeReportOpen, setIsAiJudgeReportOpen] = useState<boolean>(false);

  // AI Judge State
  const [isAiAnalyzing, setIsAiAnalyzing] = useState<boolean>(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [aiReport, setAiReport] = useState<AiJudgeReport | null>(null);
  const [lastCapturedAudio, setLastCapturedAudio] = useState<{
    base64: string | null;
    mimeType: string;
    snapshots: string[];
  } | null>(null);

  // Fullscreen state
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Refs
  const timerIntervalRef = useRef<number | null>(null);
  const videoElementRef = useRef<HTMLVideoElement | null>(null);
  const lastSnapshotProgressRef = useRef<number>(0);

  // Audio Recorder Hook
  const recorder = usePerformanceRecorder();

  // Practice Stopwatch
  useEffect(() => {
    if (isPracticing && !isPaused) {
      timerIntervalRef.current = window.setInterval(() => {
        setPracticeDuration((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
    }

    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, [isPracticing, isPaused]);

  // Periodic visual snapshot capture during recitation (at ~20%, ~45%, ~70%, ~90% progress)
  useEffect(() => {
    if (!isPracticing || isPaused) return;

    const diff = Math.abs(progressPercent - lastSnapshotProgressRef.current);
    if (diff >= 22 && videoElementRef.current) {
      lastSnapshotProgressRef.current = progressPercent;
      recorder.captureSnapshot(videoElementRef.current);
    }
  }, [progressPercent, isPracticing, isPaused, recorder]);

  // Countdown timer handler (3, 2, 1 -> Start Practice & Audio Capture)
  useEffect(() => {
    if (countdown === null) return;

    if (countdown > 0) {
      playCountdownBeep(false);
      const timer = setTimeout(() => {
        setCountdown((prev) => (prev !== null ? prev - 1 : null));
      }, 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      // Countdown completed!
      playCountdownBeep(true);
      setCountdown(null);
      setIsPracticing(true);
      setIsPaused(false);
      lastSnapshotProgressRef.current = 0;

      // Start audio recording
      recorder.startRecording().then(() => {
        // Take initial posture snapshot
        if (videoElementRef.current) {
          recorder.captureSnapshot(videoElementRef.current);
        }
      });
    }
  }, [countdown, recorder]);

  // Fullscreen change listener
  useEffect(() => {
    const handleFullscreenChange = () => {
      const doc = document as unknown as {
        fullscreenElement?: Element;
        webkitFullscreenElement?: Element;
        mozFullScreenElement?: Element;
        msFullscreenElement?: Element;
      };
      setIsFullscreen(
        !!(
          doc.fullscreenElement ||
          doc.webkitFullscreenElement ||
          doc.mozFullScreenElement ||
          doc.msFullscreenElement
        )
      );
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
    };
  }, []);

  // Action Handlers
  const handleStart = () => {
    setCountdown(3);
    setPracticeDuration(0);
    setProgressPercent(0);
    recorder.resetRecording();
    if (currentPoem.stanzas[0]?.lines[0]) {
      setActiveLineId(currentPoem.stanzas[0].lines[0].id);
    }
  };

  const handlePause = () => {
    setIsPaused(true);
  };

  const handleResume = () => {
    setIsPaused(false);
  };

  const handleRestart = () => {
    setIsPracticing(false);
    setIsPaused(false);
    setCountdown(null);
    setPracticeDuration(0);
    setProgressPercent(0);
    recorder.resetRecording();
    if (currentPoem.stanzas[0]?.lines[0]) {
      setActiveLineId(currentPoem.stanzas[0].lines[0].id);
    }
  };

  // When user clicks "Selesai & Analisis"
  const handleFinish = async () => {
    setIsPracticing(false);
    setIsPaused(false);

    // Stop audio recording and capture compiled base64
    const audioResult = await recorder.stopRecording();
    setLastCapturedAudio({
      base64: audioResult.base64,
      mimeType: audioResult.mimeType,
      snapshots: audioResult.snapshots,
    });

    if (!audioResult.base64 || audioResult.size < 500) {
      // Audio is empty or microphone captured 0 bytes
      setAiError(
        'Rekaman audio tidak terdeteksi atau durasi terlalu singkat (kurang dari 500 bytes). Pastikan izin mikrofon telah diberikan dan siswa melafalkan bait puisi di depan mikrofon.'
      );
      setIsAiJudgeReportOpen(true);
      return;
    }

    // Open privacy consent modal first
    setIsConsentModalOpen(true);
  };

  // Run AI Analysis via backend endpoint
  const runAiAnalysis = async (visualConsent: boolean) => {
    setIsConsentModalOpen(false);
    setIsAiJudgeReportOpen(true);
    setIsAiAnalyzing(true);
    setAiError(null);
    setAiReport(null);

    try {
      if (!lastCapturedAudio?.base64) {
        throw new Error('Rekaman audio tidak ditemukan atau durasi terlalu pendek. Pastikan mikrofon aktif.');
      }

      const poemRawText = currentPoem.stanzas
        .flatMap((s) => s.lines.map((l) => l.rawText))
        .join('\n');
      const prosodyMarkedText = currentPoem.stanzas
        .flatMap((s) => s.lines.map((l) => l.prosodyMarkedText))
        .join('\n');

      const payload: AnalyzeRequestPayload = {
        poemId: currentPoem.id,
        poemTitle: currentPoem.title,
        poet: currentPoem.poet,
        poemRawText,
        prosodyMarkedText,
        studentName,
        studentClass,
        durationSeconds: practiceDuration,
        audioBase64: lastCapturedAudio.base64,
        audioMimeType: lastCapturedAudio.mimeType || 'audio/webm',
        visualConsent,
        snapshots: visualConsent ? lastCapturedAudio.snapshots : [],
      };

      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data: AnalyzeResponsePayload = await res.json();

      if (!res.ok || !data.success || !data.report) {
        throw new Error(data.error || 'Server gagal memproses analisis evaluasi AI.');
      }

      setAiReport(data.report);
    } catch (err: any) {
      console.error('AI Judge error:', err);
      setAiError(err?.message || 'Terjadi gangguan saat menghubungkan ke layanan Gemini API.');
    } finally {
      setIsAiAnalyzing(false);
    }
  };

  const handleToggleFullscreen = () => {
    const doc = document as unknown as {
      fullscreenElement?: Element;
      webkitFullscreenElement?: Element;
      mozFullScreenElement?: Element;
      msFullscreenElement?: Element;
      exitFullscreen?: () => Promise<void>;
      webkitExitFullscreen?: () => Promise<void>;
      mozCancelFullScreen?: () => Promise<void>;
    };

    const isFull = !!(
      doc.fullscreenElement ||
      doc.webkitFullscreenElement ||
      doc.mozFullScreenElement ||
      doc.msFullscreenElement
    );

    if (!isFull) {
      const el = document.documentElement as unknown as {
        requestFullscreen?: () => Promise<void>;
        webkitRequestFullscreen?: () => Promise<void>;
        mozRequestFullScreen?: () => Promise<void>;
        msRequestFullscreen?: () => Promise<void>;
      };
      if (el.requestFullscreen) {
        el.requestFullscreen().catch(() => {});
      } else if (el.webkitRequestFullscreen) {
        el.webkitRequestFullscreen().catch(() => {});
      } else if (el.mozRequestFullScreen) {
        el.mozRequestFullScreen().catch(() => {});
      }
    } else {
      if (doc.exitFullscreen) {
        doc.exitFullscreen().catch(() => {});
      } else if (doc.webkitExitFullscreen) {
        doc.webkitExitFullscreen().catch(() => {});
      } else if (doc.mozCancelFullScreen) {
        doc.mozCancelFullScreen().catch(() => {});
      }
    }
  };

  const handleSelectPoem = (poem: Poem) => {
    setCurrentPoem(poem);
    handleRestart();
  };

  const handleProgressUpdate = useCallback((percent: number, activeId: string | null) => {
    setProgressPercent(percent);
    if (activeId) {
      setActiveLineId(activeId);
    }
  }, []);

  return (
    <div className="h-screen h-[100dvh] max-h-screen max-h-[100dvh] w-screen max-w-full bg-slate-950 text-slate-100 flex flex-col font-sans select-none overflow-hidden">
      {/* 1. TOP BAR */}
      <header className="flex items-center justify-between gap-4 sm:gap-8 px-4 sm:px-6 py-2 sm:py-2.5 bg-slate-900 border-b border-slate-800 shrink-0 z-40">
        {/* Zone 1: Brand wordmark */}
        <div className="flex items-center gap-2 whitespace-nowrap shrink-0">
          <span className="text-base sm:text-lg md:text-xl font-extrabold tracking-tight text-white font-display">
            PUISI PERFORMANCE STUDIO
          </span>
          <span className="text-[10px] sm:text-xs text-amber-400 font-mono hidden sm:inline px-2 py-0.5 bg-amber-500/10 rounded border border-amber-500/20">
            AI POETRY JUDGE
          </span>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6 text-xs font-semibold text-slate-400">
          <button
            type="button"
            onClick={() => setIsPoemSelectorOpen(true)}
            className="hover:text-amber-300 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-400" />
            <span>Koleksi Puisi ({currentPoem.title})</span>
          </button>
          <button
            type="button"
            onClick={() => setShowLegend(!showLegend)}
            className="hover:text-amber-300 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
          >
            <Layers className="w-3.5 h-3.5 text-sky-400" />
            <span>Notasi Jeda (/, //, ///)</span>
          </button>
          <button
            type="button"
            onClick={() => setIsGuideOpen(true)}
            className="hover:text-amber-300 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
          >
            <HelpCircle className="w-3.5 h-3.5 text-emerald-400" />
            <span>Panduan Vokal & Panggung</span>
          </button>
          <button
            type="button"
            onClick={() => setIsEvaluationOpen(true)}
            className="hover:text-amber-300 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
          >
            <Award className="w-3.5 h-3.5 text-purple-400" />
            <span>Rubrik 40/30/30</span>
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            type="button"
            onClick={() => setIsGuideOpen(true)}
            className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs font-bold text-slate-900 bg-amber-400 hover:bg-amber-300 rounded-xl transition-all shadow-md whitespace-nowrap shrink-0 font-display active:scale-95"
          >
            Petunjuk Pembacaan
          </button>
        </div>
      </header>

      {/* 2. SUB-BAR: Curated Stage Banner */}
      <div className="bg-slate-900/60 border-b border-slate-800/80 px-4 sm:px-6 py-1 sm:py-1.5 flex items-center justify-between text-xs text-slate-400 shrink-0">
        <div className="flex items-center gap-2 sm:gap-3 overflow-hidden text-ellipsis whitespace-nowrap">
          <span className="text-amber-400 font-semibold flex items-center gap-1 text-[11px] sm:text-xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Naskah Aktif:</span>
          </span>
          <span className="text-white font-medium text-[11px] sm:text-xs">{currentPoem.title}</span>
          <span className="text-slate-600 hidden sm:inline">·</span>
          <span className="hidden sm:inline text-[11px] text-slate-300">Penyair: {currentPoem.poet}</span>
        </div>

        <div className="flex items-center gap-3 shrink-0 font-mono text-[10px] sm:text-[11px]">
          <span className="text-slate-400">
            Siswa: <strong className="text-slate-200">{studentName}</strong> ({studentClass})
          </span>
          <span className="text-slate-600 hidden sm:inline">|</span>
          <span className="text-emerald-400 flex items-center gap-1 hidden sm:flex">
            <Tv className="w-3 h-3" />
            <span>IFP Layar Sentuh Siap</span>
          </span>
        </div>
      </div>

      {/* 3. MAIN STAGE: TWO PRIMARY PANELS SIDE-BY-SIDE */}
      <main
        className={`flex-1 min-h-0 w-full overflow-hidden p-2 sm:p-3 md:p-3.5 grid gap-3 md:gap-4 relative ${
          layoutMode === 'balanced'
            ? 'grid-cols-1 lg:grid-cols-2'
            : layoutMode === 'focus-camera'
            ? 'grid-cols-1 lg:grid-cols-12'
            : 'grid-cols-1 lg:grid-cols-12'
        }`}
      >
        {/* PANEL KIRI: KAMERA LANGSUNG SISWA */}
        <section
          className={`h-full min-h-0 flex flex-col overflow-hidden ${
            layoutMode === 'balanced'
              ? 'w-full'
              : layoutMode === 'focus-camera'
              ? 'lg:col-span-7 xl:col-span-8'
              : 'lg:col-span-5 xl:col-span-4'
          }`}
        >
          <CameraPanel
            studentName={studentName}
            studentClass={studentClass}
            isPracticing={isPracticing}
            micLevel={recorder.micLevel}
            isRecordingAudio={recorder.isRecording}
            videoRefForwarded={videoElementRef}
            onStudentInfoChange={(name, sClass) => {
              setStudentName(name);
              setStudentClass(sClass);
            }}
          />
        </section>

        {/* PANEL KANAN: TELEPROMPTER TEKS PUISI BESAR */}
        <section
          className={`h-full min-h-0 flex flex-col overflow-hidden ${
            layoutMode === 'balanced'
              ? 'w-full'
              : layoutMode === 'focus-camera'
              ? 'lg:col-span-5 xl:col-span-4'
              : 'lg:col-span-7 xl:col-span-8'
          }`}
        >
          <TeleprompterPanel
            poem={currentPoem}
            fontSize={fontSize}
            scrollSpeed={scrollSpeed}
            isPracticing={isPracticing}
            isPaused={isPaused}
            progressPercent={progressPercent}
            activeLineId={activeLineId}
            showProsodyMarks={showProsodyMarks}
            showEmphasis={showEmphasis}
            showExpressionGuide={showExpressionGuide}
            showLegend={showLegend}
            onFontSizeChange={setFontSize}
            onScrollSpeedChange={setScrollSpeed}
            onToggleProsodyMarks={() => setShowProsodyMarks(!showProsodyMarks)}
            onToggleEmphasis={() => setShowEmphasis(!showEmphasis)}
            onToggleExpressionGuide={() => setShowExpressionGuide(!showExpressionGuide)}
            onToggleLegend={() => setShowLegend(!showLegend)}
            onLineClick={(lineId) => setActiveLineId(lineId)}
            onProgressUpdate={handleProgressUpdate}
          />
        </section>

        {/* COUNTDOWN OVERLAY (3-2-1 READY) */}
        {countdown !== null && (
          <div className="absolute inset-0 bg-black/85 backdrop-blur-md z-50 flex flex-col items-center justify-center p-6 text-center">
            <div className="space-y-4 animate-in fade-in zoom-in duration-300">
              <span className="text-xs uppercase tracking-widest text-amber-400 font-mono font-bold block">
                SIAP DI PANGGUNG IFP
              </span>
              <div className="text-7xl sm:text-8xl md:text-9xl font-black font-display text-white drop-shadow-[0_0_40px_rgba(245,158,11,0.6)]">
                {countdown === 0 ? 'MULAI!' : countdown}
              </div>
              <p className="text-xs sm:text-sm md:text-base text-slate-300 max-w-md mx-auto">
                Tegakkan punggung, tatap ke depan, dan hembuskan napas rileks. Mikrofon dan teleprompter akan mulai bergulir otomatis.
              </p>
            </div>
          </div>
        )}
      </main>

      {/* 4. IFP CONTROL BAR */}
      <footer className="shrink-0">
        <ControlBar
          isPracticing={isPracticing}
          isPaused={isPaused}
          practiceDuration={practiceDuration}
          countdown={countdown}
          isFullscreen={isFullscreen}
          layoutMode={layoutMode}
          onLayoutModeChange={setLayoutMode}
          onStart={handleStart}
          onPause={handlePause}
          onResume={handleResume}
          onRestart={handleRestart}
          onFinish={handleFinish}
          onToggleFullscreen={handleToggleFullscreen}
          onOpenPoemSelector={() => setIsPoemSelectorOpen(true)}
          onOpenGuide={() => setIsGuideOpen(true)}
        />
      </footer>

      {/* 5. MODALS & REPORTING */}
      {/* Privacy Consent Modal Before AI Cloud Call */}
      <AiConsentModal
        isOpen={isConsentModalOpen}
        poem={currentPoem}
        studentName={studentName}
        studentClass={studentClass}
        durationSeconds={practiceDuration}
        snapshotsCount={lastCapturedAudio?.snapshots?.length || 0}
        onConfirm={(visualConsent) => runAiAnalysis(visualConsent)}
        onCancelManualRubric={() => {
          setIsConsentModalOpen(false);
          setIsEvaluationOpen(true);
        }}
        onClose={() => setIsConsentModalOpen(false)}
      />

      {/* Full AI Poetry Judge Report Modal */}
      <AiJudgeReportModal
        isOpen={isAiJudgeReportOpen}
        poem={currentPoem}
        studentName={studentName}
        studentClass={studentClass}
        durationSeconds={practiceDuration}
        report={aiReport}
        isLoading={isAiAnalyzing}
        error={aiError}
        onRetry={() => runAiAnalysis(true)}
        onOpenManualRubric={() => {
          setIsAiJudgeReportOpen(false);
          setIsEvaluationOpen(true);
        }}
        onClose={() => setIsAiJudgeReportOpen(false)}
        onPracticeAgain={() => {
          setIsAiJudgeReportOpen(false);
          handleStart();
        }}
      />

      {/* Fallback Manual Rubric Evaluation Modal */}
      <EvaluationModal
        isOpen={isEvaluationOpen}
        poem={currentPoem}
        studentName={studentName}
        studentClass={studentClass}
        durationSeconds={practiceDuration}
        onClose={() => setIsEvaluationOpen(false)}
        onRestartPractice={() => {
          setIsEvaluationOpen(false);
          handleStart();
        }}
      />

      {/* Poem Selector Modal */}
      <PoemSelectorModal
        isOpen={isPoemSelectorOpen}
        activePoemId={currentPoem.id}
        onSelectPoem={handleSelectPoem}
        onClose={() => setIsPoemSelectorOpen(false)}
      />

      {/* Stage Recitation Guide Modal */}
      <GuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
      />
    </div>
  );
}
