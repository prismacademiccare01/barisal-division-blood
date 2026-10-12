class Hospital {
  final int id;
  final String name;
  final String district;
  final String upazila;
  final String? address;
  final String? phone;
  final String? emergencyContact;
  final int hasBloodBank;
  final Map<String, int>? bloodStock;

  Hospital({
    required this.id,
    required this.name,
    required this.district,
    required this.upazila,
    this.address,
    this.phone,
    this.emergencyContact,
    required this.hasBloodBank,
    this.bloodStock,
  });

  factory Hospital.fromJson(Map<String, dynamic> json) {
    Map<String, int> stocks = {};
    if (json['blood_stocks'] != null && json['blood_stocks'] is Map) {
      json['blood_stocks'].forEach((k, v) {
        stocks[k.toString()] = int.tryParse(v.toString()) ?? 0;
      });
    }

    return Hospital(
      id: json['id'] ?? 0,
      name: json['name'] ?? '',
      district: json['district'] ?? 'বরিশাল',
      upazila: json['upazila'] ?? '',
      address: json['address'],
      phone: json['phone'],
      emergencyContact: json['emergency_contact'],
      hasBloodBank: json['has_blood_bank'] ?? 1,
      bloodStock: stocks.isNotEmpty ? stocks : null,
    );
  }
}
