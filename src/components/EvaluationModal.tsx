import React, { useState } from 'react';
import { Poem, RubricScore } from '../types/poem';
import {
  Award,
  Clock,
  BookOpen,
  User,
  Star,
  Check,
  Copy,
  RotateCcw,
  X,
  FileText
} from 'lucide-react';

interface EvaluationModalProps {
  isOpen: boolean;
  poem: Poem;
  studentName: string;
  studentClass: string;
  durationSeconds: number;
  onClose: () => void;
  onRestartPractice: () => void;
}

export const EvaluationModal: React.FC<EvaluationModalProps> = ({
  isOpen,
  poem,
  studentName,
  studentClass,
  durationSeconds,
  onClose,
  onRestartPractice,
}) => {
  const [rubric, setRubric] = useState<RubricScore>({
    articulation: 4,
    intonation: 4,
    pauseTempo: 4,
    facialExpression: 4,
    appreciation: 4,
    notes: '',
  });

  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins} menit ${remainingSecs} detik`;
  };

  const calculateTotalScore = () => {
    const total =
      rubric.articulation +
      rubric.intonation +
      rubric.pauseTempo +
      rubric.facialExpression +
      rubric.appreciation;
    return Math.round((total / 25) * 100);
  };

  const getPredicate = (score: number) => {
    if (score >= 90) return { label: 'Sangat Mahir (A)', color: 'text-emerald-400' };
    if (score >= 80) return { label: 'Mahir (B+)', color: 'text-amber-400' };
    if (score >= 70) return { label: 'Berkembang (B)', color: 'text-sky-400' };
    return { label: 'Perlu Pendampingan (C)', color: 'text-rose-400' };
  };

  const copySummaryToClipboard = () => {
    const text = `=== LEMBAR REFLEKSI LATIHAN PEMBACAAN PUISI ===
Aplikasi: PUISI PERFORMANCE STUDIO (IFP SMP)
Nama Siswa: ${studentName} (${studentClass})
Puisi: ${poem.title} karya ${poem.poet}
Durasi Latihan: ${formatTime(durationSeconds)}

--- CAPAIAN ASPEK KURIKULUM BAHASA INDONESIA ---
1. Lafal & Artikulasi: ${rubric.articulation}/5
2. Intonasi & Tekanan: ${rubric.intonation}/5
3. Jeda & Tempo: ${rubric.pauseTempo}/5
4. Ekspresi & Mimik: ${rubric.facialExpression}/5
5. Penghayatan & Gestur: ${rubric.appreciation}/5
Nilai Konversi: ${calculateTotalScore()}/100 (${getPredicate(calculateTotalScore()).label})

