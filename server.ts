import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { performAiPoetryJudge } from './src/server/analyzeService';
import { AnalyzeRequestPayload } from './src/types/aiJudge';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isProduction = process.env.NODE_ENV === 'production';
const PORT = Number(process.env.PORT) || 3000;

async function startServer() {
  const app = express();

  // Increase payload limit to support audio blobs
  app.use(express.json({ limit: '20mb' }));
  app.use(express.urlencoded({ extended: true, limit: '20mb' }));

  // API Route for AI Poetry Judge
  app.post('/api/analyze', async (req, res) => {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    try {
      const payload: AnalyzeRequestPayload = req.body;
      if (!payload || !payload.audioBase64 || typeof payload.audioBase64 !== 'string' || payload.audioBase64.trim() === '') {
        return res.status(400).json({
          success: false,
          error: 'Data audio pembacaan (audioBase64) tidak disertakan.',
          errorCode: 'INVALID_REQUEST',
        });
      }

      const report = await performAiPoetryJudge(payload);
      return res.status(200).json({
        success: true,
        report,
      });
    } catch (err: any) {
      console.error('[API /api/analyze Error]:', err);
      const errorMessage = err?.message || 'Gagal memproses evaluasi audio AI.';
      const isApiKeyError =
        errorMessage.includes('GEMINI_API_KEY') ||
        errorMessage.includes('API_KEY_INVALID') ||
        errorMessage.includes('API key') ||
        err?.code === 'MISSING_API_KEY';

      const isAudioError =
        errorMessage.includes('Base64') ||
        errorMessage.includes('audio') ||
        errorMessage.includes('rekaman');

      const errorCode = isApiKeyError
        ? 'MISSING_API_KEY'
        : isAudioError
        ? 'AUDIO_UNREADABLE'
        : 'API_ERROR';

      return res.status(500).json({
        success: false,
        error: errorMessage,
        errorCode,
      });
    }
  });

  if (!isProduction) {
    // In development, mount Vite middlewares
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR !== 'true',
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // In production, serve built dist files
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`PUISI PERFORMANCE STUDIO running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
