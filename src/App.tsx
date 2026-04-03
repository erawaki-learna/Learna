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

function App() {
  const { user, profile, loading } = useAuth();
  const [currentPage, setCurrentPage] = useState('/');

  useEffect(() => {
    const path = window.location.pathname;
    setCurrentPage(path);
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

  if (path === '/') {
    return profile.role === 'admin' ? <Dashboard /> : <MyRequests />;
  }

  if (path === '/dashboard') {
    return <Dashboard />;
  }

  if (path === '/my-requests') {
    return <MyRequests />;
  }

  if (path === '/new-request') {
    return <NewRequest />;
  }

  if (path === '/pending') {
    return profile.role === 'admin' ? <PendingReview /> : <Dashboard />;
  }

  if (path === '/requests') {
    return profile.role === 'admin' ? <AllRequests /> : <Dashboard />;
  }

  if (path === '/calendar') {
    return <LearningCalendar />;
  }

  if (path.startsWith('/request/')) {
    return <RequestDetail />;
  }

  if (path === '/auth') {
    return <AuthPage />;
  }

  return profile.role === 'admin' ? <Dashboard /> : <MyRequests />;
}

export default App;
