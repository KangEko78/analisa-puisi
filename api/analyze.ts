import type { IncomingMessage, ServerResponse } from 'http';
import { performAiPoetryJudge } from '../src/server/analyzeService';
import { AnalyzeRequestPayload } from '../src/types/aiJudge';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '15mb',
    },
  },
};

export default async function handler(req: any, res: any) {
  // Handle CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Metode tidak diizinkan. Gunakan POST.',
      errorCode: 'INVALID_REQUEST',
    });
  }

  try {
    const payload: AnalyzeRequestPayload = req.body;
    if (!payload || !payload.audioBase64) {
      return res.status(400).json({
        success: false,
        error: 'Data audio pembacaan tidak disertakan dalam permintaan.',
        errorCode: 'INVALID_REQUEST',
      });
    }

    const report = await performAiPoetryJudge(payload);

    return res.status(200).json({
      success: true,
      report,
    });
  } catch (error: any) {
    console.error('Error in /api/analyze:', error);
    const errorMessage = error?.message || 'Terjadi kesalahan saat memproses analisis AI.';
    const isApiKeyError = errorMessage.includes('GEMINI_API_KEY') || errorMessage.includes('API_KEY_INVALID');

    return res.status(500).json({
      success: false,
      error: errorMessage,
      errorCode: isApiKeyError ? 'MISSING_API_KEY' : 'API_ERROR',
    });
  }
}
