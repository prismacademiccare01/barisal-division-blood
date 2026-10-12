import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';
import '../models/donor.dart';
import '../services/api_service.dart';

class DonorListScreen extends StatefulWidget {
  final String? initialBloodGroup;
  final String? initialDistrict;

  const DonorListScreen({
    super.key,
    this.initialBloodGroup,
    this.initialDistrict,
  });

  @override
  State<DonorListScreen> createState() => _DonorListScreenState();
}

class _DonorListScreenState extends State<DonorListScreen> {
  List<Donor> _donors = [];
  bool _loading = true;
  String _selectedBloodGroup = 'all';
  String _selectedDistrict = 'all';
  String _search = '';

  final List<String> _districts = [
    'all',
    'বরিশাল',
    'পটুয়াখালী',
    'ভোলা',
    'পিরোজপুর',
    'বরগুনা',
    'ঝালকাঠি',
  ];

  final List<String> _bloodGroups = [
    'all',
    'A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'
  ];

  @override
  void initState() {
    super.initState();
    if (widget.initialBloodGroup != null) {
      _selectedBloodGroup = widget.initialBloodGroup!;
    }
    if (widget.initialDistrict != null) {
      _selectedDistrict = widget.initialDistrict!;
    }
    _fetchDonors();
  }

  Future<void> _fetchDonors() async {
    setState(() => _loading = true);
    final donors = await ApiService.getDonors(
      bloodGroup: _selectedBloodGroup,
      district: _selectedDistrict,
      search: _search,
    );
    if (mounted) {
      setState(() {
        _donors = donors;
        _loading = false;
      });
    }
  }

