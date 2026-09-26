import React, { useState, useEffect } from 'react';
import { X, Users, MessageSquare, Hand, Sparkles, Send, ShieldAlert, CheckCircle2, ChevronRight, LogOut } from 'lucide-react';
import { OpenSpaceSession, EphemeralChat } from '../types';
import { api } from '../services/api';

interface OpenSpaceDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cafeId: string;
  cafeName: string;
}

export const OpenSpaceDrawer: React.FC<OpenSpaceDrawerProps> = ({
  isOpen,
  onClose,
  cafeId,
  cafeName
}) => {
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [myAlias, setMyAlias] = useState('Sunlit Bench Explorer');
  const [sessions, setSessions] = useState<OpenSpaceSession[]>([]);
  const [activeChat, setActiveChat] = useState<EphemeralChat | null>(null);
  const [chatInput, setChatInput] = useState('');
  const [wavedAliases, setWavedAliases] = useState<string[]>([]);
  const [selectedInterests, setSelectedInterests] = useState<string[]>(['Technology', 'Coffee Roasting']);

  useEffect(() => {
    if (isOpen) {
      api.getWhosHere(cafeId).then(data => {
        if (data?.activeSessions) setSessions(data.activeSessions);
      });
    }
  }, [isOpen, cafeId]);

  if (!isOpen) return null;

  const handleJoin = async () => {
    await api.joinOpenSpace({
      userId: 'cust-demo-1',
      cafeId,
      alias: myAlias,
      interests: selectedInterests,
      statusNote: 'Enjoying single-origin filter brew'
    });
    setIsCheckedIn(true);
    // Refresh sessions
    const data = await api.getWhosHere(cafeId);
    if (data?.activeSessions) setSessions(data.activeSessions);
  };

  const handleLeave = async () => {
    await api.leaveOpenSpace('cust-demo-1');
    setIsCheckedIn(false);
    setActiveChat(null);
  };

  const handleWave = async (session: OpenSpaceSession) => {
    setWavedAliases(prev => [...prev, session.alias]);
    const res = await api.sendWave({
      fromUserId: 'cust-demo-1',
      toUserId: session.userId,
      fromAlias: myAlias,
      toAlias: session.alias
    });

    // Automatically simulate recipient accepting wave for seamless demo flow
    setTimeout(async () => {
      if (res?.ping?.id) {
        const acceptRes = await api.respondWave(res.ping.id, true);
        if (acceptRes?.chat) {
          setActiveChat(acceptRes.chat);
        }
      }
    }, 1500);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || !activeChat) return;

    const res = await api.sendChatMessage(activeChat.id, chatInput, myAlias);
    if (res?.message) {
      setActiveChat(prev => prev ? { ...prev, messages: [...prev.messages, res.message] } : null);
    }
    setChatInput('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-cafe-900/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col justify-between overflow-hidden border-l border-cream-200">
        {/* Top Header */}
        <div className="p-4 bg-cream-50 border-b border-cream-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-sage-400 text-white flex items-center justify-center shadow-sm">
              <Users size={18} />
            </div>
            <div>
              <div className="font-serif font-bold text-base text-cafe-900 flex items-center gap-1.5">
                <span>Café Open Space</span>
                <span className="text-[10px] bg-sage-100 text-sage-800 font-bold px-1.5 py-0.5 rounded-full">
                  Live
                </span>
              </div>
              <div className="text-xs text-cafe-500">Live Presence • {cafeName}</div>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {isCheckedIn && (
              <button
                onClick={handleLeave}
                className="px-2.5 py-1 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-lg transition-colors flex items-center gap-1"
                title="Leave Open Space"
              >
                <LogOut size={13} />
                <span>Leave</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 text-cafe-400 hover:text-cafe-700 rounded-lg hover:bg-cream-100 transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Active Ephemeral Chat View */}
          {activeChat ? (
            <div className="flex flex-col h-full">
              <div className="pb-3 border-b border-cream-200 flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-sage-400" />
                  <span className="text-xs font-bold text-cafe-900">
                    Chat with {activeChat.participants.filter(p => p !== myAlias).join(', ')}
                  </span>
                </div>
                <button
                  onClick={() => setActiveChat(null)}
                  className="text-xs text-cafe-500 hover:text-cafe-800 font-medium"
                >
                  ← Back to Who's Here
                </button>
              </div>

              {/* Chat Thread */}
              <div className="flex-1 space-y-3 overflow-y-auto mb-3">
                {activeChat.messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${msg.sender === myAlias ? 'items-end' : 'items-start'}`}
                  >
                    <div className="text-[10px] text-cafe-400 mb-0.5">{msg.sender} • {msg.timestamp}</div>
                    <div
                      className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${
                        msg.sender === myAlias
                          ? 'bg-cafe-600 text-white rounded-br-none shadow-sm'
                          : 'bg-cream-100 text-cafe-900 rounded-bl-none border border-cream-200'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Input */}
              <form onSubmit={handleSendMessage} className="flex gap-2 pt-2 border-t border-cream-200">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Send a friendly, polite message..."
                  className="flex-1 bg-cream-50 border border-cream-200 rounded-xl px-3 py-2 text-xs text-cafe-900 focus:outline-none focus:ring-1 focus:ring-sage-400"
                />
                <button
                  type="submit"
                  className="p-2 rounded-xl bg-sage-400 text-white hover:bg-sage-500 shadow-sm"
                >
                  <Send size={14} />
                </button>
              </form>
            </div>
          ) : (
            <>
              {/* Not Checked In Banner */}
              {!isCheckedIn ? (
                <div className="p-4 rounded-2xl bg-cream-50 border border-cream-200/80 text-center space-y-3">
                  <div className="w-10 h-10 rounded-full bg-sage-100 text-sage-600 flex items-center justify-center mx-auto">
                    <Hand size={20} />
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-cafe-900 text-sm">
                      Opt-In to Live Open Space
                    </h4>
                    <p className="text-xs text-cafe-500 max-w-xs mx-auto mt-1 leading-relaxed">
                      Connect with fellow café visitors using soft anonymous aliases. No real names or personal data are revealed without consent.
                    </p>
                  </div>

                  <div className="text-left bg-white p-3 rounded-xl border border-cream-200 space-y-2">
                    <label className="text-[11px] font-bold text-cafe-600 uppercase tracking-wider block">
                      Choose Your Anonymous Alias
                    </label>
                    <input
                      type="text"
                      value={myAlias}
                      onChange={(e) => setMyAlias(e.target.value)}
                      className="w-full bg-cream-50 border border-cream-200 rounded-lg px-2.5 py-1.5 text-xs text-cafe-900 font-medium"
                    />

                    <div className="text-[11px] font-bold text-cafe-600 uppercase tracking-wider pt-1 block">
                      Select Your Interests
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {['Technology', 'Startups', 'Coffee Roasting', 'Books', 'Design', 'Music', 'Travel'].map(tag => {
                        const isSelected = selectedInterests.includes(tag);
                        return (
                          <button
                            key={tag}
                            type="button"
                            onClick={() => {
                              setSelectedInterests(prev =>
                                isSelected ? prev.filter(t => t !== tag) : [...prev, tag]
                              );
                            }}
                            className={`text-[11px] px-2 py-0.5 rounded-full border transition-colors ${
                              isSelected
                                ? 'bg-sage-400 text-white border-sage-400 font-semibold'
                                : 'bg-cream-100 text-cafe-600 border-cream-200'
                            }`}
                          >
                            {tag}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <button
                    onClick={handleJoin}
                    className="w-full py-2.5 bg-sage-400 hover:bg-sage-500 text-white font-semibold rounded-xl text-xs shadow-sm transition-colors"
                  >
                    🟢 Turn On "Open to Connect"
                  </button>
                </div>
              ) : (
                <div className="p-3 bg-sage-50 border border-sage-200 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-sage-500 animate-pulse" />
                    <div>
                      <div className="text-xs font-bold text-sage-900">You are Open to Connect</div>
                      <div className="text-[11px] text-sage-700">Alias: <strong>{myAlias}</strong></div>
                    </div>
                  </div>
                  <span className="text-[10px] text-sage-600 font-medium px-2 py-0.5 bg-white rounded-full">
                    Auto-expires in ~90m
                  </span>
                </div>
              )}

              {/* Who's Here List (§14) */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-cafe-500">
                    Who's Here Right Now ({sessions.length})
                  </h4>
                  <span className="text-[11px] text-cafe-400 font-medium">Session-Scoped</span>
                </div>

                <div className="space-y-2.5">
                  {sessions.map((sess) => {
                    const isWaved = wavedAliases.includes(sess.alias);
                    return (
                      <div
                        key={sess.id}
                        className="p-3.5 rounded-xl bg-white border border-cream-200 shadow-soft hover:shadow-card transition-all flex items-center justify-between gap-3"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-sage-400" />
                            <span className="font-bold text-xs text-cafe-900">{sess.alias}</span>
                          </div>
                          <div className="text-[11px] text-cafe-500 italic">"{sess.statusNote}"</div>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {sess.interests.map((int, i) => (
                              <span
                                key={i}
                                className="text-[10px] px-2 py-0.5 rounded-full bg-cream-100 text-cafe-600 font-medium"
                              >
                                {int}
                              </span>
                            ))}
                          </div>
                        </div>

                        {isCheckedIn && (
                          <button
                            onClick={() => handleWave(sess)}
                            disabled={isWaved}
                            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1 transition-all ${
                              isWaved
                                ? 'bg-sage-100 text-sage-800'
                                : 'bg-cream-100 hover:bg-cream-200 text-cafe-800 border border-cream-300'
                            }`}
                          >
                            <span>👋</span>
                            <span>{isWaved ? 'Waved' : 'Wave'}</span>
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Privacy & Safety Note (§14) */}
              <div className="p-3 rounded-xl bg-cream-100/60 border border-cream-200/80 text-[11px] text-cafe-500 leading-relaxed flex items-start gap-2">
                <ShieldAlert size={14} className="text-cafe-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Privacy First:</strong> Presence is ephemeral and exists only within this physical café visit.
                  Staff have zero visibility into who is connecting with whom.
                </span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
