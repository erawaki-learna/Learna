import { useState, useEffect, useRef } from 'react';
import {
  Users, TrendingUp, Target, Zap,
  AlertCircle, CheckCircle2, Send, Loader2,
  RefreshCw, Star, ArrowRight, MessageSquare
} from 'lucide-react';

const NAVY = '#0A1628';
const GOLD = '#C9A227';
const CREAM = '#F7F5F0';

interface CompetencyScores {
  resilience: number;
  activeEmpathy: number;
  networkingIntelligence: number;
  complexitySimplification: number;
  commitmentDiscipline: number;
}

function calcTrust(s: CompetencyScores): number {
  const integrity = (s.activeEmpathy + s.networkingIntelligence) / 2;
  const competence = s.complexitySimplification;
  const capability = (s.resilience + s.commitmentDiscipline) / 2;
  return Math.round(((integrity + competence + capability) / 3) * 10) / 10;
}

function avgScore(s: CompetencyScores): number {
  return Math.round(((s.resilience + s.activeEmpathy + s.networkingIntelligence + s.complexitySimplification + s.commitmentDiscipline) / 5) * 10) / 10;
}

interface TeamMember {
  id: number;
  name: string;
  role: string;
  programme: string;
  stage: string;
  completionRate: number;
  lastActivity: string;
  selfScores: CompetencyScores;
  leaderScores: CompetencyScores;
  transferRate: number;
  daysPostTraining: number;
  checkInStatus: 'Completed' | 'Overdue' | 'Pending' | 'N/A';
}

const TEAM: TeamMember[] = [
  { id: 1, name: 'Dilshan Perera', role: 'Branch Executive', programme: 'Product Knowledge Bootcamp', stage: 'D3', completionRate: 72, lastActivity: '2 hours ago',
    selfScores: { resilience: 6, activeEmpathy: 7, networkingIntelligence: 5, complexitySimplification: 6, commitmentDiscipline: 7 },
    leaderScores: { resilience: 5, activeEmpathy: 6, networkingIntelligence: 4, complexitySimplification: 5, commitmentDiscipline: 5 },
    transferRate: 60, daysPostTraining: 18, checkInStatus: 'Overdue' },
  { id: 2, name: 'Nimasha Fernando', role: 'Senior BDE', programme: 'Advanced Sales Techniques', stage: 'D5', completionRate: 91, lastActivity: 'Yesterday',
    selfScores: { resilience: 8, activeEmpathy: 9, networkingIntelligence: 8, complexitySimplification: 7, commitmentDiscipline: 9 },
    leaderScores: { resilience: 8, activeEmpathy: 8, networkingIntelligence: 7, complexitySimplification: 8, commitmentDiscipline: 8 },
    transferRate: 90, daysPostTraining: 45, checkInStatus: 'Completed' },
  { id: 3, name: 'Kasun Jayawardena', role: 'BDE', programme: 'Compliance & Ethics 2026', stage: 'D1', completionRate: 38, lastActivity: '3 days ago',
    selfScores: { resilience: 5, activeEmpathy: 4, networkingIntelligence: 4, complexitySimplification: 5, commitmentDiscipline: 4 },
    leaderScores: { resilience: 4, activeEmpathy: 3, networkingIntelligence: 3, complexitySimplification: 4, commitmentDiscipline: 4 },
    transferRate: 0, daysPostTraining: 0, checkInStatus: 'N/A' },
  { id: 4, name: 'Thilini Wickramasinghe', role: 'Branch Manager', programme: 'Leadership Essentials', stage: 'D4', completionRate: 85, lastActivity: 'Today',
    selfScores: { resilience: 7, activeEmpathy: 8, networkingIntelligence: 7, complexitySimplification: 6, commitmentDiscipline: 8 },
    leaderScores: { resilience: 8, activeEmpathy: 7, networkingIntelligence: 8, complexitySimplification: 7, commitmentDiscipline: 8 },
    transferRate: 80, daysPostTraining: 32, checkInStatus: 'Completed' },
  { id: 5, name: 'Ruwan Silva', role: 'BDE', programme: 'Digital Tools for Sales', stage: 'D2', completionRate: 55, lastActivity: '1 week ago',
    selfScores: { resilience: 6, activeEmpathy: 5, networkingIntelligence: 6, complexitySimplification: 5, commitmentDiscipline: 5 },
    leaderScores: { resilience: 5, activeEmpathy: 4, networkingIntelligence: 5, complexitySimplification: 5, commitmentDiscipline: 4 },
    transferRate: 0, daysPostTraining: 0, checkInStatus: 'Pending' },
  { id: 6, name: 'Sandali Rathnayake', role: 'Senior BDE', programme: 'Customer Experience Mastery', stage: 'D6', completionRate: 100, lastActivity: 'Today',
    selfScores: { resilience: 9, activeEmpathy: 9, networkingIntelligence: 8, complexitySimplification: 9, commitmentDiscipline: 9 },
    leaderScores: { resilience: 9, activeEmpathy: 9, networkingIntelligence: 9, complexitySimplification: 8, commitmentDiscipline: 9 },
    transferRate: 100, daysPostTraining: 60, checkInStatus: 'Completed' },
];

