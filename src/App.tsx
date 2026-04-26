import { useEffect, useState } from 'react';
import { useAuth } from './contexts/AuthContext';
import { D1Provider } from './contexts/D1Context';
import Layout from './components/Layout';

import AuthPage from './pages/AuthPage';
import OnboardingFlow from './pages/OnboardingFlow';

import AdminDashboard from './pages/AdminDashboard';
import SalesDashboard from './pages/SalesDashboard';
import IncomingRequests from './pages/IncomingRequests';
import AllRequests from './pages/AllRequests';
import LearningCalendar from './pages/LearningCalendar';
import DeliveryTracker from './pages/DeliveryTracker';
import TransferMonitor from './pages/TransferMonitor';
import ImpactReports from './pages/ImpactReports';
import ProgrammeDesign from './pages/ProgrammeDesign';
import LearningAnalytics from './pages/LearningAnalytics';
import CertificationLog from './pages/CertificationLog';
import ReportsExport from './pages/ReportsExport';
import LearnaDNA from './pages/LearnaDNA';
import AdminSettings from './pages/AdminSettings';

import MyLearningJourney from './pages/MyLearningJourney';
import RequestProgramme from './pages/RequestProgramme';
import TeamView from './pages/TeamView';
import NominateStaff from './pages/NominateStaff';
import HelpCenter from './pages/HelpCenter';
import ManagerHub from './pages/ManagerHub';
import ManagerHub from './pages/ManagerHub';
import ManagerHub from './pages/ManagerHub';
import ProfileSettings from './pages/ProfileSettings';

import RequestDetail from './pages/RequestDetail';
import D1Home from './pages/D1Home';
import AIAdvisor from './pages/AIAdvisor';
import OutcomeBuilder from './pages/OutcomeBuilder';
import D1Package from './pages/D1Package';

function getPath() {
  return window.location.pathname || '/';
}

function AppContent() {
  const { user, profile, loading, signOut } = useAuth();
  const [currentPath, setCurrentPath] = useState(getPath);

  useEffect(() => {
    function onPopState() {
      setCurrentPath(getPath());
    }
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  function navigate(path: string) {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
  }

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: '#F7F5F0' }}
      >
        <div className="flex flex-col items-center gap-4">
          <div
            className="w-8 h-8 rounded-full border-2 animate-spin"
            style={{ borderColor: 'rgba(10,22,40,0.12)', borderTopColor: '#0A1628' }}
          />
          <p className="text-sm" style={{ color: 'rgba(10,22,40,0.45)' }}>
            Loading your account…
          </p>
        </div>
      </div>
    );
  }

  if (!user || !profile) {
    return <AuthPage />;
  }

  const isAdmin = profile.role === 'admin';
  const userName = profile.full_name || profile.email || 'User';
  const userRole: 'admin' | 'requestor' = isAdmin ? 'admin' : 'requestor';

  function resolvePage() {
    const path = currentPath;

    if (path === '/' || path === '') {
      return isAdmin ? <AdminDashboard /> : <SalesDashboard />;
    }
    if (path === '/incoming-requests') return <IncomingRequests />;
    if (path === '/requests') return <AllRequests />;
    if (path === '/calendar') return <LearningCalendar />;
    if (path === '/programme-design') return <ProgrammeDesign />;
    if (path === '/delivery-tracker') return <DeliveryTracker />;
    if (path === '/transfer-monitor') return <TransferMonitor />;
    if (path === '/impact-reports') return <ImpactReports />;
    if (path === '/learning-analytics') return <LearningAnalytics />;
    if (path === '/certification-log') return <CertificationLog />;
    if (path === '/reports-export') return <ReportsExport />;
    if (path === '/learna-dna') return <LearnaDNA onNavigate={navigate} />;
    if (path === '/admin-settings') return <AdminSettings />;

    if (path === '/request-programme') return <RequestProgramme />;
    if (path === '/my-learning-journey') return <MyLearningJourney />;
    if (path === '/team-view') return <TeamView />;
    if (path === '/nominate-staff') return <NominateStaff />;
    if (path === '/help-center') return <HelpCenter />;
  if (path === '/manager-hub') return <ManagerHub />;
  if (path === '/manager-hub') return <ManagerHub />;
    if (path === '/profile-settings') return <ProfileSettings />;

    if (path.startsWith('/request/')) return <RequestDetail />;

    if (path === '/d1/home') return <D1Home onNavigate={navigate} />;
    if (path === '/d1/ai-advisor') return <AIAdvisor onNavigate={navigate} />;
    if (path === '/d1/dna') return <LearnaDNA onNavigate={navigate} />;
    if (path === '/d1/outcomes') return <OutcomeBuilder onNavigate={navigate} />;
    if (path === '/d1/package') return <D1Package onNavigate={navigate} />;

    if (path === '/onboarding') return <OnboardingFlow onComplete={() => navigate('/')} />;

    return isAdmin ? <AdminDashboard /> : <SalesDashboard />;
  }

  return (
    <Layout
      currentPage={currentPath}
      userRole={userRole}
      userName={userName}
      onNavigate={navigate}
      onSignOut={signOut}
    >
      {resolvePage()}
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
