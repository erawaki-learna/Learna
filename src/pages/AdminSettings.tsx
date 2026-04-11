import { useState } from 'react';
import { Settings, Users, Plug, ChevronDown, Search, UserPlus, CreditCard as Edit2, UserX, CheckCircle, XCircle, Link2, Link as LinkIcon, Database, FileText, Zap, MessageSquare, Bell, Save, X } from 'lucide-react';

type Tab = 'general' | 'users' | 'integrations';

interface ToggleOption {
  key: string;
  label: string;
  description: string;
}

const TOGGLES: ToggleOption[] = [
  { key: 'aiClassification', label: 'AI Classification', description: 'Automatically classify and tag incoming training requests using AI.' },
  { key: 'autoAssignment', label: 'Auto-assignment of Requests', description: 'Assign L&D officers to requests automatically based on workload and expertise.' },
  { key: 'emailNotifications', label: 'Email Notifications (System-wide)', description: 'Enable email notifications for all users across the platform.' },
  { key: 'transferCheckins', label: 'Transfer Check-in Reminders', description: 'Send automated reminders for on-the-job transfer check-ins post-training.' },
];

type UserRole = 'Admin' | 'L&D Officer' | 'Manager' | 'Requestor';
type UserStatus = 'Active' | 'Inactive';

interface UserRecord {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  status: UserStatus;
  lastLogin: string;
}

const MOCK_USERS: UserRecord[] = [
  { id: 1, name: 'Eranda Wakista', email: 'eranda.wakista@hnb.lk', role: 'Admin', department: 'L&D', status: 'Active', lastLogin: '11 Apr 2026' },
  { id: 2, name: 'Nishantha Jayasinghe', email: 'nishantha.j@hnb.lk', role: 'L&D Officer', department: 'L&D', status: 'Active', lastLogin: '10 Apr 2026' },
  { id: 3, name: 'Saman Perera', email: 'saman.perera@hnb.lk', role: 'Requestor', department: 'Bancassurance Retail', status: 'Active', lastLogin: '09 Apr 2026' },
  { id: 4, name: 'Dilani Fernando', email: 'dilani.f@hnb.lk', role: 'Manager', department: 'Corporate Bancassurance', status: 'Active', lastLogin: '08 Apr 2026' },
  { id: 5, name: 'Ruwan Dissanayake', email: 'ruwan.d@hnb.lk', role: 'Requestor', department: 'Premier Banking', status: 'Active', lastLogin: '07 Apr 2026' },
  { id: 6, name: 'Chamari Silva', email: 'chamari.s@hnb.lk', role: 'L&D Officer', department: 'L&D', status: 'Active', lastLogin: '01 Apr 2026' },
  { id: 7, name: 'Priya Gunawardena', email: 'priya.g@hnb.lk', role: 'Manager', department: 'Retail Branch Network', status: 'Inactive', lastLogin: '15 Feb 2026' },
  { id: 8, name: 'Kasun Rathnayake', email: 'kasun.r@hnb.lk', role: 'Requestor', department: 'Group Life', status: 'Inactive', lastLogin: '20 Jan 2026' },
];

const ROLE_STYLES: Record<UserRole, { bg: string; color: string }> = {
  Admin: { bg: 'rgba(10,22,40,0.08)', color: '#0A1628' },
  'L&D Officer': { bg: 'rgba(201,162,39,0.12)', color: '#7A5B0A' },
  Manager: { bg: 'rgba(59,130,246,0.1)', color: '#1D4ED8' },
  Requestor: { bg: 'rgba(16,185,129,0.1)', color: '#065F46' },
};

type IntegrationStatus = 'connected' | 'disconnected' | 'coming_soon';

interface Integration {
  id: string;
  name: string;
  description: string;
  status: IntegrationStatus;
  icon: typeof Database;
  iconColor: string;
  iconBg: string;
}

