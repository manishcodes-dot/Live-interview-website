import { Router } from 'express';
import { db } from '../services/db';
import { Interview } from '../types/index';
import { v4 as uuid } from 'uuid';

const router = Router();

// GET /api/interviews — list all
router.get('/', (_req, res) => {
  res.json(db.getInterviews());
});

// GET /api/interviews/:id — single interview
router.get('/:id', (req, res) => {
  const interview = db.getInterviewById(req.params.id);
  if (!interview) return res.status(404).json({ error: 'Interview not found' });
  res.json(interview);
});

// POST /api/interviews — create
router.post('/', (req, res) => {
  const body = req.body as Partial<Interview>;
  if (!body.candidateName || !body.candidateEmail) {
    return res.status(400).json({ error: 'candidateName and candidateEmail are required' });
  }
  const newInterview: Interview = {
    id: 'int-' + uuid().substring(0, 8),
    candidateName: body.candidateName,
    candidateEmail: body.candidateEmail,
    role: body.role || 'Engineer',
    type: body.type || 'Live',
    status: 'Scheduled',
    scheduledDate: body.scheduledDate || new Date().toISOString(),
    durationMinutes: body.durationMinutes || 60,
    interviewerNames: body.interviewerNames || [],
    questionIds: body.questionIds || [],
    activeQuestionId: body.activeQuestionId || (body.questionIds?.[0] ?? ''),
    code: body.code || { javascript: '', typescript: '', python: '', java: '', cpp: '', go: '', csharp: '' },
    selectedLanguage: body.selectedLanguage || 'javascript',
    notes: body.notes || '',
    integritySignals: [],
    totalRuns: 0,
    visibleTestsPassed: 0,
    visibleTestsTotal: 0,
    questionHistory: body.questionHistory || {},
  };
  res.status(201).json(db.createInterview(newInterview));
});

// PATCH /api/interviews/:id — partial update
router.patch('/:id', (req, res) => {
  const updated = db.updateInterview(req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: 'Interview not found' });
  res.json(updated);
});

// DELETE /api/interviews/:id
router.delete('/:id', (req, res) => {
  const deleted = db.deleteInterview(req.params.id);
  if (!deleted) return res.status(404).json({ error: 'Interview not found' });
  res.status(204).end();
});

export default router;

