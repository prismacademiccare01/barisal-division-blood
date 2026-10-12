import React, { useState } from 'react';
import {
  HelpCircle,
  CheckCircle2,
  XCircle,
  Award,
  Sparkles,
  ArrowRight,
  RotateCcw,
} from 'lucide-react';
import { toBengaliDigits } from '../../utils/formatters.js';

interface Question {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export const LifesaverQuiz: React.FC = () => {
  const questions: Question[] = [
    {
      id: 1,
      question: 'রক্তদান করলে কি শরীর দুর্বল বা রক্তশূন্য হয়ে পড়ে?',
      options: [
        'হ্যাঁ, দীর্ঘস্থায়ী দুর্বলতা হয়',
        'না, মাত্র ৪৮ ঘণ্টায় প্লাজমা এবং কয়েক সপ্তাহে রক্তকণিকা সম্পূর্ণ পূরণ হয়ে যায়',
        'রক্তদান কেবল ধনীদের জন্য প্রযোজ্য',
      ],
      correctIndex: 1,
      explanation: 'একজন সুস্থ মানুষের শরীরে প্রায় ৫ লিটার রক্ত থাকে। মাত্র ৩৫০-৪৫০ মিলি রক্তদান করলে শরীরের কোনো ক্ষতি হয় না, বরং নতুন রক্তকণিকা তৈরিতে সহায়ক হয়।',
    },
    {
      id: 2,
      question: 'একজন প্রাপ্তবয়স্ক পুরুষ কত দিন পর পর রক্ত দিতে পারেন?',
      options: [
        'প্রতি ১ মাস পর পর',
        'প্রতি ৩ মাস (৯০ দিন) পর পর',
        'বছরে মাত্র ১ বার',
      ],
      correctIndex: 1,
      explanation: 'পুরুষদের জন্য প্রতি ৯০ দিন (৩ মাস) এবং নারীদের জন্য প্রতি ১২০ দিন (৪ মাস) পর পর রক্তদান সম্পূর্ণ নিরাপদ ও স্বাস্থ্যসম্মত।',
    },
    {
      id: 3,
      question: 'কোন রক্তের গ্রুপকে সর্বজনীন দাতা (Universal Donor) বলা হয়?',
      options: ['AB পজিটিভ (AB+)', 'O নেগেটিভ (O-)', 'B পজিটিভ (B+)'],
      correctIndex: 1,
      explanation: 'O- নেগেটিভ রক্তের লোহিত কণিকায় কোনো A, B বা Rh অ্যান্টিজেন না থাকায় এটি জরুরি প্রয়োজনে যেকোনো গ্রুপের রোগীকে দেওয়া যায়।',
    },
    {
      id: 4,
      question: 'রক্তদানের পূর্বে কী করা সবচেয়ে বেশি জরুরি?',
      options: [
        'খালি পেটে থাকা',
        'পর্যাপ্ত পানি/তরল পান করা এবং হালকা পুষ্টিকর খাবার খাওয়া',
        'ভারী শরীরচর্চা করা',
      ],
      correctIndex: 1,
      explanation: 'রক্তদানের আগে প্রচুর পানি বা জুস পান করলে রক্তচাপ স্বাভাবিক থাকে এবং মাথা ঘোরার আশঙ্কা থাকে না।',
    },
    {
      id: 5,
      question: 'রক্তদান করলে কি হৃদরোগ ও হার্ট অ্যাটাকের ঝুঁকি কমে?',
      options: [
        'হ্যাঁ, গবেষণায় দেখা গেছে নিয়মিত রক্তদান ক্ষতিকর অতিরিক্ত আয়রন কমিয়ে হার্ট ভালো রাখে',
        'না, কোনো প্রভাব নেই',
        'হৃদরোগের ঝুঁকি বৃদ্ধি পায়',
      ],
      correctIndex: 0,
      explanation: 'শরীরে অতিরিক্ত আয়রন অক্সিডেটিভ স্ট্রেস বাড়ায়। নিয়মিত রক্তদানে তা হ্রাস পেয়ে রক্তনালী সচল ও সুস্থ থাকে।',
    },
  ];

  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  const currentQ = questions[currentIdx];