const INTEGRATIONS: Integration[] = [
  { id: 'supabase', name: 'Supabase', description: 'Database, authentication, and real-time data storage for Learna.', status: 'connected', icon: Database, iconColor: '#065F46', iconBg: 'rgba(16,185,129,0.1)' },
  { id: 'notion', name: 'Notion', description: 'Sync learning blueprints, content libraries, and programme documentation.', status: 'connected', icon: FileText, iconColor: '#1D4ED8', iconBg: 'rgba(59,130,246,0.1)' },
  { id: 'zapier', name: 'Zapier', description: 'Automate workflows between Learna and your HR or CRM systems.', status: 'disconnected', icon: Zap, iconColor: 'rgba(10,22,40,0.3)', iconBg: 'rgba(10,22,40,0.05)' },
  { id: 'teams', name: 'Microsoft Teams', description: 'Receive Learna notifications and manage requests directly within Teams.', status: 'disconnected', icon: MessageSquare, iconColor: 'rgba(10,22,40,0.3)', iconBg: 'rgba(10,22,40,0.05)' },
  { id: 'whatsapp', name: 'WhatsApp Business', description: 'Send automated reminders and nudges to learners via WhatsApp.', status: 'coming_soon', icon: Bell, iconColor: 'rgba(10,22,40,0.25)', iconBg: 'rgba(10,22,40,0.04)' },
];

function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      className="relative inline-flex w-11 h-6 rounded-full transition-colors duration-200 flex-shrink-0"
      style={{ backgroundColor: checked ? '#C9A227' : 'rgba(10,22,40,0.15)' }}
    >
      <span
        className="absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all duration-200"
        style={{ left: checked ? '1.375rem' : '0.25rem' }}
      />
    </button>
  );
}

