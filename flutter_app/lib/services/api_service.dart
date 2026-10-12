import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/donor.dart';
import '../models/blood_request.dart';
import '../models/hospital.dart';

class ApiService {
  // Can be configured to the live server URL or localhost in emulator
  static String baseUrl = 'https://ais-dev-oex4j4yfoyzzu3hfyyorxu-945884087105.asia-southeast1.run.app';
  static String? authToken;

  static void setAuthToken(String token) {
    authToken = token;
  }

  static Map<String, String> get _headers {
    final headers = {'Content-Type': 'application/json'};
    if (authToken != null) {
      headers['Authorization'] = 'Bearer $authToken';
    }
    return headers;
  }

  // Fetch Donors with filters
  static Future<List<Donor>> getDonors({
    String bloodGroup = 'all',
    String district = 'all',
    String upazila = 'all',
    String search = '',
    bool onlyAvailable = false,
  }) async {
    try {
      final queryParameters = <String, String>{};
      if (bloodGroup != 'all') queryParameters['blood_group'] = bloodGroup;
      if (district != 'all') queryParameters['district'] = district;
      if (upazila != 'all') queryParameters['upazila'] = upazila;
      if (search.isNotEmpty) queryParameters['search'] = search;
      if (onlyAvailable) queryParameters['is_available'] = '1';

      final uri = Uri.parse('$baseUrl/api/v1/donors').replace(queryParameters: queryParameters);
      final response = await http.get(uri, headers: _headers);

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        if (data['success'] == true && data['data'] != null) {
          final List list = data['data']['donors'] ?? [];
          return list.map((item) => Donor.fromJson(item)).toList();
        }
      }
      return [];
    } catch (e) {
      return [];
    }
  }

  // Fetch Blood Requests
  static Future<List<BloodRequest>> getRequests() async {
    try {
      final response = await http.get(Uri.parse('$baseUrl/api/v1/requests'), headers: _headers);
      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        if (data['success'] == true && data['data'] != null) {
          final List list = data['data']['requests'] ?? [];
          return list.map((item) => BloodRequest.fromJson(item)).toList();
        }
      }
      return [];
    } catch (e) {
      return [];
    }
  }

  // Create Blood Request
  static Future<Map<String, dynamic>> createRequest(Map<String, dynamic> payload) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/api/v1/requests'),
        headers: _headers,
        body: json.encode(payload),
      );
      return json.decode(response.body);
    } catch (e) {
      return {'success': false, 'message': 'কানেকশন সমস্যা: $e'};
    }
  }

  // Fetch Hospitals
  static Future<List<Hospital>> getHospitals() async {
    try {
      final response = await http.get(Uri.parse('$baseUrl/api/v1/hospitals'), headers: _headers);
      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        if (data['success'] == true && data['data'] != null) {
          final List list = data['data']['hospitals'] ?? [];
          return list.map((item) => Hospital.fromJson(item)).toList();
        }
      }
      return [];
    } catch (e) {
      return [];
    }
  }

  // Admin Login
  static Future<Map<String, dynamic>> adminLogin(String username, String password) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/api/v1/auth/admin-login'),
        headers: _headers,
        body: json.encode({'username': username, 'password': password}),
      );
      final res = json.decode(response.body);
      if (res['success'] == true && res['data'] != null && res['data']['token'] != null) {
        setAuthToken(res['data']['token']);
      }
      return res;
    } catch (e) {
      return {'success': false, 'message': 'লগইন ব্যর্থ হয়েছে: $e'};
    }
  }

  // Admin Stats
  static Future<Map<String, dynamic>> getAdminStats() async {
    try {
      final response = await http.get(Uri.parse('$baseUrl/api/v1/admin/stats'), headers: _headers);
      return json.decode(response.body);
    } catch (e) {
      return {'success': false, 'message': '$e'};
    }
  }
}
