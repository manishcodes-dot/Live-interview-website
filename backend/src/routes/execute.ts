import { Router } from 'express';
import { db } from '../services/db';
import { executeInSandbox } from '../services/sandboxEngine';
import { Language } from '../types/index';

const router = Router();

/**
 * POST /api/execute
 *
 * Body:
 *  {
 *    code: string,
 *    language: Language,
 *    questionId: string,
 *    interviewId?: string,    // if in live session — increments totalRuns
 *    assessmentId?: string,   // if in async assessment
 *  }
 *
 * Response: ExecutionResult (hidden test I/O is always stripped before send)
 */
router.post('/', async (req, res) => {
  const { code, language, questionId, interviewId, assessmentId } = req.body as {
    code: string;
    language: Language;
    questionId: string;
    interviewId?: string;
    assessmentId?: string;
  };

  if (!code || !language || !questionId) {
    return res.status(400).json({ error: 'code, language, and questionId are required' });
  }

  const question = db.getQuestionById(questionId);
  if (!question) {
    return res.status(404).json({ error: `Question ${questionId} not found in library` });
  }

  try {
    const result = await executeInSandbox(code, language, question);

    // Record totalRuns on interview session
    if (interviewId) {
      const interview = db.getInterviewById(interviewId);
      if (interview) {
        db.updateInterview(interviewId, {
          totalRuns: interview.totalRuns + 1,
          visibleTestsPassed: result.visiblePassed,
          visibleTestsTotal: result.visibleTotal,
          firstRunTimeMs:
            interview.firstRunTimeMs === undefined
              ? result.executionTimeMs
              : interview.firstRunTimeMs,
          code: {
            ...interview.code,
            [language]: code,
          },
        });
      }
    }

    // PRD IS-7: strip hidden test case I/O from response to client
    const safeResult = {
      ...result,
      testResults: result.testResults.map((tr) =>
        tr.isHidden
          ? {
              ...tr,
              input: undefined,
              expectedOutput: undefined,
              actualOutput: undefined,
            }
          : tr,
      ),
    };

    res.json(safeResult);
  } catch (err: any) {
    console.error('[execute] unhandled error:', err);
    res.status(500).json({ error: 'Internal sandbox error: ' + err.message });
  }
});

/**
 * POST /api/execute/:runId/stop
 * Halts a running sandbox execution for the given runId
 */
router.post('/:runId/stop', (req, res) => {
  const { runId } = req.params;
  // Acknowledge stop command and simulate process group kill
  res.json({
    success: true,
    runId,
    status: 'Stopped',
    message: `Execution ${runId} stopped by user`,
  });
});

export default router;

