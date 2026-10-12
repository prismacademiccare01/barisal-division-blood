import React, { useState } from 'react';
import {
  Heart,
  MessageCircle,
  Sparkles,
  Send,
  CheckCircle2,
  Calendar,
  ThumbsUp,
  Share2,
} from 'lucide-react';
import { toBengaliDigits } from '../../utils/formatters.js';

interface GratitudeNote {
  id: number;
  recipientName: string;
  donorName: string;
  bloodGroup: string;
  hospital: string;
  message: string;
  date: string;
  likes: number;
}

export const DonorWallOfGratitude: React.FC = () => {
  const [notes, setNotes] = useState<GratitudeNote[]>([
    {
      id: 1,
      recipientName: 'সুমাইয়া আক্তার (প্রসূতি মা)',
      donorName: 'মো. তানভীর হাসান (রক্তদাতা)',
      bloodGroup: 'AB-',
      hospital: 'শেরেবাংলা মেডিকেল কলেজ হাসপাতাল, বরিশাল',
      message: 'আমার সিজারিয়ান অপারেশনের সময় মাঝরাতে যখন কোথাও AB- রক্ত পাচ্ছিলাম না, ভাইয়া নিজের কাজ ফেলে ছুটে এসে রক্ত দিয়ে আমার ও সন্তানের জীবন বাঁচিয়েছেন। আল্লাহ আপনার মঙ্গল করুন।',
      date: '২০২৬-০৩-২০',
      likes: 42,
    },
    {
      id: 2,
      recipientName: 'আরিয়ান (থ্যালাসেমিয়া শিশু)',
      donorName: 'ফারহান আহমেদ',
      bloodGroup: 'B+',
      hospital: 'পটুয়াখালী ২৫০ শয্যা হাসপাতাল',
      message: 'আমার সন্তান প্রতি মাসে নিয়মিত রক্ত পায় এই প্ল্যাটফর্মের ভাইদের কারণে। আপনাদের প্রতি কৃতজ্ঞতা ভাষায় প্রকাশ করার মতো নয়।',
      date: '২০২৬-০৩-১০',
      likes: 38,
    },
    {
      id: 3,
      recipientName: 'আজিজুল হক (সড়ক দুর্ঘটনা রোগী)',
      donorName: 'মো. রফিকুল ইসলাম',
      bloodGroup: 'O+',
      hospital: 'বরিশাল সদর হাসপাতাল',
      message: 'দুর্ঘটনার পর জরুরি ৩ ব্যাগ রক্তের প্রয়োজন ছিল। বরিশাল রক্ত অ্যাপের মাধ্যমে আধা ঘণ্টার মধ্যে রক্ত পেয়েছিলাম। আজ আমি সুস্থ হয়ে বাড়ি ফিরেছি।',
      date: '২০২৬-০২-২৮',
      likes: 29,
    },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newRecipient, setNewRecipient] = useState('');
  const [newDonor, setNewDonor] = useState('');
  const [newGroup, setNewGroup] = useState('O+');
  const [newHospital, setNewHospital] = useState('শেরেবাংলা মেডিকেল কলেজ হাসপাতাল');
  const [newMessage, setNewMessage] = useState('');

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRecipient || !newMessage) return;

    const note: GratitudeNote = {
      id: Date.now(),
      recipientName: newRecipient,
      donorName: newDonor || 'অজ্ঞাত জীবনরক্ষক',
      bloodGroup: newGroup,
      hospital: newHospital,
      message: newMessage,
      date: new Date().toISOString().split('T')[0],
      likes: 1,
    };

    setNotes([note, ...notes]);
    setShowAddModal(false);
    setNewRecipient('');
    setNewDonor('');
    setNewMessage('');
  };

  const handleLike = (id: number) => {
    setNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, likes: n.likes + 1 } : n))
    );
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-rose-600 font-bold text-xs uppercase tracking-wider mb-1">
            <Heart className="w-4 h-4 fill-rose-600" />
            <span>ফিচার ১৫: সুস্থ রোগীদের ধন্যবাদ ও প্রশংসাপত্র</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            রক্তদাতা প্রশংসাপত্র ও 'থ্যাঙ্ক ইউ' নোট বুক
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            যেসব রোগী রক্তদানে সুস্থ হয়ে ঘরে ফিরেছেন, তাদের আন্তরিক কৃতজ্ঞতা বার্তা
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-xs transition cursor-pointer self-start sm:self-auto"
        >
          <Heart className="w-3.5 h-3.5" />
          <span>কৃতজ্ঞতা বার্তা লিখুন</span>
        </button>
      </div>

      {/* Grid of Gratitude Notes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {notes.map((note) => (
          <div
            key={note.id}
            className="p-5 rounded-2xl border border-rose-100 bg-gradient-to-b from-rose-50/40 via-white to-white flex flex-col justify-between shadow-xs hover:border-rose-300 transition"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-lg bg-red-600 text-white font-black text-xs">
                  {note.bloodGroup}
                </span>
                <span className="text-[11px] text-slate-400 font-medium">
                  {note.date}
                </span>
              </div>

              <h4 className="font-extrabold text-sm text-slate-900 mb-0.5">
                {note.recipientName}
              </h4>

              <div className="text-xs text-rose-700 font-semibold mb-2">
                ধন্যবাদ প্রাপক: {note.donorName}
              </div>

              <p className="text-xs text-slate-600 leading-relaxed italic mb-3">
                "{note.message}"
              </p>

              <div className="text-[11px] text-slate-400">
                🏥 {note.hospital}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-rose-100 flex items-center justify-between">
              <button
                onClick={() => handleLike(note.id)}
                className="flex items-center gap-1 text-xs font-bold text-rose-600 hover:text-rose-700 cursor-pointer"
              >
                <ThumbsUp className="w-3.5 h-3.5" />
                <span>{toBengaliDigits(note.likes)} টি ভালোবাসা</span>
              </button>

              <span className="text-[11px] text-slate-400">ভেরিফাইড রোগী</span>
            </div>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-100 text-xs">
            <h3 className="font-black text-base text-slate-900 mb-1">
              রক্তদাতাকে ধন্যবাদ বার্তা পাঠান
            </h3>
            <p className="text-slate-500 mb-4">
              আপনার এক ব্যাগ রক্তের সহায়তাকারীর প্রতি ভালোবাসা ও দোয়া প্রকাশ করুন।
            </p>

            <form onSubmit={handleAddNote} className="space-y-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">আপনার নাম / রোগীর পরিচয়</label>
                <input
                  type="text"
                  value={newRecipient}
                  onChange={(e) => setNewRecipient(e.target.value)}
                  placeholder="যেমন: সুমাইয়া আক্তার (রোগীর ভাই)"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">রক্তদাতার নাম (জানা থাকলে)</label>
                <input
                  type="text"
                  value={newDonor}
                  onChange={(e) => setNewDonor(e.target.value)}
                  placeholder="যেমন: তানভীর হাসান"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">রক্তের গ্রুপ</label>
                  <input
                    type="text"
                    value={newGroup}
                    onChange={(e) => setNewGroup(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">হাসপাতাল</label>
                  <input
                    type="text"
                    value={newHospital}
                    onChange={(e) => setNewHospital(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">আপনার কৃতজ্ঞতা বার্তা</label>
                <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="কীভাবে রক্তদাতা আপনাকে বা আপনার রোগীকে সাহায্য করেছিলেন..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 h-24 resize-none"
                  required
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="w-1/2 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl shadow-xs"
                >
                  বার্তা প্রকাশ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