  const handleSelect = (idx: number) => {
    if (selectedOption !== null) return;
    setSelectedOption(idx);
    setShowExplanation(true);
    if (idx === currentQ.correctIndex) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    setSelectedOption(null);
    setShowExplanation(false);
    if (currentIdx + 1 < questions.length) {
      setCurrentIdx((prev) => prev + 1);
    } else {
      setQuizFinished(true);
    }
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setSelectedOption(null);
    setShowExplanation(false);
    setScore(0);
    setQuizFinished(false);
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-red-600 font-bold text-xs uppercase tracking-wider mb-1">
            <HelpCircle className="w-4 h-4" />
            <span>ফিচার ১৮: রক্তদান সচেতনতা ও মিথ-বাষ্টার কুইজ</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            রক্তদান জ্ঞান পরীক্ষা ও লাইফসেভার কুইজ
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            ভুল ধারণা ভেঙে সঠিক তথ্য জানুন এবং আপনার রক্তদান সচেতনতা স্কোর যাচাই করুন
          </p>
        </div>

        <div className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-xl self-start sm:self-auto">
          প্রশ্ন: {toBengaliDigits(currentIdx + 1)} / {toBengaliDigits(questions.length)}
        </div>
      </div>

      {!quizFinished ? (
        <div className="space-y-4 max-w-2xl mx-auto">
          {/* Question Text */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
            <h4 className="font-extrabold text-base text-slate-900 leading-snug">
              {toBengaliDigits(currentIdx + 1)}. {currentQ.question}
            </h4>
          </div>

          {/* Options */}
          <div className="space-y-2.5">
            {currentQ.options.map((opt, idx) => {
              const isSelected = selectedOption === idx;
              const isCorrect = idx === currentQ.correctIndex;

              let btnStyle = 'bg-white border-slate-200 hover:border-red-300 text-slate-800';
              if (selectedOption !== null) {
                if (isCorrect) {
                  btnStyle = 'bg-emerald-50 border-emerald-400 text-emerald-950 font-bold';
                } else if (isSelected) {
                  btnStyle = 'bg-red-50 border-red-400 text-red-950 font-bold';
                } else {
                  btnStyle = 'bg-white border-slate-200 opacity-60 text-slate-600';
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelect(idx)}
                  disabled={selectedOption !== null}
                  className={`w-full p-4 rounded-xl border text-left text-xs sm:text-sm transition flex items-center justify-between cursor-pointer ${btnStyle}`}
                >
                  <span>{opt}</span>
                  {selectedOption !== null && isCorrect && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  )}
                  {selectedOption !== null && isSelected && !isCorrect && (
                    <XCircle className="w-5 h-5 text-red-600 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Explanation Box */}
          {showExplanation && (
            <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 text-xs text-blue-950 space-y-2">
              <span className="font-bold flex items-center gap-1.5 text-blue-900">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span>মেডিকেল ব্যাখ্যা ও তথ্য:</span>
              </span>
              <p className="leading-relaxed text-blue-900">{currentQ.explanation}</p>

              <button
                onClick={handleNext}
                className="mt-2 px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 ml-auto cursor-pointer"
              >
                <span>{currentIdx + 1 === questions.length ? 'ফলাফল দেখুন' : 'পরবর্তী প্রশ্ন'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 text-center max-w-md mx-auto space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center mx-auto shadow-md">
            <Award className="w-8 h-8" />
          </div>

          <div>
            <h4 className="text-xl font-black text-slate-900">কুইজ সম্পন্ন হয়েছে!</h4>
            <div className="text-3xl font-black text-red-600 mt-2">
              {toBengaliDigits(score)} / {toBengaliDigits(questions.length)} সঠিক
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {score >= 4
                ? 'চমৎকার! রক্তদান সম্পর্কে আপনার জ্ঞান অসাধারণ। আপনি একজন সচেতন রক্তদাতা।'
                : 'ভালো চেষ্টা! রক্তদানের তথ্যগুলো জেনে নিন এবং অন্যদেরও সচেতন করুন।'}
            </p>
          </div>

          <button
            onClick={handleRestart}
            className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5 mx-auto cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>পুনরায় কুইজ দিন</span>
          </button>
        </div>
      )}
    </div>
  );
};
