import { useState } from 'react';
import { X, CheckCheck, Bell, CheckCircle, FileText, Clock, Settings, Inbox } from 'lucide-react';

type NotifType = 'approval' | 'request' | 'reminder' | 'system';

interface Notification {
  id: number;
  type: NotifType;
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
}

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: 1,
    type: 'approval',
    title: 'Request Approved',
    description: 'Your learning request REQ-2026-0031 (Digital Banking Products Overview) has been approved by Eranda Wakista.',
    timestamp: '2026-04-11T09:05:00',
    read: false,
  },
  {
    id: 2,
    type: 'reminder',
    title: 'Session Tomorrow',
    description: 'Reminder: Unit-Linked Products Workshop starts at 09:00 tomorrow at Colombo Training Centre, Level 4.',
    timestamp: '2026-04-10T17:00:00',
    read: false,
  },
  {
    id: 3,
    type: 'request',
    title: 'Comment Added to Your Request',
    description: 'Nishantha Jayasinghe added a comment to REQ-2026-0047: "Blueprint BP-001 can be adapted for this cohort..."',
    timestamp: '2026-04-09T14:32:00',
    read: false,
  },
  {
    id: 4,
    type: 'reminder',
    title: 'Pre-Work Due Soon',
    description: 'Complete the LMS module "Investment-Linked Products Fundamentals" before your session on 22 Apr 2026.',
    timestamp: '2026-04-08T08:00:00',
    read: true,
  },
  {
    id: 5,
    type: 'system',
    title: 'Learna Platform Update',
    description: 'The AI Advisor has been upgraded with the latest HNB product knowledge base for Q2 2026. Try it now.',
    timestamp: '2026-04-07T11:00:00',
    read: true,
  },
];

