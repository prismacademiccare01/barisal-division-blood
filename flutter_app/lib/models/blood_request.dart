class BloodRequest {
  final int id;
  final String patientName;
  final String bloodGroup;
  final int unitsNeeded;
  final String hospitalName;
  final String district;
  final String upazila;
  final String? locationDetails;
  final String neededDate;
  final String neededTime;
  final String contactPhone;
  final String emergencyLevel;
  final String? caseInfo;
  final String status;
  final String createdAt;

  BloodRequest({
    required this.id,
    required this.patientName,
    required this.bloodGroup,
    required this.unitsNeeded,
    required this.hospitalName,
    required this.district,
    required this.upazila,
    this.locationDetails,
    required this.neededDate,
    required this.neededTime,
    required this.contactPhone,
    required this.emergencyLevel,
    this.caseInfo,
    required this.status,
    required this.createdAt,
  });

  factory BloodRequest.fromJson(Map<String, dynamic> json) {
    return BloodRequest(
      id: json['id'] ?? 0,
      patientName: json['patient_name'] ?? '',
      bloodGroup: json['blood_group'] ?? '',
      unitsNeeded: json['units_needed'] ?? 1,
      hospitalName: json['hospital_name'] ?? '',
      district: json['district'] ?? 'বরিশাল',
      upazila: json['upazila'] ?? '',
      locationDetails: json['location_details'],
      neededDate: json['needed_date'] ?? '',
      neededTime: json['needed_time'] ?? '',
      contactPhone: json['contact_phone'] ?? '',
      emergencyLevel: json['emergency_level'] ?? 'urgent',
      caseInfo: json['case_info'],
      status: json['status'] ?? 'active',
      createdAt: json['created_at'] ?? '',
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'patient_name': patientName,
      'blood_group': bloodGroup,
      'units_needed': unitsNeeded,
      'hospital_name': hospitalName,
      'district': district,
      'upazila': upazila,
      'location_details': locationDetails,
      'needed_date': neededDate,
      'needed_time': neededTime,
      'contact_phone': contactPhone,
      'emergency_level': emergencyLevel,
      'case_info': caseInfo,
      'status': status,
      'created_at': createdAt,
    };
  }
}
