import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'screens/home_screen.dart';
import 'screens/donor_list_screen.dart';
import 'screens/emergency_request_screen.dart';
import 'screens/hospital_screen.dart';
import 'screens/admin_screen.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(const BarishalBloodApp());
}

class BarishalBloodApp extends StatelessWidget {
  const BarishalBloodApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'barishal-Blood (বরিশাল রক্ত)',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        useMaterial3: true,
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFFDC2626), // Crimson Red
          primary: const Color(0xFFDC2626),
          secondary: const Color(0xFF991B1B),
          surface: Colors.white,
        ),
        textTheme: GoogleFonts.hindSiliguriTextTheme(
          Theme.of(context).textTheme,
        ),
        appBarTheme: const AppBarTheme(
          backgroundColor: Colors.white,
          foregroundColor: Color(0xFF0F172A),
          elevation: 0.5,
          centerTitle: false,
        ),
      ),
      initialRoute: '/',
      routes: {
        '/': (context) => const MainNavigationScreen(),
        '/donors': (context) => const DonorListScreen(),
        '/emergency': (context) => const EmergencyRequestScreen(),
        '/hospitals': (context) => const HospitalScreen(),
        '/admin': (context) => const AdminScreen(),
      },
    );
  }
}

class MainNavigationScreen extends StatefulWidget {
  const MainNavigationScreen({super.key});

  @override
  State<MainNavigationScreen> createState() => _MainNavigationScreenState();
}

class _MainNavigationScreenState extends State<MainNavigationScreen> {
  int _currentIndex = 0;

  final List<Widget> _screens = const [
    HomeScreen(),
    DonorListScreen(),
    EmergencyRequestScreen(),
    HospitalScreen(),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: IndexedStack(
        index: _currentIndex,
        children: _screens,
      ),
      bottomNavigationBar: NavigationBar(
        selectedIndex: _currentIndex,
        onDestinationSelected: (index) {
          setState(() {
            _currentIndex = index;
          });
        },
        destinations: const [
          NavigationDestination(
            icon: Icon(Icons.home_outlined),
            selectedIcon: Icon(Icons.home, color: Color(0xFFDC2626)),
            label: 'হোম',
          ),
          NavigationDestination(
            icon: Icon(Icons.search_outlined),
            selectedIcon: Icon(Icons.search, color: Color(0xFFDC2626)),
            label: 'রক্ত খুঁজুন',
          ),
          NavigationDestination(
            icon: Icon(Icons.emergency_outlined),
            selectedIcon: Icon(Icons.emergency, color: Color(0xFFDC2626)),
            label: 'জরুরি রক্ত',
          ),
          NavigationDestination(
            icon: Icon(Icons.local_hospital_outlined),
            selectedIcon: Icon(Icons.local_hospital, color: Color(0xFFDC2626)),
            label: 'হাসপাতাল',
          ),
        ],
      ),
    );
  }
}
