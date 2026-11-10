import { Router } from 'express';
import { db } from '../services/db';
import { AssessmentAttempt } from '../types/index';
import { v4 as uuid } from 'uuid';

const router = Router();

// GET /api/assessments
router.get('/', (_req, res) => {
  res.json(db.getAssessments());
});

// GET /api/assessments/:id
router.get('/:id', (req, res) => {
  const a = db.getAssessmentById(req.params.id);
  if (!a) return res.status(404).json({ error: 'Assessment not found' });
  res.json(a);
});

// PATCH /api/assessments/:id — save progress, submit, etc.
router.patch('/:id', (req, res) => {
  const updated = db.updateAssessment(req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: 'Assessment not found' });
  res.json(updated);
});

// POST /api/assessments/:id/integrity-signal — append an integrity event (PRD IN-2)
router.post('/:id/integrity-signal', (req, res) => {
  const assessment = db.getAssessmentById(req.params.id);
  if (!assessment) return res.status(404).json({ error: 'Assessment not found' });

  const signal = {
    id: 'sig-' + uuid().substring(0, 8),
    ...req.body,
  };

  const updated = db.updateAssessment(req.params.id, {
    integritySignals: [...assessment.integritySignals, signal],
  });

  res.status(201).json(updated);
});

// POST /api/interviews/:id/integrity-signal
// Interviews also accept integrity signals
export function attachInterviewIntegrityRoute(router: Router) {
  router.post('/:id/integrity-signal', (req, res) => {
    const interview = db.getInterviewById(req.params.id);
    if (!interview) return res.status(404).json({ error: 'Interview not found' });

    const signal = { id: 'sig-' + uuid().substring(0, 8), ...req.body };
    const updated = db.updateInterview(req.params.id, {
      integritySignals: [...interview.integritySignals, signal],
    });
    res.status(201).json(updated);
  });
}

export default router;

