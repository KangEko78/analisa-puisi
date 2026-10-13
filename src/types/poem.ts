export type PauseType = 'short' | 'medium' | 'long';

export interface PoemWord {
  text: string;
  isEmphasized?: boolean;
  pauseAfter?: PauseType; // 'short' (/), 'medium' (//), 'long' (///)
}

export interface PoemLine {
  id: string;
  rawText: string;
  words: PoemWord[];
  prosodyMarkedText: string; // Teks dengan simbol /, //, ///
  expressionNote?: string;   // Panduan ekspresi/mimik/suara untuk baris ini
}

export interface PoemStanza {
  stanzaNumber: number;
  moodTheme: string;        // Suasana bait (e.g. Cemas & Gelisah, Prihatin & Menggugat, dsb)
  voiceGuide: string;       // Panduan vokal (e.g. Tempo lambat, nada rendah, intonasi meratap)
  lines: PoemLine[];
}

export interface Poem {
  id: string;
  title: string;
  poet: string;
  year?: string;
  theme: string;
  synopsis: string;
  stanzas: PoemStanza[];
}

export interface RubricScore {
  articulation: number;  // Lafal & Artikulasi (1-5)
  intonation: number;    // Intonasi & Tekanan (1-5)
  pauseTempo: number;    // Jeda & Tempo (1-5)
  facialExpression: number; // Ekspresi & Mimik (1-5)
  appreciation: number;  // Penghayatan & Gestur (1-5)
  notes: string;         // Catatan Guru / Refleksi Siswa
}

export interface PerformanceSession {
  poemId: string;
  poemTitle: string;
  studentName: string;
  studentClass: string;
  durationSeconds: number;
  completedAt: string;
  rubric: RubricScore;
}
