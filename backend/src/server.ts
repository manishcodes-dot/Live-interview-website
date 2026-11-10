import express from 'express';
import cors from 'cors';
import http from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import interviewsRouter from './routes/interviews';
import questionsRouter from './routes/questions';
import assessmentsRouter, { attachInterviewIntegrityRoute } from './routes/assessments';
import executeRouter from './routes/execute';
import adminRouter from './routes/admin';
import { db } from './services/db';

const app = express();
const PORT = process.env.PORT || 3001;

// ─── Middleware ─────────────────────────────────────────────────────────────
app.use(cors({ origin: ['http://localhost:5173', 'http://localhost:5174'] }));
app.use(express.json({ limit: '512kb' }));

// ─── API Routes ─────────────────────────────────────────────────────────────
app.use('/api/interviews', interviewsRouter);
app.use('/api/questions', questionsRouter);
app.use('/api/assessments', assessmentsRouter);
app.use('/api/execute', executeRouter);
app.use('/api/admin', adminRouter);

// Attach interview integrity signal route
attachInterviewIntegrityRoute(interviewsRouter);

// ─── Health Check ───────────────────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'coderoom-api',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    stats: {
      interviews: db.getInterviews().length,
      questions: db.getQuestions().length,
      assessments: db.getAssessments().length,
    },
  });
});

// ─── WebSocket Server (Real-time Code Sync & Collaboration) ────────────────
const httpServer = http.createServer(app);
const wss = new WebSocketServer({ server: httpServer });

// Map: sessionId -> Set of connected WebSocket clients
const sessionClients = new Map<string, Set<WebSocket>>();

wss.on('connection', (ws, req) => {
  const url = new URL(req.url || '/', `http://localhost`);
  const sessionId = url.searchParams.get('sessionId') || 'global';

  // Join session room
  if (!sessionClients.has(sessionId)) {
    sessionClients.set(sessionId, new Set());
  }
  sessionClients.get(sessionId)!.add(ws);

  console.log(`[WS] Client joined session: ${sessionId} (${sessionClients.get(sessionId)!.size} connected)`);

  ws.on('message', (raw) => {
    try {
      const msg = JSON.parse(raw.toString());

      switch (msg.type) {
        // ── Collaborative code edit broadcast (Operational Transforms baseline)
        case 'CODE_EDIT': {
          // Broadcast to all peers in the same session, not back to sender
          const peers = sessionClients.get(sessionId);
          if (peers) {
            const payload = JSON.stringify({
              type: 'CODE_EDIT',
              code: msg.code,
              language: msg.language,
              senderId: msg.senderId,
            });
            for (const peer of peers) {
              if (peer !== ws && peer.readyState === WebSocket.OPEN) {
                peer.send(payload);
              }
            }
          }
          break;
        }

        // ── Editor lock toggle by interviewer
        case 'LOCK_TOGGLE': {
          const peers = sessionClients.get(sessionId);
          if (peers) {
            const payload = JSON.stringify({
              type: 'LOCK_TOGGLE',
              locked: msg.locked,
            });
            for (const peer of peers) {
              if (peer !== ws && peer.readyState === WebSocket.OPEN) {
                peer.send(payload);
              }
            }
          }
          break;
        }

        // ── Chat message relay
        case 'CHAT_MESSAGE': {
          const peers = sessionClients.get(sessionId);
          if (peers) {
            const payload = JSON.stringify({
              type: 'CHAT_MESSAGE',
              sender: msg.sender,
              text: msg.text,
              time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
            });
            for (const peer of peers) {
              if (peer.readyState === WebSocket.OPEN) {
                peer.send(payload);
              }
            }
          }
          break;
        }

        // ── Execution result broadcast (interviewer sees run output too)
        case 'RUN_RESULT': {
          const peers = sessionClients.get(sessionId);
          if (peers) {
            const payload = JSON.stringify({ type: 'RUN_RESULT', result: msg.result });
            for (const peer of peers) {
              if (peer !== ws && peer.readyState === WebSocket.OPEN) {
                peer.send(payload);
              }
            }
          }
          break;
        }

        default:
          console.warn(`[WS] Unknown message type: ${msg.type}`);
      }
    } catch (e) {
      console.error('[WS] Parse error:', e);
    }
  });

  ws.on('close', () => {
    const peers = sessionClients.get(sessionId);
    if (peers) {
      peers.delete(ws);
      if (peers.size === 0) sessionClients.delete(sessionId);
    }
    console.log(`[WS] Client left session: ${sessionId}`);
  });

  ws.on('error', (err) => {
    console.error('[WS] Socket error:', err.message);
  });

  // Acknowledge connection
  ws.send(JSON.stringify({ type: 'CONNECTED', sessionId, message: 'CodeRoom WS bridge ready' }));
});

// ─── Start Server ───────────────────────────────────────────────────────────
httpServer.listen(PORT, () => {
  console.log(`
  ╔══════════════════════════════════════════╗
  ║    CodeRoom API Server  v1.0.0           ║
  ║    REST  → http://localhost:${PORT}         ║
  ║    WS    → ws://localhost:${PORT}           ║
  ║    Health → /api/health                  ║
  ╚══════════════════════════════════════════╝
  `);
});

export default app;

