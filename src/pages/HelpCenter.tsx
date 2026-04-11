import { useState } from 'react';
import {
  Search,
  ChevronDown,
  BookOpen,
  PlayCircle,
  Mail,
  Bug,
  Phone,
  Clock,
  MessageSquare,
  ArrowRight,
  HelpCircle,
  FileText,
  Layers,
  BarChart2,
  CheckCircle,
  RefreshCw,
  Users,
} from 'lucide-react';

interface FAQ {
  id: number;
  icon: typeof HelpCircle;
  iconColor: string;
  question: string;
  answer: string;
}

const FAQS: FAQ[] = [
  {
    id: 1,
    icon: FileText,
    iconColor: '#1D4ED8',
    question: 'How do I submit a training request?',
    answer:
      'To submit a training request, navigate to "New Request" from the left sidebar. Fill in the request details including the training topic, business rationale, target participants, and preferred timeline. Your request will be automatically classified using AI and routed to the L&D team. You can track the status of your request under "My Requests" at any time.',
  },
  {
    id: 2,
    icon: Layers,
    iconColor: '#C9A227',
    question: 'How does the AI classification system work?',
    answer:
      'When you submit a training request, Learna\'s AI engine analyses the content to automatically identify the training category (e.g., product knowledge, compliance, soft skills), priority level, and suggested 6Ds approach. This helps the L&D team process requests faster and ensures consistent categorisation. The AI classification can be reviewed and adjusted by L&D officers before the request is approved.',
  },
  {
    id: 3,
    icon: BookOpen,
    iconColor: '#065F46',
    question: 'What is the 6Ds framework and why does Learna use it?',
    answer:
      'The 6Ds framework — Define, Design, Deliver, Drive, Deploy, and Document — is a results-focused approach to workplace learning developed by The 6Ds Company. HNB Assurance uses this framework to ensure every training programme is directly linked to a business outcome, not just a learning activity. Learna structures all training requests, programme designs, and impact reports around the 6Ds to maximise the return on every learning investment.',
  },
  {
    id: 4,
    icon: BarChart2,
    iconColor: '#7C3AED',
    question: 'How do I track my learning journey?',
    answer:
      'Your personal learning journey is available under the "My Learning Journey" section in the sidebar. It shows all the programmes you\'ve attended, your current enrolments, upcoming sessions, and your transfer check-in history. You can also view any certifications or badges earned, and see a timeline of your development activities at HNB Assurance.',
  },
  {
    id: 5,
    icon: Users,
    iconColor: '#1D4ED8',
    question: 'How do I nominate staff for a programme?',
    answer:
      'Managers can nominate team members for available programmes via the "Incoming Requests" or "Programme Design" sections. When a scheduled programme is open for enrolment, you will see a "Nominate Staff" option. Select the team members, confirm their availability, and submit the nomination. The L&D team will confirm enrolment and send calendar invites to nominated staff.',
  },
  {
    id: 6,
    icon: CheckCircle,
    iconColor: '#065F46',
    question: 'What happens after my training request is approved?',
    answer:
      'Once your request is approved, the L&D team will design a programme and schedule a delivery date. You will receive an email notification with the programme details and a calendar invite. After the programme is delivered, you will receive a transfer check-in reminder at 30, 60, and 90 days to measure how you have applied the learning on the job. Your line manager may also receive a check-in prompt.',
  },
  {
    id: 7,
    icon: RefreshCw,
    iconColor: '#C9A227',
    question: 'How do transfer check-ins work?',
    answer:
      'Transfer check-ins are short follow-up assessments sent automatically after a training programme to measure on-the-job application. They are typically sent at 30, 60, and 90 days post-training. Each check-in asks you (and sometimes your manager) to rate how well the learning has been applied, what changes in behaviour or performance you\'ve observed, and any barriers to application. This data feeds into the ROI and Impact Reports.',
  },
  {
    id: 8,
    icon: BarChart2,
    iconColor: '#065F46',
    question: 'How do I read the Impact Reports?',
    answer:
      'Impact Reports are available under the "Impact Reports" section for L&D Officers and Admins. Each report shows training completion rates, average assessment scores, pre/post performance comparisons, and transfer check-in results. Reports are available by programme, department, and time period. You can also export reports in PDF, Excel, or CSV format from the "Reports & Export" page for sharing with leadership or HR.',
  },
];

interface QuickLink {
  icon: typeof BookOpen;
  label: string;
  description: string;
  iconBg: string;
  iconColor: string;
  action: string;
}

