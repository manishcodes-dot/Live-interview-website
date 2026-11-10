import React, { useState } from 'react';
import { Question } from '../../types';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { QuestionAuthorModal } from './QuestionAuthorModal';
import { Plus, BookOpen, Search, Code, Shield, CheckCircle2, Cpu } from 'lucide-react';

interface QuestionLibraryViewProps {
  questions: Question[];
  onRefresh: () => void;
  onSelectForPreview?: (question: Question) => void;
}

export const QuestionLibraryView: React.FC<QuestionLibraryViewProps> = ({
  questions,
  onRefresh,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [isAuthorModalOpen, setIsAuthorModalOpen] = useState(false);
  const [previewQuestion, setPreviewQuestion] = useState<Question | null>(null);

  const filtered = questions.filter((q) => {
    const matchesSearch =
      q.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDiff = selectedDifficulty === 'All' || q.difficulty === selectedDifficulty;
    return matchesSearch && matchesDiff;
  });

  const totalHiddenTests = questions.reduce(
    (acc, q) => acc + q.testCases.filter((t) => t.isHidden).length,
    0
  );
  const totalVisibleTests = questions.reduce(
    (acc, q) => acc + q.testCases.filter((t) => !t.isHidden).length,
    0
  );
  const totalTests = totalHiddenTests + totalVisibleTests;
  const easyCount = questions.filter((q) => q.difficulty === 'Easy').length;
  const medCount = questions.filter((q) => q.difficulty === 'Medium').length;
  const hardCount = questions.filter((q) => q.difficulty === 'Hard').length;

  return (
    <div className="flex-1 bg-white min-h-screen overflow-y-auto font-sans text-ink">
      <div className="max-w-[1360px] mx-auto px-12 py-10 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-8 border-b border-divider">
          <div>
            <div className="text-[12px] uppercase font-mono tracking-wider font-semibold text-[#D14509]">
              Curated Problem Bank · Version Control
            </div>
            <h1 className="text-heading text-ink font-semibold mt-1">Question Library & Authoring</h1>
            <p className="text-body text-muted mt-1">
              Curated algorithmic problems, system design challenges, and versioned hidden test harnesses.
            </p>
          </div>
          <Button
            variant="primary"
            onClick={() => setIsAuthorModalOpen(true)}
            className="flex items-center space-x-2"
          >
            <Plus size={16} />
            <span>Author question</span>
          </Button>
        </div>

        {/* Overview Metric Strip */}
        <div className="grid grid-cols-4 gap-6 py-2 border-b border-divider pb-6">
          <div className="p-4 rounded-[6px] border border-divider bg-white">
            <div className="text-[12px] uppercase font-mono tracking-wider text-muted">Question Bank Size</div>
            <div className="text-[26px] font-semibold text-ink mt-1 font-mono">
              {questions.length} <span className="text-[13px] font-sans font-normal text-muted">curated</span>
            </div>
            <div className="text-[12px] text-muted mt-1 font-mono">
              {questions.filter((q) => q.published !== false).length} published · sha256 digests
            </div>
          </div>

          <div className="p-4 rounded-[6px] border border-divider bg-white">
            <div className="text-[12px] uppercase font-mono tracking-wider text-muted">Difficulty Distribution</div>
            <div className="text-[26px] font-semibold text-ink mt-1 font-mono flex items-center space-x-2">
              <span className="text-emerald-700 text-[18px]">{easyCount}E</span>
              <span className="text-muted text-[14px]">/</span>
              <span className="text-amber-700 text-[18px]">{medCount}M</span>
              <span className="text-muted text-[14px]">/</span>
              <span className="text-red-600 text-[18px]">{hardCount}H</span>
            </div>
            <div className="text-[12px] text-muted mt-1">Balanced loop calibration</div>
          </div>

          <div className="p-4 rounded-[6px] border border-divider bg-white">
            <div className="text-[12px] uppercase font-mono tracking-wider text-muted">Hidden Test Harnesses</div>
            <div className="text-[26px] font-semibold text-ink mt-1 font-mono flex items-center space-x-2">
              <span>{totalHiddenTests}</span>
              <span className="text-[12px] font-normal text-[#D14509] bg-[#FFF3EB] px-1.5 py-0.5 rounded border border-[#D14509]/20 font-sans">
                anti-cheat
              </span>
            </div>
            <div className="text-[12px] text-muted mt-1">{totalTests} total validation cases</div>
          </div>

          <div className="p-4 rounded-[6px] border border-divider bg-white">
            <div className="text-[12px] uppercase font-mono tracking-wider text-muted">Multi-Language Isolation</div>
            <div className="text-[26px] font-semibold text-ink mt-1 font-mono flex items-center space-x-1.5 text-emerald-700">
              <CheckCircle2 size={20} />
              <span className="text-[18px]">7 Runtimes</span>
            </div>
            <div className="text-[12px] text-muted mt-1 font-mono">JS, TS, Py, Go, Java, C++, C#</div>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="flex items-center justify-between py-6 border-b border-divider">
          <div className="flex items-center space-x-3 w-80">
            <div className="relative w-full">
              <Search size={15} className="absolute left-3 top-2.5 text-muted" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search questions or categories..."
                className="w-full h-9 pl-9 pr-3 border border-divider rounded-[4px] text-[13px] text-ink focus:outline-none focus:border-[#D14509]"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {(['All', 'Easy', 'Medium', 'Hard'] as const).map((diff) => (
              <button
                key={diff}
                onClick={() => setSelectedDifficulty(diff)}
                className={`px-3 py-1.5 rounded-[4px] text-[13px] font-medium border transition-colors ${
                  selectedDifficulty === diff
                    ? 'border-ink bg-ink text-white font-semibold'
                    : 'border-divider bg-white text-muted hover:text-ink'
                }`}
              >
                {diff}
              </button>
            ))}
          </div>
        </div>

        {/* Questions Grid / Table */}
        <div className="mt-6 border border-divider rounded-[6px] overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-divider bg-[#FAFAFA] text-[12px] uppercase font-mono tracking-wider text-muted">
                <th className="py-3 px-5 font-medium">Question</th>
                <th className="py-3 px-5 font-medium">Difficulty</th>
                <th className="py-3 px-5 font-medium">Category</th>
                <th className="py-3 px-5 font-medium">Test Harness</th>
                <th className="py-3 px-5 font-medium">Digest Version</th>
                <th className="py-3 px-5 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((q) => {
                const visibleCount = q.testCases.filter((t) => !t.isHidden).length;
                const hiddenCount = q.testCases.filter((t) => t.isHidden).length;
                return (
                  <tr
                    key={q.id}
                    className="border-b border-divider last:border-b-0 hover:bg-[#FFF7F1] transition-colors duration-150"
                  >
                    <td className="py-4 px-5">
                      <div className="font-semibold text-ink text-[14px]">{q.title}</div>
                      <div className="text-[12px] text-muted truncate max-w-md">{q.description}</div>
                    </td>
                    <td className="py-4 px-5">
                      <Badge
                        variant={
                          q.difficulty === 'Easy'
                            ? 'easy'
                            : q.difficulty === 'Medium'
                            ? 'medium'
                            : 'hard'
                        }
                      >
                        {q.difficulty}
                      </Badge>
                    </td>
                    <td className="py-4 px-5 text-[13px] text-ink font-mono">{q.category}</td>
                    <td className="py-4 px-5 font-mono text-[12px]">
                      <span className="text-muted">{visibleCount} visible</span>
                      <span className="mx-1 text-divider">/</span>
                      <span className="text-[#D14509] font-medium">{hiddenCount} hidden</span>
                    </td>
                    <td className="py-4 px-5 text-[12px] font-mono text-muted">{q.version}</td>
                    <td className="py-4 px-5 text-right">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => setPreviewQuestion(q)}
                      >
                        Inspect
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <QuestionAuthorModal
        isOpen={isAuthorModalOpen}
        onClose={() => setIsAuthorModalOpen(false)}
        onSaved={() => onRefresh()}
      />

      {/* Preview Modal */}
      {previewQuestion && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/20 backdrop-blur-[2px]">
          <div className="w-full max-w-2xl bg-white rounded-[8px] border border-divider p-6 space-y-4 shadow-xl max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-divider">
              <h2 className="text-[18px] font-semibold text-ink">{previewQuestion.title}</h2>
              <Badge variant="medium">{previewQuestion.difficulty}</Badge>
            </div>
            <div className="text-[13px] text-ink leading-relaxed whitespace-pre-line">
              {previewQuestion.description}
            </div>
            <div>
              <h3 className="text-[11px] font-mono uppercase tracking-wider font-semibold text-muted mb-1">
                Constraints
              </h3>
              <ul className="text-[12px] font-mono text-muted space-y-1">
                {previewQuestion.constraints.map((c, i) => (
                  <li key={i}>• {c}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-[11px] font-mono uppercase tracking-wider font-semibold text-muted mb-1">
                Starter Code
              </h3>
              <pre className="p-3 bg-[#FAFAFA] border border-divider rounded text-[12px] font-mono overflow-x-auto text-ink">
                {previewQuestion.starterCode.javascript || previewQuestion.starterCode.python}
              </pre>
            </div>
            <div className="pt-2 flex justify-end">
              <Button variant="secondary" onClick={() => setPreviewQuestion(null)}>
                Close Preview
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

