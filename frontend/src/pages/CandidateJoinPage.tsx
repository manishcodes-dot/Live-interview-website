import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle2, AlertTriangle, ShieldCheck, Camera, Mic, Wifi, Monitor, ArrowRight, Play, RefreshCw } from 'lucide-react';
import { Button } from '../components/common/Button';
import { LiveInterviewRoom } from '../components/room/LiveInterviewRoom';
import { AsyncAssessmentRoom } from '../components/assessment/AsyncAssessmentRoom';
import { CandidateThankYouView } from '../components/room/CandidateThankYouView';
import { InterviewsAPI, QuestionsAPI, AssessmentsAPI } from '../services/api';
import type { Interview, Question, AssessmentAttempt } from '../types';

export function CandidateJoinPage() {
  const { token } = useParams<{ token?: string }>();

  // Steps: 1: Notice/Welcome -> 2: System Check -> 3: Room/Assessment -> 4: Thank-You
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [consentChecked, setConsentChecked] = useState(false);
  const [linkExpired, setLinkExpired] = useState(false);
  const [requestSent, setRequestSent] = useState(false);

  // System check diagnostics
  const [checking, setChecking] = useState(true);
  const [diagnostics, setDiagnostics] = useState({
    browser: { passed: true, label: 'Modern Desktop Browser' },
    network: { passed: true, latencyMs: 24, label: 'Real-time WebSocket Latency: 24ms' },
    camera: { passed: true, label: 'Camera Ready (HD 720p)' },
    mic: { passed: true, label: 'Microphone Detected' },
  });

  // Session data
  const [interview, setInterview] = useState<Interview | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [assessment, setAssessment] = useState<AssessmentAttempt | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // If token is invalid or specifically 'expired', show expired link page
    if (token === 'expired') {
      setLinkExpired(true);
      setIsLoading(false);
      return;
    }

    const loadCandidateSession = async () => {
      try {
        const [ivs, qs, asmts] = await Promise.all([
          InterviewsAPI.list(),
          QuestionsAPI.list(),
          AssessmentsAPI.list(),
        ]);
        setQuestions(qs);
        // Find matching interview or assessment based on token or default to first demo candidate
        const foundIv = ivs.find((i) => i.id === token) || ivs[0];
        setInterview(foundIv || null);
        const foundAsmt = asmts.find((a) => a.id === token) || asmts[0];
        setAssessment(foundAsmt || null);
      } catch (err) {
        console.error('Failed to load session:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadCandidateSession();
  }, [token]);

  // Run mock system check on Step 2
  useEffect(() => {
    if (step === 2) {
      setChecking(true);
      const timer = setTimeout(() => {
        setChecking(false);
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [step]);

  // Expired link screen (Section 4.3 & 3.5)
  if (linkExpired) {
    return (
      <div className="min-h-screen bg-white flex flex-col font-sans text-ink">
        <nav className="h-16 border-b border-divider px-8 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-6 h-6 rounded-[4px] bg-[#D14509] flex items-center justify-center text-white font-bold text-[12px]">
              C
            </div>
            <span className="text-[17px] font-semibold text-ink tracking-tight">CodeRoom</span>
          </div>
        </nav>
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="max-w-[480px] text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-amber-50 flex items-center justify-center mx-auto text-amber-600">
              <AlertTriangle size={28} />
            </div>
            <h1 className="text-[24px] font-semibold text-ink tracking-tight">
              This invitation link has expired
            </h1>
            <p className="text-[14px] text-muted leading-relaxed">
              For security, CodeRoom candidate access tokens expire after their scheduled session window. You may request a fresh link from your recruiter.
            </p>
            {requestSent ? (
              <div className="p-3 rounded bg-emerald-50 border border-emerald-200 text-emerald-800 text-[13px] font-medium">
                Link request sent to the talent team. Please check your inbox shortly.
              </div>
            ) : (
              <Button
                variant="primary"
                onClick={() => setRequestSent(true)}
                className="mt-2"
              >
                Request a new link from recruiter
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (isLoading || !interview) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center font-sans text-ink">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-2 border-divider border-t-[#D14509] rounded-full animate-spin mx-auto" />
          <p className="text-muted text-[13px] font-mono">Verifying candidate session token...</p>
        </div>
      </div>
    );
  }

  // Step 4: Thank-You Screen (Section 4.2 Step 4 & F-11)
  if (step === 4) {
    return (
      <CandidateThankYouView
        candidateName={interview.candidateName}
        role={interview.role}
        sessionType={interview.type}
      />
    );
  }

  // Step 3: Working Screen (Live room or assessment — strictly minimal, no staff menus)
  if (step === 3) {
    return (
      <LiveInterviewRoom
        interview={interview}
        questions={questions}
        onExit={() => setStep(4)}
        onEndSession={() => setStep(4)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans text-ink">
      {/* Top Header */}
      <header className="h-16 px-8 border-b border-divider flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="w-6 h-6 rounded-[4px] bg-[#D14509] flex items-center justify-center text-white font-bold text-[12px]">
            C
          </div>
          <span className="text-[17px] font-semibold text-ink tracking-tight">CodeRoom</span>
        </div>
        <div className="text-[12px] font-mono text-muted">
          Step {step} of 3 · Candidate Onboarding
        </div>
      </header>

      {/* Step 1: Welcome and Transparency Notice (Section 4.2 Step 1 & F-02, F-27) */}
      {step === 1 && (
        <div className="flex-1 flex items-center justify-center px-4 py-12">
          <div className="w-full max-w-[620px] space-y-6">
            <div>
              <div className="text-[12px] uppercase font-mono tracking-wider font-semibold text-[#D14509]">
                Candidate Access · Acme Corporation
              </div>
              <h1 className="text-[28px] font-semibold text-ink tracking-tight mt-1">
                Technical Interview: {interview.role}
              </h1>
              <p className="text-[14px] text-muted mt-1">
                Welcome, <strong>{interview.candidateName}</strong>. Please review what is recorded before joining the room.
              </p>
            </div>

            {/* Transparency Notice Box (PRD IN-5 & FS F-27) */}
            <div className="border border-divider rounded-[8px] p-6 bg-[#FAFAFA] space-y-4">
              <div className="flex items-center space-x-2 text-[14px] font-semibold text-ink border-b border-divider pb-3">
                <ShieldCheck size={18} className="text-[#D14509]" />
                <span>What Is Recorded During Your Session</span>
              </div>

              <div className="space-y-3 text-[13px] text-muted leading-relaxed">
                <div>
                  <strong className="text-ink">Code & Execution:</strong> Keystroke snapshots, test case execution outputs, and compilation runtimes are recorded for review.
                </div>
                <div>
                  <strong className="text-ink">Integrity Signals:</strong> Clipboard paste sizes and tab focus changes are surfaced as review points. They are <strong>never</strong> used for automated rejection or disqualification.
                </div>
                <div>
                  <strong className="text-ink">No Biometric Surveillance:</strong> CodeRoom does not perform webcam eye-tracking, voice stress analysis, or biometric scoring.
                </div>
                <div>
                  <strong className="text-ink">AI Policy:</strong> Transparency policy applies. You may write standard code in the Monaco editor. Autocomplete suggestions will be indicated in the review log.
                </div>
              </div>
            </div>

            {/* Consent Checkbox */}
            <label className="p-4 rounded-[6px] border border-divider hover:bg-[#FFF7F1] flex items-start space-x-3 cursor-pointer transition-colors">
              <input
                type="checkbox"
                checked={consentChecked}
                onChange={(e) => setConsentChecked(e.target.checked)}
                className="mt-0.5 text-[#D14509] rounded border-divider cursor-pointer w-4 h-4"
              />
              <div className="text-[13px] text-ink leading-snug">
                I acknowledge what is recorded during this session and consent to proceed with my technical interview.
              </div>
            </label>

            <div className="flex justify-end pt-2">
              <Button
                variant="primary"
                size="md"
                disabled={!consentChecked}
                onClick={() => setStep(2)}
                className="space-x-2"
              >
                <span>Continue to System Check</span>
                <ArrowRight size={14} />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Pre-session System Check (Section 4.2 Step 2 & F-05) */}
      {step === 2 && (
        <div className="flex-1 flex items-center justify-center px-4 py-12">
          <div className="w-full max-w-[560px] space-y-6">
            <div>
              <div className="text-[12px] uppercase font-mono tracking-wider font-semibold text-[#D14509]">
                Hardware & Connectivity Check · F-05
              </div>
              <h1 className="text-[26px] font-semibold text-ink tracking-tight mt-1">
                Pre-Session Diagnostics
              </h1>
              <p className="text-[14px] text-muted mt-1">
                Testing your browser environment and real-time WebSocket connection to the execution plane.
              </p>
            </div>

            <div className="border border-divider rounded-[8px] p-6 bg-white space-y-4 shadow-sm">
              <div className="divide-y divide-divider">
                <div className="py-3 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Monitor size={17} className="text-muted" />
                    <div>
                      <div className="text-[13px] font-semibold text-ink">Browser Environment</div>
                      <div className="text-[12px] text-muted">{diagnostics.browser.label}</div>
                    </div>
                  </div>
                  <CheckCircle2 size={18} className="text-emerald-700" />
                </div>

                <div className="py-3 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Wifi size={17} className="text-muted" />
                    <div>
                      <div className="text-[13px] font-semibold text-ink">WebSocket Latency</div>
                      <div className="text-[12px] text-muted">{diagnostics.network.label}</div>
                    </div>
                  </div>
                  <CheckCircle2 size={18} className="text-emerald-700" />
                </div>

                <div className="py-3 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Camera size={17} className="text-muted" />
                    <div>
                      <div className="text-[13px] font-semibold text-ink">Camera Video Stream</div>
                      <div className="text-[12px] text-muted">{diagnostics.camera.label}</div>
                    </div>
                  </div>
                  <CheckCircle2 size={18} className="text-emerald-700" />
                </div>

                <div className="py-3 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Mic size={17} className="text-muted" />
                    <div>
                      <div className="text-[13px] font-semibold text-ink">Microphone Audio</div>
                      <div className="text-[12px] text-muted">{diagnostics.mic.label}</div>
                    </div>
                  </div>
                  <CheckCircle2 size={18} className="text-emerald-700" />
                </div>
              </div>

              <div className="p-3 rounded bg-[#FAFAFA] border border-divider text-[12px] text-muted">
                <strong>Fallback policy (F-05):</strong> If video or microphone encounters an issue during the round, the live room remains open with audio-only or text chat. A media problem never closes your session.
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <Button variant="outline" size="md" onClick={() => setStep(1)}>
                Back
              </Button>
              <Button
                variant="primary"
                size="md"
                isLoading={checking}
                onClick={() => setStep(3)}
                className="space-x-2"
              >
                <Play size={13} className="fill-white" />
                <span>Join Interview Room</span>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

