import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { AssessmentAttempt, Question, Language, ExecutionResult } from '../../types';
import { ExecuteAPI, AssessmentsAPI } from '../../services/api';
import { ConsoleOutput } from '../room/ConsoleOutput';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import {
  Clock,
  Play,
  CheckCircle2,
  AlertCircle,
  FileCode2,
  ChevronLeft,
  ChevronRight,
  Shield,
  Send
} from 'lucide-react';

interface AsyncAssessmentRoomProps {
  assessment: AssessmentAttempt;
  questions: Question[];
  onExit: () => void;
  onSubmit: (assessment: AssessmentAttempt) => void;
}

export const AsyncAssessmentRoom: React.FC<AsyncAssessmentRoomProps> = ({
  assessment,
  questions,
  onExit,
  onSubmit,
}) => {
  const assessmentQuestions = questions.filter((q) =>
    assessment.questionIds.includes(q.id)
  );

  const [currentIndex, setCurrentIndex] = useState(assessment.currentQuestionIndex || 0);
  const activeQuestion = assessmentQuestions[currentIndex] || questions[0];

  const [language, setLanguage] = useState<Language>('javascript');
  const [code, setCode] = useState<string>(
    assessment.answers[activeQuestion.id]?.code || activeQuestion.starterCode[language] || ''
  );

  const [isRunning, setIsRunning] = useState(false);
  const [executionResult, setExecutionResult] = useState<ExecutionResult | null>(null);
  const [streamLog, setStreamLog] = useState('');
  const [lastSaved, setLastSaved] = useState('Just now');
  const [timeRemaining, setTimeRemaining] = useState(assessment.timeRemainingSeconds);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);

  // Authoritative countdown timer (PRD AA-3)
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Window focus listener for candidate integrity signal tracking (PRD IN-2)
  useEffect(() => {
    const handleBlur = async () => {
      const now = new Date();
      const timeStr = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
      await AssessmentsAPI.addIntegritySignal(assessment.id, {
        type: 'WINDOW_BLUR',
        timestamp: timeStr,
        details: 'Assessment tab lost focus (window blurred).',
        severity: 'low',
      });
    };

    window.addEventListener('blur', handleBlur);
    return () => window.removeEventListener('blur', handleBlur);
  }, [assessment]);

  const formatTimer = (totalSecs: number) => {
    const hrs = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;
    return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleQuestionChange = async (newIdx: number) => {
    // Auto-save current answer to backend before switching
    await AssessmentsAPI.update(assessment.id, {
      currentQuestionIndex: newIdx,
      answers: {
        ...assessment.answers,
        [activeQuestion.id]: { code, language, testResults: executionResult || undefined },
      },
    });

    setCurrentIndex(newIdx);
    const nextQ = assessmentQuestions[newIdx];
    const savedAnswer = assessment.answers[nextQ.id];
    if (savedAnswer) {
      setCode(savedAnswer.code);
      setLanguage(savedAnswer.language);
      setExecutionResult(savedAnswer.testResults || null);
    } else {
      setCode(nextQ.starterCode[language] || '');
      setExecutionResult(null);
    }
  };

  const handleRunCode = async () => {
    if (isRunning) return;
    setIsRunning(true);
    setStreamLog('');

    try {
      const result = await ExecuteAPI.run({
        code,
        language,
        questionId: activeQuestion.id,
        assessmentId: assessment.id,
      });
      setExecutionResult(result);
      setLastSaved('Just now');
      await AssessmentsAPI.update(assessment.id, {
        answers: { ...assessment.answers, [activeQuestion.id]: { code, language, testResults: result } },
      });
    } finally {
      setIsRunning(false);
    }
  };

  const handleFinalSubmit = async () => {
    await AssessmentsAPI.update(assessment.id, {
      status: 'Submitted',
      submittedAt: new Date().toISOString(),
      answers: {
        ...assessment.answers,
        [activeQuestion.id]: { code, language, testResults: executionResult || undefined },
      },
    });
    onSubmit(assessment);
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-white overflow-hidden select-none">
      {/* Top Bar */}
      <header className="h-14 px-6 border-b border-divider flex items-center justify-between bg-white flex-shrink-0 z-20">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2.5">
            <div className="w-5 h-5 rounded-[4px] bg-[#D14509] flex items-center justify-center text-white font-bold text-[11px]">
              C
            </div>
            <span className="text-[16px] font-semibold tracking-tight text-ink">CodeRoom</span>
          </div>

          <div className="h-4 w-[1px] bg-divider"></div>

          <div>
            <div className="font-semibold text-ink text-[14px]">
              {assessment.assessmentTitle}
            </div>
            <div className="text-[11px] text-muted font-mono">
              Problem {currentIndex + 1} of {assessmentQuestions.length} — Auto-saved to server ({lastSaved})
            </div>
          </div>
        </div>

        {/* Center: Timer & Problem Switcher */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 border border-divider rounded-[4px] p-1 bg-white">
            {assessmentQuestions.map((q, idx) => (
              <button
                key={q.id}
                onClick={() => handleQuestionChange(idx)}
                className={`px-3 py-1 rounded text-[12px] font-mono font-medium transition-colors ${
                  currentIndex === idx
                    ? 'bg-ink text-white'
                    : 'text-muted hover:text-ink hover:bg-[#FFF7F1]'
                }`}
              >
                P{idx + 1}
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-[4px] border border-divider bg-[#FAFAFA] font-mono text-[13px] text-ink font-semibold">
            <Clock size={14} className={timeRemaining < 300 ? 'text-[#D14509]' : 'text-muted'} />
            <span className={timeRemaining < 300 ? 'text-[#D14509]' : 'text-ink'}>
              {formatTimer(timeRemaining)}
            </span>
          </div>
        </div>

        {/* Right: Submit Button */}
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsSubmitModalOpen(true)}
            className="flex items-center space-x-1.5 border-divider text-ink hover:border-ink font-medium"
          >
            <Send size={13} />
            <span>Submit Assessment</span>
          </Button>
        </div>
      </header>

      {/* Main Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Question Description (360px) */}
        <div className="w-[360px] flex-shrink-0 h-full border-r border-divider bg-white flex flex-col overflow-y-auto p-5 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase tracking-wider text-muted">
              Problem {currentIndex + 1}
            </span>
            <Badge variant="medium">{activeQuestion.difficulty}</Badge>
          </div>

          <h2 className="text-[18px] font-semibold text-ink leading-tight">
            {activeQuestion.title}
          </h2>

          <div className="text-[13px] text-ink leading-relaxed whitespace-pre-line border-b border-divider pb-4">
            {activeQuestion.description}
          </div>

          <div>
            <h3 className="text-[11px] font-semibold uppercase tracking-wider text-muted mb-2 font-mono">
              Constraints
            </h3>
            <ul className="space-y-1.5 text-[12px] font-mono text-ink">
              {activeQuestion.constraints.map((c, i) => (
                <li key={i} className="flex items-start space-x-2">
                  <span className="text-muted">•</span>
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-[11px] font-semibold uppercase tracking-wider text-muted mb-2 font-mono">
              Example
            </h3>
            {activeQuestion.examples.map((ex, i) => (
              <div key={i} className="rounded-[4px] border border-divider p-3 font-mono text-[12px] space-y-2 bg-[#FAFAFA]">
                <div>
                  <span className="text-muted block text-[10px] uppercase">Input:</span>
                  <pre className="text-ink whitespace-pre-wrap">{ex.input}</pre>
                </div>
                <div>
                  <span className="text-muted block text-[10px] uppercase">Output:</span>
                  <pre className="text-ink whitespace-pre-wrap">{ex.output}</pre>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Center: Editor & Console */}
        <main className="flex-1 flex flex-col min-w-0 bg-white">
          <div className="h-12 px-4 border-b border-divider flex items-center justify-between bg-white flex-shrink-0">
            <div className="flex items-center space-x-3">
              <span className="font-mono text-[13px] font-semibold text-ink">
                solution.{language === 'javascript' ? 'js' : language === 'typescript' ? 'ts' : 'py'}
              </span>

              <div className="h-3.5 w-[1px] bg-divider"></div>

              <select
                value={language}
                onChange={(e) => {
                  const newL = e.target.value as Language;
                  setLanguage(newL);
                  setCode(activeQuestion.starterCode[newL] || '');
                }}
                className="text-[12px] font-mono font-medium text-ink bg-white border border-divider rounded px-2 py-1 cursor-pointer focus:outline-none focus:border-[#D14509]"
              >
                <option value="javascript">JavaScript</option>
                <option value="typescript">TypeScript</option>
                <option value="python">Python 3</option>
              </select>
            </div>

            <Button
              variant="primary"
              size="sm"
              onClick={handleRunCode}
              disabled={isRunning}
              className="space-x-1.5 h-[34px] px-4"
            >
              <Play size={13} className="fill-white" />
              <span>{isRunning ? 'Running...' : 'Run Tests'}</span>
            </Button>
          </div>

          <div className="flex-1 relative overflow-hidden bg-white">
            <Editor
              height="100%"
              language={language}
              value={code}
              onChange={(val) => setCode(val || '')}
              options={{
                fontSize: 13.5,
                fontFamily: "'JetBrains Mono', monospace",
                lineNumbers: 'on',
                minimap: { enabled: false },
                tabSize: 2,
                automaticLayout: true,
              }}
            />
          </div>

          <ConsoleOutput
            result={executionResult}
            isRunning={isRunning}
            streamLog={streamLog}
          />
        </main>
      </div>

      {/* Submit Confirmation Dialog */}
      {isSubmitModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/20 backdrop-blur-[2px]">
          <div className="w-full max-w-lg bg-white rounded-[8px] border border-divider p-6 space-y-5 shadow-xl">
            <h2 className="text-[18px] font-semibold text-ink">Submit Assessment?</h2>
            <p className="text-[13px] text-muted leading-relaxed">
              You are about to complete your assessment attempt. Once submitted, your answers will be frozen and graded by the automated test suite.
            </p>

            <div className="p-4 rounded-[4px] border border-divider bg-[#FAFAFA] font-mono text-[12px] space-y-2">
              <div className="flex justify-between">
                <span>Problems Completed:</span>
                <span className="font-semibold text-ink">{assessmentQuestions.length} / {assessmentQuestions.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Time Remaining:</span>
                <span className="text-ink">{formatTimer(timeRemaining)}</span>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end space-x-3">
              <Button variant="outline" onClick={() => setIsSubmitModalOpen(false)}>
                Back to Test
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  setIsSubmitModalOpen(false);
                  handleFinalSubmit();
                }}
              >
                Confirm & Submit
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

