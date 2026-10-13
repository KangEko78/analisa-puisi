import type { IncomingMessage, ServerResponse } from 'http';
import { performAiPoetryJudge } from '../src/server/analyzeService';
import { AnalyzeRequestPayload } from '../src/types/aiJudge';

// Increase max execution time for AI audio evaluation on Vercel
export const maxDuration = 60;

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '15mb',
    },
  },
};

/**
 * Universal JSON response sender that guarantees valid JSON output
 * regardless of whether res is a Vercel-enhanced response or standard Node ServerResponse.
 */
function sendJson(res: any, statusCode: number, data: any) {
  try {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (typeof res.status === 'function') {
      res.status(statusCode);
      if (typeof res.json === 'function') {
        return res.json(data);
      }
    } else {
      res.statusCode = statusCode;
    }

    return res.end(JSON.stringify(data));
  } catch (err) {
    console.error('[API sendJson Error]', err);
    try {
      res.statusCode = statusCode;
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      res.end(JSON.stringify(data));
    } catch {
      // Last-ditch effort
    }
  }
}

/**
 * Safely parses request body from various possible representations in Vercel:
 * parsed object, JSON string, Buffer, or unread stream.
 */
async function parseRequestBody(req: any): Promise<any> {
  if (req.body !== undefined && req.body !== null) {
    if (typeof req.body === 'object' && !Buffer.isBuffer(req.body)) {
      return req.body;
    }
    if (typeof req.body === 'string') {
      try {
        return JSON.parse(req.body);
      } catch {
        return {};
      }
    }
    if (Buffer.isBuffer(req.body)) {
      try {
        return JSON.parse(req.body.toString('utf-8'));
      } catch {
        return {};
      }
    }
  }

  // Fallback: Read raw IncomingMessage stream
  return new Promise((resolve) => {
    let raw = '';
    req.on('data', (chunk: any) => {
      raw += chunk;
      // Safeguard against extreme memory usage
      if (raw.length > 20 * 1024 * 1024) {
        req.destroy();
        resolve(null);
      }
    });
    req.on('end', () => {
      try {
        resolve(JSON.parse(raw));
      } catch {
        resolve({});
      }
    });
    req.on('error', (streamErr: any) => {
      console.error('[API Stream Read Error]', streamErr);
      resolve({});
    });
  });
}

export default async function handler(req: any, res: any) {
  // CORS Preflight handling
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    if (typeof res.status === 'function') {
      return res.status(200).end();
    }
    res.statusCode = 200;
    return res.end();
  }

  if (req.method !== 'POST') {
    return sendJson(res, 405, {
      success: false,
      error: 'Metode tidak diizinkan. Gunakan metode POST.',
      errorCode: 'INVALID_REQUEST',
    });
  }

  try {
    const payload: AnalyzeRequestPayload = await parseRequestBody(req);

    if (!payload || typeof payload !== 'object') {
      return sendJson(res, 400, {
        success: false,
        error: 'Payload permintaan tidak valid atau format JSON rusak.',
        errorCode: 'INVALID_REQUEST',
      });
    }

    if (!payload.audioBase64 || typeof payload.audioBase64 !== 'string' || payload.audioBase64.trim() === '') {
      return sendJson(res, 400, {
        success: false,
        error: 'Data audio pembacaan (audioBase64) tidak disertakan dalam permintaan.',
        errorCode: 'INVALID_REQUEST',
      });
    }

    // Process evaluation using Gemini API
    const report = await performAiPoetryJudge(payload);

    return sendJson(res, 200, {
      success: true,
      report,
    });
  } catch (error: any) {
    console.error('[API /api/analyze Server Error]:', error);

    const errorMessage = error?.message || 'Terjadi kesalahan saat memproses analisis AI.';
    const isApiKeyError =
      errorMessage.includes('GEMINI_API_KEY') ||
      errorMessage.includes('API_KEY_INVALID') ||
      errorMessage.includes('API key') ||
      (error?.code === 'MISSING_API_KEY');

    const isAudioError =
      errorMessage.includes('Base64') ||
      errorMessage.includes('audio') ||
      errorMessage.includes('rekaman');

    const errorCode = isApiKeyError
      ? 'MISSING_API_KEY'
      : isAudioError
      ? 'AUDIO_UNREADABLE'
      : 'API_ERROR';

    return sendJson(res, 500, {
      success: false,
      error: errorMessage,
      errorCode,
    });
  }
}
