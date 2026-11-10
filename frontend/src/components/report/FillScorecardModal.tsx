import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Interview, Scorecard, RubricCategory } from '../../types';
import { InterviewsAPI } from '../../services/api';

interface FillScorecardModalProps {
  isOpen: boolean;
  onClose: () => void;
  interview: Interview;
  onSaved: (updatedInterview: Interview) => void;
}

export const FillScorecardModal: React.FC<FillScorecardModalProps> = ({
  isOpen,
  onClose,
  interview,
  onSaved,
}) => {
  const [categories, setCategories] = useState<RubricCategory[]>(() => {
    return (
      interview.scorecard?.categories || [
        {
          id: 'cat-1',
          name: 'Problem Solving',
          score: 4,
          feedback: 'Discovered optimal O(1) approach and addressed edge cases.',
        },
        {
          id: 'cat-2',
          name: 'Code Quality',
          score: 4,
          feedback: 'Clean variable naming, robust decomposition, and readability.',
        },
        {
          id: 'cat-3',
          name: 'Communication',
          score: 3,
          feedback: 'Explained algorithmic trade-offs effectively throughout the session.',
        },
        {
          id: 'cat-4',
          name: 'Testing',
          score: 4,
          feedback: 'Systematically walked through visible and hidden edge cases.',
        },
      ]
    );
  });

  const [summary, setSummary] = useState(
    interview.scorecard?.summary ||
      'Candidate exhibited outstanding system intuition, thorough test validation, and fluid coding ability in an isolated environment.'
  );

  const [recommendation, setRecommendation] = useState<Scorecard['recommendation']>(
    interview.scorecard?.recommendation || 'Strong Hire'
  );

  const handleScoreChange = (index: number, newScore: number) => {
    const updated = [...categories];
    updated[index].score = newScore;
    setCategories(updated);
  };

  const handleFeedbackChange = (index: number, newFeedback: string) => {
    const updated = [...categories];
    updated[index].feedback = newFeedback;
    setCategories(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const scorecard: Scorecard = {
      id: 'sc-' + Math.random().toString(36).substring(2, 7),
      interviewId: interview.id,
      interviewerName: interview.interviewerNames[0] || 'Staff Interviewer',
      submittedAt: new Date().toISOString().replace('T', ' ').substring(0, 16) + ' UTC',
      categories,
      summary,
      recommendation,
    };

    const updatedInterview: Interview = { ...interview, status: 'Completed', scorecard };

    await InterviewsAPI.update(interview.id, { status: 'Completed', scorecard });
    onSaved(updatedInterview);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Submit Scorecard: ${interview.candidateName}`} maxWidth="max-w-3xl">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <h3 className="text-[14px] font-semibold text-ink mb-1">Standardized Evaluation Rubrics</h3>
          <p className="text-[12px] text-muted">
            Rate candidate competency from 1 (Unsatisfactory) to 4 (Exceptional).
          </p>
        </div>

        <div className="space-y-4">
          {categories.map((cat, idx) => (
            <div key={cat.id} className="p-4 rounded-[6px] border border-divider bg-white space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-ink text-[14px]">{cat.name}</span>
                <div className="flex items-center space-x-1">
                  {[1, 2, 3, 4].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => handleScoreChange(idx, num)}
                      className={`w-8 h-8 rounded-[4px] border font-mono text-[13px] font-semibold transition-colors ${
                        cat.score === num
                          ? 'border-ink bg-ink text-white'
                          : 'border-divider bg-white text-muted hover:border-ink hover:text-ink'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>

              <input
                type="text"
                value={cat.feedback}
                onChange={(e) => handleFeedbackChange(idx, e.target.value)}
                placeholder="Specific behavioral evidence or technical justification..."
                className="w-full h-8 px-3 border border-divider rounded-[4px] text-ink text-[13px] focus:outline-none focus:border-[#D14509]"
              />
            </div>
          ))}
        </div>

        <div>
          <label className="block text-[12px] uppercase font-mono tracking-wider font-semibold text-muted mb-1">
            Overall Recommendation
          </label>
          <div className="grid grid-cols-4 gap-2">
            {(['Strong Hire', 'Hire', 'No Hire', 'Strong No Hire'] as const).map((rec) => (
              <button
                key={rec}
                type="button"
                onClick={() => setRecommendation(rec)}
                className={`h-9 rounded-[4px] border text-[13px] font-medium transition-colors ${
                  recommendation === rec
                    ? 'border-[#D14509] bg-[#FFF3EB] text-[#D14509] font-semibold'
                    : 'border-divider bg-white text-muted hover:text-ink'
                }`}
              >
                {rec}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-[12px] uppercase font-mono tracking-wider font-semibold text-muted mb-1">
            Interviewer Synthesis & Decision Rationale
          </label>
          <textarea
            rows={3}
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            className="w-full p-3 border border-divider rounded-[4px] text-ink text-[13px] leading-relaxed resize-none focus:outline-none focus:border-[#D14509]"
          />
        </div>

        <div className="pt-4 border-t border-divider flex items-center justify-end space-x-3">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            Submit & Finalize Scorecard
          </Button>
        </div>
      </form>
    </Modal>
  );
};

