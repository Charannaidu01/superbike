import React, { useState } from 'react';
import { useBuildStore } from '../store/useBuildStore';
import { 
  Send, 
  User, 
  MessageSquare, 
  ArrowLeft, 
  ArrowRightLeft,
  Eye,
  X,
  Sparkles
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Chat() {
  const { conversations, sendMessage, user, isLoggedIn } = useBuildStore();
  const [activeConvId, setActiveConvId] = useState(conversations[0]?.id || null);
  const [inputText, setInputText] = useState('');

  const activeConv = conversations.find(c => c.id === activeConvId);

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputText.trim() || !activeConvId) return;

    sendMessage(activeConvId, inputText);
    setInputText('');
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
        <div className="glass p-8 rounded-2xl border border-white/5 text-center max-w-sm space-y-4">
          <MessageSquare className="text-brand-orange mx-auto" size={32} />
          <h3 className="text-base font-bold text-white">Chat Messaging Locked</h3>
          <p className="text-xs text-gray-400">Please sign in with your Google account to direct message sellers and negotiate listing transactions.</p>
          <Link 
            to="/auth" 
            className="block w-full bg-brand-orange hover:bg-brand-orange/90 text-white font-bold text-xs py-2.5 rounded-lg transition"
          >
            Authenticate Profile
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-73px)] bg-[#0a0a0a] flex items-stretch">
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-12 border-x border-white/5 divide-x divide-white/5">
        
        {/* Left Side: Conversations Index */}
        <div className={`md:col-span-4 flex flex-col ${activeConvId && 'hidden md:flex'}`}>
          <div className="p-4 border-b border-white/5 text-left">
            <h3 className="text-sm font-extrabold text-white uppercase tracking-wider flex items-center gap-1.5">
              <MessageSquare size={14} className="text-brand-orange" />
              Inbox Messages
            </h3>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-white/5">
            {conversations.length === 0 ? (
              <p className="text-xs text-gray-500 text-center py-10">No active inquiries or conversations yet.</p>
            ) : (
              conversations.map(conv => {
                const lastMsg = conv.messages[conv.messages.length - 1];
                const active = conv.id === activeConvId;
                return (
                  <div 
                    key={conv.id}
                    onClick={() => setActiveConvId(conv.id)}
                    className={`p-4 text-left cursor-pointer transition flex items-center gap-3 relative ${active ? 'bg-brand-orange/5 border-l-2 border-brand-orange' : 'hover:bg-white/[0.01]'}`}
                  >
                    <img 
                      src={conv.listing.imageUrl} 
                      alt="Listing" 
                      className="w-10 h-10 object-cover rounded-lg border border-white/10 shrink-0" 
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline">
                        <h4 className="text-xs font-bold text-white truncate pr-2">@{conv.recipientName}</h4>
                        <span className="text-[9px] text-gray-600 shrink-0">{lastMsg?.timestamp || ''}</span>
                      </div>
                      <p className="text-[10px] text-gray-500 truncate mt-0.5">{conv.listing.title}</p>
                      <p className="text-xs text-gray-300 truncate mt-1">
                        {lastMsg ? lastMsg.text : 'No messages yet.'}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Side: Message Thread Pane */}
        <div className={`md:col-span-8 flex flex-col justify-between ${!activeConvId && 'hidden md:flex bg-[#0c0c0c]/40'}`}>
          {activeConv ? (
            <>
              {/* Top Chat Info bar */}
              <div className="p-4 border-b border-white/5 flex items-center justify-between bg-white/[0.01]">
                <div className="flex items-center gap-3 text-left">
                  <button 
                    onClick={() => setActiveConvId(null)}
                    className="md:hidden p-1 rounded hover:bg-white/5 text-gray-400 hover:text-white"
                  >
                    <ArrowLeft size={16} />
                  </button>
                  <div>
                    <h4 className="text-xs font-bold text-white">Conversation with @{activeConv.recipientName}</h4>
                    <p className="text-[9px] text-gray-500 font-mono">CHANNEL_ID: {activeConv.id}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-brand-green px-2 py-0.5 rounded bg-green-950/60">
                    Active Session
                  </span>
                </div>
              </div>

              {/* Connected Listing Attachment Card */}
              <div className="m-4 p-3 bg-white/[0.02] border border-white/5 rounded-xl flex items-center justify-between gap-4 text-left">
                <div className="flex items-center gap-3">
                  <img src={activeConv.listing.imageUrl} alt="Attached listing" className="w-14 h-10 object-cover rounded-lg border border-white/10 shrink-0" />
                  <div>
                    <span className="text-[8px] bg-brand-orange/10 text-brand-orange font-bold px-1.5 py-0.5 rounded uppercase">
                      Inquiry Subject
                    </span>
                    <h4 className="text-xs font-bold text-white mt-1 line-clamp-1">{activeConv.listing.title}</h4>
                    <span className="text-xs font-mono font-bold text-brand-orange">₹{activeConv.listing.price.toLocaleString()}</span>
                  </div>
                </div>
                <Link 
                  to="/marketplace"
                  className="text-[10px] font-bold bg-white/5 border border-white/10 hover:bg-white/10 px-3 py-1.5 rounded-lg text-gray-300 transition shrink-0"
                >
                  View Listing
                </Link>
              </div>

              {/* Message History thread */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 text-left">
                {activeConv.messages.map((msg) => {
                  const isMe = msg.senderId === user?.id;
                  const isSystem = msg.senderId === 'system';

                  if (isSystem) {
                    return (
                      <div key={msg.id} className="text-center py-2">
                        <span className="bg-white/5 text-gray-400 text-[10px] px-3 py-1 rounded-full font-mono border border-white/5">
                          {msg.text}
                        </span>
                      </div>
                    );
                  }

                  return (
                    <div 
                      key={msg.id}
                      className={`flex flex-col max-w-[70%] space-y-1 ${isMe ? 'ml-auto items-end' : 'items-start'}`}
                    >
                      <div className={`p-3 rounded-2xl text-xs leading-relaxed ${isMe ? 'bg-brand-orange/10 border border-brand-orange/20 text-white rounded-tr-none' : 'bg-white/5 border border-white/5 text-gray-300 rounded-tl-none'}`}>
                        {msg.text}
                      </div>
                      <span className="text-[8px] text-gray-600 font-mono">{msg.timestamp}</span>
                    </div>
                  );
                })}
              </div>

              {/* Chat Input controls */}
              <form onSubmit={handleSend} className="p-4 border-t border-white/5 flex gap-2.5 bg-white/[0.01]">
                <input 
                  type="text" 
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Type negotiation message..." 
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-brand-orange"
                />
                <button 
                  type="submit"
                  className="bg-brand-orange hover:bg-brand-orange/90 text-white p-3 rounded-xl transition duration-200 shadow-md glow-orange"
                >
                  <Send size={14} />
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-500 font-mono text-xs space-y-2 p-10">
              <MessageSquare size={24} className="text-gray-700" />
              <span>Select an active message conversation thread to start negotiating.</span>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
