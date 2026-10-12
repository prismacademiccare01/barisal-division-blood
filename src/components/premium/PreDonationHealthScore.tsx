import React, { useState } from 'react';
import { toBengaliDigits } from '../../utils/formatters.js';
import {
  HeartPulse,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Activity,
  Droplet,
  Sparkles,
  ShieldCheck,
  ChevronRight,
  XCircle,
} from 'lucide-react';

export const PreDonationHealthScore: React.FC = () => {
  const [age, setAge] = useState(25);
  const [weight, setWeight] = useState(65);
  const [sleepHours, setSleepHours] = useState(7);
  const [hasFever, setHasFever] = useState(false);
  const [hasAntibiotics, setHasAntibiotics] = useState(false);
  const [hasTattoo, setHasTattoo] = useState(false);
  const [hasSurgery, setHasSurgery] = useState(false);
  const [waterGlasses, setWaterGlasses] = useState(8);

  // Score Calculation
  let score = 100;
  const deductions: string[] = [];

  if (age < 18 || age > 60) {
    score -= 40;
    deductions.push('বয়স ১৮ থেকে ৬০ বছরের মধ্যে হওয়া বাধ্যতামূলক');
  }

  if (weight < 45) {
    score -= 40;
    deductions.push('ওজন ন্যূনতম ৪৫ কেজি (নারীদের জন্য) বা ৫০ কেজি (পুরুষদের জন্য) হতে হবে');
  } else if (weight < 50) {
    score -= 10;
    deductions.push('ওজন সীমান্ত সীমায় আছে (হালকা সতর্কতা)');
  }

  if (sleepHours < 6) {
    score -= 20;
    deductions.push('বিগত রাতে অন্তত ৬-৭ ঘণ্টা পর্যাপ্ত ঘুম আবশ্যক');
  }

  if (waterGlasses < 6) {
    score -= 15;
    deductions.push('রক্তদানের পূর্বে অন্তত ৮-১০ গ্লাস পানি বা তরল পান করুন');
  }

  if (hasFever) {
    score -= 50;
    deductions.push('জ্বর বা কোনো সংক্রমণ থাকলে সম্পূর্ণ সুস্থ হওয়ার পর অন্তত ৭ দিন অপেক্ষা করতে হবে');
  }

  if (hasAntibiotics) {
    score -= 40;
    deductions.push('অ্যান্টিবায়োটিক কোর্স শেষ হওয়ার পর অন্তত ৭ দিন অপেক্ষা করতে হয়');
  }

  if (hasTattoo) {
    score -= 30;
    deductions.push('বিগত ৬ মাসের মধ্যে ট্যাটু বা পিয়ার্সিং করালে সাময়িক বিরতি প্রয়োজন');
  }

  if (hasSurgery) {
    score -= 40;
    deductions.push('বড় অস্ত্রোপচারের পর অন্তত ৬ মাস রক্তদান স্থগিত রাখা শ্রেয়');
  }

  score = Math.max(0, Math.min(100, score));

  let grade = 'A+ (চমৎকার প্রস্তুত)';
  let gradeColor = 'text-emerald-700 bg-emerald-50 border-emerald-200';
  let badgeColor = 'bg-emerald-600 text-white';

  if (score >= 90) {
    grade = 'Grade A+ (শতভাগ প্রস্তুত)';
    gradeColor = 'text-emerald-700 bg-emerald-50 border-emerald-200';
  } else if (score >= 75) {
    grade = 'Grade A (উপযুক্ত ও ফিট)';
    gradeColor = 'text-blue-700 bg-blue-50 border-blue-200';
    badgeColor = 'bg-blue-600 text-white';
  } else if (score >= 60) {
    grade = 'Grade B (সামান্য যত্ন প্রয়োজন)';
    gradeColor = 'text-amber-700 bg-amber-50 border-amber-200';
    badgeColor = 'bg-amber-600 text-white';
  } else {
    grade = 'Grade C (আপাতত বিরতি প্রয়োজন)';
    gradeColor = 'text-red-700 bg-red-50 border-red-200';
    badgeColor = 'bg-red-600 text-white';
  }

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-rose-600 font-bold text-xs uppercase tracking-wider mb-1">
          <HeartPulse className="w-4 h-4" />
          <span>ফিচার ৯: বৈজ্ঞানিক রক্তদান প্রস্তুতি স্কোর</span>
        </div>
        <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          প্রি-ডোনেশন ফিটনেস ও স্বাস্থ্য স্কোর ক্যালকুলেটর
        </h3>
        <p className="text-xs text-slate-500 mt-0.5">
          রক্তদানে যাওয়ার আগে ১ মিনিটে নিজের শারীরিক সক্ষমতা ও রক্তদানের প্রস্তুতি যাচাই করুন
        </p>
      </div>

      {/* Main interactive grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Controls (7 cols) */}
        <div className="lg:col-span-7 space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                আপনার বয়স: {toBengaliDigits(age)} বছর
              </label>
              <input
                type="range"
                min="16"
                max="65"
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                className="w-full accent-red-600"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                শরীরের ওজন: {toBengaliDigits(weight)} কেজি
              </label>
              <input
                type="range"
                min="40"
                max="105"
                value={weight}
                onChange={(e) => setWeight(Number(e.target.value))}
                className="w-full accent-red-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                গত রাতের ঘুম: {toBengaliDigits(sleepHours)} ঘণ্টা
              </label>
              <input
                type="range"
                min="3"
                max="12"
                value={sleepHours}
                onChange={(e) => setSleepHours(Number(e.target.value))}
                className="w-full accent-red-600"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                আজকের পানি পান: {toBengaliDigits(waterGlasses)} গ্লাস
              </label>
              <input
                type="range"
                min="2"
                max="15"
                value={waterGlasses}
                onChange={(e) => setWaterGlasses(Number(e.target.value))}
                className="w-full accent-red-600"
              />
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 space-y-2.5">
            <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-800">
              <input
                type="checkbox"
                checked={hasFever}
                onChange={(e) => setHasFever(e.target.checked)}
                className="w-4 h-4 rounded text-red-600 accent-red-600"
              />
              <span>গত ৩ দিনের মধ্যে জ্বর, সর্দি বা কাশি হয়েছে?</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-800">
              <input
                type="checkbox"
                checked={hasAntibiotics}
                onChange={(e) => setHasAntibiotics(e.target.checked)}
                className="w-4 h-4 rounded text-red-600 accent-red-600"
              />
              <span>গত ৭ দিনে কোনো অ্যান্টিবায়োটিক সেবন করেছেন?</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-800">
              <input
                type="checkbox"
                checked={hasTattoo}
                onChange={(e) => setHasTattoo(e.target.checked)}
                className="w-4 h-4 rounded text-red-600 accent-red-600"
              />
              <span>বিগত ৬ মাসে কোনো ট্যাটু বা কান/নাক ফুটো করিয়েছেন?</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-800">
              <input
                type="checkbox"
                checked={hasSurgery}
                onChange={(e) => setHasSurgery(e.target.checked)}
                className="w-4 h-4 rounded text-red-600 accent-red-600"
              />
              <span>বিগত ৬ মাসে কোনো বড় সার্জারি বা রক্ত গ্রহণ করেছিলেন?</span>
            </label>
          </div>
        </div>

        {/* Live Score Display Card (5 cols) */}
        <div className="lg:col-span-5 bg-slate-50 rounded-2xl p-6 border border-slate-200 flex flex-col justify-between space-y-4">
          <div className="text-center">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-2">
              ফিটনেস রেটিং স্কোর
            </span>
            <div className="text-5xl font-black text-slate-900 tracking-tight">
              {toBengaliDigits(score)}
              <span className="text-xl text-slate-400 font-normal"> / ১০০</span>
            </div>

            <div className={`mt-3 inline-block px-3 py-1 rounded-full text-xs font-black ${badgeColor}`}>
              {grade}
            </div>
          </div>

          <div className="space-y-1.5 pt-3 border-t border-slate-200 text-[11px]">
            {deductions.length === 0 ? (
              <div className="p-3 bg-emerald-50 text-emerald-900 rounded-xl border border-emerald-200 flex items-center gap-2 font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>আপনার কোনো স্বাস্থ্যগত বাধা নেই। আপনি রক্তদানের জন্য শতভাগ প্রস্তুত!</span>
              </div>
            ) : (
              <div className="space-y-1">
                <span className="font-bold text-slate-700 block mb-1">উন্নতির পরামর্শ:</span>
                {deductions.map((d, i) => (
                  <div key={i} className="flex items-start gap-1.5 text-slate-600">
                    <span className="text-amber-500 font-bold">•</span>
                    <span>{d}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
