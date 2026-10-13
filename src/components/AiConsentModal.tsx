import React, { useState } from 'react';
import {
  ShieldAlert,
  Mic,
  Camera,
  CheckCircle2,
  X,
  Sparkles,
  Info,
  Clock,
  User,
  BookOpen,
} from 'lucide-react';
import { Poem } from '../types/poem';

interface AiConsentModalProps {
  isOpen: boolean;
  poem: Poem;
  studentName: string;
  studentClass: string;
  durationSeconds: number;
  snapshotsCount: number;
  onConfirm: (visualConsent: boolean) => void;
  onCancelManualRubric: () => void;
  onClose: () => void;
}

export const AiConsentModal: React.FC<AiConsentModalProps> = ({
  isOpen,
  poem,
  studentName,
  studentClass,
  durationSeconds,
  snapshotsCount,
  onConfirm,
  onCancelManualRubric,
  onClose,
}) => {
  const [visualConsent, setVisualConsent] = useState<boolean>(true);
  const [audioConsent, setAudioConsent] = useState<boolean>(true);

  if (!isOpen) return null;

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${mins}m ${rem}s`;
  };

  const handleProceed = () => {
    if (!audioConsent) return;
    onConfirm(visualConsent);
  };

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-xl w-full shadow-2xl overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white font-display">
                Konfirmasi Persetujuan Analisis AI
              </h2>
              <p className="text-xs text-slate-400">
                Pemberitahuan Transparansi & Privasi Siswa Sebelum Analisis Cloud
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

        {/* Content */}
        <div className="p-6 space-y-5 text-xs text-slate-300">
          {/* Quick Summary Pill Strip */}
          <div className="grid grid-cols-3 gap-2 p-3 bg-slate-950/70 rounded-xl border border-slate-800 text-[11px]">
            <div className="flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-sky-400 shrink-0" />
              <span className="truncate">{studentName}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="truncate">{poem.title}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Durasi: {formatTime(durationSeconds)}</span>
            </div>
          </div>

          <p className="leading-relaxed">
            Aplikasi ini menggunakan <strong>Google Gemini API</strong> untuk menganalisis pembacaan puisi secara autentik berdasarkan rubrik standar: <strong>Vokal 40%</strong>, <strong>Penghayatan 30%</strong>, dan <strong>Penampilan 30%</strong>.
          </p>

          {/* Granular Consent Toggles */}
          <div className="space-y-3">
            {/* 1. Audio Consent */}
            <div
              onClick={() => setAudioConsent(!audioConsent)}
              className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                audioConsent
                  ? 'bg-amber-500/10 border-amber-500/40 ring-1 ring-amber-500/30'
                  : 'bg-slate-950/60 border-slate-800 opacity-60'
              }`}
            >
              <div className="pt-0.5">
                <input
                  type="checkbox"
                  checked={audioConsent}
                  onChange={(e) => setAudioConsent(e.target.checked)}
                  className="rounded text-amber-500 focus:ring-amber-500 w-4 h-4 cursor-pointer"
                />
              </div>
              <div className="space-y-1">
                <div className="font-bold text-white flex items-center gap-1.5">
                  <Mic className="w-3.5 h-3.5 text-amber-400" />
                  <span>Kirim Data Audio Rekaman Suara Siswa (Wajib)</span>
                </div>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Audio digunakan untuk analisis lafal vokal, pernapasan, tempo ketukan, ketepatan jeda (/ , //, ///), dan deteksi kata yang terlewat atau berubah. Audio tidak disimpan permanen di server.
                </p>
              </div>
            </div>

            {/* 2. Visual Snapshot Consent */}
            <div
              onClick={() => setVisualConsent(!visualConsent)}
              className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                visualConsent
                  ? 'bg-sky-500/10 border-sky-500/40 ring-1 ring-sky-500/30'
                  : 'bg-slate-950/60 border-slate-800'
              }`}
            >
              <div className="pt-0.5">
                <input
                  type="checkbox"
                  checked={visualConsent}
                  onChange={(e) => setVisualConsent(e.target.checked)}
                  className="rounded text-sky-500 focus:ring-sky-500 w-4 h-4 cursor-pointer"
                />
              </div>
              <div className="space-y-1">
                <div className="font-bold text-white flex items-center gap-1.5">
                  <Camera className="w-3.5 h-3.5 text-sky-400" />
                  <span>
                    Kirim Cuplikan Foto Statis Wajah ({snapshotsCount} Foto) (Opsional)
                  </span>
                </div>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Hanya beberapa lembar foto statis ringan (bukan video) untuk mendeteksi mimik wajah dan kontak mata ke penonton. Jika dinonaktifkan, analisis visual tidak akan diproses di cloud.
                </p>
              </div>
            </div>
          </div>

          {/* Privacy Guarantee Box */}
          <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 text-[11px] text-slate-400 flex items-start gap-2">
            <Info className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>
              <strong>Jaminan Keamanan:</strong> Video live Anda tidak pernah direkam atau diunggah. Seluruh data diproses sementara semata-mata untuk menghasilkan laporan evaluasi belajar saat ini.
            </span>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="px-6 py-4 bg-slate-950 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={onCancelManualRubric}
            className="text-xs text-slate-400 hover:text-white underline underline-offset-4"
          >
            Lewati AI & Gunakan Rubrik Manual Guru Saja
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 text-xs font-semibold text-slate-400 hover:text-white rounded-lg"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handleProceed}
              disabled={!audioConsent}
              className="px-5 py-2 text-xs font-bold bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-slate-950 rounded-xl transition-all shadow-md flex items-center gap-2 font-display active:scale-95"
            >
              <Sparkles className="w-4 h-4" />
              <span>Setujui & Mulai Analisis AI</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
