import React from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  Maximize,
  Minimize,
  BookOpen,
  Clock,
  HelpCircle,
  Columns2,
  Sparkles,
} from 'lucide-react';

export type IfpLayoutMode = 'balanced' | 'focus-camera' | 'focus-teleprompter';

interface ControlBarProps {
  isPracticing: boolean;
  isPaused: boolean;
  practiceDuration: number; // in seconds
  countdown: number | null; // 3, 2, 1, or null
  isFullscreen: boolean;
  layoutMode: IfpLayoutMode;
  onLayoutModeChange: (mode: IfpLayoutMode) => void;
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
  layoutMode,
  onLayoutModeChange,
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
    <div className="w-full bg-slate-900/95 border-t border-slate-800 px-3 sm:px-6 py-2.5 backdrop-blur-md shadow-2xl z-30 shrink-0">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2.5 sm:gap-4">
        {/* Left: Poem Switcher & Guide Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onOpenPoemSelector}
            className="h-10 sm:h-11 px-3 sm:px-4 rounded-xl bg-slate-800 hover:bg-slate-700/80 text-white font-medium text-xs sm:text-sm flex items-center gap-1.5 sm:gap-2 border border-slate-700 transition-colors shadow-sm active:scale-95"
          >
            <BookOpen className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline">Pilih Puisi</span>
            <span className="sm:hidden">Puisi</span>
          </button>

          <button
            type="button"
            onClick={onOpenGuide}
            className="h-10 sm:h-11 px-3 sm:px-3.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white text-xs sm:text-sm font-medium flex items-center gap-1.5 border border-slate-700/60 transition-colors active:scale-95"
            title="Panduan Teknik Pembacaan Puisi SMP"
          >
            <HelpCircle className="w-4 h-4 text-sky-400" />
            <span className="hidden md:inline">Tips Panggung</span>
          </button>

          {/* IFP Layout Mode Switcher */}
          <div className="hidden lg:flex items-center bg-slate-950 border border-slate-800 rounded-xl p-1 gap-1 text-xs">
            <span className="px-2 text-[11px] text-slate-400 font-mono flex items-center gap-1">
              <Columns2 className="w-3.5 h-3.5 text-amber-400" />
              <span>Rasio:</span>
            </span>
            <button
              type="button"
              onClick={() => onLayoutModeChange('balanced')}
              className={`px-2 py-1 rounded-lg font-medium transition-colors ${
                layoutMode === 'balanced'
                  ? 'bg-slate-800 text-amber-300 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              50:50
            </button>
            <button
              type="button"
              onClick={() => onLayoutModeChange('focus-camera')}
              className={`px-2 py-1 rounded-lg font-medium transition-colors ${
                layoutMode === 'focus-camera'
                  ? 'bg-slate-800 text-amber-300 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Kamera 60%
            </button>
            <button
              type="button"
              onClick={() => onLayoutModeChange('focus-teleprompter')}
              className={`px-2 py-1 rounded-lg font-medium transition-colors ${
                layoutMode === 'focus-teleprompter'
                  ? 'bg-slate-800 text-amber-300 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Teks 60%
            </button>
          </div>
        </div>

        {/* Center: Main IFP Practice Action Controls (Tactile touch targets) */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Practice Timer Indicator */}
          <div className="h-10 sm:h-11 px-3 sm:px-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-2 font-mono shadow-inner">
            <Clock className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isPracticing && !isPaused ? 'text-amber-400 animate-pulse' : 'text-slate-500'}`} />
            <div className="flex flex-col">
              <span className="text-[9px] sm:text-[10px] text-slate-400 font-sans uppercase font-semibold leading-tight">
                Durasi
              </span>
              <span className="text-sm sm:text-base font-bold text-white tracking-wider leading-tight">
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
              className="h-10 sm:h-11 px-5 sm:px-7 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs sm:text-base flex items-center gap-2 shadow-lg shadow-amber-500/20 active:scale-95 transition-all font-display"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Mulai Latihan</span>
            </button>
          ) : isPaused ? (
            /* If PAUSED: RESUME & RESTART BUTTONS */
            <>
              <button
                type="button"
                onClick={onResume}
                className="h-10 sm:h-11 px-4 sm:px-6 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-base flex items-center gap-1.5 shadow-lg shadow-emerald-600/20 active:scale-95 transition-all font-display"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Lanjutkan</span>
              </button>

              <button
                type="button"
                onClick={onRestart}
                className="h-10 sm:h-11 px-3 sm:px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs sm:text-sm flex items-center gap-1.5 border border-slate-700 active:scale-95 transition-all"
                title="Mulai Ulang dari Awal"
              >
                <RotateCcw className="w-3.5 h-3.5 text-sky-400" />
                <span className="hidden sm:inline">Ulangi</span>
              </button>

              <button
                type="button"
                onClick={onFinish}
                className="h-10 sm:h-11 px-3 sm:px-5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs sm:text-sm flex items-center gap-1.5 active:scale-95 transition-all shadow-md font-display"
              >
                <Sparkles className="w-4 h-4 fill-current" />
                <span>Selesai & Analisis</span>
              </button>
            </>
          ) : (
            /* If RUNNING: PAUSE & FINISH BUTTONS */
            <>
              <button
                type="button"
                onClick={onPause}
                className="h-10 sm:h-11 px-4 sm:px-6 rounded-xl bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border border-amber-500/40 font-bold text-xs sm:text-base flex items-center gap-1.5 active:scale-95 transition-all font-display"
              >
                <Pause className="w-4 h-4 fill-current" />
                <span>Jeda</span>
              </button>

              <button
                type="button"
                onClick={onRestart}
                className="h-10 sm:h-11 px-3 sm:px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs sm:text-sm flex items-center gap-1.5 border border-slate-700 active:scale-95 transition-all"
                title="Mulai Ulang dari Awal"
              >
                <RotateCcw className="w-3.5 h-3.5 text-sky-400" />
                <span className="hidden sm:inline">Ulangi</span>
              </button>

              <button
                type="button"
                onClick={onFinish}
                className="h-10 sm:h-11 px-3 sm:px-5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-lg shadow-amber-500/20 active:scale-95 transition-all font-display"
              >
                <Sparkles className="w-4 h-4 fill-current" />
                <span>Selesai & Analisis</span>
              </button>
            </>
          )}
        </div>

        {/* Right: Fullscreen and IFP Stage Options */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onToggleFullscreen}
            className="h-10 sm:h-11 px-3 sm:px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs sm:text-sm font-medium flex items-center gap-1.5 border border-slate-700 transition-colors active:scale-95"
            title="Mode Layar Penuh IFP (Sembunyikan Bilah Android)"
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
