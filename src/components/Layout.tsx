import { useState, ReactNode } from 'react';
import {
  LayoutDashboard,
  Inbox,
  FileText,
  Calendar,
  Layers,
  Activity,
  TrendingUp,
  BarChart2,
  Award,
  Download,
  Dna,
  Settings,
  Plus,
  Bot,
  BookOpen,
  Users,
  UserPlus,
  HelpCircle,
  User,
  LogOut,
  Bell,
  Menu,
  X,
  ClipboardList,
  ChevronRight,
} from 'lucide-react';
import NotificationsDrawer from './NotificationsDrawer';

export interface LayoutProps {
  children: ReactNode;
  currentPage: string;
  userRole: 'admin' | 'requestor';
  userName?: string;
  onNavigate: (path: string) => void;
  onSignOut: () => void;
}

interface NavItem {
  label: string;
  icon: typeof LayoutDashboard;
  path: string;
}

const ADMIN_NAV: NavItem[] = [
  { label: 'L&D Dashboard', icon: LayoutDashboard, path: '/' },
  { label: 'Incoming Requests', icon: Inbox, path: '/incoming-requests' },
  { label: 'All Requests', icon: FileText, path: '/requests' },
  { label: 'Learning Calendar', icon: Calendar, path: '/calendar' },
  { label: 'Programme Design', icon: Layers, path: '/programme-design' },
  { label: 'Delivery Tracker', icon: ClipboardList, path: '/delivery-tracker' },
  { label: 'Transfer Monitor', icon: Activity, path: '/transfer-monitor' },
  { label: 'Impact Reports', icon: TrendingUp, path: '/impact-reports' },
  { label: 'Learning Analytics', icon: BarChart2, path: '/learning-analytics' },
  { label: 'Certification Log', icon: Award, path: '/certification-log' },
  { label: 'Reports & Export', icon: Download, path: '/reports-export' },
  { label: 'LearnaDNA Profiles', icon: Dna, path: '/learna-dna' },
  { label: 'Admin Settings', icon: Settings, path: '/admin-settings' },
];

const REQUESTOR_NAV: NavItem[] = [
  { label: 'My Dashboard', icon: LayoutDashboard, path: '/' },
  { label: 'Request a Programme', icon: Plus, path: '/request-programme' },
  { label: 'AI Learning Advisor', icon: Bot, path: '/d1/ai-advisor' },
  { label: 'My Learning Journey', icon: BookOpen, path: '/my-learning-journey' },
  { label: 'My Team', icon: Users, path: '/team-view' },
  { label: 'Nominate Staff', icon: UserPlus, path: '/nominate-staff' },
  { label: 'Learning Calendar', icon: Calendar, path: '/calendar' },
  { label: 'Help Center', icon: HelpCircle, path: '/help-center' },
  { label: 'Profile Settings', icon: User, path: '/profile-settings' },
];

const MOCK_NOTIF_COUNT = 3;