const UPCOMING_PROGRAMME = 'Q3 Bancassurance Sales Campaign';
const MANAGER_NAME = 'Eranda';

function buildTeamContext(): string {
  const memberSummaries = TEAM.map(m => {
    const selfAvg = avgScore(m.selfScores);
    const leaderAvg = avgScore(m.leaderScores);
    const selfTrust = calcTrust(m.selfScores);
    const leaderTrust = calcTrust(m.leaderScores);
    const gap = selfAvg - leaderAvg;
    const weakestKey = Object.entries(m.leaderScores).sort((a,b) => a[1]-b[1])[0][0];
    const weakestLabel: Record<string,string> = {
      resilience: 'Resilience', activeEmpathy: 'Active Empathy',
      networkingIntelligence: 'Networking Intelligence',
      complexitySimplification: 'Complexity Simplification',
      commitmentDiscipline: 'Commitment & Discipline'
    };
    return `${m.name} (${m.role}): ${m.stage} of ${m.programme}, ${m.completionRate}% complete. Self avg: ${selfAvg}/10, Leader avg: ${leaderAvg}/10, Gap: ${gap > 0 ? '+' : ''}${gap.toFixed(1)}. Self Trust Score: ${selfTrust}/10, Leader Trust Score: ${leaderTrust}/10. Weakest competency (leader-rated): ${weakestLabel[weakestKey]}. Transfer check-in: ${m.checkInStatus}. Days post-training: ${m.daysPostTraining}.`;
  }).join('\n');

  return `You are a management intelligence assistant inside Learna, an L&D platform for HNB Assurance PLC in Sri Lanka.
You are speaking directly to ${MANAGER_NAME}, a leader in the Bancassurance division.
Never mention AI, Claude, or any technology. Speak as if you are Learna built-in intelligence.
Always respond in clear, practical English. Be direct and specific. Maximum 4 sentences per response unless asked for more.
Use real names from the team data. Never make up data.
The competency framework has 5 rated competencies: Resilience, Active Empathy, Networking Intelligence, Complexity Simplification, Commitment & Discipline. Level of Trust is calculated as T = I + C1 + C2 where I=integrity (empathy+networking avg), C1=competence (complexity simplification), C2=capability (resilience+discipline avg).

TEAM DATA:
${memberSummaries}

Upcoming programme: ${UPCOMING_PROGRAMME}
Today: ${new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}`;
}

async function askLearna(systemPrompt: string, userPrompt: string): Promise<string> {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1000,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }],
    }),
  });
  if (!response.ok) throw new Error('Failed to fetch');
  const data = await response.json();
  return data.content[0].text as string;
}

