import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Question, Language, TestCase } from '../../types';
import { QuestionsAPI } from '../../services/api';
import { CheckCircle2, Play, Sparkles } from 'lucide-react';

interface QuestionAuthorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: (question: Question) => void;
}

export const QuestionAuthorModal: React.FC<QuestionAuthorModalProps> = ({
  isOpen,
  onClose,
  onSaved,
}) => {
  const [title, setTitle] = useState('');
  const [difficulty, setDifficulty] = useState<Question['difficulty']>('Medium');
  const [category, setCategory] = useState<Question['category']>('Algorithms');
  const [description, setDescription] = useState('');
  const [constraintsText, setConstraintsText] = useState('1 <= n <= 10^5\nAll inputs are valid UTF-8');
  const [exampleInput, setExampleInput] = useState('[2, 7, 11, 15], target = 9');
  const [exampleOutput, setExampleOutput] = useState('[0, 1]');
  const [starterJs, setStarterJs] = useState('function solve(input) {\n  // Starter code\n  return null;\n}');
  const [referenceJs, setReferenceJs] = useState(
    'function solve(nums, target) {\n  const map = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    const complement = target - nums[i];\n    if (map.has(complement)) return [map.get(complement), i];\n    map.set(nums[i], i);\n  }\n  return [];\n}'
  );
  const [visibleTestInput, setVisibleTestInput] = useState('solve([2,7,11,15], 9)');
  const [visibleTestOutput, setVisibleTestOutput] = useState('[0,1]');
  const [hiddenTestInput, setHiddenTestInput] = useState('solve([3,2,4], 6)');
  const [hiddenTestOutput, setHiddenTestOutput] = useState('[1,2]');

  // F-18 Validation state
  const [validationState, setValidationState] = useState<'idle' | 'validating' | 'passed' | 'failed'>('idle');
  const [validationMetrics, setValidationMetrics] = useState<{
    passed: number;
    total: number;
    timeMs: number;
    memoryMB: number;
  } | null>(null);

  const handleValidate = async () => {
    if (!title.trim() || !description.trim()) {
      alert('Please fill out the title and problem statement first.');
      return;
    }
    setValidationState('validating');
    // Simulate running reference solution through sandbox against all visible + hidden test cases
    await new Promise((r) => setTimeout(r, 1200));
    setValidationMetrics({
      passed: 2,
      total: 2,
      timeMs: 42,
      memoryMB: 19,
    });
    setValidationState('passed');
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    const testCases: TestCase[] = [
      {
        id: 'tc-' + Math.random().toString(36).substring(2, 7),
        name: 'Visible Sample Test Case',
        input: visibleTestInput,
        expectedOutput: visibleTestOutput,
        isHidden: false,
      },
      {
        id: 'tc-' + Math.random().toString(36).substring(2, 7),
        name: 'Automated Hidden Edge Case',
        input: hiddenTestInput,
        expectedOutput: hiddenTestOutput,
        isHidden: true,
      },
    ];

    const newQuestion: Question = {
      id: 'q-' + Math.random().toString(36).substring(2, 7),
      title: title.trim(),
      difficulty,
      category,
      version: 'sha256:' + Math.random().toString(36).substring(2, 10),
      timeLimitSec: 2,
      memoryLimitMB: 256,
      author: 'In-House Author',
      description: description.trim(),
      constraints: constraintsText.split('\n').filter(Boolean),
      examples: [
        {
          input: exampleInput,
          output: exampleOutput,
        },
      ],
      starterCode: {
        javascript: starterJs,
        typescript: starterJs,
        python: `# Starter solution\ndef solve(input):\n    pass\n`,
        java: `class Solution {\n    public void solve() {}\n}`,
        cpp: `class Solution {\npublic:\n    void solve() {}\n};`,
        go: `package main\n`,
        csharp: `public class Solution {\n    public void Solve() {}\n}`,
      },
      referenceCode: {
        javascript: referenceJs,
        typescript: referenceJs,
        python: `def solve(nums, target):\n    seen = {}\n    for i, num in enumerate(nums):\n        if target - num in seen:\n            return [seen[target - num], i]\n        seen[num] = i\n    return []\n`,
        java: `class Solution {}`,
        cpp: `class Solution {};`,
        go: `package main`,
        csharp: `public class Solution {}`,
      },
      published: true,
      usageCount: 0,
      testCases,
    };

    await QuestionsAPI.create(newQuestion);
    onSaved(newQuestion);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Author Question & Verify Reference Solution (F-18)" maxWidth="max-w-3xl">
      <form onSubmit={handleSave} className="space-y-4">
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2">
            <label className="block text-[12px] uppercase font-mono tracking-wider font-semibold text-muted mb-1">
              Title
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Design a Thread-Safe In-Memory Queue"
              className="w-full h-9 px-3 border border-divider rounded-[4px] text-ink text-[14px] focus:outline-none focus:border-[#D14509]"
            />
          </div>
          <div>
            <label className="block text-[12px] uppercase font-mono tracking-wider font-semibold text-muted mb-1">
              Difficulty
            </label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as any)}
              className="w-full h-9 px-3 border border-divider rounded-[4px] text-ink text-[13px] bg-white focus:outline-none focus:border-[#D14509]"
            >
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-[12px] uppercase font-mono tracking-wider font-semibold text-muted mb-1">
            Problem Description (Markdown supported)
          </label>
          <textarea
            required
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the algorithm, expected time complexity, and constraints..."
            className="w-full p-2.5 border border-divider rounded-[4px] text-ink text-[13px] focus:outline-none focus:border-[#D14509] font-sans"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[12px] uppercase font-mono tracking-wider font-semibold text-muted mb-1">
              Candidate Starter Code (JS/TS)
            </label>
            <textarea
              rows={4}
              value={starterJs}
              onChange={(e) => setStarterJs(e.target.value)}
              className="w-full p-2.5 font-mono text-[12px] border border-divider rounded-[4px] bg-[#FAFAFA] text-ink focus:outline-none focus:border-[#D14509]"
            />
          </div>
          <div>
            <label className="block text-[12px] uppercase font-mono tracking-wider font-semibold text-[#D14509] mb-1">
              Author Reference Solution (F-18 step 4)
            </label>
            <textarea
              rows={4}
              value={referenceJs}
              onChange={(e) => setReferenceJs(e.target.value)}
              placeholder="Author's golden solution to validate test cases against"
              className="w-full p-2.5 font-mono text-[12px] border border-divider rounded-[4px] bg-[#FFFDFB] text-ink focus:outline-none focus:border-[#D14509]"
            />
          </div>
        </div>

        {/* Test Cases */}
        <div>
          <label className="block text-[12px] uppercase font-mono tracking-wider font-semibold text-muted mb-1">
            Test Case Suite (Visible & Hidden)
          </label>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded border border-divider bg-white">
              <span className="text-[11px] font-mono text-muted uppercase font-semibold block mb-1">
                Visible Sample Case
              </span>
              <input
                type="text"
                value={visibleTestInput}
                onChange={(e) => setVisibleTestInput(e.target.value)}
                placeholder="input expression"
                className="w-full h-8 px-2 mb-1 border border-divider rounded text-[12px] font-mono"
              />
              <input
                type="text"
                value={visibleTestOutput}
                onChange={(e) => setVisibleTestOutput(e.target.value)}
                placeholder="expected output"
                className="w-full h-8 px-2 border border-divider rounded text-[12px] font-mono"
              />
            </div>

            <div className="p-3 rounded border border-divider bg-white">
              <span className="text-[11px] font-mono text-[#D14509] uppercase font-semibold block mb-1">
                Hidden Test Case (Server Grading Only)
              </span>
              <input
                type="text"
                value={hiddenTestInput}
                onChange={(e) => setHiddenTestInput(e.target.value)}
                placeholder="Private evaluation input"
                className="w-full h-8 px-2 mb-1 border border-divider rounded text-[12px] font-mono"
              />
              <input
                type="text"
                value={hiddenTestOutput}
                onChange={(e) => setHiddenTestOutput(e.target.value)}
                placeholder="Private expected output"
                className="w-full h-8 px-2 border border-divider rounded text-[12px] font-mono"
              />
            </div>
          </div>
        </div>

        {/* Validation Status Box (F-18) */}
        {validationState === 'passed' && validationMetrics && (
          <div className="p-3 rounded border border-emerald-200 bg-emerald-50 text-emerald-800 text-[13px] flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <CheckCircle2 size={16} className="text-emerald-700" />
              <span>
                <strong>Validation Passed:</strong> Reference solution passed {validationMetrics.passed} of {validationMetrics.total} test cases.
              </span>
            </div>
            <span className="font-mono text-[11px] text-emerald-700">
              {validationMetrics.timeMs}ms · {validationMetrics.memoryMB} MB
            </span>
          </div>
        )}

        <div className="pt-4 border-t border-divider flex items-center justify-between">
          <Button
            type="button"
            variant="secondary"
            onClick={handleValidate}
            disabled={validationState === 'validating'}
            className="space-x-1.5"
          >
            <Sparkles size={14} className="text-[#D14509]" />
            <span>{validationState === 'validating' ? 'Validating against sandbox...' : 'Validate Reference Solution'}</span>
          </Button>

          <div className="flex items-center space-x-3">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={validationState !== 'passed'}
              title={validationState !== 'passed' ? 'Run validation before publishing immutable question version' : ''}
            >
              Publish Immutable Question
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
};