function getInitials(name?: string) {
  if (!name) return 'U';
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function SidebarNav({
  nav,
  currentPage,
  onNavigate,
  isAdmin,
}: {
  nav: NavItem[];
  currentPage: string;
  onNavigate: (p: string) => void;
  isAdmin: boolean;
}) {
  return (
    <nav className="flex-1 overflow-y-auto px-3 py-4">
      <p
        className="text-[10px] font-bold uppercase tracking-widest px-3 mb-3"
        style={{ color: 'rgba(201,162,39,0.45)' }}
      >
        {isAdmin ? 'Administration' : 'Learning Hub'}
      </p>
      <ul className="space-y-0.5">
        {nav.map((item) => {
          const Icon = item.icon;
          const active = currentPage === item.path;
          return (
            <li key={item.path}>
              <button
                onClick={() => onNavigate(item.path)}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-150 text-left"
                style={
                  active
                    ? { backgroundColor: '#C9A227', color: '#0A1628', fontWeight: 600 }
                    : { color: 'rgba(255,255,255,0.65)', fontWeight: 400 }
                }
                onMouseEnter={(e) => {
                  if (!active)
                    (e.currentTarget as HTMLElement).style.backgroundColor =
                      'rgba(255,255,255,0.07)';
                }}
                onMouseLeave={(e) => {
                  if (!active)
                    (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
                }}
              >
                <Icon
                  className="w-4 h-4 flex-shrink-0"
                  style={active ? { color: '#0A1628' } : { color: 'rgba(255,255,255,0.5)' }}
                />
                <span className="flex-1 leading-snug">{item.label}</span>
                {active && (
                  <ChevronRight
                    className="w-3 h-3 flex-shrink-0 opacity-60"
                    style={{ color: '#0A1628' }}
                  />
                )}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

function SidebarInner({
  nav,
  currentPage,
  isAdmin,
  userName,
  userRole,
  onNavigate,
  onSignOut,
}: {
  nav: NavItem[];
  currentPage: string;
  isAdmin: boolean;
  userName?: string;
  userRole: 'admin' | 'requestor';
  onNavigate: (p: string) => void;
  onSignOut: () => void;
}) {
  return (
    <div className="flex flex-col h-full">
      <div
        className="px-5 py-5 flex-shrink-0 border-b"
        style={{ borderColor: 'rgba(255,255,255,0.07)' }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: '#C9A227' }}
          >
            <span
              className="text-sm font-bold"
              style={{ color: '#0A1628', fontFamily: 'Georgia, serif' }}
            >
              L
            </span>
          </div>
          <div>
            <h1
              className="text-base font-bold tracking-wide leading-tight"
              style={{ color: '#C9A227', fontFamily: 'Georgia, serif' }}
            >
              LEARNA
            </h1>
            <p
              className="text-[10px] font-medium leading-tight"
              style={{ color: 'rgba(201,162,39,0.5)' }}
            >
              HNB Assurance PLC
            </p>
          </div>
        </div>
      </div>

      <SidebarNav
        nav={nav}
        currentPage={currentPage}
        onNavigate={onNavigate}
        isAdmin={isAdmin}
      />

      <div
        className="px-3 pb-4 pt-3 flex-shrink-0 border-t"
        style={{ borderColor: 'rgba(255,255,255,0.07)' }}
      >
        <div
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl mb-1"
          style={{ backgroundColor: 'rgba(255,255,255,0.04)' }}
        >
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
            style={{ backgroundColor: '#C9A227', color: '#0A1628' }}
          >
            {getInitials(userName)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate" style={{ color: 'white' }}>
              {userName || 'User'}
            </p>
            <p
              className="text-[11px] truncate capitalize"
              style={{ color: 'rgba(255,255,255,0.4)' }}
            >
              {userRole === 'admin' ? 'Administrator' : 'Sales Leader'}
            </p>
          </div>
        </div>
        <button
          onClick={onSignOut}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all"
          style={{ color: 'rgba(255,255,255,0.5)' }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(255,255,255,0.07)';
            (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.85)';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
            (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.5)';
          }}
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
}

export default function Layout({
  children,
  currentPage,
  userRole,
  userName,
  onNavigate,
  onSignOut,
}: LayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const isAdmin = userRole === 'admin';
  const nav = isAdmin ? ADMIN_NAV : REQUESTOR_NAV;

  function handleNavigate(path: string) {
    setMobileOpen(false);
    onNavigate(path);
  }

  return (
    <div
      className="min-h-screen flex"
      style={{ backgroundColor: '#F7F5F0', fontFamily: 'Inter, sans-serif' }}
    >
      <aside
        className="hidden lg:flex w-64 flex-col fixed inset-y-0 left-0 z-30"
        style={{ backgroundColor: '#0A1628' }}
      >
        <SidebarInner
          nav={nav}
          currentPage={currentPage}
          isAdmin={isAdmin}
          userName={userName}
          userRole={userRole}
          onNavigate={handleNavigate}
          onSignOut={onSignOut}
        />
      </aside>

      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 z-40 lg:hidden"
            style={{
              backgroundColor: 'rgba(10,22,40,0.55)',
              backdropFilter: 'blur(2px)',
            }}
            onClick={() => setMobileOpen(false)}
          />
          <aside
            className="fixed inset-y-0 left-0 w-64 flex flex-col z-50 lg:hidden"
            style={{ backgroundColor: '#0A1628' }}
          >
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-4 right-4 w-7 h-7 rounded-lg flex items-center justify-center transition-all"
              style={{
                color: 'rgba(255,255,255,0.4)',
                backgroundColor: 'rgba(255,255,255,0.07)',
              }}
            >
              <X className="w-4 h-4" />
            </button>
            <SidebarInner
              nav={nav}
              currentPage={currentPage}
              isAdmin={isAdmin}
              userName={userName}
              userRole={userRole}
              onNavigate={handleNavigate}
              onSignOut={onSignOut}
            />
          </aside>
        </>
      )}

      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        <header
          className="sticky top-0 z-20 flex items-center justify-between px-5 lg:px-8 h-14 border-b"
          style={{ backgroundColor: 'white', borderColor: 'rgba(10,22,40,0.07)' }}
        >
          <button
            onClick={() => setMobileOpen(true)}
            className="lg:hidden p-2 rounded-lg transition-colors hover:bg-gray-100"
          >
            <Menu className="w-5 h-5" style={{ color: '#0A1628' }} />
          </button>

          <div className="hidden lg:block" />

          <div className="flex items-center gap-3">
            <button
              onClick={() => setNotifOpen(true)}
              className="relative w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:bg-gray-100"
              style={{ color: '#0A1628' }}
            >
              <Bell className="w-[18px] h-[18px]" />
              {MOCK_NOTIF_COUNT > 0 && (
                <span
                  className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold"
                  style={{ backgroundColor: '#C9A227', color: '#0A1628' }}
                >
                  {MOCK_NOTIF_COUNT}
                </span>
              )}
            </button>

            <div
              className="hidden sm:flex items-center gap-2.5 pl-3 border-l"
              style={{ borderColor: 'rgba(10,22,40,0.08)' }}
            >
              <div className="text-right">
                <p
                  className="text-sm font-semibold leading-tight"
                  style={{ color: '#0A1628' }}
                >
                  {userName || 'User'}
                </p>
                <p
                  className="text-[11px] leading-tight capitalize"
                  style={{ color: 'rgba(10,22,40,0.45)' }}
                >
                  {isAdmin ? 'Administrator' : 'Sales Leader'}
                </p>
              </div>
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                style={{ backgroundColor: '#0A1628', color: '#C9A227' }}
              >
                {getInitials(userName)}
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1">{children}</main>
      </div>

      <NotificationsDrawer isOpen={notifOpen} onClose={() => setNotifOpen(false)} />
    </div>
  );
}
