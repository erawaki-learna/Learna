import { useState, ReactNode } from 'react';
import {
  LayoutDashboard, FileText, Calendar, Plus, LogOut, Menu,
  MessageSquare, BookOpen, Target, Inbox, ClipboardList,
  BarChart3, Users, Layers, Activity, X, Dna,
} from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
  currentPage: string;
  userRole: 'admin' | 'requestor';
  userName?: string;
  onNavigate: (page: string) => void;
  onSignOut: () => void;
}

const adminNavItems = [
  { name: 'L&D Dashboard', icon: LayoutDashboard, path: '/admin' },
  { name: 'Incoming Requests', icon: Inbox, path: '/pending' },
  { name: 'All Requests', icon: FileText, path: '/requests' },
  { name: 'Learning Calendar', icon: Calendar, path: '/calendar' },
  { name: 'Programme Design', icon: Layers, path: '/d2' },
  { name: 'Delivery Tracker', icon: ClipboardList, path: '/d3' },
  { name: 'Transfer Monitor', icon: Activity, path: '/d4' },
  { name: 'Impact Reports', icon: BarChart3, path: '/d5' },
  { name: 'LearnaDNA Profiles', icon: Users, path: '/dna' },
];

const requestorNavItems = [
  { name: 'My Dashboard', icon: LayoutDashboard, path: '/dashboard' },
  { name: 'Request a Programme', icon: Plus, path: '/new-request' },
  { name: 'Talk to Learning AI', icon: MessageSquare, path: '/ai-advisor' },
  { name: 'My Learning Journey', icon: BookOpen, path: '/my-requests' },
  { name: 'My Team Profile', icon: Dna, path: '/dna' },
  { name: 'Learning Calendar', icon: Calendar, path: '/calendar' },
  { name: 'Define My Outcome', icon: Target, path: '/d1' },
];

const getInitials = (name?: string) => {
  if (!name) return 'U';
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
};

interface NavItemProps {
  item: { name: string; icon: React.ElementType; path: string };
  isActive: boolean;
  onClick: () => void;
}

function NavItem({ item, isActive, onClick }: NavItemProps) {
  const Icon = item.icon;
  return (
    <li>
      <button
        onClick={onClick}
        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150 text-sm text-left"
        style={isActive
          ? { backgroundColor: '#C9A227', color: '#0A1628', fontWeight: 500 }
          : { color: 'rgba(255,255,255,0.7)' }
        }
        onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(255,255,255,0.1)'; }}
        onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'; }}
      >
        <Icon className="w-4 h-4 flex-shrink-0" />
        <span>{item.name}</span>
      </button>
    </li>
  );
}

export default function Layout({ children, currentPage, userRole, userName, onNavigate, onSignOut }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isAdmin = userRole === 'admin';
  const navigation = isAdmin ? adminNavItems : requestorNavItems;

  function SidebarContent() {
    return (
      <div className="flex flex-col h-full">
        <div className="p-5 border-b border-white/10 flex-shrink-0">
          <div className="flex items-center gap-3">
            <img src="/learna-logo-v2.png" alt="Learna" className="w-10 h-10 object-contain" />
            <div>
              <h1 className="text-lg font-serif leading-tight" style={{ color: '#C9A227' }}>LEARNA</h1>
              <p className="text-xs" style={{ color: 'rgba(201,162,39,0.6)' }}>HNB Assurance PLC</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-3 overflow-y-auto">
          <p className="text-xs font-medium uppercase tracking-widest px-3 mb-3" style={{ color: 'rgba(255,255,255,0.3)' }}>
            {isAdmin ? 'Administration' : 'Learning Hub'}
          </p>
          <ul className="space-y-0.5">
            {navigation.map((item) => (
              <NavItem
                key={item.path}
                item={item}
                isActive={currentPage === item.path}
                onClick={() => { setSidebarOpen(false); onNavigate(item.path); }}
              />
            ))}
          </ul>
        </nav>

        <div className="p-3 border-t border-white/10 flex-shrink-0">
          <div className="flex items-center gap-3 px-3 py-2.5 mb-1">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0"
              style={{ backgroundColor: '#C9A227', color: '#0A1628' }}
            >
              {getInitials(userName)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-medium truncate">{userName || 'User'}</p>
              <p className="text-xs truncate" style={{ color: 'rgba(255,255,255,0.4)' }}>
                {isAdmin ? 'Administrator' : 'Sales Leader'}
              </p>
            </div>
          </div>
          <button
            onClick={onSignOut}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150 text-sm"
            style={{ color: 'rgba(255,255,255,0.7)' }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)')}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: '#F7F5F0' }}>
      <aside className="hidden lg:flex lg:w-64 flex-col fixed inset-y-0 left-0 z-30" style={{ backgroundColor: '#0A1628' }}>
        <SidebarContent />
      </aside>

      {sidebarOpen && (
        <>
          <div
            className="fixed inset-0 z-40 lg:hidden"
            style={{ backgroundColor: 'rgba(10,22,40,0.6)' }}
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="fixed inset-y-0 left-0 w-64 flex flex-col z-50 lg:hidden" style={{ backgroundColor: '#0A1628' }}>
            <button
              onClick={() => setSidebarOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg"
              style={{ color: 'rgba(255,255,255,0.5)' }}
            >
              <X className="w-4 h-4" />
            </button>
            <SidebarContent />
          </aside>
        </>
      )}

      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        <header
          className="sticky top-0 z-20 px-4 lg:px-8 py-4 flex items-center justify-between lg:justify-end border-b"
          style={{ backgroundColor: '#ffffff', borderColor: 'rgba(10,22,40,0.08)' }}
        >
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-lg hover:bg-gray-100">
            <Menu className="w-5 h-5" style={{ color: '#0A1628' }} />
          </button>
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium" style={{ color: '#0A1628' }}>{userName || 'User'}</p>
              <p className="text-xs capitalize" style={{ color: 'rgba(10,22,40,0.5)' }}>
                {isAdmin ? 'Administrator' : 'Sales Leader'}
              </p>
            </div>
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold"
              style={{ backgroundColor: '#C9A227', color: '#0A1628' }}
            >
              {getInitials(userName)}
            </div>
          </div>
        </header>
        <main className="flex-1 p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
