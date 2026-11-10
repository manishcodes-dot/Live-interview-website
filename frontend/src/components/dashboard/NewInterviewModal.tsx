import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Interview, Language } from '../../types';
import { InterviewsAPI, QuestionsAPI } from '../../services/api';
import { CheckCircle2, Copy, Check, Mail, Link2 } from 'lucide-react';

interface NewInterviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: (interview: Interview) => void;
}

export const NewInterviewModal: React.FC<NewInterviewModalProps> = ({
  isOpen,
  onClose,
  onCreated
}) => {
  const [candidateName, setCandidateName] = useState('');
  const [candidateEmail, setCandidateEmail] = useState('');
  const [role, setRole] = useState('Senior Backend Engineer');
  const [type, setType] = useState<'Live' | 'Async'>('Live');
  const [scheduledDate, setScheduledDate] = useState('2026-11-03 15:00 UTC');
  const [durationMinutes, setDurationMinutes] = useState(60);
  const [interviewerName, setInterviewerName] = useState('Ines Becker');
  const [selectedQuestionId, setSelectedQuestionId] = useState('q-101');
  const [selectedLanguage, setSelectedLanguage] = useState<Language>('typescript');
  const [createdInterview, setCreatedInterview] = useState<Interview | null>(null);
  const [copied, setCopied] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const [questions, setQuestions] = useState<any[]>([]);

  useEffect(() => {
    QuestionsAPI.list().then(setQuestions).catch(console.error);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      setCreatedInterview(null);
      setCopied(false);
      setEmailSent(false);
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!candidateName.trim() || !candidateEmail.trim()) return;

    const chosenQuestion = questions.find(q => q.id === selectedQuestionId) || questions[0];

    const newInterview: Interview = {
      id: 'int-' + Math.random().toString(36).substring(2, 7),
      candidateName,
      candidateEmail,
      role,
      type,
      status: type === 'Live' ? 'Scheduled' : 'Scheduled',
      scheduledDate,
      durationMinutes,
      interviewerNames: [interviewerName],
      questionIds: [chosenQuestion.id],
      activeQuestionId: chosenQuestion.id,
      code: { ...chosenQuestion.starterCode },
      selectedLanguage,
      notes: '',
      integritySignals: [],
      totalRuns: 0,
      visibleTestsPassed: 0,
      visibleTestsTotal: chosenQuestion.testCases.filter((t: any) => !t.isHidden).length
    };

    await InterviewsAPI.create(newInterview);
    onCreated(newInterview);
    setCreatedInterview(newInterview);
  };

  if (createdInterview) {
    const candidateLink = `${window.location.origin}/join/${createdInterview.id}`;
    return (
      <Modal isOpen={isOpen} onClose={onClose} title="Interview Scheduled & Ready to Share">
        <div className="space-y-5">
          <div className="p-4 rounded-[8px] bg-emerald-50 border border-emerald-200 flex items-start space-x-3">
            <CheckCircle2 size={20} className="text-emerald-600 flex-shrink-0 mt-0.5" />
            <div>
              <div className="text-[14px] font-semibold text-emerald-900">
                Technical Interview Scheduled!
              </div>
              <div className="text-[13px] text-emerald-700 mt-0.5">
                Session for <strong>{createdInterview.candidateName}</strong> ({createdInterview.role}) is ready.
              </div>
            </div>
          </div>

          <div>
            <label className="block text-[12px] uppercase tracking-wider font-semibold text-muted mb-1.5">
              Candidate Join Link (No login required)
            </label>
            <div className="flex items-center space-x-2">
              <div className="flex-1 h-9 px-3 border border-divider rounded-[4px] bg-[#FAF8F5] flex items-center space-x-2 min-w-0">
                <Link2 size={13} className="text-[#D14509] flex-shrink-0" />
                <span className="font-mono text-[12px] text-ink truncate select-all">{candidateLink}</span>
              </div>
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  navigator.clipboard.writeText(candidateLink);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
                className="space-x-1.5 flex-shrink-0"
              >
                {copied ? <Check size={13} /> : <Copy size={13} />}
                <span>{copied ? 'Copied!' : 'Copy Link'}</span>
              </Button>
            </div>
            <p className="text-[12px] text-muted mt-1.5">
              Share this link via Slack, ATS, or email. The candidate enters directly without needing an account.
            </p>
          </div>

          <div className="p-3.5 rounded-[6px] border border-divider bg-[#FAF8F5] flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Mail size={15} className="text-muted" />
              <div>
                <div className="text-[13px] font-medium text-ink">Direct Email Invite</div>
                <div className="text-[11px] text-muted">{createdInterview.candidateEmail}</div>
              </div>
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                setEmailSent(true);
                setTimeout(() => setEmailSent(false), 3000);
              }}
            >
              {emailSent ? 'Sent to Candidate!' : 'Send Email Invite'}
            </Button>
          </div>

          <div className="pt-3 border-t border-divider flex items-center justify-between">
            <span className="text-[12px] font-mono text-muted">Token: {createdInterview.id}</span>
            <Button variant="secondary" onClick={onClose}>
              Done & View Schedule
            </Button>
          </div>
        </div>
      </Modal>
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Technical Interview">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[12px] uppercase tracking-wider font-semibold text-muted mb-1">
              Candidate Full Name
            </label>
            <input
              type="text"
              required
              value={candidateName}
              onChange={(e) => setCandidateName(e.target.value)}
              placeholder="e.g. Alex Morgan"
              className="w-full h-9 px-3 border border-divider rounded-[4px] text-ink text-[14px] focus:outline-none focus:border-[#D14509] focus:ring-1 focus:ring-[#D14509]"
            />
          </div>
          <div>
            <label className="block text-[12px] uppercase tracking-wider font-semibold text-muted mb-1">
              Candidate Email
            </label>
            <input
              type="email"
              required
              value={candidateEmail}
              onChange={(e) => setCandidateEmail(e.target.value)}
              placeholder="e.g. alex@example.com"
              className="w-full h-9 px-3 border border-divider rounded-[4px] text-ink text-[14px] focus:outline-none focus:border-[#D14509] focus:ring-1 focus:ring-[#D14509]"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[12px] uppercase tracking-wider font-semibold text-muted mb-1">
              Target Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full h-9 px-3 border border-divider rounded-[4px] text-ink text-[14px] focus:outline-none focus:border-[#D14509]"
            >
              <option value="Senior Backend Engineer">Senior Backend Engineer</option>
              <option value="Distributed Systems Engineer">Distributed Systems Engineer</option>
              <option value="Full Stack Engineer">Full Stack Engineer</option>
              <option value="Staff Infrastructure Engineer">Staff Infrastructure Engineer</option>
              <option value="Frontend Engineer">Frontend Engineer</option>
            </select>
          </div>
          <div>
            <label className="block text-[12px] uppercase tracking-wider font-semibold text-muted mb-1">
              Interview Format
            </label>
            <div className="flex space-x-2 pt-0.5">
              <button
                type="button"
                onClick={() => setType('Live')}
                className={`flex-1 h-9 rounded-[4px] text-[13px] font-medium border ${
                  type === 'Live'
                    ? 'border-[#D14509] bg-[#FFF3EB] text-[#D14509]'
                    : 'border-divider text-muted hover:text-ink'
                }`}
              >
                Live Interview
              </button>
              <button
                type="button"
                onClick={() => setType('Async')}
                className={`flex-1 h-9 rounded-[4px] text-[13px] font-medium border ${
                  type === 'Async'
                    ? 'border-[#D14509] bg-[#FFF3EB] text-[#D14509]'
                    : 'border-divider text-muted hover:text-ink'
                }`}
              >
                Async Assessment
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[12px] uppercase tracking-wider font-semibold text-muted mb-1">
              Initial Question
            </label>
            <select
              value={selectedQuestionId}
              onChange={(e) => setSelectedQuestionId(e.target.value)}
              className="w-full h-9 px-3 border border-divider rounded-[4px] text-ink text-[14px] focus:outline-none focus:border-[#D14509]"
            >
              {questions.map((q) => (
                <option key={q.id} value={q.id}>
                  {q.title} ({q.difficulty})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-[12px] uppercase tracking-wider font-semibold text-muted mb-1">
              Primary Language
            </label>
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value as Language)}
              className="w-full h-9 px-3 border border-divider rounded-[4px] text-ink text-[14px] focus:outline-none focus:border-[#D14509]"
            >
              <option value="typescript">TypeScript</option>
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
              <option value="java">Java</option>
              <option value="cpp">C++</option>
              <option value="go">Go</option>
              <option value="csharp">C#</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[12px] uppercase tracking-wider font-semibold text-muted mb-1">
              Scheduled Date / Time
            </label>
            <input
              type="text"
              value={scheduledDate}
              onChange={(e) => setScheduledDate(e.target.value)}
              className="w-full h-9 px-3 border border-divider rounded-[4px] text-ink text-[14px] focus:outline-none focus:border-[#D14509]"
            />
          </div>
          <div>
            <label className="block text-[12px] uppercase tracking-wider font-semibold text-muted mb-1">
              Assigned Lead Interviewer
            </label>
            <input
              type="text"
              value={interviewerName}
              onChange={(e) => setInterviewerName(e.target.value)}
              className="w-full h-9 px-3 border border-divider rounded-[4px] text-ink text-[14px] focus:outline-none focus:border-[#D14509]"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-divider flex items-center justify-end space-x-3">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            Schedule Session
          </Button>
        </div>
      </form>
    </Modal>
  );
};

