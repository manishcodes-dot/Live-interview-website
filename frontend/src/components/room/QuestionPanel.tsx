import React from 'react';
import { Question } from '../../types';
import { Badge } from '../common/Badge';
import { ChevronDown, BookOpen } from 'lucide-react';

interface QuestionPanelProps {
  questions: Question[];
  activeQuestion: Question;
  onSelectQuestion: (question: Question) => void;
  isInterviewer: boolean;
}

export const QuestionPanel: React.FC<QuestionPanelProps> = ({
  questions,
  activeQuestion,
  onSelectQuestion,
  isInterviewer,
}) => {
  return (
    <div className="w-[320px] flex-shrink-0 h-full border-r border-divider bg-white flex flex-col overflow-hidden">
      {/* Header with question dropdown */}
      <div className="h-12 px-4 border-b border-divider flex items-center justify-between bg-white flex-shrink-0">
        <div className="flex items-center space-x-2">
          <BookOpen size={15} className="text-muted" />
          <span className="text-[12px] uppercase font-mono tracking-wider text-muted font-medium">
            Question
          </span>
        </div>

        {isInterviewer ? (
          <div className="relative group">
            <select
              value={activeQuestion.id}
              onChange={(e) => {
                const found = questions.find((q) => q.id === e.target.value);
                if (found) onSelectQuestion(found);
              }}
              className="text-[12px] font-mono font-medium text-ink bg-white border border-divider rounded px-2 py-1 pr-6 cursor-pointer focus:outline-none focus:border-[#D14509]"
            >
              {questions.map((q, idx) => (
                <option key={q.id} value={q.id}>
                  P{idx + 1}: {q.title}
                </option>
              ))}
            </select>
          </div>
        ) : (
          <span className="text-[12px] font-mono text-muted">Problem 1 of {questions.length}</span>
        )}
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5">
        {/* Title and metadata */}
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <Badge
              variant={
                activeQuestion.difficulty === 'Easy'
                  ? 'easy'
                  : activeQuestion.difficulty === 'Medium'
                  ? 'medium'
                  : 'hard'
              }
            >
              {activeQuestion.difficulty}
            </Badge>
            <span className="text-[12px] font-mono text-muted">
              {activeQuestion.category}
            </span>
          </div>
          <h2 className="text-[18px] font-semibold text-ink leading-tight">
            {activeQuestion.title}
          </h2>
        </div>

        {/* Problem Statement */}
        <div className="text-[13px] text-ink leading-relaxed whitespace-pre-line border-b border-divider pb-4">
          {activeQuestion.description}
        </div>

        {/* Constraints */}
        <div className="border-b border-divider pb-4">
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

        {/* Worked Examples */}
        <div>
          <h3 className="text-[11px] font-semibold uppercase tracking-wider text-muted mb-2 font-mono">
            Worked Example
          </h3>
          {activeQuestion.examples.map((ex, i) => (
            <div
              key={i}
              className="rounded-[6px] border border-divider p-3 bg-white font-mono text-[12px] space-y-2"
            >
              <div>
                <span className="text-muted block text-[10px] uppercase tracking-wider">Input:</span>
                <pre className="text-ink overflow-x-auto whitespace-pre-wrap">{ex.input}</pre>
              </div>
              <div className="pt-1 border-t border-divider">
                <span className="text-muted block text-[10px] uppercase tracking-wider">Output:</span>
                <pre className="text-ink overflow-x-auto whitespace-pre-wrap">{ex.output}</pre>
              </div>
              {ex.explanation && (
                <div className="pt-1 border-t border-divider">
                  <span className="text-muted block text-[10px] uppercase tracking-wider">Explanation:</span>
                  <p className="text-muted text-[11px] font-sans leading-normal mt-0.5">
                    {ex.explanation}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

