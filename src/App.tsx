import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './hooks/useAuth.js';
import { ToastProvider, useToast } from './hooks/useToast.js';
import { HeaderNavbar } from './components/common/HeaderNavbar.js';
import { BottomNav } from './components/common/BottomNav.js';
import { OfflineIndicator } from './components/common/OfflineIndicator.js';
import { DonorFilter } from './components/donor/DonorFilter.js';
import { DonorCard } from './components/donor/DonorCard.js';
import { DonorProfileModal } from './components/donor/DonorProfileModal.js';
import { CreateRequestModal } from './components/request/CreateRequestModal.js';
import { RequestDetailModal } from './components/request/RequestDetailModal.js';
import { HospitalDirectory } from './components/hospital/HospitalDirectory.js';
import { UserPortal } from './components/portal/UserPortal.js';
import { LandingPage } from './components/landing/LandingPage.js';
import { EmergencyCenter } from './components/request/EmergencyCenter.js';
import { LearnView } from './components/learn/LearnView.js';
import { FAQView } from './components/faq/FAQView.js';
import { CommunityFeed } from './components/social/CommunityFeed.js';
import { MessengerModal } from './components/social/MessengerModal.js';
import { AdminDashboard } from './components/admin/AdminDashboard.js';
import { AdminAccessModal } from './components/admin/AdminAccessModal.js';
import { AuthModal } from './components/auth/AuthModal.js';
import { ReportModal } from './components/common/ReportModal.js';
import { DeveloperModal } from './components/common/DeveloperModal.js';
import { EmergencyShareModal } from './components/premium/EmergencyShareModal.js';
import { DonorCertificateModal } from './components/premium/DonorCertificateModal.js';
import { HospitalLiveStockBoard } from './components/premium/HospitalLiveStockBoard.js';
import { QuickEmergencySOSBar } from './components/premium/QuickEmergencySOSBar.js';
import { RoktoShohayokAI } from './components/premium/RoktoShohayokAI.js';
import { BloodRequisitionSlipModal } from './components/premium/BloodRequisitionSlipModal.js';
import { FlutterHubModal } from './components/flutter/FlutterHubModal.js';
import { api } from './services/api.js';
import { Donor, BloodRequest } from './types/index.js';
import { Droplet, Building2, Activity, Bot, X } from 'lucide-react';

