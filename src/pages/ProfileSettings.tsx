import { useState } from 'react';
import {
  User,
  Bell,
  Shield,
  Camera,
  Eye,
  EyeOff,
  Save,
  CheckCircle,
  Lock,
  Mail,
  Phone,
  Building2,
  MapPin,
  Briefcase,
} from 'lucide-react';

type Tab = 'profile' | 'notifications' | 'security';

const MOCK_PROFILE = {
  fullName: 'Eranda Wakista',
  email: 'eranda.wakista@hnbassurance.lk',
  department: 'Bancassurance',
  role: 'Lead Learning Manager',
  phone: '+94 77 234 5678',
  division: 'Retail Banking & Bancassurance',
  branch: 'Head Office — Colombo 02',
  lastLogin: '2026-04-11T08:22:00',
};

const NOTIFICATION_DEFAULTS = {
  emailNotifications: true,
  inAppAlerts: true,
  weeklyDigest: false,
  programmeReminders: true,
  requestStatusUpdates: true,
};

function Toggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <button
      role="switch"
      aria-checked={on}
      onClick={onToggle}
      className="relative inline-flex h-6 w-11 flex-shrink-0 rounded-full transition-colors duration-200 focus:outline-none"
      style={{ backgroundColor: on ? '#C9A227' : 'rgba(10,22,40,0.12)' }}
    >
      <span
        className="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform duration-200"
        style={{
          transform: on ? 'translateX(22px)' : 'translateX(2px)',
          marginTop: '2px',
        }}
      />
    </button>
  );
}

function PasswordStrength({ password }: { password: string }) {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  const levels = [
    { label: 'Weak', color: '#EF4444' },
    { label: 'Fair', color: '#F59E0B' },
    { label: 'Good', color: '#3B82F6' },
    { label: 'Strong', color: '#10B981' },
  ];

  if (!password) return null;
  const level = levels[Math.max(0, score - 1)];

  return (
    <div className="mt-2">
      <div className="flex gap-1 mb-1">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="flex-1 h-1.5 rounded-full transition-all"
            style={{ backgroundColor: i < score ? level.color : 'rgba(10,22,40,0.1)' }}
          />
        ))}
      </div>
      <p className="text-[11px] font-medium" style={{ color: level.color }}>{level.label} password</p>
    </div>
  );
}