function InsightCard({ title, content, icon: Icon, loading, onRefresh }: {
  title: string; content: string; icon: typeof Users; loading: boolean; onRefresh?: () => void;
}) {
  return (
    <div className="rounded-2xl border bg-white overflow-hidden" style={{ borderColor: 'rgba(10,22,40,0.08)' }}>
      <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: 'rgba(10,22,40,0.06)', background: NAVY }}>
        <div className="flex items-center gap-2">
          <Icon size={16} style={{ color: GOLD }} />
          <span className="text-sm font-semibold text-white" style={{ fontFamily: 'Georgia, serif' }}>{title}</span>
        </div>
        {onRefresh && (
          <button onClick={onRefresh} className="p-1 rounded-lg transition-opacity hover:opacity-70">
            <RefreshCw size={13} style={{ color: GOLD }} className={loading ? 'animate-spin' : ''} />
          </button>
        )}
      </div>
      <div className="px-5 py-4 min-h-16">
        {loading ? (
          <div className="flex items-center gap-2">
            <Loader2 size={14} className="animate-spin" style={{ color: GOLD }} />
            <span className="text-sm" style={{ color: 'rgba(10,22,40,0.4)' }}>Analysing your team...</span>
          </div>
        ) : (
          <p className="text-sm leading-relaxed" style={{ color: '#334155' }}>{content}</p>
        )}
      </div>
    </div>
  );
}

function MemberRow({ member }: { member: TeamMember }) {
  const gap = avgScore(member.selfScores) - avgScore(member.leaderScores);
  const trustScore = calcTrust(member.leaderScores);
  const gapColor = Math.abs(gap) > 2 ? '#dc2626' : Math.abs(gap) > 1 ? '#d97706' : '#16a34a';
  const statusColors: Record<string, string> = {
    Completed: '#16a34a', Overdue: '#dc2626', Pending: '#d97706', 'N/A': '#94a3b8'
  };
  return (
    <div className="flex items-center justify-between py-3 border-b last:border-0" style={{ borderColor: 'rgba(10,22,40,0.06)' }}>
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0" style={{ background: NAVY }}>
          {member.name.split(' ').map(n => n[0]).join('')}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold truncate" style={{ color: NAVY }}>{member.name}</p>
          <p className="text-xs truncate" style={{ color: 'rgba(10,22,40,0.45)' }}>{member.role} · {member.stage}</p>
        </div>
      </div>
      <div className="flex items-center gap-4 flex-shrink-0 ml-4">
        <div className="text-right hidden sm:block">
          <p className="text-xs font-medium" style={{ color: 'rgba(10,22,40,0.4)' }}>Gap</p>
          <p className="text-sm font-bold" style={{ color: gapColor }}>{gap > 0 ? '+' : ''}{gap.toFixed(1)}</p>
        </div>
        <div className="text-right hidden sm:block">
          <p className="text-xs font-medium" style={{ color: 'rgba(10,22,40,0.4)' }}>Trust</p>
          <p className="text-sm font-bold" style={{ color: trustScore >= 7 ? '#16a34a' : trustScore >= 5 ? '#d97706' : '#dc2626' }}>{trustScore}</p>
        </div>
        <div className="text-right hidden sm:block">
          <p className="text-xs font-medium" style={{ color: 'rgba(10,22,40,0.4)' }}>Check-in</p>
          <p className="text-xs font-semibold" style={{ color: statusColors[member.checkInStatus] }}>{member.checkInStatus}</p>
        </div>
        <div className="w-20 hidden md:block">
          <div className="flex justify-between text-xs mb-1" style={{ color: 'rgba(10,22,40,0.4)' }}>
            <span>Progress</span><span>{member.completionRate}%</span>
          </div>
          <div className="w-full rounded-full overflow-hidden" style={{ height: 5, background: '#e2e8f0' }}>
            <div style={{ width: `${member.completionRate}%`, background: member.completionRate >= 80 ? '#16a34a' : member.completionRate >= 50 ? GOLD : '#dc2626', height: '100%', borderRadius: 9999 }} />
          </div>
        </div>
      </div>
    </div>
  );
}

interface ChatMessage { role: 'user' | 'assistant'; content: string; }

