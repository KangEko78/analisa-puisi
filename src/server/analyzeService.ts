import { GoogleGenAI, Type } from '@google/genai';
import { AnalyzeRequestPayload, AiJudgeReport } from '../types/aiJudge';

/**
 * Safely extracts pure Base64 payload and canonical IANA MIME type,
 * removing any Data URL headers (e.g. data:audio/webm;codecs=opus;base64,) and whitespace.
 */
export function extractBase64AndMime(
  input: string,
  fallbackMime: string = 'audio/webm',
  minBytes: number = 500
) {
  if (!input || typeof input !== 'string') {
    throw new Error('Data Base64 kosong atau tidak valid.');
  }

  let cleanBase64 = input.trim();
  let detectedMime = fallbackMime;

  // If input contains a Data URL header, separate it at the comma
  if (cleanBase64.startsWith('data:')) {
    const commaIndex = cleanBase64.indexOf(',');
    if (commaIndex !== -1) {
      const header = cleanBase64.slice(5, commaIndex); // e.g. "audio/webm;codecs=opus;base64"
      const headerParts = header.split(';');
      if (headerParts.length > 0 && headerParts[0]) {
        detectedMime = headerParts[0].trim();
      }
      cleanBase64 = cleanBase64.slice(commaIndex + 1);
    }
  }

  // Strip all whitespace, newlines, or tabs that would corrupt Base64 decoding
  cleanBase64 = cleanBase64.replace(/\s+/g, '');

  // Normalize MIME type to standard IANA media type (Gemini rejects codec parameters in mimeType)
  if (detectedMime.includes(';')) {
    detectedMime = detectedMime.split(';')[0].trim();
  }

  // Fallback normalization for common audio formats
  if (detectedMime.includes('webm')) {
    detectedMime = 'audio/webm';
  } else if (detectedMime.includes('mp4')) {
    detectedMime = 'audio/mp4';
  } else if (detectedMime.includes('wav')) {
    detectedMime = 'audio/wav';
  } else if (detectedMime.includes('ogg')) {
    detectedMime = 'audio/ogg';
  }

  // Validate that the Base64 decodes to valid non-empty binary bytes
  try {
    const buffer = Buffer.from(cleanBase64, 'base64');
    if (buffer.length === 0) {
      throw new Error('Data biner hasil decoding Base64 berukuran 0 byte.');
    }
    if (buffer.length < minBytes) {
      throw new Error(
        `Ukuran rekaman terlalu kecil (${buffer.length} bytes, minimum ${minBytes} bytes). Pastikan siswa membaca puisi di depan mikrofon.`
      );
    }
  } catch (err: any) {
    throw new Error(`Validasi data Base64 gagal: ${err.message}`);
  }

  return {
    base64: cleanBase64,
    mimeType: detectedMime,
  };
}

