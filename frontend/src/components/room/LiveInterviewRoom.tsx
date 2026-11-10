import React, { useState, useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { QuestionPanel } from './QuestionPanel';
import { ConsoleOutput } from './ConsoleOutput';
import { RightPanel } from './RightPanel';
import { Button } from '../common/Button';
import { Interview, Question, Language, ExecutionResult } from '../../types';
import { ExecuteAPI, InterviewsAPI, createSessionSocket } from '../../services/api';
import {
  Play,
  Square,
  Clock,
  ArrowLeft,
  Lock,
  Unlock,
  CheckCircle2,
  FileCode2,
  ChevronDown,
  RotateCcw,
} from 'lucide-react';

interface LiveInterviewRoomProps {
  interview: Interview;
  questions: Question[];
  onExit: () => void;
  onEndSession: (interview: Interview) => void;
}

export const LiveInterviewRoom: React.FC<LiveInterviewRoomProps> = ({
  interview,
  questions,
  onExit,
  onEndSession,
}) => {
  // Session states
  const [activeQuestion, setActiveQuestion] = useState<Question>(() => {
    return questions.find((q) => q.id === interview.activeQuestionId) || questions[0];
  });

  const [language, setLanguage] = useState<Language>(interview.selectedLanguage || 'javascript');
  const [code, setCode] = useState<string>(() => {
    return interview.code[language] || activeQuestion.starterCode[language] || '';
  });

  const [notes, setNotes] = useState<string>(interview.notes || '');
  const [isInterviewer, setIsInterviewer] = useState<boolean>(true);
  const [isEditorLocked, setIsEditorLocked] = useState<boolean>(false);

  // Execution & Telemetry states
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [currentRunId, setCurrentRunId] = useState<string | null>(null);
  const [executionResult, setExecutionResult] = useState<ExecutionResult | null>(null);
  const [streamLog, setStreamLog] = useState<string>('');

  // Question history per question ID (F-10: keeps previous work preserved across switches)
  const [questionHistory, setQuestionHistory] = useState<Record<string, string>>(
    interview.questionHistory || { [activeQuestion.id]: code }
  );

  // Real-time collaborative WebSocket state (F-07, F-08)
  const [wsStatus, setWsStatus] = useState<'connected' | 'reconnecting' | 'disconnected'>('disconnected');
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimerRef = useRef<any>(null);

  const connectWS = () => {
    try {
      const ws = createSessionSocket(
        interview.id,
        (msg) => {
          if (msg.type === 'CODE_EDIT') {
            setCode(msg.code);
          } else if (msg.type === 'LOCK_TOGGLE') {
            setIsEditorLocked(msg.locked);
          } else if (msg.type === 'CONNECTED') {
            setWsStatus('connected');
          }
        },
        () => {
          setWsStatus('reconnecting');
          if (!reconnectTimerRef.current) {
            reconnectTimerRef.current = setTimeout(connectWS, 3000);
          }
        }
      );
      ws.onopen = () => {
        setWsStatus('connected');
        if (reconnectTimerRef.current) {
          clearTimeout(reconnectTimerRef.current);
          reconnectTimerRef.current = null;
        }
      };
      ws.onclose = () => {
        setWsStatus('reconnecting');
        if (!reconnectTimerRef.current) {
          reconnectTimerRef.current = setTimeout(connectWS, 3000);
        }
      };
      wsRef.current = ws;
    } catch {
      setWsStatus('reconnecting');
    }
  };

  useEffect(() => {
    connectWS();
    return () => {
      if (reconnectTimerRef.current) clearTimeout(reconnectTimerRef.current);
      wsRef.current?.close();
    };
  }, [interview.id]);

  // Live session timer (seconds)
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(34 * 60 + 18); // Default demo start 34m 18s

  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (totalSecs: number) => {
    const hrs = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;
    if (hrs > 0) {
      return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // Change question handler (F-10: preserves current question's code into history)
  const handleSelectQuestion = (q: Question) => {
    const updatedHistory = { ...questionHistory, [activeQuestion.id]: code };
    setQuestionHistory(updatedHistory);

    setActiveQuestion(q);
    const restoredCode = updatedHistory[q.id] || q.starterCode[language] || '';
    setCode(restoredCode);
    setExecutionResult(null);
    setStreamLog('');
  };

  // Broadcast code edit over WebSocket (F-07)
  const handleCodeChange = (newVal: string | undefined) => {
    const val = newVal || '';
    setCode(val);
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({
          type: 'CODE_EDIT',
          code: val,
          language,
          senderId: isInterviewer ? 'interviewer' : 'candidate',
        })
      );
    }
  };

  // Change language handler
  const handleLanguageChange = (newLang: Language) => {
    setLanguage(newLang);
    const langCode = activeQuestion.starterCode[newLang] || '';
    setCode(langCode);
  };

  // Reset to starter template
  const handleResetStarter = () => {
    const starter = activeQuestion.starterCode[language] || '';
    setCode(starter);
  };

  // Execute Code — calls backend sandbox API
  const handleRunCode = async () => {
    if (isRunning) return;
    setIsRunning(true);
    setStreamLog('[CodeRoom] Sending to execution sandbox...\n');

    try {
      const result = await ExecuteAPI.run({
        code,
        language,
        questionId: activeQuestion.id,
        interviewId: interview.id,
      });
      setCurrentRunId(result.runId);
      setExecutionResult(result);
      setStreamLog((prev) => prev + result.stdout);

      // Refresh interview state from server
      await InterviewsAPI.get(interview.id);
    } catch (err: any) {
      setStreamLog(`[Error] ${err.message}\n`);
    } finally {
      setIsRunning(false);
    }
  };

  // Stop running program (F-13)
  const handleStopRun = async () => {
    if (currentRunId) {
      try {
        await ExecuteAPI.stop(currentRunId);
      } catch (err) {
        console.warn('Failed to stop run:', err);
      }
    }
    setIsRunning(false);
    setCurrentRunId(null);
    setStreamLog((prev) => prev + '\n[CodeRoom] Execution stopped by user. Sandbox destroyed.\n');
  };

  // Handle End Session
  const handleEndClick = async () => {
    const confirmed = window.confirm(
      'Are you sure you want to end this interview session? This will preserve all candidate code, run logs, and transition the session to Scorecard Due.'
    );
    if (confirmed) {
      // Persist notes and code to backend on session end
      const updated = await InterviewsAPI.update(interview.id, {
        status: 'Scorecard Due',
        notes,
        code: { ...interview.code, [language]: code },
      });
      onEndSession(updated || { ...interview, status: 'Scorecard Due' });
    }
  };

  // Map our language to monaco editor language id
  const getMonacoLanguage = (lang: Language) => {
    switch (lang) {
      case 'javascript':
        return 'javascript';
      case 'typescript':
        return 'typescript';
      case 'python':
        return 'python';
      case 'java':
        return 'java';
      case 'cpp':
        return 'cpp';
      case 'go':
        return 'go';
      case 'csharp':
        return 'csharp';
      default:
        return 'javascript';
    }
  };

  const getFileExtension = (lang: Language) => {
    switch (lang) {
      case 'javascript':
        return 'solution.js';
      case 'typescript':
        return 'solution.ts';
      case 'python':
        return 'solution.py';
      case 'java':
        return 'Solution.java';
      case 'cpp':
        return 'solution.cpp';
      case 'go':
        return 'solution.go';
      case 'csharp':
        return 'Solution.cs';
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-white overflow-hidden select-none">
      {/* 1. TOP BAR (56 px) - Exact UI Spec 3.1 */}
      <header className="h-14 px-5 border-b border-divider flex items-center justify-between bg-white flex-shrink-0 z-20">
        {/* Left: Product Name & Candidate Details */}
        <div className="flex items-center space-x-4">
          <button
            onClick={onExit}
            className="w-8 h-8 rounded-[4px] border border-divider hover:bg-[#FFF7F1] flex items-center justify-center text-muted hover:text-ink transition-colors"
            title="Return to Dashboard"
          >
            <ArrowLeft size={16} />
          </button>

          <div className="flex items-center space-x-2.5">
            <div className="w-5 h-5 rounded-[4px] bg-[#D14509] flex items-center justify-center text-white font-bold text-[11px]">
              C
            </div>
            <span className="text-[16px] font-semibold tracking-tight text-ink">CodeRoom</span>
          </div>

          <div className="h-4 w-[1px] bg-divider"></div>

          <div className="flex items-center space-x-2">
            <span className="font-semibold text-ink text-[14px]">
              {interview.candidateName}
            </span>
            <span className="text-muted text-[13px] hidden sm:inline">
              — {interview.role}
            </span>
          </div>
        </div>

        {/* Center: Live Indicator & Session Timer */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 px-2.5 py-1 rounded-[4px] border border-divider bg-white">
            {/* Live Dot: pulses slowly while session is active (UI Spec 3.1 & 6) */}
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D14509] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#D14509]"></span>
            </span>
            <span className="text-[11px] font-semibold text-[#D14509] uppercase tracking-wider font-mono">
              Live
            </span>
          </div>

          <div className="flex items-center space-x-1.5 px-3 py-1 rounded-[4px] border border-divider bg-[#FAFAFA] font-mono text-[13px] text-ink font-semibold">
            <Clock size={13} className="text-muted" />
            <span>{formatTimer(elapsedSeconds)}</span>
          </div>
        </div>

        {/* Right: Controls & Outlined End Session Button */}
        <div className="flex items-center space-x-3">
          {/* Role Perspective Switcher for pair testing */}
          <div className="flex items-center border border-divider rounded-[4px] overflow-hidden text-[12px] font-medium">
            <button
              onClick={() => setIsInterviewer(true)}
              className={`px-2.5 py-1 transition-colors ${
                isInterviewer
                  ? 'bg-ink text-white font-semibold'
                  : 'bg-white text-muted hover:text-ink'
              }`}
            >
              Interviewer
            </button>
            <button
              onClick={() => setIsInterviewer(false)}
              className={`px-2.5 py-1 transition-colors ${
                !isInterviewer
                  ? 'bg-ink text-white font-semibold'
                  : 'bg-white text-muted hover:text-ink'
              }`}
            >
              Candidate
            </button>
          </div>

          {/* Editor Lock Toggle (PRD LR-3) */}
          {isInterviewer && (
            <button
              onClick={() => setIsEditorLocked(!isEditorLocked)}
              className={`h-[34px] px-2.5 rounded-[4px] border flex items-center space-x-1 text-[12px] transition-colors ${
                isEditorLocked
                  ? 'border-[#D14509] bg-[#FFF3EB] text-[#D14509]'
                  : 'border-divider text-muted hover:text-ink bg-white'
              }`}
              title={isEditorLocked ? "Editor is locked to candidate" : "Candidate can edit"}
            >
              {isEditorLocked ? <Lock size={13} /> : <Unlock size={13} />}
              <span className="hidden md:inline font-mono text-[11px]">
                {isEditorLocked ? 'Locked' : 'Unlocked'}
              </span>
            </button>
          )}

          {/* Outlined End Session button - strictly compliant with UI Spec 3.1 */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleEndClick}
            className="border-divider text-ink hover:border-ink font-medium"
          >
            End session
          </Button>
        </div>
      </header>

      {/* 2. THREE COLUMN LAYOUT - Exact UI Spec 3.1 */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel: 320 px Question Description */}
        <QuestionPanel
          questions={questions}
          activeQuestion={activeQuestion}
          onSelectQuestion={handleSelectQuestion}
          isInterviewer={isInterviewer}
        />

        {/* Center Panel: Editor & Output Console */}
        <main className="flex-1 flex flex-col min-w-0 bg-white">
          {/* Reconnection Banner (F-08 / LR-10) */}
          {wsStatus === 'reconnecting' && (
            <div className="flex-shrink-0 bg-amber-50 border-b border-amber-200 px-4 py-1.5 flex items-center justify-between text-amber-800 text-[12px] font-mono">
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
                <span>Connection interrupted. Local changes preserved, reconnecting to session...</span>
              </div>
              <span className="text-[11px] text-amber-600 font-semibold">LR-10 Offline Recovery</span>
            </div>
          )}

          {/* Editor Header Bar */}
          <div className="h-12 px-4 border-b border-divider flex items-center justify-between bg-white flex-shrink-0">
            {/* File name & Language Dropdown */}
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-1.5 font-mono text-[13px] font-semibold text-ink">
                <FileCode2 size={15} className="text-[#D14509]" />
                <span>{getFileExtension(language)}</span>
              </div>

              <div className="h-3.5 w-[1px] bg-divider"></div>

              <select
                value={language}
                onChange={(e) => handleLanguageChange(e.target.value as Language)}
                className="text-[12px] font-mono font-medium text-ink bg-white border border-divider rounded px-2 py-1 cursor-pointer focus:outline-none focus:border-[#D14509]"
              >
                <option value="javascript">JavaScript (Node v24)</option>
                <option value="typescript">TypeScript 5.x</option>
                <option value="python">Python 3.11</option>
                <option value="java">Java 21 (LTS)</option>
                <option value="cpp">C++ 20 (Clang)</option>
                <option value="go">Go 1.23</option>
                <option value="csharp">C# (.NET 8)</option>
              </select>

              <button
                onClick={handleResetStarter}
                className="text-muted hover:text-ink text-[11px] font-mono flex items-center space-x-1 px-2 py-1 rounded hover:bg-[#FFF7F1]"
                title="Reset to starter boilerplate"
              >
                <RotateCcw size={11} />
                <span>Reset</span>
              </button>
            </div>

            {/* Run / Stop Button (F-12, F-13: Stop button replaces Run during execution) */}
            <div className="flex items-center space-x-3">
              <span className="text-[11px] font-mono text-muted hidden sm:inline">
                Ctrl + Enter to run
              </span>
              {isRunning ? (
                <button
                  onClick={handleStopRun}
                  className="h-[34px] px-4 rounded-[6px] bg-red-600 hover:bg-red-700 text-white text-[13px] font-semibold flex items-center space-x-1.5 transition-colors shadow-sm"
                  title="Kill sandbox execution (F-13)"
                >
                  <Square size={12} className="fill-white" />
                  <span>Stop</span>
                </button>
              ) : (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleRunCode}
                  className="space-x-1.5 h-[34px] px-4"
                >
                  <Play size={13} className="fill-white" />
                  <span>Run</span>
                </Button>
              )}
            </div>
          </div>

          {/* Monaco Editor Container */}
          <div className="flex-1 relative overflow-hidden bg-white">
            {isEditorLocked && !isInterviewer && (
              <div className="absolute top-2 right-4 z-10 px-3 py-1 rounded bg-[#FFF3EB] border border-[#D14509]/30 text-[#D14509] text-[12px] font-mono flex items-center space-x-1.5">
                <Lock size={12} />
                <span>Interviewer has locked editing</span>
              </div>
            )}
            <Editor
              height="100%"
              language={getMonacoLanguage(language)}
              value={code}
              onChange={handleCodeChange}
              onMount={(editor) => {
                editor.onDidPaste((e) => {
                  const pastedText = editor.getModel()?.getValueInRange(e.range) || '';
                  InterviewsAPI.addIntegritySignal(interview.id, {
                    type: 'PASTE_EVENT',
                    timestamp: new Date().toISOString(),
                    details: `Pasted ${pastedText.length} characters in editor`,
                    severity: pastedText.length > 200 ? 'high' : pastedText.length > 50 ? 'medium' : 'low',
                  }).catch(() => {});
                });
              }}
              options={{
                readOnly: isEditorLocked && !isInterviewer,
                fontSize: 13.5,
                fontFamily: "'JetBrains Mono', monospace",
                fontLigatures: true,
                lineNumbers: 'on',
                renderLineHighlight: 'all',
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                automaticLayout: true,
                tabSize: 2,
                wordWrap: 'on',
                overviewRulerBorder: false,
                hideCursorInOverviewRuler: true,
                cursorBlinking: 'smooth',
                cursorSmoothCaretAnimation: 'on',
                smoothScrolling: true,
              }}
            />
          </div>

          {/* Bottom Console: Visible Tests, Hidden Test Pass Counts, and stdout */}
          <ConsoleOutput
            result={executionResult}
            isRunning={isRunning}
            streamLog={streamLog}
          />
        </main>

        {/* Right Panel: 300 px Video Tiles & Private Notes */}
        <RightPanel
          candidateName={interview.candidateName}
          interviewerName={interview.interviewerNames[0] || 'Ines Becker'}
          notes={notes}
          onNotesChange={setNotes}
          isInterviewer={isInterviewer}
        />
      </div>
    </div>
  );
};

