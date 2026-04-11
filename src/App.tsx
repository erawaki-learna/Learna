import { useEffect, useState } from 'react';
import { useAuth } from './contexts/AuthContext';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import MyRequests from './pages/MyRequests';
import NewRequest from './pages/NewRequest';
import RequestDetail from './pages/RequestDetail';
import PendingReview from './pages/PendingReview';
import AllRequests from './pages/AllRequests';
import LearningCalendar from './pages/LearningCalendar';
import D1Home from './pages/D1Home';
import LearnaDNA from './pages/LearnaDNA';
import OutcomeBuilder from './pages/OutcomeBuilder';
import D1Package from './pages/D1Package';
import Layout from './components/Layout';

function App() {
  const { user, profile, loading, signOut } = useAuth();
  const [currentPage, setCurrentPage] = useState(window.location.pathname);

  const navigate = (path: string) => {
    window.history.pushState({}, '', path);
    setCurrentPage(path);
  };

  useEffect(() => {
    const handlePop = () => setCurrentPage(window.location.pathname);
    window.addEventListener('popstate', handlePop);
    return () => window.removeEventListener('popstate', handlePop);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#F7F5F0' }}>
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-navy/20 border-t-navy rounded-full animate-spin" style={{ borderTopColor: '#0A1628' }} />
          <div style={{ color: 'rgba(10,22,40,0.6)' }}>Loading your account...</div>
        </div>
      </div>
    );
  }

  if (!user || !profile) return <AuthPage />;

  const userRole = profile.role === 'admin' ? 'admin' : 'requestor';
  const userName = profile.full_name || profile.email || '';

  const renderPage = () => {
    const path = currentPage;

    if (path === '/' || path === '/dashboard') {
      return profile.role === 'admin' ? <Dashboard /> : <MyRequests />;
    }
    if (path === '/admin') return <Dashboard />;
    if (path === '/my-requests') return <MyRequests />;
    if (path === '/new-request') return <NewRequest />;
    if (path === '/pending') return profile.role === 'admin' ? <PendingReview /> : <MyRequests />;
    if (path === '/requests') return profile.role === 'admin' ? <AllRequests /> : <MyRequests />;
    if (path === '/calendar') return <LearningCalendar />;
    if (path === '/d1' || path === '/d1/home') return <D1Home onNavigate={navigate} />;
    if (path === '/dna' || path === '/d1/dna') return <LearnaDNA onNavigate={navigate} />;
    if (path === '/d1/outcomes') return <OutcomeBuilder onNavigate={navigate} />;
    if (path === '/d1/package') return <D1Package onNavigate={navigate} />;
    if (path.startsWith('/request/')) return <RequestDetail />;

    // Placeholder pages
    if (['/d2', '/d3', '/d4', '/d5'].includes(path)) {
      const labels: Record<string, { title: string; desc: string }> = {
        '/d2': { title: 'Programme Design', desc: 'Design learning experiences based on confirmed needs' },
        '/d3': { title: 'Delivery Tracker', desc: 'Track programme delivery, attendance and facilitator notes' },
        '/d4': { title: 'Transfer Monitor', desc: 'Monitor learning transfer to the workplace' },
        '/d5': { title: 'Impact Reports', desc: 'Measure business impact and ROI of learning investments' },
      };
      const page = labels[path];
      return (
        <div className="max-w-2xl mx-auto mt-16 text-center">
          <div className="bg-white rounded-xl border p-12" style={{ borderColor: 'rgba(10,22,40,0.1)' }}>
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
              style={{ backgroundColor: 'rgba(201,162,39,0.15)' }}>
              <span style={{ fontSize: 28 }}>🚧</span>
            </div>
            <h2 className="text-2xl font-serif mb-3" style={{ color: '#0A1628' }}>{page.title}</h2>
            <p className="mb-2" style={{ color: 'rgba(10,22,40,0.6)' }}>{page.desc}</p>
            <p className="text-sm" style={{ color: 'rgba(10,22,40,0.4)' }}>Coming in the next sprint</p>
          </div>
        </div>
      );
    }

    return profile.role === 'admin' ? <Dashboard /> : <MyRequests />;
  };

  return (
    <Layout
      currentPage={currentPage}
      userRole={userRole}
      userName={userName}
      onNavigate={navigate}
      onSignOut={signOut}
    >
      {renderPage()}
    </Layout>
  );
}

export default App;
