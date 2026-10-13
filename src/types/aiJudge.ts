export interface TextComparisonItem {
  status: 'correct' | 'omitted' | 'substituted' | 'added';
  expectedWord?: string;
  spokenWord?: string;
  stanzaIndex?: number;
}

export interface VocalAnalysis {
  score: number; // 0 - 100
  weight: number; // 40
  articulationScore: number; // 0 - 100
  tempoScore: number; // 0 - 100
  pauseScore: number; // 0 - 100
  volumeBreathingScore: number; // 0 - 100
  summary: string;
  evidence: string[];
}

export interface AppreciationAnalysis {
  score: number; // 0 - 100
  weight: number; // 30
  intonationScore: number; // 0 - 100
  emotionalMatchScore: number; // 0 - 100
  emphasisScore: number; // 0 - 100
  summary: string;
  evidence: string[];
}

export interface PerformanceVisualAnalysis {
  score: number; // 0 - 100
  weight: number; // 30
  facialExpressionScore: number; // 0 - 100
  eyeContactScore: number; // 0 - 100
  postureScore: number; // 0 - 100
  summary: string;
  evidence: string[];
  isVisualAnalyzed: boolean;
  visualNote?: string;
}

export interface AiJudgeReport {
  overallScore: number; // (Vocal * 0.40) + (Penghayatan * 0.30) + (Penampilan * 0.30)
  predicate: string;
  transcription: string;
  wordAccuracyPercentage: number;
  wordDiscrepancies: TextComparisonItem[];
  vocal: VocalAnalysis;
  appreciation: AppreciationAnalysis;
  performance: PerformanceVisualAnalysis;
  strengths: string[];
  improvements: string[];
  evaluatorNote: string;
  analyzedAt: string;
}

export interface AnalyzeRequestPayload {
  poemId: string;
  poemTitle: string;
  poet: string;
  poemRawText: string;
  prosodyMarkedText: string;
  studentName: string;
  studentClass: string;
  durationSeconds: number;
  audioBase64: string;
  audioMimeType: string;
  visualConsent: boolean;
  snapshots?: string[]; // Base64 JPEGs
}

export interface AnalyzeResponsePayload {
  success: boolean;
  report?: AiJudgeReport;
  error?: string;
  errorCode?: 'MISSING_API_KEY' | 'AUDIO_UNREADABLE' | 'API_ERROR' | 'INVALID_REQUEST';
}
