import { useState, ReactNode } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  LayoutDashboard,
  Clock,
  FileText,
  Calendar,
  Plus,
  GraduationCap,
  LogOut,
  Menu,
  X,
} from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
  currentPage: string;
}

export default function Layout({ children, currentPage }: LayoutProps) {
  const { profile, signOut } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const adminNav = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/' },
    { name: 'Pending Review', icon: Clock, path: '/pending' },
    { name: 'All Requests', icon: FileText, path: '/requests' },
    { name: 'Learning Calendar', icon: Calendar, path: '/calendar' },
    { name: 'New Request', icon: Plus, path: '/new-request' },
  ];

  const requestorNav = [
    { name: 'My Requests', icon: FileText, path: '/' },
    { name: 'New Request', icon: Plus, path: '/new-request' },
    { name: 'Learning Calendar', icon: Calendar, path: '/calendar' },
  ];

  const navigation = profile?.role === 'admin' ? adminNav : requestorNav;

  const getInitials = (name: string | null | undefined) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const SidebarContent = () => (
    <>
      <div className="p-6 border-b border-navy-light">
        <div className="flex items-center gap-3">
          <GraduationCap className="w-8 h-8 text-gold" strokeWidth={1.5} />
          <div>
            <h1 className="text-xl font-serif text-white">LEARNA</h1>
            <p className="text-gold text-xs">HNB Assurance PLC</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.path;
            return (
              <li key={item.path}>
                <a
                  href={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-gold text-navy font-medium'
                      : 'text-cream hover:bg-navy-light'
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </a>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-navy-light">
        <div className="flex items-center gap-3 px-4 py-3 mb-2">
          <div className="w-10 h-10 rounded-full bg-gold flex items-center justify-center text-navy font-semibold">
            {getInitials(profile?.full_name)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-medium truncate">
              {profile?.full_name || 'User'}
            </p>
            <p className="text-cream/60 text-xs truncate">{profile?.email}</p>
          </div>
        </div>
        <button
          onClick={signOut}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-cream hover:bg-navy-light transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span>Sign Out</span>
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-cream flex">
      <aside className="hidden lg:flex lg:w-64 bg-navy flex-col fixed inset-y-0 left-0">
        <SidebarContent />
      </aside>

      {sidebarOpen && (
        <>
          <div
            className="fixed inset-0 bg-navy/50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="fixed inset-y-0 left-0 w-64 bg-navy flex-col z-50 lg:hidden flex">
            <SidebarContent />
          </aside>
        </>
      )}

      <div className="flex-1 lg:ml-64">
        <header className="bg-white border-b border-navy/10 px-4 lg:px-8 py-4 flex items-center justify-between lg:justify-end">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 hover:bg-cream rounded-lg transition-colors"
          >
            <Menu className="w-6 h-6 text-navy" />
          </button>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-navy">{profile?.full_name}</p>
              <p className="text-xs text-navy/60 capitalize">{profile?.role}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-gold flex items-center justify-center text-navy font-semibold">
              {getInitials(profile?.full_name)}
            </div>
          </div>
        </header>

        <main className="p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