const QUICK_LINKS: QuickLink[] = [
  {
    icon: FileText,
    label: 'User Guide',
    description: 'Full documentation for all Learna features and workflows.',
    iconBg: 'rgba(10,22,40,0.07)',
    iconColor: '#0A1628',
    action: 'Open Guide',
  },
  {
    icon: PlayCircle,
    label: 'Video Tutorial',
    description: 'Watch short walk-through videos to get started quickly.',
    iconBg: 'rgba(201,162,39,0.1)',
    iconColor: '#C9A227',
    action: 'Watch Now',
  },
  {
    icon: Mail,
    label: 'Contact L&D Team',
    description: 'Email the L&D team directly for support or escalations.',
    iconBg: 'rgba(16,185,129,0.1)',
    iconColor: '#065F46',
    action: 'Send Email',
  },
  {
    icon: Bug,
    label: 'Submit a Bug',
    description: 'Found an issue? Report it to our IT support team.',
    iconBg: 'rgba(220,38,38,0.08)',
    iconColor: '#991B1B',
    action: 'Report Issue',
  },
];

function FAQItem({ faq }: { faq: FAQ }) {
  const [open, setOpen] = useState(false);
  const Icon = faq.icon;

  return (
    <div
      className="border rounded-2xl overflow-hidden transition-all duration-200"
      style={{
        borderColor: open ? 'rgba(201,162,39,0.35)' : 'rgba(10,22,40,0.09)',
        boxShadow: open ? '0 0 0 3px rgba(201,162,39,0.07)' : 'none',
      }}
    >
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-4 px-5 py-4 text-left transition-colors hover:bg-amber-50/30"
        style={{ backgroundColor: open ? 'rgba(247,245,240,0.8)' : 'white' }}
      >
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: open ? `${faq.iconColor}18` : 'rgba(10,22,40,0.05)' }}
        >
          <Icon className="w-4 h-4 transition-colors" style={{ color: open ? faq.iconColor : 'rgba(10,22,40,0.35)' }} />
        </div>
        <span
          className="flex-1 text-sm font-semibold leading-snug"
          style={{ color: open ? '#0A1628' : 'rgba(10,22,40,0.75)', fontFamily: open ? 'Georgia, serif' : 'inherit' }}
        >
          {faq.question}
        </span>
        <ChevronDown
          className="w-4 h-4 flex-shrink-0 transition-transform duration-200"
          style={{ color: 'rgba(10,22,40,0.3)', transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
        />
      </button>

      {open && (
        <div
          className="px-5 pb-5 pt-1"
          style={{ backgroundColor: 'rgba(247,245,240,0.5)', borderTop: '1px solid rgba(10,22,40,0.06)' }}
        >
          <p className="text-sm leading-relaxed pl-[52px]" style={{ color: 'rgba(10,22,40,0.65)' }}>
            {faq.answer}
          </p>
        </div>
      )}
    </div>
  );
}

