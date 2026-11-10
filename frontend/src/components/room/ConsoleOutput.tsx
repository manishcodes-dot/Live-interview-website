import React, { useState } from 'react';
import { ExecutionResult } from '../../types';
import { Terminal, CheckCircle2, XCircle, Clock, Cpu, ShieldAlert, ChevronRight } from 'lucide-react';

interface ConsoleOutputProps {
  result: ExecutionResult | null;
  isRunning: boolean;
  streamLog: string;
}

export const ConsoleOutput: React.FC<ConsoleOutputProps> = ({
  result,
  isRunning,
  streamLog,
}) => {
  const [activeTab, setActiveTab] = useState<'tests' | 'raw'>('tests');
  const [selectedTestCaseIndex, setSelectedTestCaseIndex] = useState<number>(0);

  const visibleTests = result?.testResults.filter(t => !t.isHidden) || [];
  const hiddenTests = result?.testResults.filter(t => t.isHidden) || [];

  return (
    <div className="h-[240px] flex-shrink-0 border-t border-divider bg-white flex flex-col font-mono text-[13px] overflow-hidden">
      {/* Console Header */}
      <div className="h-10 px-4 border-b border-divider flex items-center justify-between bg-white flex-shrink-0">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2 text-muted">
            <Terminal size={14} />
            <span className="text-[11px] uppercase tracking-wider font-semibold font-sans">
              Output
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => setActiveTab('tests')}
              className={`text-[12px] pb-1 transition-colors relative ${
                activeTab === 'tests'
                  ? 'text-ink font-semibold border-b-2 border-ink'
                  : 'text-muted hover:text-ink'
              }`}
            >
              Test Cases ({result ? `${result.visiblePassed}/${result.visibleTotal}` : '0/0'})
            </button>
            <button
              onClick={() => setActiveTab('raw')}
              className={`text-[12px] pb-1 transition-colors relative ${
                activeTab === 'raw'
                  ? 'text-ink font-semibold border-b-2 border-ink'
                  : 'text-muted hover:text-ink'
              }`}
            >
              Raw stdout & Logs
            </button>
          </div>
        </div>

        {/* Telemetry info */}
        {result && !isRunning && (
          <div className="flex items-center space-x-4 text-[11px] text-muted">
            <div className="flex items-center space-x-1">
              <Clock size={12} />
              <span>{result.executionTimeMs} ms</span>
            </div>
            <div className="flex items-center space-x-1">
              <Cpu size={12} />
              <span>{result.memoryUsedMB} MB tmpfs</span>
            </div>
            <span className="text-[10px] uppercase px-1.5 py-0.5 rounded border border-divider text-ink">
              MicroVM Jailed
            </span>
          </div>
        )}

        {isRunning && (
          <div className="flex items-center space-x-2 text-[12px] text-[#D14509]">
            <span className="w-2 h-2 rounded-full bg-[#D14509] animate-ping"></span>
            <span>Executing in isolated sandbox...</span>
          </div>
        )}
      </div>

      {/* Console Body */}
      <div className="flex-1 overflow-y-auto p-4 bg-white">
        {isRunning ? (
          <div className="h-full flex flex-col justify-center items-center text-muted space-y-2">
            <div className="w-5 h-5 border-2 border-divider border-t-[#D14509] rounded-full animate-spin"></div>
            <p className="text-[12px]">Running test harness against microVM guest...</p>
          </div>
        ) : !result ? (
          <div className="h-full flex items-center justify-center text-muted text-[12px]">
            Click the orange Run button above to compile and execute your code.
          </div>
        ) : activeTab === 'raw' ? (
          <pre className="text-ink font-mono text-[12px] whitespace-pre-wrap leading-relaxed select-text">
            {streamLog || result.stdout || (result.stderr ? `[Error] ${result.stderr}` : 'No standard output recorded.')}
          </pre>
        ) : (
          <div className="space-y-4">
            {/* Status summary banner */}
            <div className="flex items-center justify-between p-2.5 rounded-[4px] border border-divider bg-white">
              <div className="flex items-center space-x-3">
                {result.visiblePassed === result.visibleTotal && result.hiddenPassed === result.hiddenTotal ? (
                  <CheckCircle2 size={18} className="text-emerald-700" />
                ) : (
                  <XCircle size={18} className="text-[#D14509]" />
                )}
                <div>
                  <span className="font-semibold text-ink text-[13px]">
                    {result.visiblePassed === result.visibleTotal && result.hiddenPassed === result.hiddenTotal
                      ? 'All test cases passed.'
                      : 'Some test cases did not pass.'}
                  </span>
                  <div className="text-[12px] text-muted">
                    Visible tests: {result.visiblePassed}/{result.visibleTotal} passed
                  </div>
                </div>
              </div>

              {/* Hidden Test Case Guarantee: Pass counts only, never expected values (PRD EX-3, IS-7) */}
              <div className="px-3 py-1.5 rounded-[4px] border border-divider bg-[#FAFAFA] text-right">
                <div className="text-[10px] uppercase font-mono text-muted tracking-wider">
                  Hidden Evaluation Sandbox
                </div>
                <div className="text-[12px] font-semibold text-ink">
                  {result.hiddenPassed} / {result.hiddenTotal} hidden tests passed
                </div>
              </div>
            </div>

            {/* Test Cases List */}
            <div className="grid grid-cols-3 gap-3">
              {visibleTests.map((tc, idx) => (
                <div
                  key={tc.testCaseId}
                  onClick={() => setSelectedTestCaseIndex(idx)}
                  className={`p-3 rounded-[4px] border cursor-pointer transition-all ${
                    selectedTestCaseIndex === idx
                      ? 'border-ink bg-[#FFF7F1]'
                      : 'border-divider hover:border-muted bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-semibold text-[12px] text-ink truncate mr-2">
                      Case {idx + 1}: {tc.name}
                    </span>
                    {tc.passed ? (
                      <span className="text-[11px] font-semibold text-emerald-700">Passed</span>
                    ) : (
                      <span className="text-[11px] font-semibold text-[#D14509]">Failed</span>
                    )}
                  </div>
                  <div className="text-[11px] text-muted">
                    Time: {tc.executionTimeMs}ms
                  </div>
                </div>
              ))}
            </div>

            {/* Selected Test Case Details */}
            {visibleTests[selectedTestCaseIndex] && (
              <div className="p-3 rounded-[4px] border border-divider bg-white space-y-2 text-[12px]">
                <div className="text-[11px] uppercase tracking-wider font-semibold text-muted font-sans">
                  Details: Case {selectedTestCaseIndex + 1} ({visibleTests[selectedTestCaseIndex].name})
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-muted block text-[10px] uppercase tracking-wider">Input:</span>
                    <pre className="p-2 rounded border border-divider bg-[#FAFAFA] text-ink overflow-x-auto">
                      {visibleTests[selectedTestCaseIndex].input || 'N/A'}
                    </pre>
                  </div>
                  <div>
                    <span className="text-muted block text-[10px] uppercase tracking-wider">Expected Output:</span>
                    <pre className="p-2 rounded border border-divider bg-[#FAFAFA] text-ink overflow-x-auto">
                      {visibleTests[selectedTestCaseIndex].expectedOutput || 'N/A'}
                    </pre>
                  </div>
                </div>
                <div>
                  <span className="text-muted block text-[10px] uppercase tracking-wider">Actual Output:</span>
                  <pre
                    className={`p-2 rounded border overflow-x-auto ${
                      visibleTests[selectedTestCaseIndex].passed
                        ? 'border-divider bg-[#FAFAFA] text-ink'
                        : 'border-[#D14509]/30 bg-[#FFF3EB] text-[#D14509]'
                    }`}
                  >
                    {visibleTests[selectedTestCaseIndex].actualOutput || 'No output'}
                  </pre>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