Catatan Refleksi:
${rubric.notes || 'Penampilan telah terlaksana dengan baik di depan panggung IFP.'}
==================================================`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const totalScore = calculateTotalScore();
  const predicate = getPredicate(totalScore);

  const criteriaList: Array<{
    key: keyof Omit<RubricScore, 'notes'>;
    title: string;
    desc: string;
  }> = [
    {
      key: 'articulation',
      title: 'Lafal & Artikulasi',
      desc: 'Kejelasan bunyi vokal (A-I-U-E-O) dan konsonan tanpa tergesa-gesa.',
    },
    {
      key: 'intonation',
      title: 'Intonasi & Tekanan',
      desc: 'Dinamika tinggi-rendah nada serta tekanan keras pada kata bermakna kunci.',
    },
    {
      key: 'pauseTempo',
      title: 'Jeda & Tempo',
      desc: 'Ketetapan henti sejenak (/), sedang (//), dan jeda bait perenungan (///).',
    },
    {
      key: 'facialExpression',
      title: 'Ekspresi & Mimik',
      desc: 'Raut wajah selaras dengan emosi suasana puisi (cemas, berontak, khusyuk).',
    },
    {
      key: 'appreciation',
      title: 'Penghayatan & Sikap Panggung',
      desc: 'Kontak mata dengan penonton, ketegakan tubuh, dan kedalaman penghayatan.',
    },
  ];

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-3xl w-full shadow-2xl overflow-hidden my-6">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white font-display">
                Lembar Refleksi & Evaluasi Pembacaan Puisi
              </h2>
              <p className="text-xs text-slate-400">
                Instrumen Penilaian Autentik Kurikulum Bahasa Indonesia SMP
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto teleprompter-scroll">
          {/* Performance Summary Banner */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-slate-950/70 border border-slate-800 rounded-xl text-xs">
            <div className="flex items-center gap-2.5">
              <User className="w-4 h-4 text-sky-400 shrink-0" />
              <div>
                <span className="text-slate-500 block text-[10px]">SISWA PEMBACA:</span>
                <span className="font-bold text-white text-sm">{studentName}</span>
                <span className="text-slate-400 block text-[11px]">{studentClass}</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <BookOpen className="w-4 h-4 text-amber-400 shrink-0" />
              <div>
                <span className="text-slate-500 block text-[10px]">JUDUL PUISI:</span>
                <span className="font-bold text-white text-sm">{poem.title}</span>
                <span className="text-slate-400 block text-[11px]">karya {poem.poet}</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
              <div>
                <span className="text-slate-500 block text-[10px]">DURASI LATIHAN:</span>
                <span className="font-bold text-emerald-300 text-sm">
                  {formatTime(durationSeconds)}
                </span>
                <span className="text-slate-400 block text-[11px]">Teleprompter terlewati</span>
              </div>
            </div>
          </div>

          {/* Real Rubric Rubrik Penilaian Standar SMP */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-200 font-display flex items-center gap-2">
                <FileText className="w-4 h-4 text-amber-400" />
                <span>Rubrik Penilaian 5 Aspek Dasar (Skala 1 - 5)</span>
              </h3>
              <div className="text-right">
                <span className="text-xs text-slate-400">Total Skor: </span>
                <span className="text-base font-extrabold text-amber-300 font-mono">
                  {totalScore} / 100
                </span>
                <span className={`ml-2 text-xs font-bold ${predicate.color}`}>
                  ({predicate.label})
                </span>
              </div>
            </div>

            <div className="space-y-3">
              {criteriaList.map((crit) => {
                const currentVal = rubric[crit.key];
                return (
                  <div
                    key={crit.key}
                    className="p-3.5 bg-slate-950/60 border border-slate-800 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-3"
                  >
                    <div className="space-y-0.5 max-w-md">
                      <div className="text-xs font-bold text-slate-200">{crit.title}</div>
                      <div className="text-[11px] text-slate-400 leading-snug">{crit.desc}</div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0 self-end md:self-auto">
                      {[1, 2, 3, 4, 5].map((starVal) => (
                        <button
                          key={starVal}
                          type="button"
                          onClick={() =>
                            setRubric((prev) => ({
                              ...prev,
                              [crit.key]: starVal,
                            }))
                          }
                          className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all ${
                            starVal <= currentVal
                              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/50 hover:bg-amber-500/30'
                              : 'bg-slate-800 text-slate-600 hover:text-slate-400'
                          }`}
                          title={`Nilai ${starVal} dari 5`}
                        >
                          <Star
                            className={`w-4 h-4 ${
                              starVal <= currentVal ? 'fill-amber-400 text-amber-400' : ''
                            }`}
                          />
                        </button>
                      ))}
                      <span className="w-6 text-center text-xs font-mono font-bold text-slate-300">
                        {currentVal}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Teacher / Peer Feedback Notes */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 block">
              Catatan Refleksi Siswa / Umpan Balik Guru di Kelas:
            </label>
            <textarea
              rows={3}
              value={rubric.notes}
              onChange={(e) =>
                setRubric((prev) => ({ ...prev, notes: e.target.value }))
              }
              placeholder="Contoh: Artikulasi vokal sudah jelas dan lantang. Pada bait kedua perlu memperdalam jeda panjang (///) untuk memberi ruang perenungan makna bencana alam kepada penonton..."
              className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-amber-500 transition-colors"
            />
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-950 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={copySummaryToClipboard}
            className="h-10 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-2 border border-slate-700 transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-300">Tersalin ke Papan Klip!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-sky-400" />
                <span>Salin Ringkasan Penilaian</span>
              </>
            )}
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                onClose();
                onRestartPractice();
              }}
              className="h-10 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold flex items-center gap-2 border border-slate-700 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
              <span>Latihan Lagi</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="h-10 px-5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-colors"
            >
              Selesai & Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
