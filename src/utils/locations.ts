export interface DistrictData {
  name: string;
  enName: string;
  upazilas: string[];
}

export const BARISHAL_DIVISION_DISTRICTS: DistrictData[] = [
  {
    name: 'বরিশাল',
    enName: 'Barishal',
    upazilas: [
      'বরিশাল সদর',
      'বাবুগঞ্জ',
      'উজিরপুর',
      'বানারীপাড়া',
      'বাকেরগঞ্জ',
      'মেহেন্দিগঞ্জ',
      'মুলাদী',
      'হিজলা',
      'গৌরনদী',
      'আগৈলঝাড়া',
    ],
  },
  {
    name: 'পটুয়াখালী',
    enName: 'Patuakhali',
    upazilas: [
      'পটুয়াখালী সদর',
      'বাউফল',
      'দশমিনা',
      'গলাচিপা',
      'কলাপাড়া',
      'মির্জাগঞ্জ',
      'দুমকি',
      'রাঙ্গাবালী',
    ],
  },
  {
    name: 'ভোলা',
    enName: 'Bhola',
    upazilas: [
      'ভোলা সদর',
      'দৌলতখান',
      'বোরহানউদ্দিন',
      'তজুমদ্দিন',
      'মনপুরা',
      'লালমোহন',
      'চরফ্যাশন',
    ],
  },
  {
    name: 'পিরোজপুর',
    enName: 'Pirojpur',
    upazilas: [
      'পিরোজপুর সদর',
      'ভাণ্ডারিয়া',
      'মঠবাড়িয়া',
      'ইন্দুরকানী (জিয়ানগর)',
      'কাউখালী',
      'নাজিরপুর',
      'নেছারাবাদ (স্বরূপকাঠি)',
    ],
  },
  {
    name: 'বরগুনা',
    enName: 'Barguna',
    upazilas: [
      'বরগুনা সদর',
      'আমতলী',
      'তালতলী',
      'বেতাগী',
      'পাথরঘাটা',
      'বামনা',
    ],
  },
  {
    name: 'ঝালকাঠি',
    enName: 'Jhalokati',
    upazilas: [
      'ঝালকাঠি সদর',
      'নলছিটি',
      'রাজাপুর',
      'কাঁঠালিয়া',
    ],
  },
];

export const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] as const;

export function getUpazilasForDistrict(districtName: string): string[] {
  const d = BARISHAL_DIVISION_DISTRICTS.find((item) => item.name === districtName);
  return d ? d.upazilas : [];
}
