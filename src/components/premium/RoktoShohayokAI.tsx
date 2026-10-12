import React, { useState, useRef, useEffect } from 'react';
import { api } from '../../services/api.js';
import {
  Bot,
  Send,
  Sparkles,
  RefreshCw,
  PhoneCall,
  Volume2,
  VolumeX,
  Copy,
  Check,
  ShieldAlert,
  Droplet,
  Heart,
  HelpCircle,
  AlertTriangle,
  Flame,
  CheckCircle2,
  Building2,
  Code2,
} from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

const PRESET_QUESTIONS = [
  '🩸 রক্তদানের সাধারণ যোগ্যতা ও নিয়ম কী কী?',
  '🦟 ডেঙ্গু রোগীর জন্য প্লাটিলেট (SDP) পেতে কী করতে হবে?',
  '💊 শেষবার রক্ত দিয়েছি ২ মাস আগে, এখন দিতে পারব?',
  '🏥 শেরেবাংলা মেডিকেল (SBMC) ব্লাড ব্যাংকে রক্তের নিয়ম কী?',
  '🩺 হিমোগ্লোবিন ১১.৫ g/dL হলে কি রক্ত দেওয়া নিরাপদ?',
  '🚢 ভোলা থেকে রাতে মুমূর্ষু রোগী আনার দ্রুততম নদীপথ কী?',
];

