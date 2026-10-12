class Donor {
  final int id;
  final String name;
  final String phone;
  final String bloodGroup;
  final String district;
  final String upazila;
  final String? area;
  final int isAvailable;
  final int isVerified;
  final int totalDonations;
  final String? lastDonationDate;

  Donor({
    required this.id,
    required this.name,
    required this.phone,
    required this.bloodGroup,
    required this.district,
    required this.upazila,
    this.area,
    required this.isAvailable,
    required this.isVerified,
    required this.totalDonations,
    this.lastDonationDate,
  });

  factory Donor.fromJson(Map<String, dynamic> json) {
    return Donor(
      id: json['id'] ?? 0,
      name: json['name'] ?? '',
      phone: json['phone'] ?? '',
      bloodGroup: json['blood_group'] ?? '',
      district: json['district'] ?? 'বরিশাল',
      upazila: json['upazila'] ?? '',
      area: json['area'],
      isAvailable: json['is_available'] ?? 1,
      isVerified: json['is_verified'] ?? 0,
      totalDonations: json['total_donations'] ?? 0,
      lastDonationDate: json['last_donation_date'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'phone': phone,
      'blood_group': bloodGroup,
      'district': district,
      'upazila': upazila,
      'area': area,
      'is_available': isAvailable,
      'is_verified': isVerified,
      'total_donations': totalDonations,
      'last_donation_date': lastDonationDate,
    };
  }
}
