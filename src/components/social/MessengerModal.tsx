import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../hooks/useAuth.js';
import { ChatConversation, ChatMessage, BloodGroup } from '../../types/index.js';
import { SocialStorageService } from '../../services/socialData.js';
import {
  X,
  Search,
  Send,
  Phone,
  Video,
  MoreVertical,
  Check,
  CheckCheck,
  Paperclip,
  Smile,
  Mic,
  Pin,
  Reply,
  Copy,
  Trash2,
  AlertTriangle,
  ShieldAlert,
  Flame,
  Droplet,
  Users,
  Archive,
  Inbox,
  Image as ImageIcon,
  Clock,
  Sparkles,
} from 'lucide-react';

interface MessengerModalProps {
  onClose: () => void;
  initialConversationId?: string;
  emergencyRequestPrompt?: {
    blood_group: BloodGroup;
    hospital: string;
    units: number;
    requester_name: string;
  };
}

export const MessengerModal: React.FC<MessengerModalProps> = ({
  onClose,
  initialConversationId,
  emergencyRequestPrompt,
}) => {
  const { user } = useAuth();

  const [activeFolder, setActiveFolder] = useState<'chats' | 'emergency' | 'requests' | 'groups' | 'archived'>('chats');
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [selectedConvId, setSelectedConvId] = useState<string>('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [replyingTo, setReplyingTo] = useState<ChatMessage | null>(null);
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [recordDuration, setRecordDuration] = useState(0);
  const [showOptionsDropdown, setShowOptionsDropdown] = useState(false);
  const [copiedMsgId, setCopiedMsgId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const list = SocialStorageService.getConversations();
    setConversations(list);

    if (initialConversationId) {
      setSelectedConvId(initialConversationId);
    } else if (emergencyRequestPrompt) {
      // Find or create emergency conversation
      const found = list.find((c) => c.is_emergency);
      if (found) {
        setSelectedConvId(found.id);
        setActiveFolder('emergency');
      } else if (list.length > 0) {
        setSelectedConvId(list[0].id);
      }
    } else if (list.length > 0) {
      setSelectedConvId(list[0].id);
    }
  }, [initialConversationId, emergencyRequestPrompt]);

  useEffect(() => {
    if (selectedConvId) {
      const msgs = SocialStorageService.getMessages(selectedConvId);
      setMessages(msgs);
    }
  }, [selectedConvId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Voice recording simulation timer
  useEffect(() => {
    let timer: any;
    if (isRecordingVoice) {
      timer = setInterval(() => {
        setRecordDuration((prev) => prev + 1);
      }, 1000);
    } else {
      setRecordDuration(0);
    }
    return () => clearInterval(timer);
  }, [isRecordingVoice]);

  const activeConversation = conversations.find((c) => c.id === selectedConvId);

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() && !isRecordingVoice) return;

    if (!selectedConvId) return;

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      conversation_id: selectedConvId,
      sender_id: user?.id || 'current_user',
      sender_name: user?.name || 'আমি',
      text: isRecordingVoice ? `🎙️ ভয়েস বার্তা (${recordDuration}s)` : inputText.trim(),
      created_at: new Date().toISOString(),
      is_delivered: true,
      is_read: false,
      reply_to: replyingTo
        ? {
            id: replyingTo.id,
            text: replyingTo.text,
            sender_name: replyingTo.sender_name,
          }
        : undefined,
    };

    const updated = [...messages, newMsg];
    setMessages(updated);
    SocialStorageService.saveMessages(selectedConvId, updated);

    // Update conversation last message
    const updatedConvs = conversations.map((c) =>
      c.id === selectedConvId
        ? {
            ...c,
            last_message: newMsg.text,
            last_message_time: 'এইমাত্র',
          }
        : c
    );
    setConversations(updatedConvs);
    SocialStorageService.saveConversations(updatedConvs);

    setInputText('');
    setReplyingTo(null);
    setIsRecordingVoice(false);
  };

  const handleCopyMessage = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedMsgId(id);
    setTimeout(() => setCopiedMsgId(null), 2000);
  };

  const handleDeleteMessage = (id: string) => {
    const updated = messages.filter((m) => m.id !== id);
    setMessages(updated);
    if (selectedConvId) {
      SocialStorageService.saveMessages(selectedConvId, updated);
    }
  };

  const handleTogglePin = (id: string) => {
    const updated = messages.map((m) => (m.id === id ? { ...m, is_pinned: !m.is_pinned } : m));
    setMessages(updated);
    if (selectedConvId) {
      SocialStorageService.saveMessages(selectedConvId, updated);
    }
  };

  const filteredConversations = conversations.filter((c) => {
    if (activeFolder === 'emergency') return c.is_emergency;
    if (activeFolder === 'groups') return c.type === 'group';
    if (activeFolder === 'requests') return c.unread_count > 0;
    if (searchQuery) {
      return (
        c.participant_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.last_message.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-2 sm:p-4">
      <div className="bg-white rounded-3xl w-full max-w-5xl h-[88vh] shadow-2xl border border-slate-200 overflow-hidden flex flex-col md:flex-row animate-in fade-in zoom-in-95 duration-150">
        {/* Left Sidebar: Messenger navigation & conversation list */}
        <div className="w-full md:w-80 border-r border-slate-200 flex flex-col bg-slate-50/70 shrink-0">
          {/* Header */}
          <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-white">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-red-600 text-white flex items-center justify-center font-black">
                💬
              </span>
              <div>
                <h3 className="font-extrabold text-sm text-slate-900 leading-none">রক্তসেবা মেসেঞ্জার</h3>
                <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  অনলাইন নেটওয়ার্ক
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="md:hidden w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Folder Tabs (Chats, Emergency, Requests, Groups, Archived) */}
          <div className="px-3 pt-2 pb-1 border-b border-slate-200 flex items-center gap-1 overflow-x-auto text-xs bg-white">
            <button
              onClick={() => setActiveFolder('chats')}
              className={`px-2.5 py-1.5 rounded-xl font-bold whitespace-nowrap cursor-pointer transition ${
                activeFolder === 'chats'
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              ইনবক্স
            </button>
            <button
              onClick={() => setActiveFolder('emergency')}
              className={`px-2.5 py-1.5 rounded-xl font-bold whitespace-nowrap cursor-pointer transition flex items-center gap-1 ${
                activeFolder === 'emergency'
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'text-red-700 bg-red-50 hover:bg-red-100'
              }`}
            >
              <Flame className="w-3 h-3 text-red-500" />
              <span>জরুরি চ্যাট</span>
            </button>
            <button
              onClick={() => setActiveFolder('groups')}
              className={`px-2.5 py-1.5 rounded-xl font-bold whitespace-nowrap cursor-pointer transition flex items-center gap-1 ${
                activeFolder === 'groups'
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Users className="w-3 h-3" />
              <span>গ্রুপ</span>
            </button>
          </div>

          {/* Search bar */}
          <div className="p-3">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="মেসেজ বা ডোনার খুঁজুন..."
                className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs focus:outline-hidden focus:ring-2 focus:ring-red-500"
              />
            </div>
          </div>

          {/* Conversation List */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {filteredConversations.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-400">
                কোনো চ্যাট পাওয়া যায়নি
              </div>
            ) : (
              filteredConversations.map((conv) => {
                const isSelected = conv.id === selectedConvId;
                return (
                  <div
                    key={conv.id}
                    onClick={() => setSelectedConvId(conv.id)}
                    className={`p-3 flex items-start gap-3 cursor-pointer transition ${
                      isSelected
                        ? 'bg-red-50/80 border-l-4 border-red-600'
                        : 'hover:bg-slate-100/60 bg-white'
                    }`}
                  >
                    <div className="relative shrink-0">
                      <img
                        src={
                          conv.participant_avatar ||
                          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'
                        }
                        alt={conv.participant_name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      {conv.participant_online && (
                        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
                      )}
                      {conv.is_emergency && (
                        <span className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full p-0.5 text-[8px] font-black">
                          🚨
                        </span>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="font-bold text-xs text-slate-900 truncate">
                          {conv.participant_name}
                        </span>
                        <span className="text-[10px] text-slate-400 shrink-0">
                          {conv.last_message_time}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 truncate">
                        {conv.last_message}
                      </p>
                      {conv.is_emergency && conv.emergency_details && (
                        <span className="inline-block mt-1 text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-rose-100 text-rose-700">
                          {conv.emergency_details.blood_group} রক্ত • {conv.emergency_details.units} ব্যাগ
                        </span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Active Chat Pane */}
        {activeConversation ? (
          <div className="flex-1 flex flex-col bg-slate-50/30">
            {/* Chat Header */}
            <div className="px-5 py-3.5 bg-white border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img
                    src={
                      activeConversation.participant_avatar ||
                      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'
                    }
                    alt={activeConversation.participant_name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  {activeConversation.participant_online && (
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-extrabold text-sm text-slate-900">
                      {activeConversation.participant_name}
                    </h4>
                    {activeConversation.participant_blood_group && (
                      <span className="text-[10px] font-black px-1.5 py-0.5 rounded-full bg-red-100 text-red-700">
                        {activeConversation.participant_blood_group}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px]">
                    <span className="text-emerald-600 font-bold">অনলাইন</span>
                    <span className="text-slate-300">•</span>
                    <span className="text-slate-500">নিয়ন্ত্রিত যোগাযোগ সুরক্ষিত</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <a
                  href="tel:01700000000"
                  className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-700 hover:bg-emerald-100 flex items-center justify-center transition cursor-pointer"
                  title="জরুরি ভয়েস কল"
                >
                  <Phone className="w-4 h-4" />
                </a>
                <button
                  onClick={() => setShowOptionsDropdown(!showOptionsDropdown)}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition cursor-pointer"
                >
                  <MoreVertical className="w-4 h-4" />
                </button>
                <button
                  onClick={onClose}
                  className="hidden md:flex w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 items-center justify-center transition cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Emergency Top Banner (If emergency chat) */}
            {activeConversation.is_emergency && (
              <div className="bg-gradient-to-r from-red-600 to-rose-600 text-white px-4 py-2.5 flex items-center justify-between text-xs shadow-md">
                <div className="flex items-center gap-2">
                  <span className="p-1 rounded-lg bg-white/20">🚨</span>
                  <div>
                    <span className="font-black">জরুরি রক্ত সহায়তা চ্যানেল:</span>{' '}
                    <span>
                      {activeConversation.emergency_details?.blood_group} রক্ত প্রয়োজন (
                      {activeConversation.emergency_details?.hospital || 'বরিশাল সদর'})
                    </span>
                  </div>
                </div>
                <span className="font-bold bg-white text-red-700 px-2.5 py-0.5 rounded-full text-[10px]">
                  Critical Urgency
                </span>
              </div>
            )}

            {/* Messages Scroll Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((msg) => {
                const isMe = msg.sender_id === (user?.id || 'current_user');
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col group ${isMe ? 'items-end' : 'items-start'}`}
                  >
                    {/* Replying banner */}
                    {msg.reply_to && (
                      <div className="text-[10px] text-slate-500 bg-slate-100 rounded-lg px-2.5 py-1 mb-1 border-l-2 border-red-500 max-w-xs">
                        <span className="font-bold">{msg.reply_to.sender_name}: </span>
                        <span className="truncate">{msg.reply_to.text}</span>
                      </div>
                    )}

                    <div className="flex items-end gap-1.5 max-w-[80%] sm:max-w-md">
                      {/* Left actions on hover for sender */}
                      {isMe && (
                        <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-opacity">
                          <button
                            onClick={() => handleCopyMessage(msg.text, msg.id)}
                            className="p-1 text-slate-400 hover:text-slate-600"
                            title="কপি"
                          >
                            <Copy className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => setReplyingTo(msg)}
                            className="p-1 text-slate-400 hover:text-slate-600"
                            title="উত্তর দিন"
                          >
                            <Reply className="w-3 h-3" />
                          </button>
                        </div>
                      )}

                      {/* Bubble */}
                      <div
                        className={`px-3.5 py-2.5 rounded-2xl text-xs relative ${
                          isMe
                            ? 'bg-red-600 text-white rounded-br-xs shadow-xs'
                            : 'bg-white text-slate-800 border border-slate-200/80 rounded-bl-xs shadow-xs'
                        }`}
                      >
                        {msg.is_pinned && (
                          <div className="flex items-center gap-1 text-[9px] text-amber-300 font-bold mb-1">
                            <Pin className="w-2.5 h-2.5" /> পিন করা বার্তা
                          </div>
                        )}
                        <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>

                        {/* Message time and read status */}
                        <div
                          className={`flex items-center justify-end gap-1 mt-1 text-[9px] ${
                            isMe ? 'text-white/80' : 'text-slate-400'
                          }`}
                        >
                          <span>
                            {new Date(msg.created_at).toLocaleTimeString('bn-BD', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                          {isMe && (
                            <span>
                              {msg.is_read ? (
                                <CheckCheck className="w-3 h-3 text-cyan-200" />
                              ) : (
                                <Check className="w-3 h-3 text-white/70" />
                              )}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Right actions on hover for recipient */}
                      {!isMe && (
                        <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-opacity">
                          <button
                            onClick={() => setReplyingTo(msg)}
                            className="p-1 text-slate-400 hover:text-slate-600"
                            title="উত্তর দিন"
                          >
                            <Reply className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => handleCopyMessage(msg.text, msg.id)}
                            className="p-1 text-slate-400 hover:text-slate-600"
                            title="কপি"
                          >
                            <Copy className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Replying Preview Bar */}
            {replyingTo && (
              <div className="px-4 py-2 bg-slate-100 border-t border-slate-200 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 truncate">
                  <Reply className="w-3.5 h-3.5 text-red-600" />
                  <span className="font-bold text-slate-700">{replyingTo.sender_name}-কে উত্তর:</span>
                  <span className="text-slate-500 truncate">{replyingTo.text}</span>
                </div>
                <button
                  onClick={() => setReplyingTo(null)}
                  className="text-slate-400 hover:text-slate-600 p-1"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Message Input Bar */}
            <form
              onSubmit={handleSendMessage}
              className="p-3 bg-white border-t border-slate-200 flex items-center gap-2"
            >
              <button
                type="button"
                onClick={() => setInputText((prev) => prev + ' 🩸 ')}
                className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-slate-100 transition cursor-pointer"
                title="রক্তদান ইমোজি"
              >
                <Smile className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() =>
                  setInputText('শেরেবাংলা মেডিকেল কলেজ হাসপাতালের ব্লাড ব্যাংকে আমি অবস্থান করছি।')
                }
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                title="দ্রুত অবস্থান শেয়ার"
              >
                <Paperclip className="w-4 h-4" />
              </button>

              {/* Voice Note Simulation button */}
              <button
                type="button"
                onClick={() => {
                  if (!isRecordingVoice) {
                    setIsRecordingVoice(true);
                  } else {
                    handleSendMessage();
                  }
                }}
                className={`p-2 rounded-xl transition cursor-pointer ${
                  isRecordingVoice
                    ? 'bg-red-600 text-white animate-pulse'
                    : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
                }`}
                title="ভয়েস মেসেজ"
              >
                <Mic className="w-4 h-4" />
              </button>

              {isRecordingVoice ? (
                <div className="flex-1 px-4 py-2 bg-red-50 text-red-700 font-bold rounded-xl text-xs flex items-center justify-between">
                  <span>ভয়েস রেকর্ড হচ্ছে... {recordDuration}s</span>
                  <button
                    type="button"
                    onClick={() => setIsRecordingVoice(false)}
                    className="text-slate-500 underline"
                  >
                    বাতিল
                  </button>
                </div>
              ) : (
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="একটি বার্তা লিখুন..."
                  className="flex-1 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-hidden focus:ring-2 focus:ring-red-500"
                />
              )}

              <button
                type="submit"
                disabled={!inputText.trim() && !isRecordingVoice}
                className="p-2.5 rounded-xl bg-red-600 hover:bg-red-700 disabled:opacity-40 text-white transition shadow-xs active:scale-95 cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400 p-8">
            <span className="text-4xl mb-2">💬</span>
            <p className="text-sm font-bold">একটি চ্যাট নির্বাচন করুন</p>
          </div>
        )}
      </div>
    </div>
  );
};
