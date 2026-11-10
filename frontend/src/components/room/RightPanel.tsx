import React, { useState } from 'react';
import { VideoWidget } from './VideoWidget';
import { Whiteboard } from './Whiteboard';
import { FileEdit, Layout, MessageSquare, Lock } from 'lucide-react';

interface RightPanelProps {
  candidateName: string;
  interviewerName: string;
  notes: string;
  onNotesChange: (notes: string) => void;
  isInterviewer: boolean;
}

export const RightPanel: React.FC<RightPanelProps> = ({
  candidateName,
  interviewerName,
  notes,
  onNotesChange,
  isInterviewer,
}) => {
  const [activeTab, setActiveTab] = useState<'notes' | 'whiteboard' | 'chat'>('notes');
  const [chatMessages, setChatMessages] = useState<Array<{ sender: string; text: string; time: string }>>([
    { sender: interviewerName, text: "Welcome to CodeRoom! Let me know if you can see the question description on the left.", time: "16:30" },
    { sender: candidateName, text: "Hello! Yes, the LRU Cache description and starter code are crystal clear.", time: "16:31" }
  ]);
  const [chatInput, setChatInput] = useState('');

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const now = new Date();
    const time = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`;
    setChatMessages([
      ...chatMessages,
      { sender: isInterviewer ? interviewerName : candidateName, text: chatInput.trim(), time }
    ]);
    setChatInput('');
  };

  return (
    <div className="w-[300px] flex-shrink-0 h-full border-l border-divider bg-white flex flex-col overflow-hidden">
      {/* Video Tiles Area */}
      <VideoWidget candidateName={candidateName} interviewerName={interviewerName} />

      {/* Tabs Header */}
      <div className="h-10 px-3 border-b border-divider flex items-center justify-between bg-white flex-shrink-0">
        <div className="flex items-center space-x-2">
          {isInterviewer && (
            <button
              onClick={() => setActiveTab('notes')}
              className={`text-[12px] pb-1 px-1 flex items-center space-x-1.5 transition-colors relative ${
                activeTab === 'notes'
                  ? 'text-ink font-semibold border-b-2 border-ink'
                  : 'text-muted hover:text-ink'
              }`}
            >
              <FileEdit size={13} />
              <span>Private Notes</span>
            </button>
          )}

          <button
            onClick={() => setActiveTab('whiteboard')}
            className={`text-[12px] pb-1 px-1 flex items-center space-x-1.5 transition-colors relative ${
              activeTab === 'whiteboard'
                ? 'text-ink font-semibold border-b-2 border-ink'
                : 'text-muted hover:text-ink'
            }`}
          >
            <Layout size={13} />
            <span>Whiteboard</span>
          </button>

          <button
            onClick={() => setActiveTab('chat')}
            className={`text-[12px] pb-1 px-1 flex items-center space-x-1.5 transition-colors relative ${
              activeTab === 'chat'
                ? 'text-ink font-semibold border-b-2 border-ink'
                : 'text-muted hover:text-ink'
            }`}
          >
            <MessageSquare size={13} />
            <span>Chat</span>
          </button>
        </div>
      </div>

      {/* Tab Contents */}
      <div className="flex-1 overflow-hidden bg-white">
        {activeTab === 'notes' && isInterviewer && (
          <div className="h-full flex flex-col p-4 bg-white">
            <div className="flex items-center space-x-1.5 mb-2 pb-2 border-b border-divider text-[11px] text-muted">
              <Lock size={12} className="text-muted" />
              <span className="font-mono font-medium">Only you can see these notes</span>
            </div>
            <textarea
              value={notes}
              onChange={(e) => onNotesChange(e.target.value)}
              placeholder="Record candidate observations, algorithmic trade-offs, edge cases mentioned, and initial rubric impressions..."
              className="flex-1 w-full p-3 rounded-[6px] border border-divider text-ink text-[13px] leading-relaxed resize-none focus:outline-none focus:border-[#D14509] font-sans placeholder:text-muted/60"
            />
            <div className="pt-2 text-[11px] font-mono text-muted flex justify-between">
              <span>Auto-saved to session record</span>
              <span>{notes.length} chars</span>
            </div>
          </div>
        )}

        {activeTab === 'whiteboard' && (
          <Whiteboard />
        )}

        {activeTab === 'chat' && (
          <div className="h-full flex flex-col bg-white">
            <div className="flex-1 overflow-y-auto p-3 space-y-3">
              {chatMessages.map((msg, i) => (
                <div key={i} className="text-[12px]">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="font-semibold text-ink">{msg.sender}</span>
                    <span className="text-[10px] font-mono text-muted">{msg.time}</span>
                  </div>
                  <p className="text-muted bg-[#FAFAFA] p-2 rounded border border-divider">
                    {msg.text}
                  </p>
                </div>
              ))}
            </div>

            <form onSubmit={handleSendChat} className="p-2 border-t border-divider flex space-x-1 bg-white">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Type in-room message..."
                className="flex-1 h-8 px-2.5 border border-divider rounded-[4px] text-[12px] text-ink focus:outline-none focus:border-[#D14509]"
              />
              <button
                type="submit"
                className="h-8 px-3 rounded-[4px] bg-white border border-divider text-ink text-[12px] font-medium hover:bg-[#FFF7F1]"
              >
                Send
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

