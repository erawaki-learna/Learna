import { useEffect, useState } from 'react';
import { useAuth } from './contexts/AuthContext';
import Layout from './components/Layout';
import AuthPage from './pages/AuthPage';
import AdminDashboard from './pages/AdminDashboard';
import SalesDashboard from './pages/SalesDashboard';
import MyRequests from './pages/MyRequests';
import NewRequest from './pages/NewRequest';
import RequestDetail from './pages/RequestDetail';
import PendingReview from './pages/PendingReview';
import AllRequests from './pages/AllRequests';
import IncomingRequests from './pages/IncomingRequests';
import LearningCalendar from './pages/LearningCalendar';
import DeliveryTracker from './pages/DeliveryTracker';
import TransferMonitor from './pages/TransferMonitor';
import ImpactReports from './pages/ImpactReports';
import MyLearningJourney from './pages/MyLearningJourney';
import RequestProgramme from './pages/RequestProgramme';
import LearnaDNA from './pages/LearnaDNA';
import D1Home from './pages/D1Home';
import AIAdvisor from './pages/AIAdvisor';
import OutcomeBuilder from './pages/OutcomeBuilder';
import D1Package from './pages/D1Package';
import { D1Provider } from './contexts/D1Context';

function AppContent() {
  const { user, profile, loading, signOut } = useAuth();
  const [currentPage, setCurrentPage] = useState(window.location.pathname);
  const [d1Mode, setD1Mode] = useState<string | null>(null);

  const handleNavigate = (page: string) => {
    if (page === 'home') {
      setD1Mode(null);
      setCurrentPage('/');
      window.history.pushState({}, '', '/');
    } else if (['ai-advisor', 'dna', 'outcomes', 'package'].includes(page) || page.startsWith('d1-')) {
      setD1Mode(page);
      setCurrentPage(`/d1/${page}`);
      window.history.pushState({}, '', `/d1/${page}`);
    } else {
      setD1Mode(null);
      setCurrentPage(`/${page}`);
      window.history.pushState({}, '', `/${page}`);
    }
  };

  const handleSidebarNavigate = (path: string) => {
    const pathMap: Record<string, string> = {
      '/admin': '/',
      '/dashboard': '/',
      '/pending': '/incoming-requests',
      '/requests': '/requests',
      '/calendar': '/calendar',
      '/d2': '/delivery-tracker',
      '/d3': '/delivery-tracker',
      '/d4': '/transfer-monitor',
      '/d5': '/impact-reports',
      '/dna': '/learna-dna',
      '/new-request': '/request-programme',
      '/ai-advisor': '/d1/ai-advisor',
      '/my-requests': '/my-learning-journey',
      '/d1': '/d1/home',
    };
    const resolved = pathMap[path] || path;
    if (resolved.startsWith('/d1/')) {
      setD1Mode(resolved.replace('/d1/', ''));
    } else {
      setD1Mode(null);
    }
    setCurrentPage(resolved);
    window.history.pushState({}, '', resolved);
  };

  useEffect(() => {
    const path = window.location.pathname;
    if (path.startsWith('/d1/')) {
      setD1Mode(path.replace('/d1/', ''));
    }
    setCurrentPage(path);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#F7F5F0' }}>
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 rounded-full animate-spin" style={{ borderColor: 'rgba(10,22,40,0.2)', borderTopColor: '#0A1628' }} />
          <div style={{ color: 'rgba(10,22,40,0.6)' }}>Loading your account...</div>
        </div>
      </div>
    );
  }

  if (!user || !profile) {
    return <AuthPage />;
  }

  const isAdmin = profile.role === 'admin';
  const userName = profile.full_name || user.email || 'User';

  const resolvePageContent = () => {
    const path = currentPage;

    if (d1Mode === 'ai-advisor' || path === '/d1/ai-advisor') return <AIAdvisor onNavigate={handleNavigate} />;
    if (d1Mode === 'dna' || path === '/d1/dna') return <LearnaDNA onNavigate={handleNavigate} />;
    if (d1Mode === 'outcomes' || path === '/d1/outcomes') return <OutcomeBuilder onNavigate={handleNavigate} />;
    if (d1Mode === 'package' || path === '/d1/package') return <D1Package onNavigate={handleNavigate} />;
    if (d1Mode === 'home' || path === '/d1/home' || path === '/d1') return <D1Home onNavigate={handleNavigate} />;

    if (path === '/calendar') return <LearningCalendar />;
    if (path === '/learna-dna' || path === '/dna') return <LearnaDNA onNavigate={handleNavigate} />;
    if (path.startsWith('/request/')) return <RequestDetail />;

    if (path === '/' || path === '/dashboard' || path === '/admin') return isAdmin ? <AdminDashboard /> : <SalesDashboard />;
    if (path === '/incoming-requests' || path === '/pending') return isAdmin ? <IncomingRequests /> : <SalesDashboard />;
    if (path === '/requests') return isAdmin ? <AllRequests /> : <SalesDashboard />;
    if (path === '/delivery-tracker' || path === '/d2' || path === '/d3') return isAdmin ? <DeliveryTracker /> : <SalesDashboard />;
    if (path === '/transfer-monitor' || path === '/d4') return isAdmin ? <TransferMonitor /> : <SalesDashboard />;
    if (path === '/impact-reports' || path === '/d5') return isAdmin ? <ImpactReports /> : <SalesDashboard />;

    if (path === '/sales-dashboard') return <SalesDashboard />;
    if (path === '/my-learning-journey' || path === '/my-requests') return <MyLearningJourney />;
    if (path === '/request-programme' || path === '/new-request') return <RequestProgramme />;

    return isAdmin ? <AdminDashboard /> : <SalesDashboard />;
  };

  return (
    <Layout
      currentPage={currentPage}
      userRole={isAdmin ? 'admin' : 'requestor'}
      userName={userName}
      onNavigate={handleSidebarNavigate}
      onSignOut={signOut}
    >
      {resolvePageContent()}
    </Layout>
  );
}

function App() {
  return (
    <D1Provider>
      <AppContent />
    </D1Provider>
  );
}

export default App;
