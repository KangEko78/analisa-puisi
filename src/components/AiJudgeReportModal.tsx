import React, { useState } from 'react';
import {
  Award,
  Sparkles,
  Volume2,
  Heart,
  Eye,
  CheckCircle2,
  AlertTriangle,
  X,
  Copy,
  Printer,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  BookOpen,
  User,
  Clock,
  ThumbsUp,
  TrendingUp,
  FileCheck2,
} from 'lucide-react';
import { Poem } from '../types/poem';
import { AiJudgeReport } from '../types/aiJudge';

interface AiJudgeReportModalProps {
  isOpen: boolean;
  poem: Poem;
  studentName: string;
  studentClass: string;
  durationSeconds: number;
  report: AiJudgeReport | null;
  isLoading: boolean;
  error: string | null;
  onRetry: () => void;
  onOpenManualRubric: () => void;
  onClose: () => void;
  onPracticeAgain: () => void;
}

export const AiJudgeReportModal: React.FC<AiJudgeReportModalProps> = ({
  isOpen,
  poem,
  studentName,
  studentClass,
  durationSeconds,
  report,
  isLoading,
  error,
  onRetry,
  onOpenManualRubric,
  onClose,
  onPracticeAgain,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'text-check' | 'breakdown'>('overview');
  const [copied, setCopied] = useState(false);
  const [teacherNotes, setTeacherNotes] = useState('');

  if (!isOpen) return null;

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${mins}m ${rem}s`;
  };

  const copyReportText = () => {
    if (!report) return;

    const text = `=== LAPORAN RESMI AI POETRY JUDGE (PUISI PERFORMANCE STUDIO) ===
Nama Siswa: ${studentName} (${studentClass})
Puisi: ${poem.title} karya ${poem.poet}
Durasi Pembacaan: ${formatTime(durationSeconds)}
Waktu Penilaian: ${new Date(report.analyzedAt).toLocaleString('id-ID')}

--- SKOR AKHIR & PREDIKAT ---
Total Skor: ${report.overallScore}/100 (${report.predicate})
Formula Bobot: Vokal (40%) + Penghayatan (30%) + Penampilan (30%)

1. VOKAL (Skor: ${report.vocal.score}/100, Bobot 40%):
   - Artikulasi: ${report.vocal.articulationScore}/100
   - Tempo: ${report.vocal.tempoScore}/100
   - Jeda Prosodi: ${report.vocal.pauseScore}/100
   - Volume & Pernapasan: ${report.vocal.volumeBreathingScore}/100
   Ringkasan: ${report.vocal.summary}
   Bukti Vokal: ${report.vocal.evidence.join('; ')}

2. PENGHAYATAN (Skor: ${report.appreciation.score}/100, Bobot 30%):
   - Dinamika Intonasi: ${report.appreciation.intonationScore}/100
   - Keselarasan Emosi: ${report.appreciation.emotionalMatchScore}/100
   - Penekanan Kata: ${report.appreciation.emphasisScore}/100
   Ringkasan: ${report.appreciation.summary}
   Bukti Penghayatan: ${report.appreciation.evidence.join('; ')}

3. PENAMPILAN (Skor: ${report.performance.score}/100, Bobot 30%):
   - Mimik Wajah: ${report.performance.facialExpressionScore}/100
   - Tatapan Mata: ${report.performance.eyeContactScore}/100
   - Sikap Panggung: ${report.performance.postureScore}/100
   Ringkasan: ${report.performance.summary}

--- AKURASI LAFAL TEKS (${report.wordAccuracyPercentage}%) ---
Transkripsi Siswa:
"${report.transcription}"

--- KEKUATAN PENAMPILAN ---
${report.strengths.map((s, i) => `${i + 1}. ${s}`).join('\n')}

--- REKOMENDASI PERBAIKAN PEMBELAJARAN ---
${report.improvements.map((im, i) => `${i + 1}. ${im}`).join('\n')}

Catatan Validator Guru:
${teacherNotes || report.evaluatorNote}

[DISCLAIMER: Skor ini merupakan estimasi AI berdasarkan model Google Gemini dan wajib divalidasi oleh Guru Bahasa Indonesia.]
==================================================================`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-4xl w-full shadow-2xl overflow-hidden my-4 flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="px-5 sm:px-6 py-3.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 text-slate-950 flex items-center justify-center font-bold shadow-md">
              <Sparkles className="w-5 h-5 fill-current" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white font-display flex items-center gap-2">
                <span>Laporan AI Poetry Judge</span>
                <span className="text-[10px] bg-amber-500/20 text-amber-300 font-mono px-2 py-0.5 rounded border border-amber-500/30">
                  GEMINI 3.8 FLASH
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Analisis Autentik Vokal (40%), Penghayatan (30%), dan Penampilan (30%)
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body Container */}
        <div className="flex-1 min-h-0 overflow-y-auto teleprompter-scroll p-4 sm:p-6 space-y-5">
          {/* 1. LOADING STATE */}
          {isLoading && (
            <div className="py-16 flex flex-col items-center justify-center text-center space-y-4 max-w-md mx-auto">
              <div className="w-16 h-16 rounded-full border-4 border-amber-500/20 border-t-amber-400 animate-spin" />
              <div className="space-y-1">
                <h3 className="text-base font-bold text-white font-display">
                  Sedang Menganalisis Penampilan Siswa...
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Model AI sedang mendengarkan rekaman audio pembacaan puisi, memeriksa ketepatan jeda prosodi (/, //, ///), artikulasi lafal kata, dan ekspresi panggung.
                </p>
              </div>
              <div className="w-full bg-slate-950 p-3 rounded-xl border border-slate-800 text-[11px] font-mono text-amber-300/80 animate-pulse">
                Memproses multimodal: Audio ({formatTime(durationSeconds)}) + Naskah Taufiq Ismail
              </div>
            </div>
          )}

          {/* 2. ERROR STATE (No fake scores!) */}
          {!isLoading && error && (
            <div className="p-6 bg-rose-950/40 border border-rose-800/80 rounded-2xl space-y-4 max-w-lg mx-auto text-center">
              <div className="w-12 h-12 rounded-full bg-rose-900/60 text-rose-400 flex items-center justify-center mx-auto">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-rose-200 font-display">
                  Analisis AI Belum Dapat Diproses
                </h3>
                <p className="text-xs text-rose-300 leading-relaxed">
                  {error}
                </p>
              </div>
              <p className="text-[11px] text-slate-400">
                Sesuai prinsip keadilan penilaian kurikulum SMP, sistem tidak akan menghasilkan skor simulasi atau angka acak jika data gagal diproses.
              </p>
              <div className="pt-2 flex flex-col sm:flex-row gap-2.5 justify-center">
                <button
                  type="button"
                  onClick={onRetry}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Coba Analisis Ulang</span>
                </button>
                <button
                  type="button"
                  onClick={onOpenManualRubric}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold transition-all border border-slate-700 flex items-center justify-center gap-1.5"
                >
                  <FileCheck2 className="w-3.5 h-3.5 text-amber-400" />
                  <span>Gunakan Rubrik Manual Guru</span>
                </button>
              </div>
            </div>
          )}

          {/* 3. SUCCESS REPORT DISPLAY */}
          {!isLoading && !error && report && (
            <>
              {/* Summary Card with Overall Score Banner */}
              <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 rounded-2xl border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <User className="w-3.5 h-3.5 text-sky-400" />
                    <span className="font-bold text-white text-sm">{studentName}</span>
                    <span>·</span>
                    <span>{studentClass}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                    <span className="text-white font-medium">{poem.title}</span>
                    <span className="italic font-serif">karya {poem.poet}</span>
                  </div>
                  <div className="text-[11px] text-slate-500 font-mono">
                    Durasi: {formatTime(durationSeconds)} · Akurasi Lafal Teks: {report.wordAccuracyPercentage}%
                  </div>
                </div>

                {/* Score Box */}
                <div className="flex items-center gap-4 bg-slate-950/80 p-3 sm:p-4 rounded-xl border border-slate-800/90 shrink-0">
                  <div className="text-right">
                    <div className="text-[10px] text-slate-400 font-mono uppercase tracking-wider">
                      TOTAL SKOR AI
                    </div>
                    <div className="text-xs font-semibold text-amber-400">
                      {report.predicate}
                    </div>
                  </div>
                  <div className="text-4xl sm:text-5xl font-black font-display text-transparent bg-clip-text bg-gradient-to-br from-amber-300 via-amber-400 to-amber-500 font-mono">
                    {report.overallScore}
                  </div>
                </div>
              </div>

              {/* Navigation Tabs */}
              <div className="flex items-center border-b border-slate-800 gap-1 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setActiveTab('overview')}
                  className={`px-4 py-2 border-b-2 transition-all ${
                    activeTab === 'overview'
                      ? 'border-amber-400 text-amber-300 bg-amber-500/10 rounded-t-lg'
                      : 'border-transparent text-slate-400 hover:text-white'
                  }`}
                >
                  Ringkasan Rubrik (40/30/30)
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('text-check')}
                  className={`px-4 py-2 border-b-2 transition-all flex items-center gap-1.5 ${
                    activeTab === 'text-check'
                      ? 'border-amber-400 text-amber-300 bg-amber-500/10 rounded-t-lg'
                      : 'border-transparent text-slate-400 hover:text-white'
                  }`}
                >
                  <span>Periksa Teks & Transkripsi</span>
                  <span className="px-1.5 py-0.2 bg-slate-800 text-amber-400 font-mono text-[10px] rounded">
                    {report.wordAccuracyPercentage}%
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('breakdown')}
                  className={`px-4 py-2 border-b-2 transition-all ${
                    activeTab === 'breakdown'
                      ? 'border-amber-400 text-amber-300 bg-amber-500/10 rounded-t-lg'
                      : 'border-transparent text-slate-400 hover:text-white'
                  }`}
                >
                  Bukti & Rekomendasi
                </button>
              </div>

              {/* TAB 1: OVERVIEW (3 MAIN ASPECTS) */}
              {activeTab === 'overview' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                    {/* 1. Vokal Card (40%) */}
                    <div className="p-4 bg-slate-950/70 rounded-xl border border-sky-900/40 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Volume2 className="w-4 h-4 text-sky-400" />
                          <span className="text-xs font-bold text-white font-display">
                            1. VOKAL (40%)
                          </span>
                        </div>
                        <span className="text-lg font-black font-mono text-sky-300">
                          {report.vocal.score}
                        </span>
                      </div>
                      <div className="space-y-1.5 text-[11px] text-slate-400">
                        <div className="flex justify-between">
                          <span>Artikulasi Bunyi:</span>
                          <strong className="text-white font-mono">{report.vocal.articulationScore}</strong>
                        </div>
                        <div className="flex justify-between">
                          <span>Tempo / Ketukan:</span>
                          <strong className="text-white font-mono">{report.vocal.tempoScore}</strong>
                        </div>
                        <div className="flex justify-between">
                          <span>Ketetapan Jeda (/, //, ///):</span>
                          <strong className="text-white font-mono">{report.vocal.pauseScore}</strong>
                        </div>
                        <div className="flex justify-between">
                          <span>Volume & Napas:</span>
                          <strong className="text-white font-mono">{report.vocal.volumeBreathingScore}</strong>
                        </div>
                      </div>
                      <p className="text-[11px] text-slate-300 border-t border-slate-800/80 pt-2 leading-relaxed">
                        {report.vocal.summary}
                      </p>
                    </div>

                    {/* 2. Penghayatan Card (30%) */}
                    <div className="p-4 bg-slate-950/70 rounded-xl border border-amber-900/40 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Heart className="w-4 h-4 text-amber-400" />
                          <span className="text-xs font-bold text-white font-display">
                            2. PENGHAYATAN (30%)
                          </span>
                        </div>
                        <span className="text-lg font-black font-mono text-amber-300">
                          {report.appreciation.score}
                        </span>
                      </div>
                      <div className="space-y-1.5 text-[11px] text-slate-400">
                        <div className="flex justify-between">
                          <span>Dinamika Intonasi:</span>
                          <strong className="text-white font-mono">{report.appreciation.intonationScore}</strong>
                        </div>
                        <div className="flex justify-between">
                          <span>Keselarasan Emosi:</span>
                          <strong className="text-white font-mono">{report.appreciation.emotionalMatchScore}</strong>
                        </div>
                        <div className="flex justify-between">
                          <span>Penekanan Kata Kunci:</span>
                          <strong className="text-white font-mono">{report.appreciation.emphasisScore}</strong>
                        </div>
                      </div>
                      <p className="text-[11px] text-slate-300 border-t border-slate-800/80 pt-2 leading-relaxed">
                        {report.appreciation.summary}
                      </p>
                    </div>

                    {/* 3. Penampilan Card (30%) */}
                    <div className="p-4 bg-slate-950/70 rounded-xl border border-purple-900/40 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Eye className="w-4 h-4 text-purple-400" />
                          <span className="text-xs font-bold text-white font-display">
                            3. PENAMPILAN (30%)
                          </span>
                        </div>
                        <span className="text-lg font-black font-mono text-purple-300">
                          {report.performance.score}
                        </span>
                      </div>
                      <div className="space-y-1.5 text-[11px] text-slate-400">
                        <div className="flex justify-between">
                          <span>Mimik Wajah:</span>
                          <strong className="text-white font-mono">{report.performance.facialExpressionScore}</strong>
                        </div>
                        <div className="flex justify-between">
                          <span>Kontak Mata ke Audiens:</span>
                          <strong className="text-white font-mono">{report.performance.eyeContactScore}</strong>
                        </div>
                        <div className="flex justify-between">
                          <span>Sikap Tubuh & Panggung:</span>
                          <strong className="text-white font-mono">{report.performance.postureScore}</strong>
                        </div>
                      </div>
                      <p className="text-[11px] text-slate-300 border-t border-slate-800/80 pt-2 leading-relaxed">
                        {report.performance.summary}
                      </p>
                    </div>
                  </div>

                  {/* Highlights Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div className="p-3.5 bg-emerald-950/30 border border-emerald-800/50 rounded-xl space-y-2">
                      <div className="flex items-center gap-2 text-xs font-bold text-emerald-300 font-display">
                        <ThumbsUp className="w-4 h-4" />
                        <span>Kekuatan Utama Penampilan Siswa:</span>
                      </div>
                      <ul className="text-[11px] text-slate-300 space-y-1 list-disc list-inside">
                        {report.strengths.map((str, idx) => (
                          <li key={idx} className="leading-snug">{str}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-3.5 bg-amber-950/30 border border-amber-800/50 rounded-xl space-y-2">
                      <div className="flex items-center gap-2 text-xs font-bold text-amber-300 font-display">
                        <TrendingUp className="w-4 h-4" />
                        <span>Rekomendasi Pembelajaran Lanjutan:</span>
                      </div>
                      <ul className="text-[11px] text-slate-300 space-y-1 list-disc list-inside">
                        {report.improvements.map((imp, idx) => (
                          <li key={idx} className="leading-snug">{imp}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: TEXT & TRANSCRIPTION COMPARISON */}
              {activeTab === 'text-check' && (
                <div className="space-y-4">
                  <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                    <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Transkripsi Suara Nyata dari Rekaman Siswa:</span>
                    </span>
                    <p className="text-xs text-slate-200 leading-relaxed font-serif italic bg-slate-900 p-3 rounded-lg border border-slate-800">
                      "{report.transcription}"
                    </p>
                  </div>

                  {/* Discrepancies list */}
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-slate-300 block">
                      Analisis Ketepatan Kata & Frasa:
                    </span>
                    {report.wordDiscrepancies && report.wordDiscrepancies.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        {report.wordDiscrepancies.map((item, idx) => (
                          <div
                            key={idx}
                            className={`p-2.5 rounded-lg border flex items-center justify-between gap-2 ${
                              item.status === 'omitted'
                                ? 'bg-rose-950/40 border-rose-800 text-rose-300'
                                : item.status === 'substituted'
                                ? 'bg-amber-950/40 border-amber-800 text-amber-300'
                                : 'bg-sky-950/40 border-sky-800 text-sky-300'
                            }`}
                          >
                            <span className="text-[11px] uppercase font-mono font-bold">
                              {item.status === 'omitted' ? 'Terlewat:' : item.status === 'substituted' ? 'Diubah:' : 'Ditambah:'}
                            </span>
                            <span className="font-semibold text-right">
                              {item.expectedWord ? `"${item.expectedWord}"` : ''}{' '}
                              {item.spokenWord ? `→ "${item.spokenWord}"` : ''}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-3 bg-emerald-950/30 border border-emerald-800/40 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Sempurna! Seluruh kata pada naskah puisi terucap lengkap tanpa kata yang terlewat.</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 3: BREAKDOWN & EVIDENCE */}
              {activeTab === 'breakdown' && (
                <div className="space-y-4">
                  {/* Evidence details */}
                  <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3 text-xs">
                    <span className="font-bold text-amber-300 block font-display">
                      Bukti Konkret yang Mendasari Penilaian AI:
                    </span>

                    <div className="space-y-2">
                      <strong className="text-sky-300 block text-[11px]">Bukti Aspek Vokal & Jeda:</strong>
                      <ul className="list-disc list-inside text-slate-300 space-y-1 pl-1">
                        {report.vocal.evidence.map((ev, i) => (
                          <li key={i}>{ev}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-slate-800">
                      <strong className="text-amber-300 block text-[11px]">Bukti Aspek Penghayatan & Emosi:</strong>
                      <ul className="list-disc list-inside text-slate-300 space-y-1 pl-1">
                        {report.appreciation.evidence.map((ev, i) => (
                          <li key={i}>{ev}</li>
                        ))}
                      </ul>
                    </div>

                    {report.performance.evidence && report.performance.evidence.length > 0 && (
                      <div className="space-y-2 pt-2 border-t border-slate-800">
                        <strong className="text-purple-300 block text-[11px]">Bukti Aspek Penampilan Panggung:</strong>
                        <ul className="list-disc list-inside text-slate-300 space-y-1 pl-1">
                          {report.performance.evidence.map((ev, i) => (
                            <li key={i}>{ev}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Teacher Validation Input Box */}
                  <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800 space-y-2">
                    <label className="text-xs font-semibold text-slate-300 block">
                      Catatan Guru Pembimbing (Validasi Manusia):
                    </label>
                    <textarea
                      rows={2}
                      value={teacherNotes}
                      onChange={(e) => setTeacherNotes(e.target.value)}
                      placeholder="Masukkan catatan konfirmasi guru untuk siswa sebelum laporan dicetak atau dibagikan..."
                      className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>
              )}

              {/* Pedagogical Transparency Disclaimer */}
              <div className="p-3 bg-slate-950/90 rounded-xl border border-slate-800/90 text-[11px] text-slate-400 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Pedoman Evaluasi SMP:</strong> Skor di atas merupakan estimasi evaluasi cerdas AI berbasis kurikulum Bahasa Indonesia untuk memotivasi latihan siswa. Keputusan akhir dan nilai rapor tetap berada pada wewenang guru pembimbing.
                </span>
              </div>
            </>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="px-5 sm:px-6 py-3.5 bg-slate-950 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            {report && (
              <>
                <button
                  type="button"
                  onClick={copyReportText}
                  className="h-9 px-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 border border-slate-700 transition-colors"
                >
                  <Copy className="w-3.5 h-3.5 text-sky-400" />
                  <span>{copied ? 'Tersalin!' : 'Salin Laporan'}</span>
                </button>
                <button
                  type="button"
                  onClick={handlePrint}
                  className="h-9 px-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 border border-slate-700 transition-colors hidden sm:flex"
                >
                  <Printer className="w-3.5 h-3.5 text-amber-400" />
                  <span>Cetak</span>
                </button>
              </>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                onClose();
                onPracticeAgain();
              }}
              className="h-9 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold flex items-center gap-1.5 border border-slate-700 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
              <span>Latihan Lagi</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="h-9 px-5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-colors font-display"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
