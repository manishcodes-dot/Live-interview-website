import React, { useState, useEffect } from 'react';
import { Sidebar, NavItem } from './components/common/Sidebar';
import { InterviewsDashboard } from './components/dashboard/InterviewsDashboard';
import { LiveInterviewRoom } from './components/room/LiveInterviewRoom';
import { CandidateReportView } from './components/report/CandidateReportView';
import { FillScorecardModal } from './components/report/FillScorecardModal';
import { AssessmentsListView } from './components/assessment/AssessmentsListView';
import { AsyncAssessmentRoom } from './components/assessment/AsyncAssessmentRoom';
import { QuestionLibraryView } from './components/questions/QuestionLibraryView';
import { CandidatesView } from './components/candidates/CandidatesView';
import { PipelineView } from './components/recruiter/PipelineView';
import { HiringOverviewView } from './components/hiringmanager/HiringOverviewView';
import { AdminOverviewView } from './components/admin/AdminOverviewView';
import { PeopleManagementView } from './components/admin/PeopleManagementView';
import { SecuritySettingsView } from './components/admin/SecuritySettingsView';
import { UsageBillingView } from './components/admin/UsageBillingView';
import { AuditLogView } from './components/admin/AuditLogView';
import { DataRetentionView } from './components/admin/DataRetentionView';
import { IntegrationsView } from './components/admin/IntegrationsView';
import { CandidateThankYouView } from './components/room/CandidateThankYouView';
import { UserProfileModal } from './components/profile/UserProfileModal';
import { ToastContainer, ToastMessage } from './components/common/Toast';
import { InterviewsAPI, QuestionsAPI, AssessmentsAPI, AdminAPI } from './services/api';
import type { Interview, Question, AssessmentAttempt, UserRole, UserProfile, AuditLogEntry } from './types';