export default function ManagerHub() {
  const [pulse, setPulse] = useState('');
  const [pulseLoading, setPulseLoading] = useState(true);
  const [coaching, setCoaching] = useState('');
  const [coachingLoading, setCoachingLoading] = useState(true);
  const [readiness, setReadiness] = useState<{ready?: string[]; notReady?: string[]; action?: string} | null>(null);
  const [readinessLoading, setReadinessLoading] = useState(true);
  const [action, setAction] = useState('');
  const [actionLoading, setActionLoading] = useState(true);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);
  const context = buildTeamContext();

  useEffect(() => { loadPulse(); loadCoaching(); loadReadiness(); loadAction(); }, []);
  useEffect(() => { chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [chatMessages]);

  async function loadPulse() {
    setPulseLoading(true);
    try { const r = await askLearna(context, 'Give me a 3-sentence team pulse. What is the overall learning health this week? Mention specific names. Be direct.'); setPulse(r); }
    catch { setPulse('Unable to generate team pulse. Please try refreshing.'); }
    setPulseLoading(false);
  }

  async function loadCoaching() {
    setCoachingLoading(true);
    try { const r = await askLearna(context, 'Identify one team member needing urgent attention and give exactly 3 specific talking points for a 1-on-1 this week. Format: [Name]: then three numbered points.'); setCoaching(r); }
    catch { setCoaching('Unable to generate coaching focus right now.'); }
    setCoachingLoading(false);
  }

  async function loadReadiness() {
    setReadinessLoading(true);
    try {
      const raw = await askLearna(context, `Assess team readiness for ${UPCOMING_PROGRAMME}. Respond ONLY as valid JSON, no markdown: {"ready": ["Name: reason"], "notReady": ["Name: reason"], "action": "one action sentence"}`);
      const parsed = JSON.parse(raw.replace(/\`\`\`json|\`\`\`/g, '').trim());
      setReadiness(parsed);
    } catch { setReadiness({ ready: [], notReady: [], action: 'Unable to generate readiness assessment.' }); }
    setReadinessLoading(false);
  }

  async function loadAction() {
    setActionLoading(true);
    try { const r = await askLearna(context, 'Give me ONE specific action to take this week to improve team learning outcomes. One sentence. Start with a verb.'); setAction(r); }
    catch { setAction('Unable to generate action recommendation.'); }
    setActionLoading(false);
  }

  async function handleChatSend() {
    if (!chatInput.trim() || chatLoading) return;
    const userMsg: ChatMessage = { role: 'user', content: chatInput.trim() };
    const updated = [...chatMessages, userMsg];
    setChatMessages(updated);
    setChatInput('');
    setChatLoading(true);
    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: 'claude-haiku-4-5-20251001', max_tokens: 1000, system: context + '\nAnswer using only team data. Be specific, use names, be brief.', messages: updated }),
      });
      const data = await response.json();
      setChatMessages(prev => [...prev, { role: 'assistant', content: data.content[0].text }]);
    } catch { setChatMessages(prev => [...prev, { role: 'assistant', content: 'Could not process that. Please try again.' }]); }
    setChatLoading(false);
  }

  const quickQuestions = ['Who needs my attention most this week?', 'Who has the biggest Trust Score gap?', 'Which team member is closest to completing their programme?', 'What should I focus on with Kasun?'];
  const teamAvgCompletion = Math.round(TEAM.reduce((s, m) => s + m.completionRate, 0) / TEAM.length);
  const teamAvgTrust = (TEAM.reduce((s, m) => s + calcTrust(m.leaderScores), 0) / TEAM.length).toFixed(1);
  const overdueCount = TEAM.filter(m => m.checkInStatus === 'Overdue').length;
  const completedCount = TEAM.filter(m => m.completionRate === 100).length;

  return (
    <div className="min-h-screen" style={{ background: CREAM, fontFamily: 'Inter, sans-serif' }}>
      <div className="px-6 py-6" style={{ background: NAVY }}>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white" style={{ fontFamily: 'Georgia, serif' }}>Good morning, {MANAGER_NAME}.</h1>
            <p className="text-sm mt-1" style={{ color: '#8899bb' }}>{new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })} · {TEAM.length} team members · Bancassurance Division</p>
          </div>
          <div className="text-right">
            <p className="text-xs font-medium" style={{ color: GOLD }}>LEARNA INTELLIGENCE</p>
            <p className="text-xs mt-0.5" style={{ color: '#8899bb' }}>Updated just now</p>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-3 mt-5">
          {[
            { label: 'Avg Completion', value: `${teamAvgCompletion}%`, icon: TrendingUp, color: '#16a34a' },
            { label: 'Avg Trust Score', value: teamAvgTrust, icon: Star, color: GOLD },
            { label: 'Overdue Check-ins', value: overdueCount, icon: AlertCircle, color: '#dc2626' },
            { label: 'Fully Complete', value: completedCount, icon: CheckCircle2, color: '#16a34a' },
          ].map(stat => (
            <div key={stat.label} className="rounded-xl px-4 py-3" style={{ background: 'rgba(255,255,255,0.06)' }}>
              <div className="flex items-center gap-1.5 mb-1">
                <stat.icon size={13} style={{ color: stat.color }} />
                <p className="text-xs" style={{ color: '#8899bb' }}>{stat.label}</p>
              </div>
              <p className="text-xl font-bold" style={{ color: stat.color, fontFamily: 'Georgia, serif' }}>{stat.value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="px-6 py-6 space-y-5 max-w-5xl mx-auto">
        <div className="rounded-2xl p-5 border-l-4 bg-white" style={{ borderLeftColor: GOLD, border: '1px solid rgba(10,22,40,0.08)', borderLeft: `4px solid ${GOLD}` }}>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${GOLD}20` }}>
              <Zap size={16} style={{ color: GOLD }} />
            </div>
            <div className="flex-1">
              <p className="text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: GOLD }}>Your Action This Week</p>
              {actionLoading ? <div className="flex items-center gap-2"><Loader2 size={14} className="animate-spin" style={{ color: GOLD }} /><span className="text-sm" style={{ color: 'rgba(10,22,40,0.4)' }}>Thinking...</span></div>
                : <p className="text-base font-medium leading-relaxed" style={{ color: NAVY }}>{action}</p>}
            </div>
            <button onClick={loadAction} className="p-1.5 rounded-lg flex-shrink-0" style={{ background: `${GOLD}15` }}>
              <RefreshCw size={13} style={{ color: GOLD }} className={actionLoading ? 'animate-spin' : ''} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InsightCard title="Team Pulse" content={pulse} icon={Users} loading={pulseLoading} onRefresh={loadPulse} />
          <InsightCard title="Coaching Spotlight" content={coaching} icon={Star} loading={coachingLoading} onRefresh={loadCoaching} />

          <div className="rounded-2xl border bg-white overflow-hidden" style={{ borderColor: 'rgba(10,22,40,0.08)' }}>
            <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: 'rgba(10,22,40,0.06)', background: NAVY }}>
              <div className="flex items-center gap-2"><Target size={16} style={{ color: GOLD }} /><span className="text-sm font-semibold text-white" style={{ fontFamily: 'Georgia, serif' }}>Readiness — {UPCOMING_PROGRAMME}</span></div>
              <button onClick={loadReadiness} className="p-1 rounded-lg transition-opacity hover:opacity-70"><RefreshCw size={13} style={{ color: GOLD }} className={readinessLoading ? 'animate-spin' : ''} /></button>
            </div>
            <div className="px-5 py-4">
              {readinessLoading ? <div className="flex items-center gap-2"><Loader2 size={14} className="animate-spin" style={{ color: GOLD }} /><span className="text-sm" style={{ color: 'rgba(10,22,40,0.4)' }}>Analysing campaign readiness...</span></div>
                : readiness ? (
                  <div className="space-y-3">
                    {readiness.ready && readiness.ready.length > 0 && (<div><p className="text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: '#16a34a' }}>✓ Ready</p><ul className="space-y-1">{readiness.ready.map((item, i) => <li key={i} className="flex gap-2 text-sm" style={{ color: '#334155' }}><span style={{ color: '#16a34a', flexShrink: 0 }}>•</span>{item}</li>)}</ul></div>)}
                    {readiness.notReady && readiness.notReady.length > 0 && (<div><p className="text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: '#dc2626' }}>✗ Needs Attention</p><ul className="space-y-1">{readiness.notReady.map((item, i) => <li key={i} className="flex gap-2 text-sm" style={{ color: '#334155' }}><span style={{ color: '#dc2626', flexShrink: 0 }}>•</span>{item}</li>)}</ul></div>)}
                    {readiness.action && (<div className="rounded-lg px-3 py-2.5 mt-2" style={{ background: `${GOLD}12` }}><p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: GOLD }}>→ Your Action</p><p className="text-sm" style={{ color: NAVY }}>{readiness.action}</p></div>)}
                  </div>
                ) : null}
            </div>
          </div>

          <div className="rounded-2xl border bg-white overflow-hidden" style={{ borderColor: 'rgba(10,22,40,0.08)' }}>
            <div className="flex items-center gap-2 px-5 py-4 border-b" style={{ borderColor: 'rgba(10,22,40,0.06)', background: NAVY }}>
              <MessageSquare size={16} style={{ color: GOLD }} />
              <span className="text-sm font-semibold text-white" style={{ fontFamily: 'Georgia, serif' }}>Ask About Your Team</span>
            </div>
            <div className="p-4 flex flex-col" style={{ height: 220 }}>
              <div className="flex-1 overflow-y-auto space-y-2 mb-3">
                {chatMessages.length === 0 && <div className="space-y-1.5">{quickQuestions.map(q => <button key={q} onClick={() => setChatInput(q)} className="w-full text-left px-3 py-2 rounded-lg text-xs flex items-center gap-2" style={{ background: `${GOLD}10`, color: NAVY }}><ArrowRight size={11} style={{ color: GOLD, flexShrink: 0 }} />{q}</button>)}</div>}
                {chatMessages.map((msg, i) => <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}><div className="max-w-xs px-3 py-2 rounded-xl text-xs leading-relaxed" style={msg.role === 'user' ? { background: NAVY, color: 'white', borderBottomRightRadius: 4 } : { background: '#f0ede6', color: NAVY, borderBottomLeftRadius: 4 }}>{msg.content}</div></div>)}
                {chatLoading && <div className="flex justify-start"><div className="px-3 py-2 rounded-xl" style={{ background: '#f0ede6', borderBottomLeftRadius: 4 }}><Loader2 size={12} className="animate-spin" style={{ color: GOLD }} /></div></div>}
                <div ref={chatBottomRef} />
              </div>
              <div className="flex gap-2">
                <input type="text" value={chatInput} onChange={e => setChatInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleChatSend()} placeholder="Ask anything about your team..." className="flex-1 px-3 py-2 rounded-lg text-xs outline-none border" style={{ borderColor: '#d8d2c5', background: 'white', color: NAVY }} />
                <button onClick={handleChatSend} disabled={!chatInput.trim() || chatLoading} className="px-3 py-2 rounded-lg" style={{ background: chatInput.trim() && !chatLoading ? GOLD : '#e8e2d5', color: chatInput.trim() && !chatLoading ? NAVY : '#aaa' }}><Send size={13} /></button>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border bg-white overflow-hidden" style={{ borderColor: 'rgba(10,22,40,0.08)' }}>
          <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: 'rgba(10,22,40,0.06)' }}>
            <h2 className="text-base font-bold" style={{ fontFamily: 'Georgia, serif', color: NAVY }}>Team Overview</h2>
            <span className="text-xs px-2.5 py-1 rounded-full font-medium" style={{ background: `${GOLD}15`, color: NAVY }}>{TEAM.length} members</span>
          </div>
          <div className="px-5">{TEAM.map(member => <MemberRow key={member.id} member={member} />)}</div>
        </div>
      </div>
    </div>
  );
}
