import React, { useRef, useEffect } from 'react';
import { Poem, PoemLine } from '../types/poem';
import {
  Type,
  Gauge,
  Sliders,
  HelpCircle,
  Sparkles,
  Info,
  Layers
} from 'lucide-react';

interface TeleprompterPanelProps {
  poem: Poem;
  fontSize: number; // in pixels (e.g. 24, 32, 40, 48, 56)
  scrollSpeed: number; // 1 - 10
  isPracticing: boolean;
  isPaused: boolean;
  progressPercent: number;
  activeLineId: string | null;
  showProsodyMarks: boolean;
  showEmphasis: boolean;
  showExpressionGuide: boolean;
  showLegend: boolean;
  onFontSizeChange: (size: number) => void;
  onScrollSpeedChange: (speed: number) => void;
  onToggleProsodyMarks: () => void;
  onToggleEmphasis: () => void;
  onToggleExpressionGuide: () => void;
  onToggleLegend: () => void;
  onLineClick: (lineId: string) => void;
  onProgressUpdate: (percent: number, activeId: string | null) => void;
}

export const TeleprompterPanel: React.FC<TeleprompterPanelProps> = ({
  poem,
  fontSize,
  scrollSpeed,
  isPracticing,
  isPaused,
  progressPercent,
  activeLineId,
  showProsodyMarks,
  showEmphasis,
  showExpressionGuide,
  showLegend,
  onFontSizeChange,
  onScrollSpeedChange,
  onToggleProsodyMarks,
  onToggleEmphasis,
  onToggleExpressionGuide,
  onToggleLegend,
  onLineClick,
  onProgressUpdate,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const animFrameIdRef = useRef<number | null>(null);
  const lastTimestampRef = useRef<number | null>(null);

  // Auto-scroll loop when practicing and not paused
  useEffect(() => {
    if (!isPracticing || isPaused) {
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
        animFrameIdRef.current = null;
      }
      lastTimestampRef.current = null;
      return;
    }

    const container = containerRef.current;
    if (!container) return;

    // Base speed in pixels per second: speed level 1 = 18px/s, level 10 = 120px/s
    const pxPerSecond = 14 + scrollSpeed * 10;

    const scrollLoop = (timestamp: number) => {
      if (!lastTimestampRef.current) {
        lastTimestampRef.current = timestamp;
      }
      const deltaTime = (timestamp - lastTimestampRef.current) / 1000;
      lastTimestampRef.current = timestamp;

      const maxScroll = container.scrollHeight - container.clientHeight;
      if (maxScroll > 0) {
        const nextScrollTop = container.scrollTop + pxPerSecond * deltaTime;
        if (nextScrollTop >= maxScroll) {
          container.scrollTop = maxScroll;
          // Completed
        } else {
          container.scrollTop = nextScrollTop;
        }

        // Calculate progress percentage
        const progress = Math.min(100, Math.round((container.scrollTop / maxScroll) * 100));
        
        // Find which line is currently near the reading focus horizon (35% from top of container)
        const readingLineY = container.getBoundingClientRect().top + container.clientHeight * 0.35;
        const lineElements = container.querySelectorAll<HTMLElement>('[data-line-id]');
        let currentActiveId: string | null = null;
        let closestDist = Infinity;

        lineElements.forEach((el) => {
          const rect = el.getBoundingClientRect();
          const lineCenter = rect.top + rect.height / 2;
          const dist = Math.abs(lineCenter - readingLineY);
          if (dist < closestDist) {
            closestDist = dist;
            currentActiveId = el.getAttribute('data-line-id');
          }
        });

        onProgressUpdate(progress, currentActiveId);
      }

      animFrameIdRef.current = requestAnimationFrame(scrollLoop);
    };

    animFrameIdRef.current = requestAnimationFrame(scrollLoop);

    return () => {
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, [isPracticing, isPaused, scrollSpeed, onProgressUpdate]);

  // When activeLineId changes via manual selection or restart, scroll container if needed
  const scrollToLine = (lineId: string) => {
    onLineClick(lineId);
    const container = containerRef.current;
    if (!container) return;
    const targetEl = container.querySelector<HTMLElement>(`[data-line-id="${lineId}"]`);
    if (targetEl) {
      const containerRect = container.getBoundingClientRect();
      const targetRect = targetEl.getBoundingClientRect();
      const relativeTop = targetRect.top - containerRect.top + container.scrollTop;
      // Position target at around 30% from top of viewport
      container.scrollTo({
        top: Math.max(0, relativeTop - container.clientHeight * 0.3),
        behavior: 'smooth',
      });
    }
  };

  // Helper to render words with prosody tokens
  const renderLineWords = (line: PoemLine, isActive: boolean) => {
    return (
      <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1.5 leading-relaxed">
        {line.words.map((w, wIdx) => {
          return (
            <span key={wIdx} className="inline-flex items-baseline">
              {/* Word text with emphasis styling */}
              <span
                className={`transition-colors ${
                  showEmphasis && w.isEmphasized
                    ? 'font-bold text-amber-300 drop-shadow-[0_2px_10px_rgba(245,158,11,0.3)]'
                    : isActive
                    ? 'text-white font-medium'
                    : 'text-slate-200'
                }`}
              >
                {w.text}
              </span>

              {/* Pause Notation Token */}
              {showProsodyMarks && w.pauseAfter && (
                <span
                  title={
                    w.pauseAfter === 'short'
                      ? 'Jeda Pendek (/)'
                      : w.pauseAfter === 'medium'
                      ? 'Jeda Sedang (//)'
                      : 'Jeda Panjang (///)'
                  }
                  className={`ml-1 select-none font-mono font-black ${
                    w.pauseAfter === 'short'
                      ? 'text-sky-400 bg-sky-950/60 px-1 rounded text-[0.65em] border border-sky-600/30'
                      : w.pauseAfter === 'medium'
                      ? 'text-amber-400 bg-amber-950/60 px-1.5 rounded text-[0.65em] border border-amber-600/30'
                      : 'text-rose-400 bg-rose-950/70 px-2 rounded text-[0.65em] border border-rose-600/40'
                  }`}
                >
                  {w.pauseAfter === 'short' && '/'}
                  {w.pauseAfter === 'medium' && '//'}
                  {w.pauseAfter === 'long' && '///'}
                </span>
              )}
            </span>
          );
        })}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full min-h-0 bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl relative">
      {/* Top Header & Teleprompter Controls Bar */}
      <div className="px-4 py-2.5 bg-slate-900/95 border-b border-slate-800 backdrop-blur z-20 shrink-0 flex flex-wrap items-center justify-between gap-2">
        {/* Left: Poem Metadata */}
        <div className="flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
          <div>
            <h2 className="text-xs sm:text-sm font-bold text-white tracking-wide uppercase font-display flex items-center gap-2">
              <span>{poem.title}</span>
              <span className="text-xs font-normal text-amber-400/90 font-serif italic hidden sm:inline">
                karya {poem.poet} {poem.year ? `(${poem.year})` : ''}
              </span>
            </h2>
          </div>
        </div>

        {/* Right: Quick Teleprompter Settings Controls */}
        <div className="flex items-center flex-wrap gap-2">
          {/* Font Size Selector */}
          <div className="flex items-center bg-slate-800 rounded-lg p-0.5 border border-slate-700">
            <span className="px-2 text-xs text-slate-400 flex items-center gap-1">
              <Type className="w-3.5 h-3.5" />
              <span className="hidden xl:inline">Ukuran:</span>
            </span>
            {[24, 32, 40, 48].map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => onFontSizeChange(size)}
                className={`px-2 py-1 text-xs font-semibold rounded transition-colors ${
                  fontSize === size
                    ? 'bg-amber-500 text-slate-950 shadow-sm'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                {size === 24 ? 'S' : size === 32 ? 'M' : size === 40 ? 'L' : 'XL'}
              </button>
            ))}
          </div>

          {/* Speed Selector */}
          <div className="flex items-center bg-slate-800 rounded-lg p-0.5 border border-slate-700">
            <span className="px-2 text-xs text-slate-400 flex items-center gap-1">
              <Gauge className="w-3.5 h-3.5" />
              <span className="hidden xl:inline">Kecepatan:</span>
            </span>
            <button
              type="button"
              onClick={() => onScrollSpeedChange(Math.max(1, scrollSpeed - 1))}
              disabled={scrollSpeed <= 1}
              className="px-2 py-1 text-xs font-bold text-slate-300 hover:text-white disabled:opacity-40"
            >
              -
            </button>
            <span className="px-1.5 text-xs font-mono font-bold text-amber-300">
              {scrollSpeed}x
            </span>
            <button
              type="button"
              onClick={() => onScrollSpeedChange(Math.min(10, scrollSpeed + 1))}
              disabled={scrollSpeed >= 10}
              className="px-2 py-1 text-xs font-bold text-slate-300 hover:text-white disabled:opacity-40"
            >
              +
            </button>
          </div>

          {/* Prosody Notation Toggle */}
          <button
            type="button"
            onClick={onToggleProsodyMarks}
            className={`px-2.5 py-1.5 text-xs font-medium rounded-lg flex items-center gap-1.5 transition-colors border ${
              showProsodyMarks
                ? 'bg-sky-500/20 text-sky-300 border-sky-500/40'
                : 'bg-slate-800 text-slate-400 border-transparent hover:text-white'
            }`}
            title="Tampilkan tanda jeda /, //, ///"
          >
            <span className="font-mono font-bold">/ // ///</span>
            <span className="hidden lg:inline">Jeda</span>
          </button>

          {/* Emphasis Toggle */}
          <button
            type="button"
            onClick={onToggleEmphasis}
            className={`px-2.5 py-1.5 text-xs font-medium rounded-lg flex items-center gap-1.5 transition-colors border ${
              showEmphasis
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                : 'bg-slate-800 text-slate-400 border-transparent hover:text-white'
            }`}
            title="Tampilkan penekanan kata (kata kunci intonasi)"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">Tekanan</span>
          </button>

          {/* Expression Guide Toggle */}
          <button
            type="button"
            onClick={onToggleExpressionGuide}
            className={`px-2.5 py-1.5 text-xs font-medium rounded-lg flex items-center gap-1.5 transition-colors border ${
              showExpressionGuide
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                : 'bg-slate-800 text-slate-400 border-transparent hover:text-white'
            }`}
            title="Tampilkan panduan mimik wajah dan intonasi"
          >
            <Layers className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">Ekspresi</span>
          </button>

          {/* Legend Toggle */}
          <button
            type="button"
            onClick={onToggleLegend}
            className={`px-2.5 py-1.5 text-xs font-medium rounded-lg flex items-center gap-1 transition-colors border ${
              showLegend
                ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                : 'bg-slate-800 text-slate-400 border-transparent hover:text-white'
            }`}
            title="Panduan arti tanda baca puisi"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span className="hidden xl:inline">Petunjuk</span>
          </button>
        </div>
      </div>

      {/* Progress Bar Header Strip */}
      <div className="w-full bg-slate-950/80 border-b border-slate-800 px-4 py-1.5 flex items-center justify-between text-xs font-mono text-slate-400 z-10 shrink-0">
        <div className="flex items-center gap-2.5">
          <span className="text-[11px]">KEMAJUAN:</span>
          <div className="w-28 sm:w-36 h-2 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-amber-300 transition-all duration-200"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="text-amber-400 font-bold">{progressPercent}%</span>
        </div>
        <div className="flex items-center gap-2 hidden sm:flex">
          <span className="text-slate-500">Petunjuk IFP:</span>
          <span className="text-slate-300">Sentuh baris mana saja untuk melompat</span>
        </div>
      </div>

      {/* Notation Legend Drawer (Collapsible) */}
      {showLegend && (
        <div className="bg-slate-950/90 border-b border-slate-800 px-4 py-2.5 z-10 text-xs text-slate-300 transition-all shrink-0">
          <div className="flex items-center gap-2 font-semibold text-amber-300 mb-2 font-display">
            <Info className="w-4 h-4" />
            <span>Panduan Tanda Pembacaan Puisi Kurikulum Bahasa Indonesia SMP</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-[11px] leading-relaxed">
            <div className="flex items-start gap-2 p-2 bg-slate-900 rounded-lg border border-sky-900/50">
              <span className="px-1.5 py-0.5 bg-sky-950 text-sky-300 border border-sky-600/40 font-mono font-bold rounded">
                /
              </span>
              <div>
                <strong className="text-sky-300">Jeda Pendek:</strong> Berhenti sejenak (± 0.5 detik). Pemenggalan frasa.
              </div>
            </div>
            <div className="flex items-start gap-2 p-2 bg-slate-900 rounded-lg border border-amber-900/50">
              <span className="px-1.5 py-0.5 bg-amber-950 text-amber-300 border border-amber-600/40 font-mono font-bold rounded">
                //
              </span>
              <div>
                <strong className="text-amber-300">Jeda Sedang:</strong> Berhenti (± 1 detik). Pergantian kalimat/koma.
              </div>
            </div>
            <div className="flex items-start gap-2 p-2 bg-slate-900 rounded-lg border border-rose-900/50">
              <span className="px-1.5 py-0.5 bg-rose-950 text-rose-300 border border-rose-600/40 font-mono font-bold rounded">
                ///
              </span>
              <div>
                <strong className="text-rose-300">Jeda Panjang:</strong> Berhenti penuh (± 2 detik). Titik/antar-bait.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reading Line Horizon Guide (Fixed center indicator) */}
      <div className="absolute top-[35%] left-0 right-0 pointer-events-none z-10 hidden md:block">
        <div className="w-full border-t border-dashed border-amber-500/25 relative">
          <span className="absolute right-6 -top-2.5 bg-slate-900/90 border border-amber-500/30 text-amber-400 font-mono text-[9px] px-2 py-0.5 rounded tracking-wider uppercase">
            Garis Fokus Membaca Teleprompter
          </span>
        </div>
      </div>

      {/* Main Teleprompter Text Canvas */}
      <div
        ref={containerRef}
        className="flex-1 min-h-0 overflow-y-auto teleprompter-scroll px-6 md:px-10 py-6 md:py-10 relative select-text"
        style={{ scrollBehavior: 'smooth' }}
      >
        <div className="max-w-3xl mx-auto space-y-8 md:space-y-12 pb-32">
          {/* Poem Title Header Banner inside Prompter */}
          <div className="text-center pb-8 border-b border-slate-800/80">
            <h1 className="text-3xl md:text-5xl font-black text-white font-editorial tracking-tight mb-3">
              {poem.title}
            </h1>
            <p className="text-lg md:text-xl text-amber-400 font-medium font-serif italic mb-4">
              Karya: {poem.poet}
            </p>
            <div className="inline-block max-w-xl text-xs md:text-sm text-slate-400 bg-slate-950/70 border border-slate-800 p-3 rounded-xl leading-relaxed">
              <strong>Penghayatan Tema:</strong> {poem.synopsis}
            </div>
          </div>

          {/* Stanzas & Lines */}
          {poem.stanzas.map((stanza) => (
            <div
              key={stanza.stanzaNumber}
              className="space-y-6 relative group/stanza"
            >
              {/* Stanza Context Guide Callout */}
              {showExpressionGuide && (
                <div className="p-3 rounded-xl bg-slate-950/80 border border-emerald-500/30 text-emerald-300 text-xs flex flex-wrap items-center justify-between gap-2 shadow-sm">
                  <div className="flex items-center gap-2">
                    <span className="font-bold uppercase tracking-wider text-[10px] bg-emerald-500/20 px-2 py-0.5 rounded border border-emerald-500/40">
                      Bait {stanza.stanzaNumber}
                    </span>
                    <span className="font-semibold">{stanza.moodTheme}</span>
                  </div>
                  <div className="text-slate-400 text-[11px] italic">
                    {stanza.voiceGuide}
                  </div>
                </div>
              )}

              {/* Lines in this stanza */}
              <div className="space-y-6">
                {stanza.lines.map((line) => {
                  const isActive = activeLineId === line.id;
                  return (
                    <div
                      key={line.id}
                      data-line-id={line.id}
                      onClick={() => scrollToLine(line.id)}
                      className={`cursor-pointer rounded-2xl p-4 transition-all duration-200 border ${
                        isActive
                          ? 'bg-amber-500/10 border-amber-500/50 shadow-[0_0_25px_rgba(245,158,11,0.15)] ring-1 ring-amber-500/40'
                          : 'border-transparent hover:bg-slate-800/50 hover:border-slate-700/60'
                      }`}
                    >
                      {/* Active line indicator dot */}
                      <div className="flex items-start gap-3">
                        <div className="pt-1 select-none">
                          <span
                            className={`inline-block w-2.5 h-2.5 rounded-full transition-all ${
                              isActive
                                ? 'bg-amber-400 scale-125 shadow-[0_0_8px_rgba(245,158,11,0.8)]'
                                : 'bg-slate-700'
                            }`}
                          />
                        </div>

                        <div className="flex-1 space-y-2">
                          {/* Line words formatted with prosody & emphasis */}
                          <div
                            style={{
                              fontSize: `${fontSize}px`,
                              lineHeight: 1.45,
                            }}
                            className="font-editorial font-medium"
                          >
                            {renderLineWords(line, isActive)}
                          </div>

                          {/* Line expression note */}
                          {showExpressionGuide && line.expressionNote && (
                            <div className="text-xs text-amber-300/80 italic flex items-center gap-1.5 pt-1">
                              <span className="text-[10px] uppercase font-bold not-italic px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                                Mimik & Gestur:
                              </span>
                              <span>{line.expressionNote}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {/* End of Poem Marker */}
          <div className="text-center py-12 border-t border-slate-800">
            <div className="inline-block px-6 py-3 bg-slate-950 border border-amber-500/40 rounded-2xl text-amber-300">
              <span className="font-serif italic text-lg block mb-1">
                — Selesai Pembacaan Puisi —
              </span>
              <span className="text-xs text-slate-400">
                Tarik napas teratur, tatap audiens sejenak sebelum memberi hormat.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