export default function HelpCenter() {
  const [search, setSearch] = useState('');

  const filtered = search.trim()
    ? FAQS.filter(
        (f) =>
          f.question.toLowerCase().includes(search.toLowerCase()) ||
          f.answer.toLowerCase().includes(search.toLowerCase()),
      )
    : FAQS;

  return (
    <div className="min-h-screen" style={{ background: '#F7F5F0', fontFamily: 'Inter, sans-serif' }}>
      <div className="max-w-3xl mx-auto px-4 pt-2 pb-16">

        <div className="mb-8">
          <div className="flex items-center gap-2 mb-1">
            <HelpCircle className="w-4 h-4" style={{ color: '#C9A227' }} />
            <p className="text-xs font-bold uppercase tracking-widest" style={{ color: 'rgba(10,22,40,0.4)' }}>Help &amp; Support</p>
          </div>
          <h1 className="text-2xl font-bold mb-1" style={{ color: '#0A1628', fontFamily: 'Georgia, serif' }}>
            Help Center
          </h1>
          <p className="text-sm" style={{ color: 'rgba(10,22,40,0.45)' }}>
            Find answers, guides, and contact options for the Learna platform.
          </p>
        </div>

        <div className="relative mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none" style={{ color: 'rgba(10,22,40,0.3)' }} />
          <input
            type="text"
            placeholder="Search for help…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-4 rounded-2xl border text-sm outline-none transition-all shadow-sm"
            style={{
              borderColor: search ? 'rgba(201,162,39,0.4)' : 'rgba(10,22,40,0.1)',
              backgroundColor: 'white',
              color: '#0A1628',
              boxShadow: search ? '0 0 0 3px rgba(201,162,39,0.08)' : '0 1px 4px rgba(10,22,40,0.06)',
            }}
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold px-2 py-0.5 rounded-lg"
              style={{ backgroundColor: 'rgba(10,22,40,0.06)', color: 'rgba(10,22,40,0.4)' }}
            >
              Clear
            </button>
          )}
        </div>

        <div className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold" style={{ color: '#0A1628', fontFamily: 'Georgia, serif' }}>
              Frequently Asked Questions
            </h2>
            {search && (
              <span className="text-xs" style={{ color: 'rgba(10,22,40,0.4)' }}>
                {filtered.length} result{filtered.length !== 1 ? 's' : ''}
              </span>
            )}
          </div>

          {filtered.length > 0 ? (
            <div className="space-y-2">
              {filtered.map((faq) => <FAQItem key={faq.id} faq={faq} />)}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border px-6 py-10 text-center" style={{ borderColor: 'rgba(10,22,40,0.09)' }}>
              <MessageSquare className="w-8 h-8 mx-auto mb-3" style={{ color: 'rgba(10,22,40,0.2)' }} />
              <p className="text-sm font-semibold mb-1" style={{ color: 'rgba(10,22,40,0.5)' }}>No results found</p>
              <p className="text-xs" style={{ color: 'rgba(10,22,40,0.35)' }}>
                Try different keywords, or contact the L&amp;D team directly below.
              </p>
            </div>
          )}
        </div>

        <div className="mb-10">
          <h2 className="text-base font-semibold mb-4" style={{ color: '#0A1628', fontFamily: 'Georgia, serif' }}>
            Quick Links
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {QUICK_LINKS.map((link) => {
              const Icon = link.icon;
              return (
                <button
                  key={link.label}
                  className="bg-white rounded-2xl border p-4 text-left flex items-start gap-4 transition-all hover:shadow-md hover:-translate-y-0.5 group"
                  style={{ borderColor: 'rgba(10,22,40,0.09)' }}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: link.iconBg }}
                  >
                    <Icon className="w-5 h-5" style={{ color: link.iconColor }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold mb-0.5" style={{ color: '#0A1628' }}>{link.label}</p>
                    <p className="text-xs leading-relaxed" style={{ color: 'rgba(10,22,40,0.45)' }}>{link.description}</p>
                  </div>
                  <ArrowRight
                    className="w-4 h-4 flex-shrink-0 mt-1 transition-transform group-hover:translate-x-1"
                    style={{ color: 'rgba(10,22,40,0.2)' }}
                  />
                </button>
              );
            })}
          </div>
        </div>

        <div
          className="rounded-2xl border p-6"
          style={{
            background: 'linear-gradient(135deg, #0A1628 0%, #0F2040 100%)',
            borderColor: 'rgba(10,22,40,0.15)',
          }}
        >
          <div className="flex items-center gap-2 mb-1">
            <MessageSquare className="w-4 h-4" style={{ color: '#C9A227' }} />
            <p className="text-xs font-bold uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.4)' }}>
              Still need help?
            </p>
          </div>
          <h3 className="text-base font-semibold mb-4" style={{ color: 'white', fontFamily: 'Georgia, serif' }}>
            Contact the L&amp;D Team
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex items-start gap-3">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: 'rgba(201,162,39,0.15)' }}
              >
                <Mail className="w-4 h-4" style={{ color: '#C9A227' }} />
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider mb-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>Email</p>
                <p className="text-sm font-semibold" style={{ color: 'white' }}>learna@hnb.lk</p>
                <p className="text-[11px] mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>Replies within 1 business day</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: 'rgba(201,162,39,0.15)' }}
              >
                <Phone className="w-4 h-4" style={{ color: '#C9A227' }} />
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider mb-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>Phone</p>
                <p className="text-sm font-semibold" style={{ color: 'white' }}>+94 11 249 0000</p>
                <p className="text-[11px] mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>Ext. 2250 — L&amp;D Direct</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: 'rgba(201,162,39,0.15)' }}
              >
                <Clock className="w-4 h-4" style={{ color: '#C9A227' }} />
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider mb-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>Office Hours</p>
                <p className="text-sm font-semibold" style={{ color: 'white' }}>Mon – Fri</p>
                <p className="text-[11px] mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>8:30 AM – 5:00 PM (IST)</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