export default function ProfileSettings() {
  const [activeTab, setActiveTab] = useState<Tab>('profile');

  const [profile, setProfile] = useState(MOCK_PROFILE);
  const [profileSaved, setProfileSaved] = useState(false);

  const [notifs, setNotifs] = useState(NOTIFICATION_DEFAULTS);

  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [pwSaved, setPwSaved] = useState(false);
  const [pwError, setPwError] = useState('');

  function handleSaveProfile() {
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 3000);
  }

  function handleUpdatePassword() {
    setPwError('');
    if (!currentPw || !newPw || !confirmPw) {
      setPwError('All password fields are required.');
      return;
    }
    if (newPw !== confirmPw) {
      setPwError('New passwords do not match.');
      return;
    }
    if (newPw.length < 8) {
      setPwError('New password must be at least 8 characters.');
      return;
    }
    setPwSaved(true);
    setCurrentPw('');
    setNewPw('');
    setConfirmPw('');
    setTimeout(() => setPwSaved(false), 3000);
  }

  const tabs: { key: Tab; label: string; icon: typeof User }[] = [
    { key: 'profile', label: 'Profile', icon: User },
    { key: 'notifications', label: 'Notifications', icon: Bell },
    { key: 'security', label: 'Security', icon: Shield },
  ];

  const inputCls = "w-full px-3 py-2.5 rounded-xl border text-sm outline-none transition-all";
  const inputStyle = { borderColor: 'rgba(10,22,40,0.12)', color: '#0A1628', fontFamily: 'Inter, sans-serif', backgroundColor: 'white' };
  const disabledStyle = { ...inputStyle, backgroundColor: 'rgba(10,22,40,0.03)', color: 'rgba(10,22,40,0.4)' };

  const notifItems: { key: keyof typeof NOTIFICATION_DEFAULTS; label: string; desc: string }[] = [
    { key: 'emailNotifications', label: 'Email Notifications', desc: 'Receive important updates and activity summaries by email.' },
    { key: 'inAppAlerts', label: 'In-App Alerts', desc: 'Show real-time notifications within the Learna platform.' },
    { key: 'weeklyDigest', label: 'Weekly Digest', desc: 'A curated summary of learning activity every Monday morning.' },
    { key: 'programmeReminders', label: 'Programme Reminders', desc: 'Reminders for upcoming sessions, deadlines, and assessments.' },
    { key: 'requestStatusUpdates', label: 'Request Status Updates', desc: 'Notify me when a learning request status changes.' },
  ];

  return (
    <div className="min-h-screen" style={{ background: '#F7F5F0', fontFamily: 'Inter, sans-serif' }}>
      <div className="max-w-4xl mx-auto pt-2 pb-16">

        <div className="mb-6">
          <h1 className="text-2xl font-semibold" style={{ color: '#0A1628', fontFamily: 'Georgia, serif' }}>Account Settings</h1>
          <p className="text-sm mt-0.5" style={{ color: 'rgba(10,22,40,0.45)' }}>Manage your profile, notifications, and security preferences.</p>
        </div>

        <div className="flex gap-1 p-1 rounded-2xl mb-6 w-fit" style={{ backgroundColor: 'rgba(10,22,40,0.06)' }}>
          {tabs.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all"
              style={{
                backgroundColor: activeTab === key ? '#0A1628' : 'transparent',
                color: activeTab === key ? 'white' : 'rgba(10,22,40,0.45)',
              }}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>

        {activeTab === 'profile' && (
          <div className="space-y-5">
            <div className="bg-white rounded-2xl border p-6" style={{ borderColor: 'rgba(10,22,40,0.09)' }}>
              <div className="flex items-center gap-5 mb-6">
                <div className="relative">
                  <div
                    className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold text-white flex-shrink-0"
                    style={{ backgroundColor: '#0A1628' }}
                  >
                    EW
                  </div>
                  <button
                    className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full flex items-center justify-center border-2 transition-opacity hover:opacity-80"
                    style={{ backgroundColor: '#C9A227', borderColor: 'white' }}
                  >
                    <Camera className="w-3.5 h-3.5 text-white" />
                  </button>
                </div>
                <div>
                  <p className="text-lg font-semibold" style={{ color: '#0A1628', fontFamily: 'Georgia, serif' }}>{profile.fullName}</p>
                  <p className="text-sm" style={{ color: 'rgba(10,22,40,0.5)' }}>{profile.role}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'rgba(10,22,40,0.35)' }}>{profile.department} Division</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center gap-1.5 text-xs font-semibold mb-1.5" style={{ color: 'rgba(10,22,40,0.45)' }}>
                    <User className="w-3.5 h-3.5" style={{ color: '#C9A227' }} /> Full Name
                  </label>
                  <input
                    type="text"
                    value={profile.fullName}
                    onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                    className={inputCls}
                    style={inputStyle}
                    onFocus={(e) => (e.currentTarget.style.boxShadow = '0 0 0 2px rgba(201,162,39,0.25)')}
                    onBlur={(e) => (e.currentTarget.style.boxShadow = 'none')}
                  />
                </div>

                <div>
                  <label className="flex items-center gap-1.5 text-xs font-semibold mb-1.5" style={{ color: 'rgba(10,22,40,0.45)' }}>
                    <Mail className="w-3.5 h-3.5" style={{ color: '#C9A227' }} /> Email Address
                    <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ backgroundColor: 'rgba(10,22,40,0.06)', color: 'rgba(10,22,40,0.35)' }}>Read only</span>
                  </label>
                  <input
                    type="email"
                    value={profile.email}
                    readOnly
                    className={inputCls}
                    style={disabledStyle}
                  />
                </div>

                <div>
                  <label className="flex items-center gap-1.5 text-xs font-semibold mb-1.5" style={{ color: 'rgba(10,22,40,0.45)' }}>
                    <Building2 className="w-3.5 h-3.5" style={{ color: '#C9A227' }} /> Department
                  </label>
                  <input
                    type="text"
                    value={profile.department}
                    onChange={(e) => setProfile({ ...profile, department: e.target.value })}
                    className={inputCls}
                    style={inputStyle}
                    onFocus={(e) => (e.currentTarget.style.boxShadow = '0 0 0 2px rgba(201,162,39,0.25)')}
                    onBlur={(e) => (e.currentTarget.style.boxShadow = 'none')}
                  />
                </div>

                <div>
                  <label className="flex items-center gap-1.5 text-xs font-semibold mb-1.5" style={{ color: 'rgba(10,22,40,0.45)' }}>
                    <Briefcase className="w-3.5 h-3.5" style={{ color: '#C9A227' }} /> Role
                    <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ backgroundColor: 'rgba(10,22,40,0.06)', color: 'rgba(10,22,40,0.35)' }}>Read only</span>
                  </label>
                  <input
                    type="text"
                    value={profile.role}
                    readOnly
                    className={inputCls}
                    style={disabledStyle}
                  />
                </div>

                <div>
                  <label className="flex items-center gap-1.5 text-xs font-semibold mb-1.5" style={{ color: 'rgba(10,22,40,0.45)' }}>
                    <Phone className="w-3.5 h-3.5" style={{ color: '#C9A227' }} /> Phone Number
                  </label>
                  <input
                    type="tel"
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    className={inputCls}
                    style={inputStyle}
                    onFocus={(e) => (e.currentTarget.style.boxShadow = '0 0 0 2px rgba(201,162,39,0.25)')}
                    onBlur={(e) => (e.currentTarget.style.boxShadow = 'none')}
                  />
                </div>

                <div>
                  <label className="flex items-center gap-1.5 text-xs font-semibold mb-1.5" style={{ color: 'rgba(10,22,40,0.45)' }}>
                    <Building2 className="w-3.5 h-3.5" style={{ color: '#C9A227' }} /> Division
                  </label>
                  <input
                    type="text"
                    value={profile.division}
                    onChange={(e) => setProfile({ ...profile, division: e.target.value })}
                    className={inputCls}
                    style={inputStyle}
                    onFocus={(e) => (e.currentTarget.style.boxShadow = '0 0 0 2px rgba(201,162,39,0.25)')}
                    onBlur={(e) => (e.currentTarget.style.boxShadow = 'none')}
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="flex items-center gap-1.5 text-xs font-semibold mb-1.5" style={{ color: 'rgba(10,22,40,0.45)' }}>
                    <MapPin className="w-3.5 h-3.5" style={{ color: '#C9A227' }} /> Branch
                  </label>
                  <input
                    type="text"
                    value={profile.branch}
                    onChange={(e) => setProfile({ ...profile, branch: e.target.value })}
                    className={inputCls}
                    style={inputStyle}
                    onFocus={(e) => (e.currentTarget.style.boxShadow = '0 0 0 2px rgba(201,162,39,0.25)')}
                    onBlur={(e) => (e.currentTarget.style.boxShadow = 'none')}
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleSaveProfile}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90"
                style={{ backgroundColor: '#C9A227', color: '#0A1628' }}
              >
                <Save className="w-4 h-4" /> Save Changes
              </button>
              {profileSaved && (
                <div className="inline-flex items-center gap-1.5 text-sm font-medium" style={{ color: '#065F46' }}>
                  <CheckCircle className="w-4 h-4" /> Profile saved successfully
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'notifications' && (
          <div className="bg-white rounded-2xl border p-6" style={{ borderColor: 'rgba(10,22,40,0.09)' }}>
            <h2 className="text-base font-semibold mb-1" style={{ color: '#0A1628', fontFamily: 'Georgia, serif' }}>Notification Preferences</h2>
            <p className="text-sm mb-6" style={{ color: 'rgba(10,22,40,0.45)' }}>Choose how and when you want to be notified about activity in Learna.</p>

            <div className="space-y-1">
              {notifItems.map((item, idx) => (
                <div
                  key={item.key}
                  className="flex items-center justify-between gap-4 py-4"
                  style={{ borderBottom: idx < notifItems.length - 1 ? '1px solid rgba(10,22,40,0.06)' : 'none' }}
                >
                  <div className="flex-1">
                    <p className="text-sm font-semibold" style={{ color: '#0A1628' }}>{item.label}</p>
                    <p className="text-xs mt-0.5 leading-relaxed" style={{ color: 'rgba(10,22,40,0.45)' }}>{item.desc}</p>
                  </div>
                  <Toggle
                    on={notifs[item.key]}
                    onToggle={() => setNotifs({ ...notifs, [item.key]: !notifs[item.key] })}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="space-y-5">
            <div className="bg-white rounded-2xl border p-6" style={{ borderColor: 'rgba(10,22,40,0.09)' }}>
              <div className="flex items-center gap-2 mb-1">
                <Lock className="w-4 h-4" style={{ color: '#C9A227' }} />
                <h2 className="text-base font-semibold" style={{ color: '#0A1628', fontFamily: 'Georgia, serif' }}>Change Password</h2>
              </div>
              <p className="text-sm mb-6" style={{ color: 'rgba(10,22,40,0.45)' }}>Use a strong password that you don't use elsewhere.</p>

              <div className="space-y-4 max-w-md">
                <div>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: 'rgba(10,22,40,0.45)' }}>Current Password</label>
                  <div className="relative">
                    <input
                      type={showCurrentPw ? 'text' : 'password'}
                      value={currentPw}
                      onChange={(e) => setCurrentPw(e.target.value)}
                      placeholder="Enter current password"
                      className={inputCls + ' pr-10'}
                      style={inputStyle}
                      onFocus={(e) => (e.currentTarget.style.boxShadow = '0 0 0 2px rgba(201,162,39,0.25)')}
                      onBlur={(e) => (e.currentTarget.style.boxShadow = 'none')}
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPw(!showCurrentPw)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 transition-opacity hover:opacity-60"
                      style={{ color: 'rgba(10,22,40,0.35)' }}
                    >
                      {showCurrentPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: 'rgba(10,22,40,0.45)' }}>New Password</label>
                  <div className="relative">
                    <input
                      type={showNewPw ? 'text' : 'password'}
                      value={newPw}
                      onChange={(e) => setNewPw(e.target.value)}
                      placeholder="Enter new password"
                      className={inputCls + ' pr-10'}
                      style={inputStyle}
                      onFocus={(e) => (e.currentTarget.style.boxShadow = '0 0 0 2px rgba(201,162,39,0.25)')}
                      onBlur={(e) => (e.currentTarget.style.boxShadow = 'none')}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPw(!showNewPw)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 transition-opacity hover:opacity-60"
                      style={{ color: 'rgba(10,22,40,0.35)' }}
                    >
                      {showNewPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <PasswordStrength password={newPw} />
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: 'rgba(10,22,40,0.45)' }}>Confirm New Password</label>
                  <div className="relative">
                    <input
                      type={showConfirmPw ? 'text' : 'password'}
                      value={confirmPw}
                      onChange={(e) => setConfirmPw(e.target.value)}
                      placeholder="Repeat new password"
                      className={inputCls + ' pr-10'}
                      style={{
                        ...inputStyle,
                        borderColor: confirmPw && confirmPw !== newPw ? '#EF4444' : 'rgba(10,22,40,0.12)',
                      }}
                      onFocus={(e) => (e.currentTarget.style.boxShadow = '0 0 0 2px rgba(201,162,39,0.25)')}
                      onBlur={(e) => (e.currentTarget.style.boxShadow = 'none')}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPw(!showConfirmPw)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 transition-opacity hover:opacity-60"
                      style={{ color: 'rgba(10,22,40,0.35)' }}
                    >
                      {showConfirmPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {confirmPw && confirmPw !== newPw && (
                    <p className="text-[11px] mt-1 font-medium" style={{ color: '#EF4444' }}>Passwords do not match</p>
                  )}
                </div>

                {pwError && (
                  <div className="px-3 py-2.5 rounded-xl text-xs font-medium" style={{ backgroundColor: 'rgba(239,68,68,0.08)', color: '#B91C1C' }}>
                    {pwError}
                  </div>
                )}

                <div className="flex items-center gap-3 pt-1">
                  <button
                    onClick={handleUpdatePassword}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90"
                    style={{ backgroundColor: '#0A1628', color: '#C9A227' }}
                  >
                    <Lock className="w-4 h-4" /> Update Password
                  </button>
                  {pwSaved && (
                    <div className="inline-flex items-center gap-1.5 text-sm font-medium" style={{ color: '#065F46' }}>
                      <CheckCircle className="w-4 h-4" /> Password updated
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="px-5 py-4 rounded-2xl border flex items-center gap-3" style={{ borderColor: 'rgba(10,22,40,0.09)', backgroundColor: 'white' }}>
              <Lock className="w-4 h-4 flex-shrink-0" style={{ color: 'rgba(10,22,40,0.25)' }} />
              <div>
                <p className="text-xs font-semibold" style={{ color: 'rgba(10,22,40,0.4)' }}>Last Login</p>
                <p className="text-sm font-medium" style={{ color: '#0A1628' }}>
                  {new Date(MOCK_PROFILE.lastLogin).toLocaleString('en-GB', {
                    weekday: 'long',
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                  {' '}&mdash; HNB Assurance Internal Network
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
