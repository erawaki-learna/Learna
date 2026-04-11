import { useEffect, useState } from 'react';
import { useAuth } from './contexts/AuthContext';
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
  const { user, profile, loading } = useAuth();
  const [d1Mode, setD1Mode] = useState<string | null>(null);

  const handleNavigate = (page: string) => {
    if (page === 'home') {
      setD1Mode(null);
      window.history.pushState({}, '', '/');
    } else if (['ai-advisor', 'dna', 'outcomes', 'package'].includes(page) || page.startsWith('d1-')) {
      setD1Mode(page);
      window.history.pushState({}, '', `/d1/${page}`);
    } else {
      setD1Mode(page);
      window.history.pushState({}, '', `/d1/${page}`);
    }
  };

  useEffect(() => {
    const path = window.location.pathname;
    if (path.startsWith('/d1/')) {
      setD1Mode(path.replace('/d1/', ''));
    } else {
      setD1Mode(null);
    }
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-3 border-navy/20 border-t-navy rounded-full animate-spin" />
          <div className="text-navy/60">Loading your account...</div>
        </div>
      </div>
    );
  }

  if (!user || !profile) {
    return <AuthPage />;
  }

  const path = window.location.pathname;

  if (d1Mode === 'ai-advisor' || path === '/d1/ai-advisor') return <AIAdvisor onNavigate={handleNavigate} />;
  if (d1Mode === 'dna' || path === '/d1/dna') return <LearnaDNA onNavigate={handleNavigate} />;
  if (d1Mode === 'outcomes' || path === '/d1/outcomes') return <OutcomeBuilder onNavigate={handleNavigate} />;
  if (d1Mode === 'package' || path === '/d1/package') return <D1Package onNavigate={handleNavigate} />;
  if (d1Mode === 'home' || path === '/d1/home' || path === '/d1') return <D1Home onNavigate={handleNavigate} />;

  if (path === '/' || path === '/dashboard') return profile.role === 'admin' ? <AdminDashboard /> : <SalesDashboard />;
  if (path === '/incoming-requests' || path === '/pending') return profile.role === 'admin' ? <IncomingRequests /> : <SalesDashboard />;
  if (path === '/requests') return profile.role === 'admin' ? <AllRequests /> : <SalesDashboard />;
  if (path === '/delivery-tracker' || path === '/d2' || path === '/d3') return profile.role === 'admin' ? <DeliveryTracker /> : <SalesDashboard />;
  if (path === '/transfer-monitor' || path === '/d4') return profile.role === 'admin' ? <TransferMonitor /> : <SalesDashboard />;
  if (path === '/impact-reports' || path === '/d5') return profile.role === 'admin' ? <ImpactReports /> : <SalesDashboard />;
  if (path === '/calendar') return <LearningCalendar />;
  if (path === '/learna-dna' || path === '/dna') return <LearnaDNA onNavigate={handleNavigate} />;
  if (path === '/sales-dashboard') return <SalesDashboard />;
  if (path === '/my-learning-journey' || path === '/my-requests') return <MyLearningJourney />;
  if (path === '/request-programme' || path === '/new-request') return <RequestProgramme />;
  if (path.startsWith('/request/')) return <RequestDetail />;
  if (path === '/auth') return <AuthPage />;

  return profile.role === 'admin' ? <AdminDashboard /> : <SalesDashboard />;
}

function App() {
  return (
    <D1Provider>
      <AppContent />
    </D1Provider>
  );
}

export default App;