export function App() {
  // Role & navigation state (Section 2, 6.2)
  const [currentRole, setCurrentRole] = useState<UserRole>('Interviewer');
  const [activeNav, setActiveNav] = useState<NavItem>('interviews');

  // Active logged-in user profile & popup modal
  const [currentUser, setCurrentUser] = useState({
    name: 'Ines Becker',
    email: 'ines.becker@acme.corp',
  });
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (msg: Omit<ToastMessage, 'id'>) => {
    const id = 'toast-' + Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { ...msg, id }]);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Data collections
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [assessments, setAssessments] = useState<AssessmentAttempt[]>([]);
  const [staff, setStaff] = useState<UserProfile[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);

  // Active full-screen view states
  const [activeLiveInterview, setActiveLiveInterview] = useState<Interview | null>(null);
  const [activeReportInterview, setActiveReportInterview] = useState<Interview | null>(null);
  const [scorecardInterview, setScorecardInterview] = useState<Interview | null>(null);
  const [activeAssessmentAttempt, setActiveAssessmentAttempt] = useState<AssessmentAttempt | null>(null);
  const [thankYouSession, setThankYouSession] = useState<{
    candidateName: string;
    role: string;
    type: 'Live' | 'Async';
  } | null>(null);

  const loadData = async () => {
    try {
      setApiError(null);
      const [ivs, qs, asmts, stf, aud] = await Promise.all([
        InterviewsAPI.list(),
        QuestionsAPI.list(),
        AssessmentsAPI.list(),
        AdminAPI.getStaff().catch(() => []),
        AdminAPI.getAuditLogs().catch(() => []),
      ]);
      setInterviews(ivs);
      setQuestions(qs);
      setAssessments(asmts);
      setStaff(stf);
      setAuditLogs(aud);
    } catch (err: any) {
      setApiError('Cannot reach CodeRoom API at localhost:3001. Is the backend running?');
      console.error('[App] loadData error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Handle switching role (Interviewer vs Admin)
  const handleRoleChange = (role: UserRole) => {
    setCurrentRole(role);
    addToast({
      type: 'info',
      title: 'Active Role Switched',
      message: `Now viewing as ${role}. Navigating to workspace.`,
    });
    if (role === 'Admin') {
      setActiveNav('admin_overview');
    } else {
      setActiveNav('interviews');
    }
  };

  const handleQuickJoinLive = () => {
    const liveInterview = interviews.find((i) => i.status === 'Live') || interviews[0];
    if (liveInterview) setActiveLiveInterview(liveInterview);
  };

  // Scope interviews for interviewer view (Section 3 & 7.1: only their own items)
  const interviewerInterviews = currentRole === 'Interviewer'
    ? interviews.filter((i) => i.interviewerNames.includes('Ines Becker') || i.status === 'Live')
    : interviews;

  // Full-screen candidate thank-you page (Section 4.2 D, F-11)
  if (thankYouSession) {
    return (
      <div className="relative">
        <CandidateThankYouView
          candidateName={thankYouSession.candidateName}
          role={thankYouSession.role}
          sessionType={thankYouSession.type}
        />
        <button
          onClick={() => setThankYouSession(null)}
          className="fixed bottom-6 right-6 h-9 px-4 rounded-[6px] bg-ink text-white text-[13px] font-medium shadow-lg hover:bg-[#1a1410] transition-colors"
        >
          Return to Staff Workspace
        </button>
      </div>
    );
  }

  // Full-screen live room
  if (activeLiveInterview) {
    return (
      <LiveInterviewRoom
        interview={activeLiveInterview}
        questions={questions}
        onExit={() => {
          setActiveLiveInterview(null);
          loadData();
        }}
        onEndSession={(endedInterview) => {
          setActiveLiveInterview(null);
          loadData();
          setScorecardInterview(endedInterview);
        }}
      />
    );
  }

  // Full-screen async assessment
  if (activeAssessmentAttempt) {
    return (
      <AsyncAssessmentRoom
        assessment={activeAssessmentAttempt}
        questions={questions}
        onExit={() => {
          setActiveAssessmentAttempt(null);
          loadData();
        }}
        onSubmit={() => {
          const finished = activeAssessmentAttempt;
          setActiveAssessmentAttempt(null);
          loadData();
          setThankYouSession({
            candidateName: finished.candidateName,
            role: finished.assessmentTitle,
            type: 'Async',
          });
        }}
      />
    );
  }

  // Full-screen candidate report
  if (activeReportInterview) {
    return (
      <CandidateReportView
        interview={activeReportInterview}
        onBack={() => {
          setActiveReportInterview(null);
          loadData();
        }}
        onEditScorecard={() => setScorecardInterview(activeReportInterview)}
      />
    );
  }

  if (isLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-white font-sans text-ink">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-2 border-divider border-t-[#D14509] rounded-full animate-spin mx-auto" />
          <p className="text-muted text-[14px] font-mono">Loading CodeRoom Platform...</p>
        </div>
      </div>
    );
  }

  if (apiError) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-white p-8 font-sans text-ink">
        <div className="max-w-md text-center space-y-4 border border-divider rounded-[8px] p-8">
          <div className="w-10 h-10 rounded-full bg-[#FFF3EB] flex items-center justify-center mx-auto text-[#D14509] font-bold text-xl">
            !
          </div>
          <h2 className="text-[18px] font-semibold text-ink">Backend Unreachable</h2>
          <p className="text-[14px] text-muted leading-relaxed">{apiError}</p>
          <code className="block p-3 bg-[#FAFAFA] border border-divider rounded text-[12px] font-mono text-ink text-left">
            cd backend<br />
            npm install<br />
            npm run dev
          </code>
          <button
            onClick={loadData}
            className="h-9 px-5 rounded-[6px] bg-[#D14509] text-white text-[13px] font-semibold hover:bg-[#b83c07]"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-white text-ink font-sans">
      <Sidebar
        activeTab={activeNav}
        onSelectTab={setActiveNav}
        currentRole={currentRole}
        onChangeRole={handleRoleChange}
        userName={currentUser.name}
        userEmail={currentUser.email}
        onOpenProfile={() => setIsProfileModalOpen(true)}
      />

      {/* ─── Role-Based Main Views ────────────────────────────────────────── */}
      {/* 1. Interviewer Views */}
      {activeNav === 'interviews' && (
        <InterviewsDashboard
          interviews={interviewerInterviews}
          onSelectInterview={setActiveLiveInterview}
          onViewReport={setActiveReportInterview}
          onFillScorecard={setScorecardInterview}
          onRefresh={loadData}
        />
      )}

      {/* 2. Recruiter Views */}
      {activeNav === 'pipeline' && (
        <PipelineView
          interviews={interviews}
          assessments={assessments}
          onSelectInterview={setActiveLiveInterview}
          onViewReport={setActiveReportInterview}
          onRefresh={loadData}
        />
      )}

      {/* 3. Hiring Manager Views */}
      {activeNav === 'hiring_overview' && (
        <HiringOverviewView
          interviews={interviews}
          onViewReport={setActiveReportInterview}
        />
      )}

      {/* 4. Content Author & Common Shared Views */}
      {activeNav === 'questions' && (
        <QuestionLibraryView questions={questions} onRefresh={loadData} />
      )}
      {activeNav === 'assessments' && (
        <AssessmentsListView
          assessments={assessments}
          onTakeAssessment={setActiveAssessmentAttempt}
          onRefresh={loadData}
        />
      )}
      {activeNav === 'candidates' && (
        <CandidatesView
          interviews={interviews}
          onViewReport={setActiveReportInterview}
          onNavigateToInterviews={() => setActiveNav('interviews')}
        />
      )}

      {/* 5. Org Admin Views */}
      {activeNav === 'admin_overview' && (
        <AdminOverviewView
          staff={staff}
          auditLogs={auditLogs}
          interviews={interviews}
          onNavigateTab={(tab) => setActiveNav(`admin_${tab}` as NavItem)}
        />
      )}
      {activeNav === 'admin_people' && (
        <PeopleManagementView staff={staff} onRefresh={loadData} onNotify={addToast} />
      )}
      {activeNav === 'admin_security' && <SecuritySettingsView />}
      {activeNav === 'admin_billing' && <UsageBillingView />}
      {activeNav === 'admin_audit' && <AuditLogView logs={auditLogs} />}
      {activeNav === 'admin_data' && <DataRetentionView />}
      {activeNav === 'admin_integrations' && <IntegrationsView />}

      {/* User Profile Pop-Up Modal */}
      <UserProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        currentRole={currentRole}
        userName={currentUser.name}
        userEmail={currentUser.email}
        onUpdateProfile={(updated) => setCurrentUser(updated)}
        onNotify={addToast}
      />

      {/* Scorecard Modal */}
      {scorecardInterview && (
        <FillScorecardModal
          isOpen={!!scorecardInterview}
          onClose={() => setScorecardInterview(null)}
          interview={scorecardInterview}
          onSaved={(updated) => {
            const candName = scorecardInterview.candidateName;
            loadData();
            setActiveReportInterview(updated);
            addToast({
              type: 'success',
              title: 'Scorecard Saved',
              message: `Evaluation for ${candName} recorded and audit ledger updated.`,
            });
          }}
        />
      )}

      {/* Global Toast Notifications (Spec Section 2.2) */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}

export default App;