  void _callPhone(String phone) async {
    final uri = Uri.parse('tel:$phone');
    if (await canLaunchUrl(uri)) {
      await launchUrl(uri);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('রক্তদাতা খুঁজুন', style: TextStyle(fontWeight: FontWeight.bold)),
      ),
      body: Column(
        children: [
          // Filter Bar
          Container(
            padding: const EdgeInsets.all(12),
            color: Colors.grey.shade50,
            child: Column(
              children: [
                TextField(
                  onChanged: (val) {
                    _search = val;
                    _fetchDonors();
                  },
                  decoration: InputDecoration(
                    hintText: 'নাম, উপজেলা বা এলাকা দিয়ে খুঁজুন...',
                    prefixIcon: const Icon(Icons.search, size: 20),
                    filled: true,
                    fillColor: Colors.white,
                    contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(12),
                      borderSide: BorderSide(color: Colors.grey.shade300),
                    ),
                    enabledBorder: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(12),
                      borderSide: BorderSide(color: Colors.grey.shade300),
                    ),
                  ),
                ),
                const SizedBox(height: 10),
                Row(
                  children: [
                    Expanded(
                      child: DropdownButtonFormField<String>(
                        value: _selectedBloodGroup,
                        decoration: InputDecoration(
                          contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                          filled: true,
                          fillColor: Colors.white,
                          border: OutlineInputBorder(borderRadius: BorderRadius.circular(10)),
                        ),
                        items: _bloodGroups.map((bg) {
                          return DropdownMenuItem(
                            value: bg,
                            child: Text(bg == 'all' ? 'সকল গ্রুপ' : bg, style: const TextStyle(fontSize: 13)),
                          );
                        }).toList(),
                        onChanged: (val) {
                          if (val != null) {
                            setState(() => _selectedBloodGroup = val);
                            _fetchDonors();
                          }
                        },
                      ),
                    ),
                    const SizedBox(width: 8),
                    Expanded(
                      child: DropdownButtonFormField<String>(
                        value: _selectedDistrict,
                        decoration: InputDecoration(
                          contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                          filled: true,
                          fillColor: Colors.white,
                          border: OutlineInputBorder(borderRadius: BorderRadius.circular(10)),
                        ),
                        items: _districts.map((dist) {
                          return DropdownMenuItem(
                            value: dist,
                            child: Text(dist == 'all' ? 'সকল জেলা' : dist, style: const TextStyle(fontSize: 13)),
                          );
                        }).toList(),
                        onChanged: (val) {
                          if (val != null) {
                            setState(() => _selectedDistrict = val);
                            _fetchDonors();
                          }
                        },
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),

          // Count Bar
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  'মোট রক্তদাতা: ${_donors.length} জন',
                  style: TextStyle(fontSize: 12, color: Colors.grey.shade700, fontWeight: FontWeight.bold),
                ),
                if (_selectedBloodGroup != 'all' || _selectedDistrict != 'all')
                  GestureDetector(
                    onTap: () {
                      setState(() {
                        _selectedBloodGroup = 'all';
                        _selectedDistrict = 'all';
                        _search = '';
                      });
                      _fetchDonors();
                    },
                    child: const Text('রিসেট', style: TextStyle(fontSize: 12, color: Color(0xFFDC2626))),
                  ),
              ],
            ),
          ),

          // List
          Expanded(
            child: _loading
                ? const Center(child: CircularProgressIndicator())
                : _donors.isEmpty
                    ? Center(
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Icon(Icons.person_off, size: 48, color: Colors.grey.shade400),
                            const SizedBox(height: 8),
                            const Text('কোনো রক্তদাতা পাওয়া যায়নি'),
                          ],
                        ),
                      )
                    : ListView.builder(
                        padding: const EdgeInsets.all(12),
                        itemCount: _donors.length,
                        itemBuilder: (context, index) {
                          final donor = _donors[index];
                          return Card(
                            margin: const EdgeInsets.only(bottom: 10),
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                            child: Padding(
                              padding: const EdgeInsets.all(14),
                              child: Row(
                                children: [
                                  Container(
                                    width: 48,
                                    height: 48,
                                    decoration: BoxDecoration(
                                      color: const Color(0xFFDC2626),
                                      borderRadius: BorderRadius.circular(14),
                                    ),
                                    child: Center(
                                      child: Text(
                                        donor.bloodGroup,
                                        style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 16),
                                      ),
                                    ),
                                  ),
                                  const SizedBox(width: 14),
                                  Expanded(
                                    child: Column(
                                      crossAxisAlignment: CrossAxisAlignment.start,
                                      children: [
                                        Row(
                                          children: [
                                            Text(
                                              donor.name,
                                              style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15),
                                            ),
                                            if (donor.isVerified == 1) ...[
                                              const SizedBox(width: 4),
                                              const Icon(Icons.verified, size: 16, color: Colors.blue),
                                            ],
                                          ],
                                        ),
                                        const SizedBox(height: 3),
                                        Text(
                                          '${donor.upazila}, ${donor.district}',
                                          style: TextStyle(fontSize: 12, color: Colors.grey.shade600),
                                        ),
                                        const SizedBox(height: 3),
                                        Row(
                                          children: [
                                            Container(
                                              padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                                              decoration: BoxDecoration(
                                                color: donor.isAvailable == 1 ? Colors.green.shade50 : Colors.red.shade50,
                                                borderRadius: BorderRadius.circular(6),
                                              ),
                                              child: Text(
                                                donor.isAvailable == 1 ? 'রক্তদানে প্রস্তুত' : 'সাময়িক অনুপলব্ধ',
                                                style: TextStyle(
                                                  fontSize: 10,
                                                  fontWeight: FontWeight.bold,
                                                  color: donor.isAvailable == 1 ? Colors.green.shade800 : Colors.red.shade800,
                                                ),
                                              ),
                                            ),
                                            const SizedBox(width: 6),
                                            Text(
                                              '• ${donor.totalDonations} বার রক্তদান',
                                              style: TextStyle(fontSize: 11, color: Colors.grey.shade600),
                                            ),
                                          ],
                                        ),
                                      ],
                                    ),
                                  ),
                                  IconButton.filled(
                                    onPressed: () => _callPhone(donor.phone),
                                    icon: const Icon(Icons.phone),
                                    style: IconButton.styleFrom(
                                      backgroundColor: Colors.green.shade600,
                                      foregroundColor: Colors.white,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          );
                        },
                      ),
          ),
        ],
      ),
    );
  }
}
