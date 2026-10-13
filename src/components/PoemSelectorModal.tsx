import React, { useState } from 'react';
import { Poem } from '../types/poem';
import { INITIAL_POEMS, parseCustomPoemText } from '../data/poems';
import { BookOpen, Plus, Check, X, FileText, Sparkles } from 'lucide-react';

interface PoemSelectorModalProps {
  isOpen: boolean;
  activePoemId: string;
  onSelectPoem: (poem: Poem) => void;
  onClose: () => void;
}

export const PoemSelectorModal: React.FC<PoemSelectorModalProps> = ({
  isOpen,
  activePoemId,
  onSelectPoem,
  onClose,
}) => {
  const [poemsList, setPoemsList] = useState<Poem[]>(INITIAL_POEMS);
  const [isAddingCustom, setIsAddingCustom] = useState(false);
  const [customTitle, setCustomTitle] = useState('');
  const [customPoet, setCustomPoet] = useState('');
  const [customText, setCustomText] = useState('');

  if (!isOpen) return null;

  const handleAddCustomPoem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customText.trim()) return;

    const newPoem = parseCustomPoemText(
      customTitle.trim() || 'Puisi Siswa',
      customPoet.trim() || 'Karya Siswa',
      customText.trim()
    );

    setPoemsList((prev) => [newPoem, ...prev]);
    onSelectPoem(newPoem);
    setIsAddingCustom(false);
    setCustomTitle('');
    setCustomPoet('');
    setCustomText('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden my-6">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white font-display">
                Pilih Naskah Puisi Latihan
              </h2>
              <p className="text-xs text-slate-400">
                Pilih naskah kurikulum SMP atau masukkan teks puisi karya siswa
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
        <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto teleprompter-scroll">
          {/* Action Tabs: Choose from Library or Add Custom */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider font-display">
              Koleksi Puisi Pembelajaran:
            </span>
            <button
              type="button"
              onClick={() => setIsAddingCustom(!isAddingCustom)}
              className="px-3 py-1.5 rounded-lg bg-amber-500/15 text-amber-300 border border-amber-500/30 text-xs font-semibold hover:bg-amber-500/25 transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{isAddingCustom ? 'Kembali ke Daftar' : 'Input Puisi Sendiri'}</span>
            </button>
          </div>

          {isAddingCustom ? (
            /* Custom Poem Entry Form */
            <form onSubmit={handleAddCustomPoem} className="space-y-4 bg-slate-950/80 border border-slate-800 p-5 rounded-xl">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
                <Sparkles className="w-4 h-4" />
                <span>Formulir Naskah Puisi Siswa / Guru</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Judul Puisi:</label>
                  <input
                    type="text"
                    required
                    value={customTitle}
                    onChange={(e) => setCustomTitle(e.target.value)}
                    placeholder="Contoh: Tanah Airku Indonesia"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Nama Penyair:</label>
                  <input
                    type="text"
                    required
                    value={customPoet}
                    onChange={(e) => setCustomPoet(e.target.value)}
                    placeholder="Contoh: Budi Santoso (Kelas VIII A)"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">
                  Teks Lengkap Puisi (Pisahkan per baris):
                </label>
                <textarea
                  rows={8}
                  required
                  value={customText}
                  onChange={(e) => setCustomText(e.target.value)}
                  placeholder="Ketik atau tempel teks puisi di sini...&#10;Sistem akan otomatis menghasilkan tanda jeda (/ dan //) dan pembagian baris teleprompter."
                  className="w-full p-3 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-500 font-serif leading-relaxed"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddingCustom(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg transition-colors shadow-md"
                >
                  Gunakan Puisi Ini di Teleprompter
                </button>
              </div>
            </form>
          ) : (
            /* Poem Cards Grid */
            <div className="space-y-3">
              {poemsList.map((poem) => {
                const isSelected = poem.id === activePoemId;
                return (
                  <div
                    key={poem.id}
                    onClick={() => {
                      onSelectPoem(poem);
                      onClose();
                    }}
                    className={`p-4 rounded-xl cursor-pointer border transition-all flex items-start justify-between gap-4 ${
                      isSelected
                        ? 'bg-amber-500/15 border-amber-500/60 ring-1 ring-amber-500/30'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40'
                    }`}
                  >
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2">
                        <FileText className={`w-4 h-4 ${isSelected ? 'text-amber-400' : 'text-slate-400'}`} />
                        <h3 className="text-sm font-bold text-white font-display">
                          {poem.title}
                        </h3>
                        <span className="text-xs text-amber-300/80 font-serif italic">
                          — {poem.poet}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                        {poem.synopsis}
                      </p>
                      <div className="flex items-center gap-3 text-[11px] text-slate-500 font-mono pt-1">
                        <span>{poem.stanzas.length} Bait</span>
                        <span>·</span>
                        <span>
                          {poem.stanzas.reduce((acc, s) => acc + s.lines.length, 0)} Baris
                        </span>
                        <span>·</span>
                        <span className="text-amber-400/80">{poem.theme}</span>
                      </div>
                    </div>

                    <div className="shrink-0 pt-1">
                      {isSelected ? (
                        <div className="w-7 h-7 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
                          <Check className="w-4 h-4" />
                        </div>
                      ) : (
                        <button
                          type="button"
                          className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 text-xs font-semibold"
                        >
                          Pilih
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-950 border-t border-slate-800 text-right">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
