import 'package:flutter/material.dart';
import '../services/api_service.dart';

class AdminScreen extends StatefulWidget {
  const AdminScreen({super.key});

  @override
  State<AdminScreen> createState() => _AdminScreenState();
}

class _AdminScreenState extends State<AdminScreen> {
  bool _isLoggedIn = false;
  bool _loading = false;
  String _username = 'superadmin';
  String _password = '';
  String _errorMessage = '';
  Map<String, dynamic>? _stats;

  Future<void> _handleLogin() async {
    if (_username.isEmpty || _password.isEmpty) {
      setState(() => _errorMessage = 'ইউজারনেম ও পাসওয়ার্ড লিখুন');
      return;
    }

    setState(() {
      _loading = true;
      _errorMessage = '';
    });

    final res = await ApiService.adminLogin(_username.trim(), _password);
    setState(() => _loading = false);

    if (res['success'] == true) {
      setState(() => _isLoggedIn = true);
      _fetchStats();
    } else {
      setState(() => _errorMessage = res['message'] ?? 'ভুল তথ্য দেওয়া হয়েছে');
    }
  }

  Future<void> _fetchStats() async {
    final stats = await ApiService.getAdminStats();
    if (mounted && stats['success'] == true) {
      setState(() => _stats = stats['data']);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF0F172A),
      appBar: AppBar(
        backgroundColor: const Color(0xFF0F172A),
        foregroundColor: Colors.white,
        title: const Text('অ্যাডমিন কমান্ড পোর্টাল', style: TextStyle(fontWeight: FontWeight.bold)),
      ),
      body: _isLoggedIn ? _buildDashboard() : _buildLoginForm(),
    );
  }

  Widget _buildLoginForm() {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(24),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          const SizedBox(height: 30),
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: const Color(0xFFDC2626).withOpacity(0.2),
              shape: BoxShape.circle,
              border: Border.all(color: const Color(0xFFDC2626), width: 2),
            ),
            child: const Icon(Icons.security, size: 48, color: Color(0xFFDC2626)),
          ),
          const SizedBox(height: 16),
          const Text(
            'সুরক্ষিত অ্যাডমিন প্রবেশদ্বার',
            style: TextStyle(color: Colors.white, fontSize: 20, fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 6),
          const Text(
            'barishal-Blood সেন্ট্রাল অ্যাডমিন সিস্টেমে লগইন করুন',
            style: TextStyle(color: Colors.grey, fontSize: 12),
          ),
          const SizedBox(height: 30),

          if (_errorMessage.isNotEmpty)
            Container(
              padding: const EdgeInsets.all(12),
              margin: const EdgeInsets.only(bottom: 16),
              decoration: BoxDecoration(
                color: Colors.red.shade900.withOpacity(0.4),
                borderRadius: BorderRadius.circular(10),
                border: Border.all(color: Colors.red),
              ),
              child: Text(
                _errorMessage,
                style: const TextStyle(color: Colors.white, fontSize: 13),
              ),
            ),

          TextFormField(
            initialValue: _username,
            style: const TextStyle(color: Colors.white),
            decoration: InputDecoration(
              labelText: 'অ্যাডমিন ইউজারনেম',
              labelStyle: const TextStyle(color: Colors.grey),
              prefixIcon: const Icon(Icons.person, color: Colors.grey),
              filled: true,
              fillColor: const Color(0xFF1E293B),
              border: OutlineInputBorder(borderRadius: BorderRadius.circular(14)),
            ),
            onChanged: (val) => _username = val,
          ),
          const SizedBox(height: 14),
          TextFormField(
            obscureText: true,
            style: const TextStyle(color: Colors.white),
            decoration: InputDecoration(
              labelText: 'পাসওয়ার্ড',
              labelStyle: const TextStyle(color: Colors.grey),
              prefixIcon: const Icon(Icons.lock, color: Colors.grey),
              filled: true,
              fillColor: const Color(0xFF1E293B),
              border: OutlineInputBorder(borderRadius: BorderRadius.circular(14)),
            ),
            onChanged: (val) => _password = val,
          ),
          const SizedBox(height: 24),
          SizedBox(
            width: double.infinity,
            height: 50,
            child: ElevatedButton(
              onPressed: _loading ? null : _handleLogin,
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFFDC2626),
                foregroundColor: Colors.white,
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
              ),
              child: _loading
                  ? const CircularProgressIndicator(color: Colors.white)
                  : const Text('লগইন করুন', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildDashboard() {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: const Color(0xFF1E293B),
              borderRadius: BorderRadius.circular(18),
              border: Border.all(color: Colors.red.shade900),
            ),
            child: Row(
              children: [
                const Icon(Icons.verified_user, color: Colors.greenAccent, size: 28),
                const SizedBox(width: 12),
                const Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'সুপার অ্যাডমিন অ্যাক্টিভ',
                        style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 15),
                      ),
                      Text(
                        'সম্পূর্ণ বরিশাল বিভাগের ডাটাবেস ও কঠোর অ্যাকশন মোড সক্রিয়',
                        style: TextStyle(color: Colors.grey, fontSize: 11),
                      ),
                    ],
                  ),
                ),
                TextButton(
                  onPressed: () => setState(() => _isLoggedIn = false),
                  child: const Text('লগআউট', style: TextStyle(color: Colors.redAccent)),
                ),
              ],
            ),
          ),
          const SizedBox(height: 20),
          const Text(
            'সিস্টেম সংক্ষিপ্ত তথ্য',
            style: TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 12),
          GridView.count(
            crossAxisCount: 2,
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            crossAxisSpacing: 10,
            mainAxisSpacing: 10,
            childAspectRatio: 1.4,
            children: [
              _buildStatCard('মোট রক্তদাতা', '${_stats?['summary']?['totalDonors'] ?? '--'} জন', Icons.people, Colors.blue),
              _buildStatCard('জরুরি রক্তের আবেদন', '${_stats?['summary']?['emergencyRequests'] ?? '--'} টি', Icons.emergency, Colors.red),
              _buildStatCard('হাসপাতাল', '${_stats?['summary']?['totalHospitals'] ?? '--'} টি', Icons.local_hospital, Colors.green),
              _buildStatCard('পেন্ডিং রিপোর্ট', '${_stats?['summary']?['pendingReports'] ?? '--'} টি', Icons.warning, Colors.amber),
            ],
          ),
          const SizedBox(height: 20),
          const Text(
            'কঠোর অ্যাকশন ও কন্ট্রোল',
            style: TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 10),
          _buildActionButton('🚨 সাইট-ওয়াইড রেড অ্যালার্ট টগল', Colors.red, () {
            ScaffoldMessenger.of(context).showSnackBar(
              const SnackBar(content: Text('সাইট-ওয়াইড রেড অ্যালার্ট সক্রিয় করা হয়েছে')),
            );
          }),
          const SizedBox(height: 8),
          _buildActionButton('📥 সম্পূর্ণ ডাটাবেস ব্যাকআপ রিকোয়েস্ট', Colors.indigo, () {
            ScaffoldMessenger.of(context).showSnackBar(
              const SnackBar(content: Text('ডাটাবেস ব্যাকআপ সফলভাবে প্রক্রিয়াকরণ করা হয়েছে')),
            );
          }),
        ],
      ),
    );
  }

  Widget _buildStatCard(String title, String value, IconData icon, Color color) {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: const Color(0xFF1E293B),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Colors.white.withOpacity(0.05)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Icon(icon, color: color, size: 24),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(value, style: const TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold)),
              Text(title, style: TextStyle(color: Colors.grey.shade400, fontSize: 11)),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildActionButton(String label, Color color, VoidCallback onTap) {
    return SizedBox(
      width: double.infinity,
      child: ElevatedButton(
        onPressed: onTap,
        style: ElevatedButton.styleFrom(
          backgroundColor: color,
          foregroundColor: Colors.white,
          padding: const EdgeInsets.symmetric(vertical: 14),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
        ),
        child: Text(label, style: const TextStyle(fontWeight: FontWeight.bold)),
      ),
    );
  }
}
