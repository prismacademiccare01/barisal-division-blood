import 'package:flutter/material.dart';
import '../services/api_service.dart';

class CreateRequestScreen extends StatefulWidget {
  const CreateRequestScreen({super.key});

  @override
  State<CreateRequestScreen> createState() => _CreateRequestScreenState();
}

class _CreateRequestScreenState extends State<CreateRequestScreen> {
  final _formKey = GlobalKey<FormState>();

  String _patientName = '';
  String _bloodGroup = 'O+';
  int _units = 1;
  String _hospitalName = 'শেরেবাংলা মেডিকেল কলেজ হাসপাতাল, বরিশাল';
  String _district = 'বরিশাল';
  String _upazila = 'বরিশাল সদর';
  String _phone = '';
  String _emergencyLevel = 'critical';
  String _caseInfo = '';
  bool _loading = false;

  final List<String> _districts = [
    'বরিশাল', 'পটুয়াখালী', 'ভোলা', 'পিরোজপুর', 'বরগুনা', 'ঝালকাঠি'
  ];

  final List<String> _bloodGroups = [
    'A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'
  ];

  Future<void> _submit() async {
    if (!_formKey.currentState!.validate()) return;
    _formKey.currentState!.save();

    setState(() => _loading = true);

    final payload = {
      'patient_name': _patientName,
      'blood_group': _bloodGroup,
      'units_needed': _units,
      'hospital_name': _hospitalName,
      'district': _district,
      'upazila': _upazila,
      'needed_date': DateTime.now().toIso8601String().split('T')[0],
      'needed_time': 'জরুরি',
      'contact_phone': _phone,
      'emergency_level': _emergencyLevel,
      'case_info': _caseInfo,
    };

    final res = await ApiService.createRequest(payload);
    setState(() => _loading = false);

    if (mounted) {
      if (res['success'] == true) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('রক্তের আবেদন সফলভাবে পোস্ট করা হয়েছে!'),
            backgroundColor: Colors.green,
          ),
        );
        Navigator.pop(context, true);
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(res['message'] ?? 'আবেদন ব্যর্থ হয়েছে'),
            backgroundColor: Colors.red,
          ),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('রক্তের জরুরি আবেদন তৈরি করুন'),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              TextFormField(
                decoration: const InputDecoration(
                  labelText: 'রোগীর পূর্ণ নাম *',
                  border: OutlineInputBorder(),
                ),
                validator: (val) => val == null || val.isEmpty ? 'নাম লিখুন' : null,
                onSaved: (val) => _patientName = val ?? '',
              ),
              const SizedBox(height: 14),
              Row(
                children: [
                  Expanded(
                    child: DropdownButtonFormField<String>(
                      value: _bloodGroup,
                      decoration: const InputDecoration(
                        labelText: 'রক্তের গ্রুপ *',
                        border: OutlineInputBorder(),
                      ),
                      items: _bloodGroups.map((bg) => DropdownMenuItem(value: bg, child: Text(bg))).toList(),
                      onChanged: (val) => setState(() => _bloodGroup = val ?? 'O+'),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: TextFormField(
                      initialValue: '1',
                      keyboardType: TextInputType.number,
                      decoration: const InputDecoration(
                        labelText: 'কত ব্যাগ রক্ত? *',
                        border: OutlineInputBorder(),
                      ),
                      validator: (val) => val == null || val.isEmpty ? 'ব্যাগ লিখুন' : null,
                      onSaved: (val) => _units = int.tryParse(val ?? '1') ?? 1,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 14),
              TextFormField(
                initialValue: _hospitalName,
                decoration: const InputDecoration(
                  labelText: 'হাসপাতালের নাম *',
                  border: OutlineInputBorder(),
                ),
                validator: (val) => val == null || val.isEmpty ? 'হাসপাতাল লিখুন' : null,
                onSaved: (val) => _hospitalName = val ?? '',
              ),
              const SizedBox(height: 14),
              Row(
                children: [
                  Expanded(
                    child: DropdownButtonFormField<String>(
                      value: _district,
                      decoration: const InputDecoration(
                        labelText: 'জেলা *',
                        border: OutlineInputBorder(),
                      ),
                      items: _districts.map((d) => DropdownMenuItem(value: d, child: Text(d))).toList(),
                      onChanged: (val) => setState(() => _district = val ?? 'বরিশাল'),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: TextFormField(
                      initialValue: _upazila,
                      decoration: const InputDecoration(
                        labelText: 'উপজেলা *',
                        border: OutlineInputBorder(),
                      ),
                      onSaved: (val) => _upazila = val ?? '',
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 14),
              TextFormField(
                keyboardType: TextInputType.phone,
                decoration: const InputDecoration(
                  labelText: 'যোগাযোগের মোবাইল নম্বর *',
                  hintText: '01XXXXXXXXX',
                  border: OutlineInputBorder(),
                ),
                validator: (val) => val == null || val.length < 10 ? 'সঠিক ফোন নম্বর দিন' : null,
                onSaved: (val) => _phone = val ?? '',
              ),
              const SizedBox(height: 14),
              TextFormField(
                decoration: const InputDecoration(
                  labelText: 'রোগের কারণ বা জরুরি বিবরণ (ঐচ্ছিক)',
                  hintText: 'যেমন: ডেঙ্গু প্লাটিলেট, সিজারিয়ান অপারেশন, থ্যালাসেমিয়া',
                  border: OutlineInputBorder(),
                ),
                onSaved: (val) => _caseInfo = val ?? '',
              ),
              const SizedBox(height: 24),
              SizedBox(
                width: double.infinity,
                height: 50,
                child: ElevatedButton(
                  onPressed: _loading ? null : _submit,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFFDC2626),
                    foregroundColor: Colors.white,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                  ),
                  child: _loading
                      ? const CircularProgressIndicator(color: Colors.white)
                      : const Text('পোস্ট করুন', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
