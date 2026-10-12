import React, { useState } from 'react';
import {
  HeartPulse,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ShieldCheck,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

export const EligibilityCalculator: React.FC = () => {
  const [age, setAge] = useState<number | ''>(25);
  const [weight, setWeight] = useState<number | ''>(62);
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [daysSinceDonation, setDaysSinceDonation] = useState<number | ''>(120);
  const [hasFeverOrAntibiotic, setHasFeverOrAntibiotic] = useState(false);
  const [hasSurgeryOrTattoo, setHasSurgeryOrTattoo] = useState(false);
  const [isPregnantOrLactating, setIsPregnantOrLactating] = useState(false);

  // Result calculation
  const numAge = Number(age) || 0;
  const numWeight = Number(weight) || 0;
  const numDays = daysSinceDonation === '' ? 999 : Number(daysSinceDonation);

  const isAgeValid = numAge >= 18 && numAge <= 65;
  const isWeightValid = gender === 'female' ? numWeight >= 45 : numWeight >= 50;
  const isIntervalValid = numDays >= 90;
  const isHealthConditionValid =
    !hasFeverOrAntibiotic && !hasSurgeryOrTattoo && !isPregnantOrLactating;

  const isFullyEligible =
    isAgeValid && isWeightValid && isIntervalValid && isHealthConditionValid;

  const reasonsToWait: string[] = [];
  if (!isAgeValid) reasonsToWait.push('বয়স ১৮ থেকে ৬৫ বছরের মধ্যে হতে হবে।');
  if (!isWeightValid)
    reasonsToWait.push(
      gender === 'female'
        ? 'নারীদের ক্ষেত্রে ন্যূনতম ওজন ৪৫ কেজি আবশ্যক।'
        : 'পুরুষদের ক্ষেত্রে ন্যূনতম ওজন ৫০ কেজি আবশ্যক।'
    );
  if (!isIntervalValid)
    reasonsToWait.push(
      `পূর্ববর্তী রক্তদানের পর অন্তত ৯০ দিন অতিবাহিত হতে হবে (বাকি আছে ${90 - numDays} দিন)।`
    );
  if (hasFeverOrAntibiotic)
    reasonsToWait.push('জ্বর বা অ্যান্টিবায়োটিক সেবন শেষ হওয়ার পর অন্তত ৭ দিন অপেক্ষা করতে হবে।');
  if (hasSurgeryOrTattoo)
    reasonsToWait.push('বড় সার্জারি বা ট্যাটু করানোর পর ৬ মাস রক্তদান স্থগিত রাখা বাঞ্ছনীয়।');
  if (isPregnantOrLactating)
    reasonsToWait.push('গর্ভবতী ও স্তন্যদানকারী মায়েদের রক্তদান থেকে বিরত থাকতে হবে।');

  const handleReset = () => {
    setAge(25);
    setWeight(62);
    setGender('male');
    setDaysSinceDonation(120);
    setHasFeverOrAntibiotic(false);
    setHasSurgeryOrTattoo(false);
    setIsPregnantOrLactating(false);
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 flex items-center gap-2">
            <HeartPulse className="w-5 h-5 text-red-600" />
            রক্তদান যোগ্যতা ও স্বাস্থ্য পরীক্ষক (Medical Eligibility)
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            বিশ্ব স্বাস্থ্য সংস্থা (WHO) ও স্বাস্থ্য অধিদপ্তরের মানদণ্ড অনুযায়ী আপনার রক্তদানের যোগ্যতা যাচাই করুন
          </p>
        </div>

        <button
          onClick={handleReset}
          className="self-start sm:self-auto flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800 font-semibold"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>রিসেট</span>
        </button>
      </div>

      {/* Input Questions Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
        {/* Gender */}
        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
          <label className="block font-bold text-slate-700 mb-1.5">লিঙ্গ (Gender)</label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setGender('male')}
              className={`py-2 rounded-xl font-bold transition ${
                gender === 'male'
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'bg-white text-slate-700 border border-slate-200'
              }`}
            >
              পুরুষ
            </button>
            <button
              type="button"
              onClick={() => setGender('female')}
              className={`py-2 rounded-xl font-bold transition ${
                gender === 'female'
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'bg-white text-slate-700 border border-slate-200'
              }`}
            >
              মহিলা
            </button>
          </div>
        </div>

        {/* Age */}
        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
          <label className="block font-bold text-slate-700 mb-1.5">বয়স (বছর)</label>
          <input
            type="number"
            min="15"
            max="80"
            value={age}
            onChange={(e) => setAge(e.target.value === '' ? '' : Number(e.target.value))}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm font-bold bg-white"
          />
        </div>

        {/* Weight */}
        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
          <label className="block font-bold text-slate-700 mb-1.5">ওজন (কেজি)</label>
          <input
            type="number"
            min="30"
            max="150"
            value={weight}
            onChange={(e) => setWeight(e.target.value === '' ? '' : Number(e.target.value))}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm font-bold bg-white"
          />
        </div>
      </div>

      {/* Secondary Questions */}
      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-3 text-xs">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-slate-700">
            সর্বশেষ কবে রক্ত দিয়েছেন? (দিন হিসেবে লিখুন):
          </span>
          <input
            type="number"
            min="0"
            max="999"
            value={daysSinceDonation}
            onChange={(e) =>
              setDaysSinceDonation(e.target.value === '' ? '' : Number(e.target.value))
            }
            placeholder="দিন..."
            className="w-28 px-3 py-1.5 rounded-xl border border-slate-200 text-sm font-bold bg-white text-right"
          />
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-slate-200/60">
          <span className="font-semibold text-slate-700">
            গত ৭ দিনে জ্বর, সর্দি বা কোনো অ্যান্টিবায়োটিক নিয়েছেন কি?
          </span>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={hasFeverOrAntibiotic}
              onChange={(e) => setHasFeverOrAntibiotic(e.target.checked)}
              className="w-4 h-4 text-red-600 rounded-sm accent-red-600"
            />
            <span className="font-bold">{hasFeverOrAntibiotic ? 'হ্যাঁ' : 'না'}</span>
          </label>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-slate-200/60">
          <span className="font-semibold text-slate-700">
            গত ৬ মাসে বড় কোনো অপারেশন বা ট্যাটু করিয়েছেন কি?
          </span>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={hasSurgeryOrTattoo}
              onChange={(e) => setHasSurgeryOrTattoo(e.target.checked)}
              className="w-4 h-4 text-red-600 rounded-sm accent-red-600"
            />
            <span className="font-bold">{hasSurgeryOrTattoo ? 'হ্যাঁ' : 'না'}</span>
          </label>
        </div>

        {gender === 'female' && (
          <div className="flex items-center justify-between pt-2 border-t border-slate-200/60">
            <span className="font-semibold text-slate-700">
              আপনি কি বর্তমানে গর্ভবতী অথবা স্তন্যদানকারী মা?
            </span>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isPregnantOrLactating}
                onChange={(e) => setIsPregnantOrLactating(e.target.checked)}
                className="w-4 h-4 text-red-600 rounded-sm accent-red-600"
              />
              <span className="font-bold">{isPregnantOrLactating ? 'হ্যাঁ' : 'না'}</span>
            </label>
          </div>
        )}
      </div>

      {/* Result Card */}
      <div
        className={`p-5 rounded-2xl border transition-all ${
          isFullyEligible
            ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
            : 'bg-amber-50 border-amber-200 text-amber-900'
        }`}
      >
        <div className="flex items-center gap-3">
          {isFullyEligible ? (
            <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-md">
              <CheckCircle2 className="w-7 h-7" />
            </div>
          ) : (
            <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-md">
              <AlertCircle className="w-7 h-7" />
            </div>
          )}

          <div>
            <h4 className="text-base sm:text-lg font-black">
              {isFullyEligible
                ? 'অভিনন্দন! আপনি রক্তদানে সম্পূর্ণ প্রস্তুত ও যোগ্য 🎉'
                : 'আপাতত রক্তদান স্থগিত রাখা প্রয়োজন'}
            </h4>
            <p className="text-xs opacity-90 mt-0.5">
              {isFullyEligible
                ? 'আপনার স্বাস্থ্য রক্তদানের জন্য সম্পূর্ণ অনুকূল। এক ব্যাগ রক্ত দিয়ে একটি জীবন বাঁচান।'
                : 'নিরাপদ স্বাস্থ্য সুরক্ষায় নিচের শর্তগুলো পূরণ হওয়া পর্যন্ত অপেক্ষা করুন:'}
            </p>
          </div>
        </div>

        {!isFullyEligible && (
          <ul className="mt-4 space-y-1.5 text-xs text-amber-800 list-disc list-inside bg-white/60 p-3.5 rounded-xl border border-amber-200/80">
            {reasonsToWait.map((r, i) => (
              <li key={i} className="font-medium">
                {r}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};