const TYPE_CONFIG: Record<NotifType, { icon: typeof Bell; bg: string; color: string; label: string }> = {
  approval: { icon: CheckCircle, bg: 'rgba(16,185,129,0.1)', color: '#065F46', label: 'Approval' },
  request: { icon: FileText, bg: 'rgba(59,130,246,0.1)', color: '#1D4ED8', label: 'Request' },
  reminder: { icon: Clock, bg: 'rgba(201,162,39,0.12)', color: '#7A5B0A', label: 'Reminder' },
  system: { icon: Settings, bg: 'rgba(10,22,40,0.07)', color: 'rgba(10,22,40,0.45)', label: 'System' },
};

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function NotificationsDrawer({ isOpen, onClose }: Props) {
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);

  const unreadCount = notifications.filter((n) => !n.read).length;

  function markAllRead() {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  }

  function markRead(id: number) {
    setNotifications(notifications.map((n) => n.id === id ? { ...n, read: true } : n));
  }

  return (
    <>
      <div
        className="fixed inset-0 z-40 transition-opacity duration-300"
        style={{
          backgroundColor: 'rgba(10,22,40,0.35)',
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? 'auto' : 'none',
          backdropFilter: 'blur(2px)',
        }}
        onClick={onClose}
      />

      <div
        className="fixed top-0 right-0 h-full z-50 flex flex-col"
        style={{
          width: '400px',
          maxWidth: '100vw',
          backgroundColor: 'white',
          transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow: '-8px 0 40px rgba(10,22,40,0.12)',
          fontFamily: 'Inter, sans-serif',
        }}
      >
        <div
          className="flex items-center justify-between px-5 py-4 border-b"
          style={{ borderColor: 'rgba(10,22,40,0.08)' }}
        >
          <div className="flex items-center gap-2.5">
            <Bell className="w-4 h-4" style={{ color: '#C9A227' }} />
            <span className="text-sm font-semibold" style={{ color: '#0A1628', fontFamily: 'Georgia, serif' }}>
              Notifications
            </span>
            {unreadCount > 0 && (
              <span
                className="inline-flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-bold"
                style={{ backgroundColor: '#C9A227', color: '#0A1628' }}
              >
                {unreadCount}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="inline-flex items-center gap-1 text-xs font-semibold transition-opacity hover:opacity-70"
                style={{ color: 'rgba(10,22,40,0.45)' }}
              >
                <CheckCheck className="w-3.5 h-3.5" /> Mark all read
              </button>
            )}
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-lg flex items-center justify-center transition-all hover:opacity-70"
              style={{ backgroundColor: 'rgba(10,22,40,0.06)', color: '#0A1628' }}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-3 px-8 text-center">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center"
                style={{ backgroundColor: 'rgba(10,22,40,0.05)' }}
              >
                <Inbox className="w-6 h-6" style={{ color: 'rgba(10,22,40,0.25)' }} />
              </div>
              <div>
                <p className="text-sm font-semibold" style={{ color: '#0A1628' }}>All caught up</p>
                <p className="text-xs mt-1" style={{ color: 'rgba(10,22,40,0.4)' }}>No notifications to show right now.</p>
              </div>
            </div>
          ) : (
            <div>
              {unreadCount > 0 && (
                <p
                  className="px-5 pt-3 pb-1 text-[11px] font-semibold uppercase tracking-wider"
                  style={{ color: 'rgba(10,22,40,0.35)' }}
                >
                  Unread
                </p>
              )}
              {notifications
                .sort((a, b) => (a.read === b.read ? 0 : a.read ? 1 : -1))
                .map((notif, idx, arr) => {
                  const cfg = TYPE_CONFIG[notif.type];
                  const Icon = cfg.icon;
                  const prevRead = idx > 0 && arr[idx - 1].read;
                  const showDivider = !prevRead && notif.read && unreadCount > 0 && unreadCount < notifications.length;
                  return (
                    <div key={notif.id}>
                      {showDivider && (
                        <p
                          className="px-5 pt-4 pb-1 text-[11px] font-semibold uppercase tracking-wider"
                          style={{ color: 'rgba(10,22,40,0.35)' }}
                        >
                          Earlier
                        </p>
                      )}
                      <button
                        className="w-full text-left flex items-start gap-3 px-5 py-3.5 transition-all hover:bg-gray-50"
                        style={{
                          backgroundColor: !notif.read ? 'rgba(201,162,39,0.04)' : 'transparent',
                          borderBottom: '1px solid rgba(10,22,40,0.05)',
                        }}
                        onClick={() => markRead(notif.id)}
                      >
                        <div
                          className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                          style={{ backgroundColor: cfg.bg }}
                        >
                          <Icon className="w-4 h-4" style={{ color: cfg.color }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <p className="text-sm font-semibold leading-snug" style={{ color: '#0A1628' }}>
                              {notif.title}
                            </p>
                            <div className="flex items-center gap-1.5 flex-shrink-0">
                              {!notif.read && (
                                <span
                                  className="w-2 h-2 rounded-full flex-shrink-0"
                                  style={{ backgroundColor: '#C9A227' }}
                                />
                              )}
                              <span className="text-[11px]" style={{ color: 'rgba(10,22,40,0.35)' }}>
                                {timeAgo(notif.timestamp)}
                              </span>
                            </div>
                          </div>
                          <p
                            className="text-xs mt-1 leading-relaxed"
                            style={{ color: 'rgba(10,22,40,0.55)' }}
                          >
                            {notif.description}
                          </p>
                          <span
                            className="inline-flex mt-1.5 px-1.5 py-0.5 rounded text-[10px] font-semibold"
                            style={{ backgroundColor: cfg.bg, color: cfg.color }}
                          >
                            {cfg.label}
                          </span>
                        </div>
                      </button>
                    </div>
                  );
                })}
            </div>
          )}
        </div>

        <div
          className="px-5 py-3 border-t flex items-center justify-between"
          style={{ borderColor: 'rgba(10,22,40,0.08)' }}
        >
          <p className="text-xs" style={{ color: 'rgba(10,22,40,0.35)' }}>
            {notifications.length} notification{notifications.length !== 1 ? 's' : ''}
          </p>
          <button
            className="text-xs font-semibold transition-opacity hover:opacity-70"
            style={{ color: '#C9A227' }}
          >
            View all activity
          </button>
        </div>
      </div>
    </>
  );
}
