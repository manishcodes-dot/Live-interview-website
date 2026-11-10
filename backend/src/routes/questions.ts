import { Router } from 'express';
import { db } from '../services/db';
import { Question } from '../types/index';
import { v4 as uuid } from 'uuid';

const router = Router();

// GET /api/questions
router.get('/', (_req, res) => {
  res.json(db.getQuestions());
});

// GET /api/questions/:id
router.get('/:id', (req, res) => {
  const q = db.getQuestionById(req.params.id);
  if (!q) return res.status(404).json({ error: 'Question not found' });
  res.json(q);
});

// POST /api/questions — author new
router.post('/', (req, res) => {
  const body = req.body as Partial<Question>;
  if (!body.title || !body.description) {
    return res.status(400).json({ error: 'title and description are required' });
  }
  const newQuestion: Question = {
    id: 'q-' + uuid().substring(0, 8),
    title: body.title,
    difficulty: body.difficulty || 'Medium',
    category: body.category || 'Algorithms',
    version: 'sha256:' + uuid().replace(/-/g, '').substring(0, 10),
    timeLimitSec: body.timeLimitSec || 2,
    memoryLimitMB: body.memoryLimitMB || 256,
    author: body.author || 'Platform',
    description: body.description,
    constraints: body.constraints || [],
    examples: body.examples || [],
    starterCode: body.starterCode || {
      javascript: '// Write solution here\n',
      typescript: '// Write solution here\n',
      python: '# Write solution here\n',
      java: '// Write solution here\n',
      cpp: '// Write solution here\n',
      go: '// Write solution here\n',
      csharp: '// Write solution here\n',
    },
    testCases: body.testCases || [],
  };
  res.status(201).json(db.createQuestion(newQuestion));
});

// PATCH /api/questions/:id
router.patch('/:id', (req, res) => {
  const updated = db.updateQuestion(req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: 'Question not found' });
  res.json(updated);
});

// DELETE /api/questions/:id
router.delete('/:id', (req, res) => {
  const deleted = db.deleteQuestion(req.params.id);
  if (!deleted) return res.status(404).json({ error: 'Question not found' });
  res.status(204).end();
});

export default router;

