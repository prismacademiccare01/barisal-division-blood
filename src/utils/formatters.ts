export function toBengaliDigits(num: number | string | null | undefined): string {
  if (num === null || num === undefined) return '';
  const str = String(num);
  const bengaliDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return str.replace(/[0-9]/g, (w) => bengaliDigits[+w]);
}

export function formatDateBengali(dateStr: string | null | undefined): string {
  if (!dateStr) return 'তথ্য নেই';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;

    const months = [
      'জানুয়ারি',
      'ফেব্রুয়ারি',
      'মার্চ',
      'এপ্রিল',
      'মে',
      'জুন',
      'জুলাই',
      'আগস্ট',
      'সেপ্টেম্বর',
      'অক্টোবর',
      'নভেম্বর',
      'ডিসেম্বর',
    ];

    const day = toBengaliDigits(d.getDate());
    const month = months[d.getMonth()];
    const year = toBengaliDigits(d.getFullYear());

    return `${day} ${month}, ${year}`;
  } catch {
    return dateStr;
  }
}

export function getDaysSinceLastDonation(lastDateStr: string | null | undefined): {
  days: number;
  eligible: boolean;
  message: string;
} {
  if (!lastDateStr) {
    return { days: 999, eligible: true, message: 'রক্তদানের জন্য প্রস্তুত' };
  }

  const lastDate = new Date(lastDateStr);
  if (isNaN(lastDate.getTime())) {
    return { days: 999, eligible: true, message: 'রক্তদানের জন্য প্রস্তুত' };
  }

  const now = new Date();
  const diffTime = Math.abs(now.getTime() - lastDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  // Eligible if 90 days (3 months) passed
  const eligible = diffDays >= 90;
  if (eligible) {
    return {
      days: diffDays,
      eligible: true,
      message: `${toBengaliDigits(diffDays)} দিন পূর্বে রক্ত দিয়েছেন (রক্তদানে প্রস্তুত)`,
    };
  } else {
    const remainingDays = 90 - diffDays;
    return {
      days: diffDays,
      eligible: false,
      message: `আরও ${toBengaliDigits(remainingDays)} দিন পর রক্ত দিতে পারবেন`,
    };
  }
}