function GeneralTab() {
  const [form, setForm] = useState({
    orgName: 'HNB Assurance PLC',
    ldEmail: 'learna@hnb.lk',
    language: 'English',
    timezone: 'Asia/Colombo',
  });
  const [toggles, setToggles] = useState<Record<string, boolean>>({
    aiClassification: true,
    autoAssignment: false,
    emailNotifications: true,
    transferCheckins: true,
  });
  const [saved, setSaved] = useState(false);

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border p-6" style={{ borderColor: 'rgba(10,22,40,0.09)' }}>
        <h3 className="text-sm font-semibold mb-4" style={{ color: '#0A1628', fontFamily: 'Georgia, serif' }}>Organisation Details</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { key: 'orgName', label: 'Organisation Name' },
            { key: 'ldEmail', label: 'L&D Team Email' },
          ].map(({ key, label }) => (
            <div key={key}>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: 'rgba(10,22,40,0.5)' }}>{label}</label>
              <input
                type="text"
                value={form[key as keyof typeof form]}
                onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                className="w-full px-3.5 py-2.5 rounded-xl border text-sm outline-none transition-all"
                style={{ borderColor: 'rgba(10,22,40,0.12)', color: '#0A1628', backgroundColor: '#F7F5F0' }}
              />
            </div>
          ))}
          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: 'rgba(10,22,40,0.5)' }}>Default Language</label>
            <div className="relative">
              <select
                value={form.language}
                onChange={(e) => setForm((f) => ({ ...f, language: e.target.value }))}
                className="w-full appearance-none px-3.5 pr-8 py-2.5 rounded-xl border text-sm outline-none"
                style={{ borderColor: 'rgba(10,22,40,0.12)', color: '#0A1628', backgroundColor: '#F7F5F0' }}
              >
                <option>English</option>
                <option>Sinhala</option>
                <option>Tamil</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none" style={{ color: 'rgba(10,22,40,0.3)' }} />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: 'rgba(10,22,40,0.5)' }}>Timezone</label>
            <div className="relative">
              <select
                value={form.timezone}
                onChange={(e) => setForm((f) => ({ ...f, timezone: e.target.value }))}
                className="w-full appearance-none px-3.5 pr-8 py-2.5 rounded-xl border text-sm outline-none"
                style={{ borderColor: 'rgba(10,22,40,0.12)', color: '#0A1628', backgroundColor: '#F7F5F0' }}
              >
                <option value="Asia/Colombo">Asia/Colombo (UTC+5:30)</option>
                <option value="Asia/Dubai">Asia/Dubai (UTC+4)</option>
                <option value="UTC">UTC</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none" style={{ color: 'rgba(10,22,40,0.3)' }} />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border p-6" style={{ borderColor: 'rgba(10,22,40,0.09)' }}>
        <h3 className="text-sm font-semibold mb-1" style={{ color: '#0A1628', fontFamily: 'Georgia, serif' }}>Platform Behaviour</h3>
        <p className="text-xs mb-4" style={{ color: 'rgba(10,22,40,0.4)' }}>Configure system-wide automation and notification settings.</p>
        <div className="space-y-4">
          {TOGGLES.map((t) => (
            <div key={t.key} className="flex items-start justify-between gap-4 py-3 border-b last:border-0" style={{ borderColor: 'rgba(10,22,40,0.05)' }}>
              <div>
                <p className="text-sm font-semibold" style={{ color: '#0A1628' }}>{t.label}</p>
                <p className="text-xs mt-0.5" style={{ color: 'rgba(10,22,40,0.45)' }}>{t.description}</p>
              </div>
              <Toggle checked={toggles[t.key]} onChange={() => setToggles((s) => ({ ...s, [t.key]: !s[t.key] }))} />
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90"
          style={{ backgroundColor: saved ? '#065F46' : '#C9A227', color: saved ? 'white' : '#0A1628' }}
        >
          {saved ? <CheckCircle className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          {saved ? 'Saved!' : 'Save Settings'}
        </button>
      </div>
    </div>
  );
}

function UserManagementTab() {
  const [users, setUsers] = useState<UserRecord[]>(MOCK_USERS);
  const [search, setSearch] = useState('');
  const [showInvite, setShowInvite] = useState(false);
  const [invite, setInvite] = useState({ name: '', email: '', role: 'Requestor' as UserRole, department: '' });

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.department.toLowerCase().includes(search.toLowerCase()),
  );

  function toggleStatus(id: number) {
    setUsers((us) => us.map((u) => u.id === id ? { ...u, status: u.status === 'Active' ? 'Inactive' : 'Active' } : u));
  }

  function handleInvite() {
    if (!invite.name || !invite.email) return;
    const newUser: UserRecord = {
      id: Date.now(),
      name: invite.name,
      email: invite.email,
      role: invite.role,
      department: invite.department || 'Unassigned',
      status: 'Active',
      lastLogin: '—',
    };
    setUsers((u) => [newUser, ...u]);
    setInvite({ name: '', email: '', role: 'Requestor', department: '' });
    setShowInvite(false);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="relative flex-1" style={{ maxWidth: '360px' }}>
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: 'rgba(10,22,40,0.3)' }} />
          <input
            type="text"
            placeholder="Search users…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2.5 rounded-xl border text-sm outline-none"
            style={{ borderColor: 'rgba(10,22,40,0.12)', color: '#0A1628', backgroundColor: 'white' }}
          />
        </div>
        <button
          onClick={() => setShowInvite((v) => !v)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90"
          style={{ backgroundColor: '#C9A227', color: '#0A1628' }}
        >
          {showInvite ? <X className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
          {showInvite ? 'Cancel' : 'Invite User'}
        </button>
      </div>

      {showInvite && (
        <div className="bg-white rounded-2xl border p-5" style={{ borderColor: 'rgba(201,162,39,0.35)', boxShadow: '0 0 0 3px rgba(201,162,39,0.08)' }}>
          <h3 className="text-sm font-semibold mb-4" style={{ color: '#0A1628', fontFamily: 'Georgia, serif' }}>Invite New User</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
            {[
              { key: 'name', label: 'Full Name', placeholder: 'e.g. Kasun Bandara' },
              { key: 'email', label: 'Email Address', placeholder: 'kasun.b@hnb.lk' },
              { key: 'department', label: 'Department', placeholder: 'e.g. Bancassurance Retail' },
            ].map(({ key, label, placeholder }) => (
              <div key={key}>
                <label className="block text-xs font-semibold mb-1" style={{ color: 'rgba(10,22,40,0.5)' }}>{label}</label>
                <input
                  type="text"
                  placeholder={placeholder}
                  value={invite[key as keyof typeof invite]}
                  onChange={(e) => setInvite((f) => ({ ...f, [key]: e.target.value }))}
                  className="w-full px-3.5 py-2 rounded-xl border text-sm outline-none"
                  style={{ borderColor: 'rgba(10,22,40,0.12)', color: '#0A1628', backgroundColor: '#F7F5F0' }}
                />
              </div>
            ))}
            <div>
              <label className="block text-xs font-semibold mb-1" style={{ color: 'rgba(10,22,40,0.5)' }}>Role</label>
              <div className="relative">
                <select
                  value={invite.role}
                  onChange={(e) => setInvite((f) => ({ ...f, role: e.target.value as UserRole }))}
                  className="w-full appearance-none px-3.5 pr-8 py-2 rounded-xl border text-sm outline-none"
                  style={{ borderColor: 'rgba(10,22,40,0.12)', color: '#0A1628', backgroundColor: '#F7F5F0' }}
                >
                  <option>Admin</option>
                  <option>L&D Officer</option>
                  <option>Manager</option>
                  <option>Requestor</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none" style={{ color: 'rgba(10,22,40,0.3)' }} />
              </div>
            </div>
          </div>
          <button
            onClick={handleInvite}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90"
            style={{ backgroundColor: '#0A1628', color: '#C9A227' }}
          >
            <UserPlus className="w-4 h-4" /> Send Invitation
          </button>
        </div>
      )}

      <div className="bg-white rounded-2xl border overflow-hidden" style={{ borderColor: 'rgba(10,22,40,0.09)' }}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(10,22,40,0.07)', backgroundColor: '#FAFAF9' }}>
                {['Name', 'Role', 'Department', 'Status', 'Last Login', 'Actions'].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'rgba(10,22,40,0.35)' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((u, i) => (
                <tr
                  key={u.id}
                  className="transition-colors hover:bg-gray-50"
                  style={{ borderBottom: i < filtered.length - 1 ? '1px solid rgba(10,22,40,0.05)' : 'none' }}
                >
                  <td className="px-5 py-3.5">
                    <div>
                      <p className="text-sm font-semibold" style={{ color: '#0A1628' }}>{u.name}</p>
                      <p className="text-xs mt-0.5" style={{ color: 'rgba(10,22,40,0.4)' }}>{u.email}</p>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span
                      className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold"
                      style={{ backgroundColor: ROLE_STYLES[u.role].bg, color: ROLE_STYLES[u.role].color }}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="text-sm" style={{ color: 'rgba(10,22,40,0.55)' }}>{u.department}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold"
                      style={{
                        backgroundColor: u.status === 'Active' ? 'rgba(16,185,129,0.1)' : 'rgba(10,22,40,0.06)',
                        color: u.status === 'Active' ? '#065F46' : 'rgba(10,22,40,0.35)',
                      }}
                    >
                      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: u.status === 'Active' ? '#10B981' : 'rgba(10,22,40,0.2)' }} />
                      {u.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="text-sm" style={{ color: 'rgba(10,22,40,0.4)' }}>{u.lastLogin}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <button
                        className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg transition-all hover:opacity-80"
                        style={{ backgroundColor: 'rgba(10,22,40,0.06)', color: '#0A1628' }}
                      >
                        <Edit2 className="w-3 h-3" /> Edit
                      </button>
                      <button
                        onClick={() => toggleStatus(u.id)}
                        className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg transition-all hover:opacity-80"
                        style={{
                          backgroundColor: u.status === 'Active' ? 'rgba(220,38,38,0.08)' : 'rgba(16,185,129,0.08)',
                          color: u.status === 'Active' ? '#991B1B' : '#065F46',
                        }}
                      >
                        {u.status === 'Active' ? <UserX className="w-3 h-3" /> : <CheckCircle className="w-3 h-3" />}
                        {u.status === 'Active' ? 'Deactivate' : 'Activate'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="px-5 py-10 text-center">
              <p className="text-sm" style={{ color: 'rgba(10,22,40,0.4)' }}>No users match your search.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function IntegrationsTab() {
  const [integrations, setIntegrations] = useState<Integration[]>(INTEGRATIONS);

  function toggle(id: string) {
    setIntegrations((list) =>
      list.map((i) => {
        if (i.id !== id || i.status === 'coming_soon') return i;
        return { ...i, status: i.status === 'connected' ? 'disconnected' : 'connected' };
      }),
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
      {integrations.map((intg) => {
        const Icon = intg.icon;
        const isConnected = intg.status === 'connected';
        const isSoon = intg.status === 'coming_soon';
        return (
          <div
            key={intg.id}
            className="bg-white rounded-2xl border p-5 flex flex-col gap-4"
            style={{ borderColor: isConnected ? 'rgba(16,185,129,0.25)' : 'rgba(10,22,40,0.09)' }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: intg.iconBg }}
              >
                <Icon className="w-5 h-5" style={{ color: intg.iconColor }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold" style={{ color: isSoon ? 'rgba(10,22,40,0.4)' : '#0A1628', fontFamily: 'Georgia, serif' }}>{intg.name}</p>
                <span
                  className="inline-flex items-center gap-1 text-[11px] font-semibold mt-0.5"
                  style={{
                    color: isConnected ? '#065F46' : isSoon ? 'rgba(10,22,40,0.3)' : 'rgba(10,22,40,0.4)',
                  }}
                >
                  {isConnected && <CheckCircle className="w-3 h-3" />}
                  {!isConnected && !isSoon && <XCircle className="w-3 h-3" />}
                  {isSoon ? 'Coming Soon' : isConnected ? 'Connected' : 'Not Connected'}
                </span>
              </div>
            </div>
            <p className="text-xs leading-relaxed" style={{ color: 'rgba(10,22,40,0.45)' }}>{intg.description}</p>
            <button
              onClick={() => toggle(intg.id)}
              disabled={isSoon}
              className="w-full py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
              style={{
                backgroundColor: isSoon
                  ? 'rgba(10,22,40,0.04)'
                  : isConnected
                  ? 'rgba(220,38,38,0.08)'
                  : 'rgba(10,22,40,0.06)',
                color: isSoon
                  ? 'rgba(10,22,40,0.25)'
                  : isConnected
                  ? '#991B1B'
                  : '#0A1628',
                cursor: isSoon ? 'default' : 'pointer',
              }}
            >
              {isSoon ? (
                'Notify Me'
              ) : isConnected ? (
                <><LinkIcon className="w-3.5 h-3.5" /> Disconnect</>
              ) : (
                <><Link2 className="w-3.5 h-3.5" /> Connect</>
              )}
            </button>
          </div>
        );
      })}
    </div>
  );
}

const TABS: { id: Tab; label: string; icon: typeof Settings }[] = [
  { id: 'general', label: 'General', icon: Settings },
  { id: 'users', label: 'User Management', icon: Users },
  { id: 'integrations', label: 'Integrations', icon: Plug },
];

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState<Tab>('general');

  return (
    <div className="min-h-screen" style={{ background: '#F7F5F0', fontFamily: 'Inter, sans-serif' }}>
      <div className="max-w-6xl mx-auto px-4 pt-2 pb-12">

        <div className="mb-6">
          <h1 className="text-xl font-semibold" style={{ color: '#0A1628', fontFamily: 'Georgia, serif' }}>Admin Settings</h1>
          <p className="text-sm mt-0.5" style={{ color: 'rgba(10,22,40,0.45)' }}>Manage platform configuration, users, and integrations</p>
        </div>

        <div className="flex items-center gap-1 p-1 rounded-xl mb-6 w-fit" style={{ backgroundColor: 'rgba(10,22,40,0.06)' }}>
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all"
                style={{
                  backgroundColor: active ? 'white' : 'transparent',
                  color: active ? '#0A1628' : 'rgba(10,22,40,0.45)',
                  boxShadow: active ? '0 1px 4px rgba(10,22,40,0.1)' : 'none',
                }}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {activeTab === 'general' && <GeneralTab />}
        {activeTab === 'users' && <UserManagementTab />}
        {activeTab === 'integrations' && <IntegrationsTab />}
      </div>
    </div>
  );
}
