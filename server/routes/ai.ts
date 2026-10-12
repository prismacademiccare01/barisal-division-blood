import { Router } from 'express';
import { GoogleGenAI } from '@google/genai';

const router = Router();

// Initialize GoogleGenAI instance with header
const getAIClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
};

const SYSTEM_INSTRUCTION = `তুমি হলে "রক্ত সহায়ক এআই" (Rokto Shohayok AI) — বরিশাল রক্ত (Barishal Rokto) ডিজিটাল ব্লাড নেটওয়ার্কের অভিজ্ঞ, সহানুভূতিশীল ও বিশ্বস্ত বাংলা মেডিকেল অ্যাসিস্ট্যান্ট।
তোমার প্রধান দায়িত্ব:
১. রক্তদান সংক্রান্ত বৈজ্ঞানিক তথ্য প্রদান: রক্তদানের যোগ্যতা (বয়স ১৮-৬০, ওজন ৪৫+ কেজি, হিমোগ্লোবিন ১২.৫+ g/dL, শেষ রক্তদানের পর ৯০ দিনের বিরতি ইত্যাদি)।
২. রক্তের গ্রুপ ও ক্রস-ম্যাচিং: কোন গ্রুপের রক্ত কে নিতে পারবে (O- ইউনিভার্সাল ডোনার, AB+ ইউনিভার্সাল গ্রহীতা ইত্যাদি)।
৩. ডেঙ্গু ও প্লাটিলেট (SDP) সংক্রান্ত পরামর্শ: প্লাটিলেটের স্বাভাবিক কাউন্ট (১.৫ থেকে ৪.৫ লাখ), ডেঙ্গুতে প্লাটিলেট সংকট মোকাবেলার উপায়।
৪. থ্যালাসেমিয়া ও নিয়মিত ট্রান্সফিউশন: থ্যালাসেমিয়া রোগীদের জন্য নিয়মিত রক্তদাতার গুরুত্ব।
৫. বরিশাল বিভাগের স্বাস্থ্য পরিকাঠামো: শেরেবাংলা মেডিকেল কলেজ হাসপাতাল (SBMC), বরিশাল সদর হাসপাতাল, ভোলা ২৫০ শয্যা হাসপাতাল, পটুয়াখালী মেডিকেল কলেজ, পায়রা সেতু ও লঞ্চ/নদীপথ অ্যাম্বুলেন্স সংক্রান্ত ভৌগোলিক সহায়তা।
৬. রক্তদানের পূর্বে ও পরের যত্ন: প্রচুর পানি ও ওরস্যালাইন পান, ভারি ওজন না তোলা, মাথা ঘুরলে শুয়ে পা উঁচুতে রাখা।

নির্দেশনা:
- স্পষ্ট, সহজবোধ্য ও শ্রদ্ধাশীল বাংলায় উত্তর দেবে।
- প্রয়োজনে বুলেট পয়েন্ট বা ছোট প্যারাগ্রাফ ব্যবহার করবে যাতে ব্যবহারকারী দ্রুত বুঝতে পারেন।
- জরুরি সংকটে সব সময় নিকটস্থ হাসপাতাল (যেমন শেরেবাংলা মেডিকেল ব্লাড ব্যাংক: ০৪৩১-২১৭৩৭) অথবা জাতীয় জরুরি সেবা ৯৯৯ এ যোগাযোগের পরামর্শ দেবে।
- স্মরণ করিয়ে দেবে যে এটি পরামর্শমূলক এবং গুরুতর পরিস্থিতিতে বিশেষজ্ঞ চিকিৎসকের পরামর্শ নেওয়া বাধ্যতামূলক।
- লিড সফটওয়্যার আর্কিটেক্ট: MD. SAIDUL ISLAM।`;

