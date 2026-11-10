import React, { useState } from 'react';
import { Mic, MicOff, Video, VideoOff, Wifi } from 'lucide-react';

interface VideoWidgetProps {
  candidateName: string;
  interviewerName: string;
}

export const VideoWidget: React.FC<VideoWidgetProps> = ({
  candidateName,
  interviewerName,
}) => {
  const [candidateMuted, setCandidateMuted] = useState(false);
  const [candidateCamOff, setCandidateCamOff] = useState(false);
  const [interviewerMuted, setInterviewerMuted] = useState(false);
  const [interviewerCamOff, setInterviewerCamOff] = useState(false);

  return (
    <div className="space-y-3 p-4 border-b border-divider bg-white">
      {/* Candidate Video Tile */}
      <div className="relative h-[120px] rounded-[6px] border border-divider bg-[#FAFAFA] flex flex-col justify-between p-2.5 overflow-hidden group">
        <div className="flex items-center justify-between z-10">
          <span className="text-[12px] font-semibold text-ink bg-white/90 px-2 py-0.5 rounded border border-divider">
            {candidateName}
          </span>
          <div className="flex items-center space-x-1.5">
            <span className="flex items-center space-x-1 text-[10px] font-mono text-emerald-700 bg-white/90 px-1.5 py-0.5 rounded border border-divider">
              <Wifi size={10} />
              <span>32ms</span>
            </span>
          </div>
        </div>

        {/* Video stream rendering or simulated avatar */}
        {!candidateCamOff ? (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#FAFAFA] to-[#F0EDE8]">
            <div className="w-12 h-12 rounded-full border border-divider bg-white flex items-center justify-center text-ink font-semibold text-[15px] shadow-sm">
              {candidateName.split(' ').map(n => n[0]).join('')}
            </div>
          </div>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-muted text-[12px] font-mono">
            Camera Off
          </div>
        )}

        <div className="flex items-center justify-between z-10">
          <div className="flex items-center space-x-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D14509] animate-pulse"></span>
            <span className="text-[10px] font-mono uppercase text-muted">Candidate</span>
          </div>

          <div className="flex items-center space-x-1">
            <button
              onClick={() => setCandidateMuted(!candidateMuted)}
              className="w-6 h-6 rounded flex items-center justify-center bg-white/90 border border-divider text-ink hover:bg-white"
              title={candidateMuted ? "Unmute" : "Mute"}
            >
              {candidateMuted ? <MicOff size={11} className="text-[#D14509]" /> : <Mic size={11} />}
            </button>
            <button
              onClick={() => setCandidateCamOff(!candidateCamOff)}
              className="w-6 h-6 rounded flex items-center justify-center bg-white/90 border border-divider text-ink hover:bg-white"
              title={candidateCamOff ? "Turn camera on" : "Turn camera off"}
            >
              {candidateCamOff ? <VideoOff size={11} className="text-[#D14509]" /> : <Video size={11} />}
            </button>
          </div>
        </div>
      </div>

      {/* Interviewer Video Tile */}
      <div className="relative h-[120px] rounded-[6px] border border-divider bg-[#FAFAFA] flex flex-col justify-between p-2.5 overflow-hidden group">
        <div className="flex items-center justify-between z-10">
          <span className="text-[12px] font-semibold text-ink bg-white/90 px-2 py-0.5 rounded border border-divider">
            {interviewerName}
          </span>
          <span className="flex items-center space-x-1 text-[10px] font-mono text-emerald-700 bg-white/90 px-1.5 py-0.5 rounded border border-divider">
            <Wifi size={10} />
            <span>24ms</span>
          </span>
        </div>

        {!interviewerCamOff ? (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#FAFAFA] to-[#EDE7DF]">
            <div className="w-12 h-12 rounded-full border border-divider bg-white flex items-center justify-center text-ink font-semibold text-[15px] shadow-sm">
              {interviewerName.split(' ').map(n => n[0]).join('')}
            </div>
          </div>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-muted text-[12px] font-mono">
            Camera Off
          </div>
        )}

        <div className="flex items-center justify-between z-10">
          <span className="text-[10px] font-mono uppercase text-muted">Interviewer</span>
          <div className="flex items-center space-x-1">
            <button
              onClick={() => setInterviewerMuted(!interviewerMuted)}
              className="w-6 h-6 rounded flex items-center justify-center bg-white/90 border border-divider text-ink hover:bg-white"
            >
              {interviewerMuted ? <MicOff size={11} className="text-[#D14509]" /> : <Mic size={11} />}
            </button>
            <button
              onClick={() => setInterviewerCamOff(!interviewerCamOff)}
              className="w-6 h-6 rounded flex items-center justify-center bg-white/90 border border-divider text-ink hover:bg-white"
            >
              {interviewerCamOff ? <VideoOff size={11} className="text-[#D14509]" /> : <Video size={11} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

