import React from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  Maximize,
  Minimize,
  BookOpen,
  Volume2,
  Clock,
  HelpCircle,
} from 'lucide-react';

interface ControlBarProps {
  isPracticing: boolean;
  isPaused: boolean;
  practiceDuration: number; // in seconds
  countdown: number | null; // 3, 2, 1, or null
  isFullscreen: boolean;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onRestart: () => void;
  onFinish: () => void;
  onToggleFullscreen: () => void;
  onOpenPoemSelector: () => void;
  onOpenGuide: () => void;
}

export const ControlBar: React.FC<ControlBarProps> = ({
  isPracticing,
  isPaused,
  practiceDuration,
  countdown,
  isFullscreen,
  onStart,
  onPause,
  onResume,
  onRestart,
  onFinish,
  onToggleFullscreen,
  onOpenPoemSelector,
  onOpenGuide,
}) => {
  // Format seconds to mm:ss
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainingSecs
      .toString()
      .padStart(2, '0')}`;
  };

  return (
    <div className="w-full bg-slate-900/95 border-t border-slate-800 px-6 py-4 backdrop-blur-md shadow-2xl z-30">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
        {/* Left: Poem Switcher & Guide Buttons */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={onOpenPoemSelector}
            className="h-12 px-4 rounded-xl bg-slate-800 hover:bg-slate-700/80 text-white font-medium text-xs md:text-sm flex items-center gap-2 border border-slate-700 transition-colors shadow-sm active:scale-95"
          >
            <BookOpen className="w-4 h-4 text-amber-400" />
            <span>Pilih / Ganti Puisi</span>
          </button>

          <button
            type="button"
            onClick={onOpenGuide}
            className="h-12 px-3.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white text-xs md:text-sm font-medium flex items-center gap-1.5 border border-slate-700/60 transition-colors active:scale-95"
            title="Panduan Teknik Pembacaan Puisi SMP"
          >
            <HelpCircle className="w-4 h-4 text-sky-400" />
            <span className="hidden sm:inline">Tips Vokal & Panggung</span>
          </button>
        </div>

        {/* Center: Main IFP Practice Action Controls (Large touch targets) */}
        <div className="flex items-center gap-3">
          {/* Practice Timer Indicator */}
          <div className="h-12 px-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-2.5 font-mono shadow-inner">
            <Clock className={`w-4 h-4 ${isPracticing && !isPaused ? 'text-amber-400 animate-pulse' : 'text-slate-500'}`} />
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-400 font-sans uppercase font-semibold">
                Durasi Latihan
              </span>
              <span className="text-base font-bold text-white tracking-wider">
                {formatTime(practiceDuration)}
              </span>
            </div>
          </div>

          {/* If NOT PRACTICING: START BUTTON */}
          {!isPracticing ? (
            <button
              type="button"
              onClick={onStart}
              disabled={countdown !== null}
              className="h-12 px-7 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm md:text-base flex items-center gap-2.5 shadow-lg shadow-amber-500/20 active:scale-95 transition-all font-display"
            >
              <Play className="w-5 h-5 fill-current" />
              <span>Mulai Latihan</span>
            </button>
          ) : isPaused ? (
            /* If PAUSED: RESUME & RESTART BUTTONS */
            <>
              <button
                type="button"
                onClick={onResume}
                className="h-12 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm md:text-base flex items-center gap-2 shadow-lg shadow-emerald-600/20 active:scale-95 transition-all font-display"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Lanjutkan</span>
              </button>

              <button
                type="button"
                onClick={onRestart}
                className="h-12 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-sm flex items-center gap-2 border border-slate-700 active:scale-95 transition-all"
                title="Mulai Ulang dari Awal"
              >
                <RotateCcw className="w-4 h-4 text-sky-400" />
                <span className="hidden sm:inline">Ulangi</span>
              </button>

              <button
                type="button"
                onClick={onFinish}
                className="h-12 px-5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm flex items-center gap-2 active:scale-95 transition-all shadow-md"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Selesai & Evaluasi</span>
              </button>
            </>
          ) : (
            /* If RUNNING: PAUSE & FINISH BUTTONS */
            <>
              <button
                type="button"
                onClick={onPause}
                className="h-12 px-6 rounded-xl bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border border-amber-500/40 font-bold text-sm md:text-base flex items-center gap-2 active:scale-95 transition-all font-display"
              >
                <Pause className="w-4 h-4 fill-current" />
                <span>Jeda</span>
              </button>

              <button
                type="button"
                onClick={onRestart}
                className="h-12 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-sm flex items-center gap-2 border border-slate-700 active:scale-95 transition-all"
                title="Mulai Ulang dari Awal"
              >
                <RotateCcw className="w-4 h-4 text-sky-400" />
                <span className="hidden sm:inline">Ulangi</span>
              </button>

              <button
                type="button"
                onClick={onFinish}
                className="h-12 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm flex items-center gap-2 shadow-lg shadow-emerald-600/20 active:scale-95 transition-all"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Selesai & Evaluasi</span>
              </button>
            </>
          )}
        </div>

        {/* Right: Fullscreen and IFP Stage Options */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={onToggleFullscreen}
            className="h-12 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs md:text-sm font-medium flex items-center gap-2 border border-slate-700 transition-colors active:scale-95"
            title="Mode Layar Penuh IFP"
          >
            {isFullscreen ? (
              <>
                <Minimize className="w-4 h-4 text-amber-400" />
                <span className="hidden md:inline">Keluar Layar Penuh</span>
              </>
            ) : (
              <>
                <Maximize className="w-4 h-4 text-amber-400" />
                <span className="hidden md:inline">Layar Penuh IFP</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
