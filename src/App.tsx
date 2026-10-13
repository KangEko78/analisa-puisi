import React, { useState, useEffect, useRef, useCallback } from 'react';
import { CameraPanel } from './components/CameraPanel';
import { TeleprompterPanel } from './components/TeleprompterPanel';
import { ControlBar } from './components/ControlBar';
import { EvaluationModal } from './components/EvaluationModal';
import { PoemSelectorModal } from './components/PoemSelectorModal';
import { GuideModal } from './components/GuideModal';
import { INITIAL_POEMS } from './data/poems';
import { Poem } from './types/poem';
import { playCountdownBeep } from './utils/audioCue';
import {
  Sparkles,
  Tv,
  HelpCircle,
  BookOpen,
  Award,
  Layers,
  ChevronRight,
} from 'lucide-react';

export default function App() {
  // State for current poem
  const [currentPoem, setCurrentPoem] = useState<Poem>(INITIAL_POEMS[0]);

  // Student identification (for IFP classroom turns)
  const [studentName, setStudentName] = useState<string>('Siswa Pembaca');
  const [studentClass, setStudentClass] = useState<string>('Kelas VIII SMP');

  // Teleprompter presentation settings
  const [fontSize, setFontSize] = useState<number>(32); // 24, 32, 40, 48
  const [scrollSpeed, setScrollSpeed] = useState<number>(2); // 1 - 10
  const [showProsodyMarks, setShowProsodyMarks] = useState<boolean>(true);
  const [showEmphasis, setShowEmphasis] = useState<boolean>(true);
  const [showExpressionGuide, setShowExpressionGuide] = useState<boolean>(true);
  const [showLegend, setShowLegend] = useState<boolean>(false);

  // Performance practice playback state
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

  // Fullscreen state
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Stopwatch timer ref
  const timerIntervalRef = useRef<number | null>(null);

  // Practice Stopwatch effect
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

  // Countdown timer handler (3, 2, 1 -> Start!)
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
    }
  }, [countdown]);

  // Fullscreen change listener
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  // Action Handlers
  const handleStart = () => {
    // Initiate 3-second countdown before teleprompter starts rolling
    setCountdown(3);
    setPracticeDuration(0);
    setProgressPercent(0);
    // Set first line as active
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
    if (currentPoem.stanzas[0]?.lines[0]) {
      setActiveLineId(currentPoem.stanzas[0].lines[0].id);
    }
  };

  const handleFinish = () => {
    setIsPracticing(false);
    setIsPaused(false);
    setIsEvaluationOpen(true);
  };

  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
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
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans select-none overflow-x-hidden">
      {/* 1. TOP BAR CONTRACT (Strict 3-Zone: Brand, Nav links, 1 Primary Action) */}
      <header className="flex items-center justify-between gap-8 px-6 py-3.5 bg-slate-900 border-b border-slate-800 shrink-0 z-40">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-2.5 whitespace-nowrap shrink-0">
          <span className="text-xl font-extrabold tracking-tight text-white font-display">
            PUISI PERFORMANCE STUDIO
          </span>
          <span className="text-xs text-amber-400 font-mono hidden sm:inline px-2 py-0.5 bg-amber-500/10 rounded border border-amber-500/20">
            IFP EDISI SMP
          </span>
        </div>

        {/* Zone 2: Concise single-line text navigation links */}
        <nav className="hidden lg:flex items-center gap-7 text-xs font-semibold text-slate-400">
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
            <span>Rubrik Aspek SMP</span>
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => setIsGuideOpen(true)}
            className="px-4 py-2 text-xs font-bold text-slate-900 bg-amber-400 hover:bg-amber-300 rounded-xl transition-all shadow-md whitespace-nowrap shrink-0 font-display active:scale-95"
          >
            Petunjuk Pembacaan
          </button>
        </div>
      </header>

      {/* 2. SUB-BAR: Curated Editorial Kicker for IFP Stage */}
      <div className="bg-slate-900/60 border-b border-slate-800/80 px-6 py-2 flex items-center justify-between text-xs text-slate-400 shrink-0">
        <div className="flex items-center gap-3 overflow-hidden text-ellipsis whitespace-nowrap">
          <span className="text-amber-400 font-semibold flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Naskah Aktif:</span>
          </span>
          <span className="text-white font-medium">{currentPoem.title}</span>
          <span className="text-slate-600">·</span>
          <span>Penyair: {currentPoem.poet}</span>
          <span className="text-slate-600">·</span>
          <span className="hidden md:inline text-slate-400 italic">
            Tema: {currentPoem.theme}
          </span>
        </div>

        <div className="flex items-center gap-4 shrink-0 font-mono text-[11px]">
          <span className="text-slate-400">
            Pembaca: <strong className="text-slate-200">{studentName}</strong> ({studentClass})
          </span>
          <span className="text-slate-600">|</span>
          <span className="text-emerald-400 flex items-center gap-1">
            <Tv className="w-3 h-3" />
            <span>IFP Layar Sentuh Siap</span>
          </span>
        </div>
      </div>

      {/* 3. MAIN STAGE: TWO PRIMARY PANELS SIDE-BY-SIDE (IFP OPTIMIZED) */}
      <main className="flex-1 p-4 md:p-6 grid grid-cols-1 lg:grid-cols-2 gap-5 relative overflow-hidden min-h-[600px]">
        {/* PANEL KIRI: KAMERA LANGSUNG SISWA */}
        <section className="h-full min-h-[420px] flex flex-col">
          <CameraPanel
            studentName={studentName}
            studentClass={studentClass}
            isPracticing={isPracticing}
            onStudentInfoChange={(name, sClass) => {
              setStudentName(name);
              setStudentClass(sClass);
            }}
          />
        </section>

        {/* PANEL KANAN: TELEPROMPTER TEKS PUISI BESAR */}
        <section className="h-full min-h-[420px] flex flex-col">
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

        {/* COUNTDOWN OVERLAY (3-2-1 READY MODAL) */}
        {countdown !== null && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md z-50 flex flex-col items-center justify-center p-6 text-center">
            <div className="space-y-4 animate-in fade-in zoom-in duration-300">
              <span className="text-xs uppercase tracking-widest text-amber-400 font-mono font-bold block">
                SIAP DI PANGGUNG IFP
              </span>
              <div className="text-8xl md:text-9xl font-black font-display text-white drop-shadow-[0_0_40px_rgba(245,158,11,0.6)]">
                {countdown === 0 ? 'MULAI!' : countdown}
              </div>
              <p className="text-sm md:text-base text-slate-300 max-w-md mx-auto">
                Tegakkan punggung, tatap ke depan, dan hembuskan napas rileks. Teleprompter akan mulai bergulir otomatis.
              </p>
            </div>
          </div>
        )}
      </main>

      {/* 4. IFP CONTROL BAR (Fixed at bottom for easy teacher & student touch interactions) */}
      <footer className="shrink-0">
        <ControlBar
          isPracticing={isPracticing}
          isPaused={isPaused}
          practiceDuration={practiceDuration}
          countdown={countdown}
          isFullscreen={isFullscreen}
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

      {/* 5. MODALS */}
      {/* Real SMP Rubric Evaluation Modal */}
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

      {/* Poem Selector / Custom Poem Input Modal */}
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
