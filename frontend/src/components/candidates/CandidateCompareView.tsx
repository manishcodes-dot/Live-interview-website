import React from 'react';
import { Interview } from '../../types';
import { ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';
import { Badge } from '../common/Badge';

interface Props {
  candidates: Interview[];
  onBack: () => void;
}

const SCORE_LABELS: Record<number, string> = {
  1: 'Below Basic',
  2: 'Developing',
  3: 'Competent',
  4: 'Exceptional',
};

const SCORE_COLOR: Record<number, string> = {
  1: 'text-red-600',
  2: 'text-amber-600',
  3: 'text-emerald-700',
  4: 'text-emerald-700 font-bold',
};

export const CandidateCompareView: React.FC<Props> = ({ candidates, onBack }) => {
  const rubricNames = ['Problem Solving', 'Code Quality', 'Communication', 'Testing'];

  return (
    <div className="flex-1 bg-white min-h-screen overflow-y-auto font-sans text-ink">
      <div className="max-w-[1360px] mx-auto px-12 py-10">
        <div className="flex items-center space-x-3 mb-8">
          <button
            onClick={onBack}
            className="w-8 h-8 rounded-[4px] border border-divider hover:bg-[#FFF7F1] flex items-center justify-center text-muted hover:text-ink transition-colors"
            title="Back to candidates"
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <h1 className="text-[20px] font-semibold text-ink tracking-tight">Compare Candidates (F-26)</h1>
            <p className="text-[13px] text-muted">
              Side-by-side rubric scores, test results, and reviewer synthesis. CodeRoom does not rank or auto-reject candidates.
            </p>
          </div>
        </div>

        {candidates.length < 2 ? (
          <div className="border border-divider rounded-[6px] p-12 text-center text-muted">
            <p className="text-[15px]">Select at least 2 candidates to compare side by side.</p>
          </div>
        ) : (
          <div className="overflow-x-auto border border-divider rounded-[6px]">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#FAFAFA] border-b border-divider">
                  <th className="py-4 px-6 text-[12px] font-mono uppercase tracking-wider text-muted w-48">
                    Evaluation Axis
                  </th>
                  {candidates.map((c) => (
                    <th key={c.id} className="py-4 px-6 min-w-[260px] border-l border-divider">
                      <div className="text-[15px] font-semibold text-ink">{c.candidateName}</div>
                      <div className="text-[12px] text-muted font-normal">{c.role}</div>
                      <div className="mt-1">
                        <Badge variant={c.status === 'Completed' ? 'success' : 'neutral'}>
                          {c.status}
                        </Badge>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-divider text-[14px]">
                {/* Final Recommendation */}
                <tr className="bg-[#FFFDFB]">
                  <td className="py-4 px-6 font-semibold text-ink">Recommendation</td>
                  {candidates.map((c) => (
                    <td key={c.id} className="py-4 px-6 border-l border-divider font-mono">
                      {c.scorecard ? (
                        <span
                          className={`font-semibold px-2 py-0.5 rounded text-[12px] border ${
                            c.scorecard.recommendation.includes('No Hire')
                              ? 'bg-red-50 text-red-700 border-red-200'
                              : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          }`}
                        >
                          {c.scorecard.recommendation}
                        </span>
                      ) : (
                        <span className="text-muted text-[13px] italic">Scorecard pending</span>
                      )}
                    </td>
                  ))}
                </tr>

                {/* Rubric Categories */}
                {rubricNames.map((name) => (
                  <tr key={name} className="hover:bg-[#FFF7F1] transition-colors">
                    <td className="py-4 px-6 font-medium text-ink">{name}</td>
                    {candidates.map((c) => {
                      const cat = c.scorecard?.categories.find((x) => x.name === name);
                      return (
                        <td key={c.id} className="py-4 px-6 border-l border-divider">
                          {cat ? (
                            <div>
                              <div className="flex items-center space-x-2">
                                <span className={`text-[16px] font-bold font-mono ${SCORE_COLOR[cat.score]}`}>
                                  {cat.score}/4
                                </span>
                                <span className="text-[12px] text-muted font-medium">
                                  ({SCORE_LABELS[cat.score]})
                                </span>
                              </div>
                              {cat.feedback && (
                                <p className="text-[12px] text-muted mt-1 leading-relaxed bg-[#FAFAFA] p-2 rounded border border-divider/60">
                                  "{cat.feedback}"
                                </p>
                              )}
                            </div>
                          ) : (
                            <span className="text-muted text-[13px] italic">—</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}

                {/* Visible Test Results */}
                <tr>
                  <td className="py-4 px-6 font-medium text-ink">Visible Tests</td>
                  {candidates.map((c) => (
                    <td key={c.id} className="py-4 px-6 border-l border-divider font-mono text-[13px]">
                      <span className="font-semibold text-ink">
                        {c.visibleTestsPassed} / {c.visibleTestsTotal}
                      </span>{' '}
                      passed
                    </td>
                  ))}
                </tr>

                {/* Runs & Telemetry */}
                <tr>
                  <td className="py-4 px-6 font-medium text-ink">Total Runs</td>
                  {candidates.map((c) => (
                    <td key={c.id} className="py-4 px-6 border-l border-divider font-mono text-[13px] text-ink">
                      {c.totalRuns} execution runs
                    </td>
                  ))}
                </tr>

                {/* Integrity Signals Count */}
                <tr>
                  <td className="py-4 px-6 font-medium text-ink">Integrity Signals</td>
                  {candidates.map((c) => (
                    <td key={c.id} className="py-4 px-6 border-l border-divider text-[13px]">
                      {c.integritySignals.length === 0 ? (
                        <span className="text-emerald-700 flex items-center space-x-1">
                          <CheckCircle2 size={13} />
                          <span>0 flags</span>
                        </span>
                      ) : (
                        <span className="text-amber-700 font-mono flex items-center space-x-1">
                          <AlertCircle size={13} />
                          <span>{c.integritySignals.length} signals for review</span>
                        </span>
                      )}
                    </td>
                  ))}
                </tr>

                {/* Written Reviewer Synthesis */}
                <tr className="bg-[#FAFAFA]">
                  <td className="py-4 px-6 font-semibold text-ink">Scorecard Summary</td>
                  {candidates.map((c) => (
                    <td key={c.id} className="py-4 px-6 border-l border-divider text-[13px] text-ink leading-relaxed">
                      {c.scorecard?.summary ? (
                        <p className="whitespace-pre-wrap">{c.scorecard.summary}</p>
                      ) : (
                        <span className="text-muted italic">No synthesis provided yet.</span>
                      )}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