export async function performAiPoetryJudge(payload: AnalyzeRequestPayload): Promise<AiJudgeReport> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY' || apiKey.trim() === '') {
    const err: any = new Error(
      'GEMINI_API_KEY belum dikonfigurasi pada environment server Vercel. Pastikan Anda telah menambahkan GEMINI_API_KEY pada tab Settings > Environment Variables di dashboard Vercel Anda.'
    );
    err.code = 'MISSING_API_KEY';
    throw err;
  }

  const ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });

  // Prepare multimodal parts
  const contentsParts: Array<{
    inlineData?: { mimeType: string; data: string };
    text?: string;
  }> = [];

  // 1. Process & Validate Audio Part
  if (!payload.audioBase64) {
    throw new Error('Audio rekaman pembacaan tidak ditemukan. Pastikan mikrofon aktif sebelum menekan tombol Selesai.');
  }

  const audioData = extractBase64AndMime(payload.audioBase64, payload.audioMimeType || 'audio/webm');
  contentsParts.push({
    inlineData: {
      mimeType: audioData.mimeType,
      data: audioData.base64,
    },
  });

  // 2. Process Visual Snapshot Parts (if student consented)
  if (payload.visualConsent && payload.snapshots && payload.snapshots.length > 0) {
    payload.snapshots.slice(0, 4).forEach((snap) => {
      try {
        const snapData = extractBase64AndMime(snap, 'image/jpeg', 50);
        contentsParts.push({
          inlineData: {
            mimeType: 'image/jpeg',
            data: snapData.base64,
          },
        });
      } catch (err) {
        console.warn('Lewati cuplikan foto yang tidak valid:', err);
      }
    });
  }

  // 3. Strict Pedagogical Evaluation Prompt
  const promptText = `
Anda adalah Dewan Juri Profesional dan Kurator Sastra Pembacaan Puisi Bahasa Indonesia untuk jenjang Sekolah Menengah Pertama (SMP).

TUGAS ANDA:
Dengarkan audio pembacaan puisi autentik siswa dan analisis penampilannya secara objektif, mendalam, dan berbasis bukti nyata. Jangan mengarang bukti atau memberikan skor sembarangan.

DATA PENAMPILAN SISWA:
- Nama Siswa: ${payload.studentName}
- Kelas: ${payload.studentClass}
- Judul Puisi: ${payload.poemTitle}
- Penyair: ${payload.poet}
- Durasi Pembacaan: ${payload.durationSeconds} detik
- Mode Analisis Visual: ${payload.visualConsent ? 'Aktif (cuplikan foto wajah/panggung terlampir)' : 'Nonaktif (hanya evaluasi audio & vokal)'}

TEKS ASLI PUISI YANG HARUS DIBACA SISWA:
"""
${payload.poemRawText}
"""

NOTASI PANDUAN JEDA & PENEKANAN KATA (STANDAR KURIKULUM):
"""
${payload.prosodyMarkedText}
"""
Keterangan tanda:
/ = Jeda pendek (± 0.5 detik, pemenggalan frasa)
// = Jeda sedang (± 1 detik, koma/pergantian kalimat)
/// = Jeda panjang (± 2 detik, henti perenungan akhir bait)

RUBRIK PENILAIAN AUTENTIK (SKALA 0 - 100):
1. VOKAL (Bobot 40%):
   - Artikulasi (kejelasan vokal A-I-U-E-O dan konsonan).
   - Tempo (kecepatan, tidak tergesa-gesa).
   - Jeda (ketepatan pemenggalan /, //, ///).
   - Volume & Pernapasan (daya proyeksi suara dan stabilitas napas diafragma).
2. PENGHAYATAN (Bobot 30%):
   - Intonasi (dinamika nada tinggi-rendah sesuai isi puisi).
   - Keselarasan Emosi (penjiwaan suasana bait: rasa cemas, menggugat alam yang rusak, hingga doa khusyuk).
   - Penekanan Kata (pemberian aksen vokal pada kata-kata bermakna kunci).
3. PENAMPILAN (Bobot 30%):
   - Jika foto visual tersedia: analisis mimik wajah, tatapan mata (apakah menatap audiens atau terpaku ke prompter), dan ketegakan gestur.
   - Jika visual nonaktif: beri skor estimasi berdasarkan wibawa vokal dan beri catatan bahwa analisis visual cloud tidak diaktifkan oleh pengguna.

TRANSKRIPSI & PERBANDINGAN KATA:
- Tuliskan transkripsi apa yang benar-benar diucapkan siswa.
- Hitung persentase akurasi kata (wordAccuracyPercentage).
- Catat kata yang terlewat (omitted), kata yang diubah (substituted), atau kata yang ditambah (added).

RUMUS SKOR AKHIR:
overallScore = (vocal.score * 0.40) + (appreciation.score * 0.30) + (performance.score * 0.30)
Bulatkan skor akhir menjadi bilangan bulat 0-100.
Predikat:
- 90 - 100: "Sangat Mahir (A)"
- 80 - 89: "Mahir (B+)"
- 70 - 79: "Berkembang (B)"
- < 70: "Perlu Pendampingan (C)"

Berikan bukti konkret berupa kutipan bait/kata nyata dari rekaman siswa, 2-3 kekuatan unggul, dan 2-3 rekomendasi perbaikan pedagogis yang memotivasi siswa SMP.
`;

  contentsParts.push({ text: promptText });

  const response = await ai.models.generateContent({
    model: 'gemini-3.8-flash',
    contents: {
      parts: contentsParts as unknown as any,
    },
    config: {
      temperature: 0.2, // Low temperature for consistent, factual grading
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          overallScore: { type: Type.NUMBER },
          predicate: { type: Type.STRING },
          transcription: { type: Type.STRING },
          wordAccuracyPercentage: { type: Type.NUMBER },
          wordDiscrepancies: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                status: { type: Type.STRING },
                expectedWord: { type: Type.STRING },
                spokenWord: { type: Type.STRING },
                stanzaIndex: { type: Type.NUMBER },
              },
              required: ['status'],
            },
          },
          vocal: {
            type: Type.OBJECT,
            properties: {
              score: { type: Type.NUMBER },
              weight: { type: Type.NUMBER },
              articulationScore: { type: Type.NUMBER },
              tempoScore: { type: Type.NUMBER },
              pauseScore: { type: Type.NUMBER },
              volumeBreathingScore: { type: Type.NUMBER },
              summary: { type: Type.STRING },
              evidence: { type: Type.ARRAY, items: { type: Type.STRING } },
            },
            required: ['score', 'articulationScore', 'tempoScore', 'pauseScore', 'volumeBreathingScore', 'summary', 'evidence'],
          },
          appreciation: {
            type: Type.OBJECT,
            properties: {
              score: { type: Type.NUMBER },
              weight: { type: Type.NUMBER },
              intonationScore: { type: Type.NUMBER },
              emotionalMatchScore: { type: Type.NUMBER },
              emphasisScore: { type: Type.NUMBER },
              summary: { type: Type.STRING },
              evidence: { type: Type.ARRAY, items: { type: Type.STRING } },
            },
            required: ['score', 'intonationScore', 'emotionalMatchScore', 'emphasisScore', 'summary', 'evidence'],
          },
          performance: {
            type: Type.OBJECT,
            properties: {
              score: { type: Type.NUMBER },
              weight: { type: Type.NUMBER },
              facialExpressionScore: { type: Type.NUMBER },
              eyeContactScore: { type: Type.NUMBER },
              postureScore: { type: Type.NUMBER },
              summary: { type: Type.STRING },
              evidence: { type: Type.ARRAY, items: { type: Type.STRING } },
              isVisualAnalyzed: { type: Type.BOOLEAN },
              visualNote: { type: Type.STRING },
            },
            required: ['score', 'facialExpressionScore', 'eyeContactScore', 'postureScore', 'summary', 'evidence', 'isVisualAnalyzed'],
          },
          strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
          improvements: { type: Type.ARRAY, items: { type: Type.STRING } },
          evaluatorNote: { type: Type.STRING },
        },
        required: [
          'overallScore',
          'predicate',
          'transcription',
          'wordAccuracyPercentage',
          'vocal',
          'appreciation',
          'performance',
          'strengths',
          'improvements',
          'evaluatorNote',
        ],
      },
    },
  });

  const responseText = response.text;
  if (!responseText) {
    throw new Error('Gemini API tidak mengembalikan teks respons analisis.');
  }

  let cleanedJson = responseText.trim();
  if (cleanedJson.startsWith('```json')) {
    cleanedJson = cleanedJson.replace(/^```json\s*/i, '').replace(/```\s*$/, '').trim();
  } else if (cleanedJson.startsWith('```')) {
    cleanedJson = cleanedJson.replace(/^```\s*/, '').replace(/```\s*$/, '').trim();
  }

  let parsed: AiJudgeReport;
  try {
    parsed = JSON.parse(cleanedJson) as AiJudgeReport;
  } catch (parseErr: any) {
    console.error('[Gemini JSON Parse Error] Raw text was:', responseText);
    throw new Error(`Format respons Gemini bukan JSON valid: ${parseErr.message}`);
  }

  parsed.analyzedAt = new Date().toISOString();
  parsed.vocal.weight = 40;
  parsed.appreciation.weight = 30;
  parsed.performance.weight = 30;

  return parsed;
}