export const RoktoShohayokAI: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      text: `আসসালামু আলাইকুম! আমি **রক্ত সহায়ক এআই (Rokto Shohayok AI)** — বরিশাল রক্ত প্ল্যাটফর্মের ২৪/৭ ডিজিটাল রক্ত ও স্বাস্থ্য পরামর্শক।\n\nরক্তদানের যোগ্যতা, রক্তের গ্রুপ মেলবন্ধন, ডেঙ্গু প্লাটিলেট, থ্যালাসেমিয়া সেবা কিংবা বরিশাল বিভাগের জরুরি চিকিৎসা নিয়ে আমাকে যেকোনো প্রশ্ন করতে পারেন। নিচের কুইক বাটনে ট্যাপ করেও প্রশ্ন করতে পারেন।`,
      timestamp: new Date().toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [speakingId, setSpeakingId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || loading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text,
      timestamp: new Date().toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputText('');
    setLoading(true);

    try {
      // Build conversation history for API
      const history = messages.slice(-5).map((m) => ({
        role: m.role,
        text: m.text,
      }));

      const res = await api.askAI(text, history);
      const replyText =
        res.success && res.data?.reply
          ? res.data.reply
          : 'দুঃখিত, এই মুহূর্তে সার্ভারে সংযোগ পাওয়া যায়নি। তবে যেকোনো জরুরি প্রয়োজনে আমাদের ব্লাড ব্যাংক হটলাইনে কল করুন: ০৪৩১-২১৭৩৭';

      const assistantMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        text: replyText,
        timestamp: new Date().toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch {
      const fallbackMsg: ChatMessage = {
        id: `ai-err-${Date.now()}`,
        role: 'assistant',
        text: 'জরুরি প্রয়োজনে শেরেবাংলা মেডিকেল কলেজ হাসপাতাল ব্লাড ব্যাংক (০৪৩১-২১৭৩৭) অথবা জাতীয় জরুরি সেবা ৯৯৯-এ যোগাযোগ করুন।',
        timestamp: new Date().toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSpeak = (id: string, text: string) => {
    if (!('speechSynthesis' in window)) return;

    if (speakingId === id) {
      window.speechSynthesis.cancel();
      setSpeakingId(null);
      return;
    }

    window.speechSynthesis.cancel();
    const cleanText = text.replace(/[*#_`]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'bn-BD';
    utterance.rate = 0.95;
    utterance.onend = () => setSpeakingId(null);
    utterance.onerror = () => setSpeakingId(null);

    setSpeakingId(id);
    window.speechSynthesis.speak(utterance);
  };

  const handleClear = () => {
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    setSpeakingId(null);
    setMessages([
      {
        id: 'welcome-reset',
        role: 'assistant',
        text: 'কথোপকথন রিসেট করা হয়েছে। আপনার নতুন প্রশ্নটি লিখুন বা নিচের অপশন থেকে বেছে নিন।',
        timestamp: new Date().toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden flex flex-col h-[700px] max-h-[85vh]">
      {/* Header */}
      <div className="p-4 sm:p-5 bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 text-white shadow-inner">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-black text-base sm:text-lg tracking-tight">
                রক্ত সহায়ক এআই (Rokto Shohayok AI)
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-400/20 text-emerald-200 border border-emerald-300/30">
                ২৪/৭ অ্যাক্টিভ
              </span>
            </div>
            <p className="text-xs text-red-100 flex items-center gap-1.5 mt-0.5">
              <span>বরিশাল বিভাগীয় রক্ত ও মেডিকেল ইন্টেলিজেন্স</span>
              <span>·</span>
              <span>Gemini Powered</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleClear}
            title="চ্যাট রিসেট করুন"
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition active:scale-95 cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <a
            href="tel:999"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white text-red-700 font-extrabold text-xs shadow-xs hover:bg-red-50 transition active:scale-95"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>জরুরি ৯৯৯</span>
          </a>
        </div>
      </div>

      {/* Suggested Quick Questions */}
      <div className="p-3 bg-slate-50 border-b border-slate-100 overflow-x-auto no-scrollbar shrink-0">
        <div className="flex items-center gap-2 min-w-max">
          <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-500" />
            দ্রুত প্রশ্ন:
          </span>
          {PRESET_QUESTIONS.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q)}
              disabled={loading}
              className="text-xs bg-white hover:bg-red-50 hover:text-red-700 hover:border-red-200 text-slate-700 px-3 py-1.5 rounded-xl border border-slate-200 transition shrink-0 cursor-pointer disabled:opacity-50"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-4 bg-slate-50/50">
        {messages.map((m) => {
          const isUser = m.role === 'user';
          return (
            <div
              key={m.id}
              className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <div
                className={`w-8 h-8 rounded-xl shrink-0 flex items-center justify-center text-xs font-bold ${
                  isUser
                    ? 'bg-slate-900 text-white'
                    : 'bg-red-600 text-white shadow-xs shadow-red-500/20'
                }`}
              >
                {isUser ? 'আপনি' : <Bot className="w-4 h-4" />}
              </div>

              <div className={`max-w-[85%] sm:max-w-[75%] space-y-1.5`}>
                <div
                  className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-xs ${
                    isUser
                      ? 'bg-slate-900 text-white rounded-tr-xs'
                      : 'bg-white text-slate-800 border border-slate-200/90 rounded-tl-xs whitespace-pre-line'
                  }`}
                >
                  {m.text}
                </div>

                <div
                  className={`flex items-center gap-2 text-[10px] text-slate-400 px-1 ${
                    isUser ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <span>{m.timestamp}</span>

                  {!isUser && (
                    <>
                      <span>·</span>
                      <button
                        onClick={() => handleCopy(m.id, m.text)}
                        className="hover:text-slate-700 flex items-center gap-0.5 transition cursor-pointer"
                        title="কপি করুন"
                      >
                        {copiedId === m.id ? (
                          <Check className="w-3 h-3 text-emerald-600" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                        <span>{copiedId === m.id ? 'কপি হয়েছে' : 'কপি'}</span>
                      </button>

                      <span>·</span>
                      <button
                        onClick={() => handleSpeak(m.id, m.text)}
                        className="hover:text-slate-700 flex items-center gap-0.5 transition cursor-pointer"
                        title="ভয়েসে শুনুন"
                      >
                        {speakingId === m.id ? (
                          <VolumeX className="w-3 h-3 text-red-500" />
                        ) : (
                          <Volume2 className="w-3 h-3" />
                        )}
                        <span>{speakingId === m.id ? 'থামান' : 'ভয়েস'}</span>
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-red-600 text-white shrink-0 flex items-center justify-center">
              <Bot className="w-4 h-4" />
            </div>
            <div className="p-4 rounded-2xl bg-white border border-slate-200 text-slate-500 text-xs flex items-center gap-2 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-red-600 animate-bounce" />
              <span className="w-2 h-2 rounded-full bg-red-600 animate-bounce [animation-delay:0.2s]" />
              <span className="w-2 h-2 rounded-full bg-red-600 animate-bounce [animation-delay:0.4s]" />
              <span className="font-semibold text-slate-600">
                রক্ত সহায়ক এআই তথ্য পর্যালোচনা করছে...
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Safety Notice Banner */}
      <div className="px-4 py-2 bg-amber-50 border-t border-amber-100 flex items-center justify-between text-[11px] text-amber-900 shrink-0">
        <div className="flex items-center gap-1.5">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
          <span>
            এআই পরামর্শ সাধারণ সচেতনতামূলক। গুরুতর ক্ষেত্রে সরাসরি শেরেবাংলা মেডিকেল বা বিশেষজ্ঞের শরণাপন্ন হোন।
          </span>
        </div>
        <span className="font-bold text-[10px] text-amber-700 shrink-0 hidden sm:inline">
          Arch: MD. SAIDUL ISLAM
        </span>
      </div>

      {/* Input Box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="p-3 sm:p-4 bg-white border-t border-slate-200/80 flex items-center gap-2 shrink-0"
      >
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="রক্তদান, রক্তের গ্রুপ, প্লাটিলেট বা যোগ্যতা নিয়ে যেকোনো প্রশ্ন লিখুন..."
          className="flex-1 px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-red-500/20 focus:border-red-500 text-xs sm:text-sm text-slate-800 transition"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={!inputText.trim() || loading}
          className="px-5 py-3 rounded-2xl bg-red-600 hover:bg-red-700 active:scale-95 text-white font-bold text-xs sm:text-sm shadow-md shadow-red-600/30 flex items-center gap-1.5 transition disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shrink-0"
        >
          <Send className="w-4 h-4" />
          <span className="hidden sm:inline">পাঠান</span>
        </button>
      </form>
    </div>
  );
};
