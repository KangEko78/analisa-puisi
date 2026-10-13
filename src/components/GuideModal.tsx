import React from 'react';
import { X, Mic, Eye, Wind, Smile, HelpCircle, Sparkles } from 'lucide-react';

interface GuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GuideModal: React.FC<GuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden my-6">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-sky-500/20 border border-sky-500/40 flex items-center justify-center text-sky-400">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white font-display">
                Panduan Panggung Pembacaan Puisi SMP
              </h2>
              <p className="text-xs text-slate-400">
                Tips Vokal, Pernapasan, Tatapan Mata, dan Penghayatan Jiwa Puisi
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

        {/* Content */}
        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto teleprompter-scroll text-slate-300 text-xs leading-relaxed">
          <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
            <div className="flex items-center gap-2 text-amber-300 font-bold text-sm font-display">
              <Eye className="w-4 h-4 text-amber-400" />
              <span>1. Teknik Tatapan Mata di Panggung IFP</span>
            </div>
            <p>
              Jangan terpaku hanya menatap teks di teleprompter. Gunakan <strong>Garis Tatapan Mata (Eye-Line)</strong> di panel kiri kamera untuk sesekali menyapu pandangan ke arah audiens/juri kelas. Bacalah satu frasa dengan cepat, lalu angkat pandangan saat melafalkan kata-kata kunci berbobot.
            </p>
          </div>

          <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
            <div className="flex items-center gap-2 text-sky-300 font-bold text-sm font-display">
              <Wind className="w-4 h-4 text-sky-400" />
              <span>2. Pernapasan Diafragma & Jeda Bernapas</span>
            </div>
            <p>
              Ambil napas dalam melalui hidung hingga perut mengembang, bukan dada terangkat. Manfaatkan tanda jeda:
            </p>
            <ul className="list-disc list-inside space-y-1 text-slate-400 pl-2">
              <li><strong className="text-sky-300">/ (Jeda Pendek):</strong> Cukup henti sejenak tanpa menarik napas baru.</li>
              <li><strong className="text-amber-300">// (Jeda Sedang):</strong> Tarik napas lembut sejenak sebelum berganti frasa.</li>
              <li><strong className="text-rose-300">/// (Jeda Panjang):</strong> Beri jeda hening penuh 2-3 detik untuk memberi ruang renungan emosi pada audiens.</li>
            </ul>
          </div>

          <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
            <div className="flex items-center gap-2 text-emerald-300 font-bold text-sm font-display">
              <Mic className="w-4 h-4 text-emerald-400" />
              <span>3. Artikulasi Vokal & Tekanan Dinamik</span>
            </div>
            <p>
              Buka rongga mulut lebar-lebar untuk bunyi vokal <strong>A, I, U, E, O</strong>. Pada kata-kata yang ditandai warna emas (penekanan kata), naikkan sedikit volume atau perlambat ketukan agar pesan moral puisi tersampaikan kuat.
            </p>
          </div>

          <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
            <div className="flex items-center gap-2 text-purple-300 font-bold text-sm font-display">
              <Smile className="w-4 h-4 text-purple-400" />
              <span>4. Mimik Wajah & Penghayatan Rasa</span>
            </div>
            <p>
              Pada puisi <em>Membaca Tanda-Tanda</em> karya Taufiq Ismail, raut muka dimulai dari <strong>kecemasan yang sunyi</strong>, bergerak menjadi <strong>kemarahan/kegusaran atas alam yang rusak</strong>, lalu merunduk dalam <strong>doa khusyuk memohon ampunan Tuhan</strong>. Jangan tersenyum pada bait-bait bencana alam!
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-950 border-t border-slate-800 text-right">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg transition-colors"
          >
            Mengerti, Siap Berlatih
          </button>
        </div>
      </div>
    </div>
  );
};