function MainContent() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<string>('landing');
  const [hospitalSubTab, setHospitalSubTab] = useState<'directory' | 'stocks'>('directory');

  // Modal states
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showMessengerModal, setShowMessengerModal] = useState(false);
  const [showAdminAccessModal, setShowAdminAccessModal] = useState(false);

  // Auto transition to Community Feed when user logs in
  const prevUserRef = React.useRef(user);
  useEffect(() => {
    if (!prevUserRef.current && user) {
      setActiveTab('feed');
    }
    prevUserRef.current = user;
  }, [user]);
  const [showDeveloperModal, setShowDeveloperModal] = useState(false);
  const [showFlutterHubModal, setShowFlutterHubModal] = useState(false);
  const [showCreateRequestModal, setShowCreateRequestModal] = useState(false);
  const [showAiAssistantModal, setShowAiAssistantModal] = useState(false);
  const [showRequisitionModal, setShowRequisitionModal] = useState(false);
  const [selectedDonorProfile, setSelectedDonorProfile] = useState<Donor | null>(null);
  const [selectedDonorCertificate, setSelectedDonorCertificate] = useState<Donor | null>(null);
  const [selectedRequestDetail, setSelectedRequestDetail] = useState<BloodRequest | null>(null);
  const [shareModalRequest, setShareModalRequest] = useState<BloodRequest | null>(null);
  const [reportModalData, setReportModalData] = useState<{
    targetType: 'donor' | 'request' | 'hospital';
    targetId: number;
    targetName: string;
  } | null>(null);

  // Hidden admin easter-egg click counter
  const [secretAdminClicks, setSecretAdminClicks] = useState(0);

  // Search tab filters & data
  const [selectedBloodGroup, setSelectedBloodGroup] = useState<string>('all');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('all');
  const [selectedUpazila, setSelectedUpazila] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [onlyAvailable, setOnlyAvailable] = useState<boolean>(true);
  const [onlyVerified, setOnlyVerified] = useState<boolean>(false);

  // Donors & requests list
  const [donors, setDonors] = useState<Donor[]>([]);
  const [donorLoading, setDonorLoading] = useState(false);
  const [requests, setRequests] = useState<BloodRequest[]>([]);
  const [requestLoading, setRequestLoading] = useState(false);

  // Platform Emergency Alert Banner
  const [emergencyBannerActive, setEmergencyBannerActive] = useState(false);
  const [emergencyBannerText, setEmergencyBannerText] = useState('');

  // Fetch Donors
  const fetchDonors = async () => {
    setDonorLoading(true);
    try {
      const res = await api.searchDonors({
        blood_group: selectedBloodGroup,
        district: selectedDistrict,
        upazila: selectedUpazila,
        search: searchTerm,
        is_available: onlyAvailable ? 1 : '',
        is_verified: onlyVerified ? 1 : '',
      });
      if (res.success && res.data) {
        setDonors(res.data.donors);
      }
    } catch {}
    setDonorLoading(false);
  };

  // Fetch Blood Requests
  const fetchRequests = async () => {
    setRequestLoading(true);
    try {
      const res = await api.getRequests();
      if (res.success && res.data) {
        setRequests(res.data.requests);
      }
    } catch {}
    setRequestLoading(false);
  };

  useEffect(() => {
    fetchDonors();
  }, [selectedBloodGroup, selectedDistrict, selectedUpazila, onlyAvailable, onlyVerified]);

  useEffect(() => {
    fetchRequests();
    api.getSystemConfig()
      .then((res) => {
        if (res.success && res.data) {
          setEmergencyBannerActive(res.data.emergency_broadcast_active);
          setEmergencyBannerText(res.data.emergency_broadcast_message || 'বরিশাল বিভাগে রক্তের জরুরি চাহিদা চলছে!');
        }
      })
      .catch(() => {});
  }, []);

  // Hidden admin entrance (URL hash #admin-secure-gate, secret param ?access=admin, or key shortcut Ctrl+Shift+A)
  useEffect(() => {
    const checkAdminTrigger = () => {
      if (
        window.location.hash === '#admin-secure-gate' ||
        window.location.hash === '#admin' ||
        window.location.search.includes('access=admin') ||
        window.location.search.includes('admin=gate')
      ) {
        setShowAdminAccessModal(true);
      }
    };
    checkAdminTrigger();
    window.addEventListener('hashchange', checkAdminTrigger);

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        setShowAdminAccessModal(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('hashchange', checkAdminTrigger);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Search by blood group, district, and upazila from Hero
  const handleHeroSearchBloodGroup = (bg: string, district?: string, upazila?: string) => {
    setSelectedBloodGroup(bg);
    if (district && district !== 'all') {
      setSelectedDistrict(district);
    }
    if (upazila && upazila !== 'all') {
      setSelectedUpazila(upazila);
    }
    setActiveTab('search');
  };

  // Call Donor click handler
  const handleCallDonor = (donor: Donor) => {
    if (!user) {
      showToast('রক্তদাতার নম্বরে যোগাযোগের জন্য অনুগ্রহ করে লগইন করুন।', 'info', 'লগইন প্রয়োজন');
      setShowAuthModal(true);
    } else if (donor.phone) {
      showToast(`${donor.name}-এর ফোন নম্বরে ডায়াল করা হচ্ছে...`, 'success', 'যোগাযোগ');
      window.location.href = `tel:${donor.phone}`;
    }
  };

  // Report click handler
  const handleReportDonor = (donor: Donor) => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    setReportModalData({
      targetType: 'donor',
      targetId: donor.id,
      targetName: `${donor.name} (${donor.blood_group})`,
    });
  };

  // Discrete admin trigger on copyright clicks
  const handleCopyrightClick = () => {
    const next = secretAdminClicks + 1;
    setSecretAdminClicks(next);
    if (next >= 5) {
      setSecretAdminClicks(0);
      setShowAdminAccessModal(true);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* Top Header Navbar (Section 1: Home, রক্ত খুঁজুন, জরুরি রক্ত, হাসপাতাল ও ব্লাড ব্যাংক, রক্ত সম্পর্কে জানুন, FAQ, Login) */}
      <HeaderNavbar
        onOpenAuth={() => setShowAuthModal(true)}
        onOpenCreateRequest={() => setShowCreateRequestModal(true)}
        onOpenDeveloperModal={() => setShowDeveloperModal(true)}
        onOpenAiAssistant={() => setShowAiAssistantModal(true)}
        onOpenFlutterHub={() => setShowFlutterHubModal(true)}
        onOpenRequisitionModal={() => setShowRequisitionModal(true)}
        onOpenMessenger={() => setShowMessengerModal(true)}
        onTriggerAdminPortal={() => {
          if (user?.role === 'admin' || user?.role === 'super_admin') {
            setActiveTab('admin');
          } else {
            setShowAdminAccessModal(true);
          }
        }}
        onTabChange={(tab) => setActiveTab(tab)}
        activeTab={activeTab}
      />

      {/* Site-Wide Crimson Emergency Alert Banner (Controlled by Admin Central Command) */}
      {emergencyBannerActive && (
        <div className="bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white px-4 py-2.5 shadow-md flex items-center justify-between gap-3 text-xs sm:text-sm font-extrabold animate-pulse">
          <div className="max-w-6xl mx-auto w-full flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping shrink-0" />
              <span>🚨 জরুরি বিভাগীয় রেড অ্যালার্ট: {emergencyBannerText}</span>
            </div>
            <button
              onClick={() => setActiveTab('search')}
              className="self-start sm:self-auto px-3 py-1 bg-white text-red-600 rounded-lg text-xs font-black shadow-xs hover:bg-red-50 cursor-pointer shrink-0"
            >
              রক্তদাতাগণ এগিয়ে আসুন →
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 pt-5 pb-20 sm:pb-12">
        {/* 1. Home / Landing Page */}
        {activeTab === 'landing' && (
          <LandingPage
            onSearchBloodGroup={handleHeroSearchBloodGroup}
            onOpenCreateRequest={() => setShowCreateRequestModal(true)}
            onNavigateTab={(tab) => setActiveTab(tab)}
            onOpenAuth={() => setShowAuthModal(true)}
            onOpenDeveloperModal={() => setShowDeveloperModal(true)}
            onOpenFlutterHub={() => setShowFlutterHubModal(true)}
            recentRequests={requests}
            featuredDonors={donors}
            onViewRequestDetails={(r) => setSelectedRequestDetail(r)}
            onViewCertificate={(d) => setSelectedDonorCertificate(d)}
            isLoggedIn={!!user}
          />
        )}

        {/* 2. রক্ত খুঁজুন (Find Blood) */}
        {activeTab === 'search' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-1">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900">
                  বরিশাল বিভাগের রক্তদাতা অনুসন্ধান
                </h2>
                <p className="text-xs text-slate-500">
                  District → Upazila → Area ক্রমানুসারে যাচাইকৃত ও প্রস্তুত রক্তদাতাদের তালিকা
                </p>
              </div>
              <span className="text-xs font-semibold text-slate-500">
                পাওয়া গেছে: {donors.length} জন
              </span>
            </div>

            <DonorFilter
              selectedBloodGroup={selectedBloodGroup}
              onSelectBloodGroup={setSelectedBloodGroup}
              selectedDistrict={selectedDistrict}
              onSelectDistrict={setSelectedDistrict}
              selectedUpazila={selectedUpazila}
              onSelectUpazila={setSelectedUpazila}
              searchTerm={searchTerm}
              onSearchTermChange={setSearchTerm}
              onlyAvailable={onlyAvailable}
              onToggleOnlyAvailable={() => setOnlyAvailable(!onlyAvailable)}
              onlyVerified={onlyVerified}
              onToggleOnlyVerified={() => setOnlyVerified(!onlyVerified)}
            />

            {donorLoading ? (
              <div className="py-16 text-center text-slate-400 text-sm">
                রক্তদাতা তালিকা লোড হচ্ছে...
              </div>
            ) : donors.length === 0 ? (
              <div className="bg-white rounded-3xl p-10 text-center text-slate-500 border border-slate-200">
                <Droplet className="w-12 h-12 text-red-200 mx-auto mb-3" />
                <h4 className="font-bold text-slate-800 text-base mb-1">
                  এই ফিল্টারে কোনো রক্তদাতা পাওয়া যায়নি
                </h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
                  ফিল্টার পরিবর্তন করুন অথবা 'সকল গ্রুপ' বা অন্য জেলা নির্বাচন করে পুনরায় চেষ্টা করুন।
                </p>
                <button
                  onClick={() => {
                    setSelectedBloodGroup('all');
                    setSelectedDistrict('all');
                    setSelectedUpazila('all');
                    setSearchTerm('');
                    setOnlyAvailable(false);
                  }}
                  className="px-4 py-2 bg-red-600 text-white rounded-xl text-xs font-bold cursor-pointer"
                >
                  সব ফিল্টার রিসেট করুন
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {donors.map((d) => (
                  <DonorCard
                    key={d.id}
                    donor={d}
                    onCallClick={handleCallDonor}
                    onReportClick={handleReportDonor}
                    onViewProfile={(d) => setSelectedDonorProfile(d)}
                    onViewCertificate={(d) => setSelectedDonorCertificate(d)}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* 3. জরুরি রক্ত (Ultimate Emergency Center) */}
        {activeTab === 'requests' && (
          <EmergencyCenter
            requests={requests}
            donors={donors}
            requestLoading={requestLoading}
            onOpenCreateRequest={() => setShowCreateRequestModal(true)}
            onRespondClick={(r) => setSelectedRequestDetail(r)}
            onViewRequestDetails={(r) => setSelectedRequestDetail(r)}
            onShareClick={(r) => setShareModalRequest(r)}
            onCallDonor={handleCallDonor}
            onViewDonorProfile={(d) => setSelectedDonorProfile(d)}
            onFindBloodForRequest={(bg) => {
              setSelectedBloodGroup(bg);
              setActiveTab('search');
            }}
            isLoggedIn={!!user}
          />
        )}

        {/* 4. কমিউনিটি ফিড (Premium Social System & Feed) */}
        {activeTab === 'feed' && (
          <CommunityFeed
            onNavigateEmergency={() => setActiveTab('requests')}
            onOpenCreateRequest={() => setShowCreateRequestModal(true)}
            donors={donors}
            requests={requests}
            onCallDonor={handleCallDonor}
            onViewDonorProfile={(d) => setSelectedDonorProfile(d)}
          />
        )}

        {/* 5. হাসপাতাল ও ব্লাড ব্যাংক (Hospitals & Stocks) */}
        {activeTab === 'hospitals' && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
              <button
                onClick={() => setHospitalSubTab('directory')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  hospitalSubTab === 'directory'
                    ? 'bg-red-600 text-white shadow-xs'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <Building2 className="w-4 h-4" />
                <span>হাসপাতাল ডিরেক্টরি</span>
              </button>

              <button
                onClick={() => setHospitalSubTab('stocks')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  hospitalSubTab === 'stocks'
                    ? 'bg-red-600 text-white shadow-xs'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <Activity className="w-4 h-4 text-rose-500" />
                <span>ব্লাড ব্যাংক মজুত ও স্টক</span>
              </button>
            </div>

            {hospitalSubTab === 'directory' ? (
              <HospitalDirectory />
            ) : (
              <HospitalLiveStockBoard
                onDonateClick={(group) => {
                  setSelectedBloodGroup(group);
                  setActiveTab('search');
                }}
              />
            )}
          </div>
        )}

        {/* 5. রক্ত সম্পর্কে জানুন (Learn) */}
        {activeTab === 'learn' && <LearnView />}

        {/* 6. FAQ (সচরাচর জিজ্ঞাসিত প্রশ্ন) */}
        {activeTab === 'faq' && <FAQView />}

        {/* 7. ইউজার পোর্টাল (Premium User Dashboard) */}
        {(activeTab === 'portal' || activeTab === 'profile') && (
          <UserPortal
            onOpenAuth={() => setShowAuthModal(true)}
            onOpenCreateRequest={() => setShowCreateRequestModal(true)}
            onOpenDeveloperModal={() => setShowDeveloperModal(true)}
            onNavigateToAdmin={() => setActiveTab('admin')}
            requests={requests}
            onViewRequestDetails={(r) => setSelectedRequestDetail(r)}
          />
        )}

        {/* 8. Hidden Protected Admin Dashboard */}
        {activeTab === 'admin' && (
          <AdminDashboard onExitAdmin={() => setActiveTab('landing')} />
        )}
      </main>

      {/* Footer (Section 36: Admin Portal completely hidden from public website!) */}
      <footer className="bg-white border-t border-slate-200/80 py-8 px-4 text-xs text-slate-500 mb-16 sm:mb-0">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-bold text-slate-800 text-sm">
            <Droplet className="w-5 h-5 text-red-600 fill-red-600" />
            <span>বরিশাল রক্ত · barishal-Blood</span>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-slate-500 text-xs text-center">
            <span>বরিশাল বিভাগীয় জরুরি রক্ত ও জীবনরক্ষা নেটওয়ার্ক</span>
            <span className="hidden sm:inline">·</span>
            <button
              onClick={() => setShowDeveloperModal(true)}
              className="font-medium text-slate-700 hover:text-red-600 transition flex items-center gap-1 group cursor-pointer"
            >
              <span>চিফ ইঞ্জিনিয়ার:</span>
              <span className="font-extrabold text-slate-900 group-hover:text-red-600 underline decoration-red-400 underline-offset-2">
                MD. SAIDUL ISLAM
              </span>
            </button>
          </div>

          {/* Clean Copyright without any visible admin link */}
          <div
            onClick={handleCopyrightClick}
            className="text-slate-400 text-[11px] text-center sm:text-right select-none cursor-default"
            title="বরিশাল রক্ত"
          >
            © ২০২৬ বরিশাল রক্ত · সর্বস্বত্ব সংরক্ষিত
          </div>
        </div>
      </footer>

      {/* Quick Emergency Floating SOS Trigger Bar */}
      <QuickEmergencySOSBar
        onOpenCreateRequest={() => setShowCreateRequestModal(true)}
        onOpenRadar={() => {
          setActiveTab('requests');
          window.scrollTo({ top: 300, behavior: 'smooth' });
        }}
      />

      {/* Mobile Bottom Navigation Bar */}
      <BottomNav
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab)}
        onOpenAuth={() => setShowAuthModal(true)}
      />

      {/* Offline Status Toast Indicator */}
      <OfflineIndicator />

      {/* Modals */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />

      <CreateRequestModal
        isOpen={showCreateRequestModal}
        onClose={() => setShowCreateRequestModal(false)}
        onCreated={() => {
          fetchRequests();
          setActiveTab('requests');
        }}
      />

      <DonorProfileModal
        donor={selectedDonorProfile}
        onClose={() => setSelectedDonorProfile(null)}
        onOpenAuth={() => setShowAuthModal(true)}
      />

      <RequestDetailModal
        request={selectedRequestDetail}
        onClose={() => setSelectedRequestDetail(null)}
        onRefresh={() => fetchRequests()}
        onOpenAuth={() => setShowAuthModal(true)}
      />

      <EmergencyShareModal
        request={shareModalRequest}
        onClose={() => setShareModalRequest(null)}
      />

      {reportModalData && (
        <ReportModal
          isOpen={true}
          onClose={() => setReportModalData(null)}
          targetType={reportModalData.targetType}
          targetId={reportModalData.targetId}
          targetName={reportModalData.targetName}
        />
      )}

      {/* Developer Recognition Modal */}
      <DeveloperModal
        isOpen={showDeveloperModal}
        onClose={() => setShowDeveloperModal(false)}
      />

      {/* Protected Admin Access Modal (Accessible only via protected URL or secure trigger) */}
      <AdminAccessModal
        isOpen={showAdminAccessModal}
        onClose={() => setShowAdminAccessModal(false)}
        onAccessGranted={() => setActiveTab('admin')}
        onOpenAuth={() => setShowAuthModal(true)}
      />

      {/* Official Donor Certificate of Honor Modal */}
      {selectedDonorCertificate && (
        <DonorCertificateModal
          isOpen={true}
          onClose={() => setSelectedDonorCertificate(null)}
          donor={selectedDonorCertificate}
          user={user}
        />
      )}

      {/* Hospital Blood Requisition Slip Modal */}
      <BloodRequisitionSlipModal
        isOpen={showRequisitionModal}
        onClose={() => setShowRequisitionModal(false)}
        initialRequest={selectedRequestDetail || requests[0] || null}
      />

      {/* Premium Messenger & Emergency Chat Modal */}
      {showMessengerModal && (
        <MessengerModal onClose={() => setShowMessengerModal(false)} />
      )}

      {/* Official Flutter Mobile App & APK Simulator Hub */}
      <FlutterHubModal
        isOpen={showFlutterHubModal}
        onClose={() => setShowFlutterHubModal(false)}
        onNavigateEmergency={() => {
          setShowFlutterHubModal(false);
          setActiveTab('requests');
        }}
        onNavigateDonors={() => {
          setShowFlutterHubModal(false);
          setActiveTab('search');
        }}
      />

      {/* Floating 24/7 Rokto Shohayok AI Launcher */}
      <div className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-40">
        <button
          onClick={() => setShowAiAssistantModal(true)}
          className="group flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white shadow-xl shadow-red-600/40 hover:shadow-red-600/60 active:scale-95 transition cursor-pointer border border-white/20"
          title="রক্ত সহায়ক এআই-এর সাথে কথা বলুন"
        >
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center shrink-0">
            <Bot className="w-5 h-5 text-white animate-pulse" />
          </div>
          <span className="font-extrabold text-xs tracking-tight hidden sm:inline">
            রক্ত সহায়ক এআই
          </span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping hidden sm:inline" />
        </button>
      </div>

      {/* 24/7 Rokto Shohayok AI Assistant Modal */}
      {showAiAssistantModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="max-w-2xl w-full relative">
            <button
              onClick={() => setShowAiAssistantModal(false)}
              className="absolute -top-10 right-0 text-white hover:text-slate-200 text-xs font-bold flex items-center gap-1 cursor-pointer bg-slate-900/50 px-3 py-1 rounded-full border border-white/20"
            >
              <X className="w-4 h-4" />
              <span>বন্ধ করুন</span>
            </button>
            <RoktoShohayokAI />
          </div>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <MainContent />
      </ToastProvider>
    </AuthProvider>
  );
}