// Intelligent fallback responses for high-frequency blood emergencies
const getLocalFallbackReply = (query: string): string => {
  const q = query.toLowerCase();
  if (q.includes('হিমোগ্লোবিন') || q.includes('যোগ্যতা') || q.includes('ওজন')) {
    return `🩸 **রক্তদানের সাধারণ যোগ্যতা নির্দেশিকা:**\n- **বয়স:** ১৮ থেকে ৬০ বছর।\n- **ওজন:** পুরুষদের ক্ষেত্রে কমপক্ষে ৪৮ কেজি, নারীদের ক্ষেত্রে ৪৫ কেজি।\n- **হিমোগ্লোবিনের মাত্রা:** পুরুষদের ১২.৫ g/dL এবং নারীদের ১২.০ g/dL বা বেশি।\n- **বিরতি:** শেষ রক্তদানের পর অবশ্যই পূর্ণ ৯০ দিন (৩ মাস) অতিবাহিত হতে হবে।\n- **শারীরিক অবস্থা:** রক্তচাপ স্বাভাবিক (উচ্চ রক্তচাপ নিয়ন্ত্রিত হলে চিকিৎসকের পরামর্শে সম্ভব), জ্বর বা কোনো অ্যান্টিবায়োটিক সেবন না থাকা।\n\n💡 *বরিশাল রক্ত পোর্টালে "রক্তদান যোগ্যতা ক্যালকুলেটর" ব্যবহার করে আপনার সঠিক ফিটনেস স্কোর এখনই দেখে নিতে পারেন।*`;
  }
  if (q.includes('প্লাটিলেট') || q.includes('ডেঙ্গু')) {
    return `🦟 **ডেঙ্গু ও প্লাটিলেট (SDP) সংক্রান্ত জরুরি তথ্য:**\n- প্লাটিলেটের স্বাভাবিক মাত্রা ১,৫০,০০০ থেকে ৪,৫০,০০০।\n- কাউন্ট ২০,০০০ এর নিচে নামলে অথবা রক্তক্ষরণের লক্ষণ থাকলে জরুরি এফেরেসিস (SDP) প্লাটিলেট প্রয়োজন হতে পারে।\n- **শেরেবাংলা মেডিকেল কলেজ হাসপাতাল, বরিশাল**-এ প্লাটিলেট সেপারেশনের আধুনিক ইউনিট রয়েছে।\n- প্লাটিলেট দাতার ওজন কমপক্ষে ৫৫ কেজি এবং শিরা স্পষ্ট হওয়া প্রয়োজন। দাতা শেষ ৪৮ ঘণ্টায় অ্যাসপিরিন সেবন না করে থাকতে হবে।\n\n🚨 যেকোনো জরুরি প্রয়োজনে আমাদের ব্লাড হটলাইনে যোগাযোগ করুন।`;
  }
  if (q.includes('মাথা ঘোর') || q.includes('দুর্বল') || q.includes('অসুস্থ')) {
    return `🩺 **রক্তদানের পর মাথা ঘোরা বা দুর্বলতার প্রাথমিক চিকিৎসা:**\n১. সাথে সাথে শুয়ে পড়ুন এবং পায়ের নিচে বালিশ দিয়ে পা দুটি মাথার চেয়ে সামান্য উঁচুতে রাখুন।\n২. টাইট জামাকাপড় ঢিলেঢালা করে দিন এবং উন্মুক্ত বাতাস নিশ্চিত করুন।\n৩. প্রচুর পানি, ডাবের পানি, ফলের রস বা ওরস্যালাইন পান করুন।\n৪. অন্তত ৩০ মিনিট কোনো ভারী কাজ বা দ্রুত হাঁটাচলা করবেন না।\n৫. সমস্যা দীর্ঘস্থায়ী হলে অবিলম্বে নিকটস্থ হাসপাতালে ট্রান্সফিউশন বিভাগে দেখান।`;
  }
  return `🩸 **রক্ত সহায়ক এআই-এর বার্তা:**\nবরিশাল বিভাগে রক্তের যেকোনো জরুরি প্রয়োজনে আমরা আপনার সাথে আছি।\n- শেরেবাংলা মেডিকেল কলেজ হাসপাতাল (SBMC), বরিশাল ব্লাড ব্যাংক: **০৪৩১-২১৭৩৭**\n- জাতীয় জরুরি সেবা: **৯৯৯**\n- রক্তের গ্রুপ ক্রস-ম্যাচিং ও লাইভ ডোনার খুঁজতে আমাদের **"লাইভ ডোনার রাডার"** ব্যবহার করুন।\n\nসুস্থ থাকুন, রক্তদান করে মানবতার পাশে দাঁড়ান! 💖`;
};

// POST /api/v1/ai/chat
router.post('/chat', async (req, res) => {
  try {
    const { message, conversationHistory = [] } = req.body;

    if (!message || typeof message !== 'string') {
      res.status(400).json({ success: false, error: 'বার্তা প্রদান করুন' });
      return;
    }

    const ai = getAIClient();

    if (!ai) {
      // Local graceful fallback when key is not configured
      const reply = getLocalFallbackReply(message);
      res.json({
        success: true,
        reply,
        model: 'local-medical-assistant',
      });
      return;
    }

    // Build chat contents from history if available
    const contents: any[] = [];
    if (Array.isArray(conversationHistory)) {
      for (const turn of conversationHistory.slice(-6)) {
        if (turn.role && turn.text) {
          contents.push({
            role: turn.role === 'user' ? 'user' : 'model',
            parts: [{ text: turn.text }],
          });
        }
      }
    }

    // Append current message
    contents.push({
      role: 'user',
      parts: [{ text: message }],
    });

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      },
    });

    const reply = response.text || getLocalFallbackReply(message);

    res.json({
      success: true,
      reply,
      model: 'gemini-3.8-flash',
    });
  } catch (error: any) {
    console.error('[AI Route Error]:', error);
    // Graceful fallback on API error so user always gets life-saving info
    const fallbackText = getLocalFallbackReply(req.body?.message || '');
    res.json({
      success: true,
      reply: fallbackText,
      model: 'fallback-emergency-mode',
    });
  }
});

export default router;
