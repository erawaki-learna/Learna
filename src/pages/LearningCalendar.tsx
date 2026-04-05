import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface Programme {
  id: string;
  title: string;
  description: string;
  programme_type: string;
  target_divisions: string[];
  target_audience: string;
  skill_area: string;
  start_date: string;
  end_date: string;
  start_time: string;
  venue: string;
  facilitator: string;
  max_participants: number;
  status: string;
  created_at: string;
}

interface Nomination {
  id: string;
  programme_id: string;
  nominator_name: string;
  nominator_division: string;
  staff_names: string;
  staff_count: number;
  justification: string;
  status: string;
  created_at: string;
}

const DIVISIONS = ['ATC', 'Bancassurance Retail', 'Bancassurance Corporate', 'Head Office Operations', 'Claims', 'Underwriting', 'IT', 'Finance', 'HR & Admin', 'Marketing'];
const TYPES = ['Workshop', 'Training', 'Webinar', 'Certification', 'Coaching', 'Conference'];
const SKILL_AREAS = ['Sales & Closing', 'Product Knowledge', 'Customer Service', 'Leadership', 'Communication', 'Digital Skills', 'Compliance', 'Operations', 'Finance', 'Soft Skills'];
const STATUSES = ['Scheduled', 'In Development', 'Open for Nominations', 'In Progress', 'Completed', 'Cancelled'];

const STATUS_COLORS: Record<string, string> = {
  'Scheduled': 'bg-blue-100 text-blue-700',
  'In Development': 'bg-orange-100 text-orange-700',
  'Open for Nominations': 'bg-green-100 text-green-700',
  'In Progress': 'bg-purple-100 text-purple-700',
  'Completed': 'bg-gray-100 text-gray-500',
  'Cancelled': 'bg-red-100 text-red-600',
};

const TYPE_COLORS: Record<string, string> = {
  'Workshop': 'bg-purple-100 text-purple-700',
  'Training': 'bg-blue-100 text-blue-700',
  'Webinar': 'bg-cyan-100 text-cyan-700',
  'Certification': 'bg-yellow-100 text-yellow-700',
  'Coaching': 'bg-orange-100 text-orange-700',
  'Conference': 'bg-pink-100 text-pink-700',
};

const emptyForm = {
  title: '', description: '', programme_type: 'Workshop',
  target_divisions: [] as string[], target_audience: '', skill_area: '',
  start_date: '', end_date: '', start_time: '', venue: '',
  facilitator: '', max_participants: 20, status: 'Scheduled',
};

export default function LearningCalendar() {
  const { profile, user } = useAuth();
  const isAdmin = profile?.role === 'admin';
  const [programmes, setProgrammes] = useState<Programme[]>([]);
  const [nominations, setNominations] = useState<Nomination[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [filter, setFilter] = useState('upcoming');
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [selectedProgramme, setSelectedProgramme] = useState<Programme | null>(null);
  const [showNominateForm, setShowNominateForm] = useState(false);
  const [nominateForm, setNominateForm] = useState({ staff_names: '', staff_count: 1, justification: '' });
  const [showNominations, setShowNominations] = useState<string | null>(null);

  useEffect(() => { loadProgrammes(); loadNominations(); }, []);

  const loadProgrammes = async () => {
    setLoading(true);
    const { data } = await supabase.from('learning_programmes').select('id, title, description, status, created_at, user_id') as any.order('start_date', { ascending: true });
    setProgrammes(data || []);
    setLoading(false);
  };

  const loadNominations = async () => {
    const { data } = await supabase.from('nominations').select('id, title, description, status, created_at, user_id') as any.order('created_at', { ascending: false });
    setNominations(data || []);
  };

  const sendNotification = async (userId: string, title: string, message: string, type: string, link: string) => {
    await supabase.from('notifications').insert({ user_id: userId, title, message, type, link });
  };

  const handleSave = async () => {
    if (!form.title || !form.start_date) return;
    setSaving(true);
    if (editId) {
      await supabase.from('learning_programmes').update(form).eq('id', editId);
    } else {
      const { data: newProg } = await supabase.from('learning_programmes').insert(form).select().single();
      // Notify all users if open for nominations
      if (form.status === 'Open for Nominations' && newProg) {
        const { data: allProfiles } = await supabase.from('profiles').select('id, division');
        if (allProfiles) {
          for (const p of allProfiles) {
            if (!form.target_divisions.length || form.target_divisions.includes(p.division || '')) {
              await sendNotification(p.id,
                `New Programme: ${form.title}`,
                `${form.programme_type} on ${form.skill_area || 'Learning & Development'} — ${new Date(form.start_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}. Open for nominations.`,
                'programme', '/calendar');
            }
          }
        }
      }
    }
    setSaving(false);
    setShowForm(false);
    setEditId(null);
    setForm(emptyForm);
    loadProgrammes();
  };

  const handleEdit = (p: Programme) => {
    setForm({ title: p.title, description: p.description || '', programme_type: p.programme_type, target_divisions: p.target_divisions || [], target_audience: p.target_audience || '', skill_area: p.skill_area || '', start_date: p.start_date, end_date: p.end_date || '', start_time: p.start_time || '', venue: p.venue || '', facilitator: p.facilitator || '', max_participants: p.max_participants || 20, status: p.status });
    setEditId(p.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this programme?')) return;
    await supabase.from('learning_programmes').delete().eq('id', id);
    loadProgrammes();
  };

  const handleNominate = async () => {
    if (!selectedProgramme || !nominateForm.staff_names) return;
    setSaving(true);
    await supabase.from('nominations').insert({
      programme_id: selectedProgramme.id,
      nominated_by: user?.id,
      nominator_name: profile?.full_name || '',
      nominator_division: profile?.division || '',
      staff_names: nominateForm.staff_names,
      staff_count: nominateForm.staff_count,
      justification: nominateForm.justification,
      status: 'Pending',
    });
    // Notify admins
    const { data: admins } = await supabase.from('profiles').select('id').eq('role', 'admin');
    if (admins) {
      for (const admin of admins) {
        await sendNotification(admin.id,
          `New Nomination: ${selectedProgramme.title}`,
          `${profile?.full_name} nominated ${nominateForm.staff_count} staff member(s) from ${profile?.division || 'their division'}.`,
          'request', '/calendar');
      }
    }
    setSaving(false);
    setShowNominateForm(false);
    setNominateForm({ staff_names: '', staff_count: 1, justification: '' });
    loadNominations();
    alert('Nomination submitted successfully!');
  };

  const handleNominationStatus = async (nomId: string, status: string) => {
    await supabase.from('nominations').update({ status }).eq('id', nomId);
    loadNominations();
  };

  const toggleDivision = (div: string) => {
    setForm(f => ({ ...f, target_divisions: f.target_divisions.includes(div) ? f.target_divisions.filter(d => d !== div) : [...f.target_divisions, div] }));
  };

  const filtered = programmes.filter(p => {
    if (filter === 'all') return true;
    if (filter === 'upcoming') return new Date(p.start_date) >= new Date() && p.status !== 'Cancelled';
    if (filter === 'nominations') return p.status === 'Open for Nominations';
    return p.status === filter;
  });

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return { firstDay: new Date(year, month, 1).getDay(), daysInMonth: new Date(year, month + 1, 0).getDate() };
  };

  const getProgrammesForDay = (day: number) => {
    const year = selectedMonth.getFullYear();
    const month = String(selectedMonth.getMonth() + 1).padStart(2, '0');
    const dateStr = `${year}-${month}-${String(day).padStart(2, '0')}`;
    return programmes.filter(p => p.start_date === dateStr);
  };

  const { firstDay, daysInMonth } = getDaysInMonth(selectedMonth);
  const programmeNominations = (id: string) => nominations.filter(n => n.programme_id === id);

  return (
    <Layout currentPage="/calendar">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-serif text-navy mb-1">Learning Calendar</h1>
            <p className="text-navy/50 text-sm">{isAdmin ? 'Manage programmes and nominations' : 'Upcoming programmes — nominate your team'}</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex bg-navy/5 rounded-lg p-1">
              <button onClick={() => setViewMode('list')} className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${viewMode === 'list' ? 'bg-white text-navy shadow-sm' : 'text-navy/50'}`}>List</button>
              <button onClick={() => setViewMode('calendar')} className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${viewMode === 'calendar' ? 'bg-white text-navy shadow-sm' : 'text-navy/50'}`}>Calendar</button>
            </div>
            {isAdmin && (
              <button onClick={() => { setShowForm(true); setEditId(null); setForm(emptyForm); }}
                className="bg-navy text-gold px-4 py-2 rounded-lg text-sm font-semibold hover:bg-navy/90 transition-colors">
                + Add Programme
              </button>
            )}
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {['upcoming', 'all', 'nominations', 'In Development', 'Completed'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${filter === f ? 'bg-navy text-white' : 'bg-navy/5 text-navy/60 hover:bg-navy/10'}`}>
              {f === 'nominations' ? '📋 Open for Nominations' : f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {/* Admin Form */}
        {showForm && isAdmin && (
          <div className="bg-white rounded-2xl border border-navy/10 p-6 mb-6 shadow-sm">
            <h3 className="font-serif font-bold text-navy text-lg mb-4">{editId ? 'Edit Programme' : 'New Programme'}</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-xs font-semibold text-navy/50 uppercase tracking-wider mb-1">Programme Title *</label>
                <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-navy/20 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold" placeholder="e.g. Advanced Closing Techniques Workshop" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-navy/50 uppercase tracking-wider mb-1">Type</label>
                <select value={form.programme_type} onChange={e => setForm(f => ({ ...f, programme_type: e.target.value }))} className="w-full px-3 py-2 border border-navy/20 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold">
                  {TYPES.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-navy/50 uppercase tracking-wider mb-1">Skill Area</label>
                <select value={form.skill_area} onChange={e => setForm(f => ({ ...f, skill_area: e.target.value }))} className="w-full px-3 py-2 border border-navy/20 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold">
                  <option value="">Select skill area</option>
                  {SKILL_AREAS.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-navy/50 uppercase tracking-wider mb-1">Start Date *</label>
                <input type="date" value={form.start_date} onChange={e => setForm(f => ({ ...f, start_date: e.target.value }))} className="w-full px-3 py-2 border border-navy/20 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-navy/50 uppercase tracking-wider mb-1">End Date</label>
                <input type="date" value={form.end_date} onChange={e => setForm(f => ({ ...f, end_date: e.target.value }))} className="w-full px-3 py-2 border border-navy/20 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-navy/50 uppercase tracking-wider mb-1">Time</label>
                <input type="time" value={form.start_time} onChange={e => setForm(f => ({ ...f, start_time: e.target.value }))} className="w-full px-3 py-2 border border-navy/20 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-navy/50 uppercase tracking-wider mb-1">Venue</label>
                <input value={form.venue} onChange={e => setForm(f => ({ ...f, venue: e.target.value }))} className="w-full px-3 py-2 border border-navy/20 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold" placeholder="Training Room / Zoom" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-navy/50 uppercase tracking-wider mb-1">Facilitator</label>
                <input value={form.facilitator} onChange={e => setForm(f => ({ ...f, facilitator: e.target.value }))} className="w-full px-3 py-2 border border-navy/20 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold" placeholder="Facilitator name" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-navy/50 uppercase tracking-wider mb-1">Max Participants</label>
                <input type="number" value={form.max_participants} onChange={e => setForm(f => ({ ...f, max_participants: Number(e.target.value) }))} className="w-full px-3 py-2 border border-navy/20 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-navy/50 uppercase tracking-wider mb-1">Status</label>
                <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))} className="w-full px-3 py-2 border border-navy/20 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold">
                  {STATUSES.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-semibold text-navy/50 uppercase tracking-wider mb-2">Target Divisions</label>
                <div className="flex flex-wrap gap-2">
                  {DIVISIONS.map(div => (
                    <button key={div} type="button" onClick={() => toggleDivision(div)}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${form.target_divisions.includes(div) ? 'bg-navy text-white' : 'bg-navy/5 text-navy/60 hover:bg-navy/10'}`}>
                      {div}
                    </button>
                  ))}
                </div>
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-semibold text-navy/50 uppercase tracking-wider mb-1">Description</label>
                <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  rows={3} className="w-full px-3 py-2 border border-navy/20 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold resize-none" placeholder="Programme overview and objectives..." />
              </div>
            </div>
            <div className="flex gap-3 mt-4 pt-4 border-t border-navy/10">
              <button onClick={handleSave} disabled={saving} className="bg-gold text-navy font-bold px-6 py-2.5 rounded-lg text-sm hover:bg-gold/90 disabled:opacity-50">
                {saving ? 'Saving...' : editId ? 'Update' : 'Create Programme'}
              </button>
              <button onClick={() => { setShowForm(false); setEditId(null); setForm(emptyForm); }} className="bg-navy/10 text-navy font-semibold px-6 py-2.5 rounded-lg text-sm hover:bg-navy/20">Cancel</button>
            </div>
          </div>
        )}

        {/* Nominate Form Modal */}
        {showNominateForm && selectedProgramme && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
              <h3 className="font-serif font-bold text-navy text-lg mb-1">Nominate Staff</h3>
              <p className="text-navy/50 text-sm mb-4">{selectedProgramme.title}</p>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-navy/50 uppercase tracking-wider mb-1">Staff Names *</label>
                  <textarea value={nominateForm.staff_names} onChange={e => setNominateForm(f => ({ ...f, staff_names: e.target.value }))}
                    rows={3} className="w-full px-3 py-2 border border-navy/20 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold resize-none"
                    placeholder="List staff names, one per line..." />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-navy/50 uppercase tracking-wider mb-1">Number of Staff</label>
                  <input type="number" min={1} value={nominateForm.staff_count} onChange={e => setNominateForm(f => ({ ...f, staff_count: Number(e.target.value) }))}
                    className="w-full px-3 py-2 border border-navy/20 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-navy/50 uppercase tracking-wider mb-1">Justification</label>
                  <textarea value={nominateForm.justification} onChange={e => setNominateForm(f => ({ ...f, justification: e.target.value }))}
                    rows={2} className="w-full px-3 py-2 border border-navy/20 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold resize-none"
                    placeholder="Why are you nominating these staff members?" />
                </div>
              </div>
              <div className="flex gap-3 mt-4">
                <button onClick={handleNominate} disabled={saving} className="flex-1 bg-gold text-navy font-bold py-2.5 rounded-lg text-sm hover:bg-gold/90 disabled:opacity-50">
                  {saving ? 'Submitting...' : 'Submit Nomination'}
                </button>
                <button onClick={() => setShowNominateForm(false)} className="px-4 bg-navy/10 text-navy font-semibold py-2.5 rounded-lg text-sm">Cancel</button>
              </div>
            </div>
          </div>
        )}

        {/* Calendar View */}
        {viewMode === 'calendar' && (
          <div className="bg-white rounded-2xl border border-navy/10 p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <button onClick={() => setSelectedMonth(m => new Date(m.getFullYear(), m.getMonth() - 1))} className="p-2 hover:bg-navy/5 rounded-lg text-navy">←</button>
              <h3 className="font-serif font-bold text-navy text-lg">{selectedMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}</h3>
              <button onClick={() => setSelectedMonth(m => new Date(m.getFullYear(), m.getMonth() + 1))} className="p-2 hover:bg-navy/5 rounded-lg text-navy">→</button>
            </div>
            <div className="grid grid-cols-7 gap-1 mb-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                <div key={d} className="text-center text-xs font-semibold text-navy/40 py-2">{d}</div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: firstDay }).map((_, i) => <div key={`e-${i}`} />)}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const dayProgs = getProgrammesForDay(day);
                const isToday = new Date().getDate() === day && new Date().getMonth() === selectedMonth.getMonth() && new Date().getFullYear() === selectedMonth.getFullYear();
                return (
                  <div key={day} className={`min-h-16 p-1 rounded-lg border ${isToday ? 'border-gold bg-gold/5' : 'border-transparent hover:border-navy/10'}`}>
                    <div className={`text-xs font-medium mb-1 ${isToday ? 'text-gold font-bold' : 'text-navy/50'}`}>{day}</div>
                    {dayProgs.map(p => (
                      <div key={p.id} onClick={() => setSelectedProgramme(p)}
                        className="text-[10px] bg-navy text-white rounded px-1 py-0.5 mb-0.5 truncate cursor-pointer hover:bg-navy/80" title={p.title}>
                        {p.title}
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Programme Detail Panel */}
        {selectedProgramme && (
          <div className="bg-white rounded-2xl border-2 border-gold p-6 mb-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex gap-2 mb-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${TYPE_COLORS[selectedProgramme.programme_type] || 'bg-navy/10 text-navy'}`}>{selectedProgramme.programme_type}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[selectedProgramme.status] || 'bg-gray-100 text-gray-600'}`}>{selectedProgramme.status}</span>
                </div>
                <h3 className="font-serif font-bold text-navy text-xl">{selectedProgramme.title}</h3>
              </div>
              <button onClick={() => setSelectedProgramme(null)} className="text-navy/30 hover:text-navy text-lg">✕</button>
            </div>
            {selectedProgramme.description && <p className="text-navy/60 text-sm mb-4">{selectedProgramme.description}</p>}
            <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
              <div><span className="text-navy/40 text-xs">Date</span><p className="font-medium text-navy">{new Date(selectedProgramme.start_date).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p></div>
              {selectedProgramme.start_time && <div><span className="text-navy/40 text-xs">Time</span><p className="font-medium text-navy">{selectedProgramme.start_time}</p></div>}
              {selectedProgramme.venue && <div><span className="text-navy/40 text-xs">Venue</span><p className="font-medium text-navy">{selectedProgramme.venue}</p></div>}
              {selectedProgramme.facilitator && <div><span className="text-navy/40 text-xs">Facilitator</span><p className="font-medium text-navy">{selectedProgramme.facilitator}</p></div>}
              {selectedProgramme.skill_area && <div><span className="text-navy/40 text-xs">Skill Area</span><p className="font-medium text-navy">{selectedProgramme.skill_area}</p></div>}
              {selectedProgramme.max_participants && <div><span className="text-navy/40 text-xs">Max Participants</span><p className="font-medium text-navy">{selectedProgramme.max_participants}</p></div>}
            </div>

            {/* Nominations count */}
            {isAdmin && (
              <div className="mb-4">
                <button onClick={() => setShowNominations(showNominations === selectedProgramme.id ? null : selectedProgramme.id)}
                  className="text-sm font-semibold text-navy/60 hover:text-navy transition-colors">
                  📋 {programmeNominations(selectedProgramme.id).length} Nomination(s) {showNominations === selectedProgramme.id ? '▲' : '▼'}
                </button>
                {showNominations === selectedProgramme.id && (
                  <div className="mt-3 space-y-2">
                    {programmeNominations(selectedProgramme.id).length === 0 && (
                      <p className="text-navy/40 text-xs">No nominations yet.</p>
                    )}
                    {programmeNominations(selectedProgramme.id).map(n => (
                      <div key={n.id} className="bg-cream rounded-lg p-3 text-sm">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-semibold text-navy">{n.nominator_name} <span className="text-navy/40 font-normal">({n.nominator_division})</span></p>
                            <p className="text-navy/60 text-xs mt-0.5">Staff: {n.staff_names}</p>
                            <p className="text-navy/60 text-xs">Count: {n.staff_count}</p>
                            {n.justification && <p className="text-navy/50 text-xs mt-1 italic">"{n.justification}"</p>}
                          </div>
                          <div className="flex gap-1">
                            {n.status === 'Pending' && (
                              <>
                                <button onClick={() => handleNominationStatus(n.id, 'Approved')} className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-lg hover:bg-green-200">✓</button>
                                <button onClick={() => handleNominationStatus(n.id, 'Rejected')} className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-lg hover:bg-red-200">✕</button>
                              </>
                            )}
                            {n.status !== 'Pending' && (
                              <span className={`text-xs px-2 py-1 rounded-lg ${n.status === 'Approved' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>{n.status}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="flex gap-3">
              {selectedProgramme.status === 'Open for Nominations' && !isAdmin && (
                <button onClick={() => setShowNominateForm(true)} className="bg-gold text-navy font-bold px-5 py-2.5 rounded-lg text-sm hover:bg-gold/90 transition-colors">
                  + Nominate Staff
                </button>
              )}
              {isAdmin && (
                <>
                  <button onClick={() => handleEdit(selectedProgramme)} className="bg-navy text-gold font-semibold px-5 py-2.5 rounded-lg text-sm hover:bg-navy/90">Edit</button>
                  <button onClick={() => handleDelete(selectedProgramme.id)} className="bg-red-50 text-red-600 font-semibold px-5 py-2.5 rounded-lg text-sm hover:bg-red-100">Delete</button>
                </>
              )}
            </div>
          </div>
        )}

        {/* List View */}
        {viewMode === 'list' && (
          <div className="space-y-4">
            {loading && <div className="text-center py-12 text-navy/40">Loading programmes...</div>}
            {!loading && filtered.length === 0 && (
              <div className="bg-white rounded-2xl border border-navy/10 p-12 text-center">
                <div className="text-4xl mb-3">📅</div>
                <h3 className="font-serif font-bold text-navy mb-1">No programmes found</h3>
                <p className="text-navy/40 text-sm">{isAdmin ? 'Click "Add Programme" to create the first one.' : 'Check back soon for upcoming programmes.'}</p>
              </div>
            )}
            {filtered.map(p => (
              <div key={p.id} onClick={() => setSelectedProgramme(p)}
                className="bg-white rounded-2xl border border-navy/10 p-5 hover:shadow-md hover:border-gold/30 transition-all cursor-pointer">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap mb-2">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${TYPE_COLORS[p.programme_type] || 'bg-navy/10 text-navy'}`}>{p.programme_type}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[p.status] || 'bg-gray-100 text-gray-600'}`}>{p.status}</span>
                      {p.skill_area && <span className="text-xs px-2 py-0.5 rounded-full bg-cream text-navy/60 font-medium">{p.skill_area}</span>}
                      {p.status === 'Open for Nominations' && <span className="text-xs px-2 py-0.5 rounded-full bg-gold/20 text-yellow-800 font-bold animate-pulse">📋 Nominate Now</span>}
                    </div>
                    <h3 className="font-serif font-bold text-navy text-lg mb-1">{p.title}</h3>
                    {p.description && <p className="text-navy/50 text-sm mb-3 line-clamp-2">{p.description}</p>}
                    <div className="flex items-center gap-4 flex-wrap text-xs text-navy/50">
                      <span>📅 {new Date(p.start_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                      {p.start_time && <span>🕐 {p.start_time}</span>}
                      {p.venue && <span>📍 {p.venue}</span>}
                      {p.facilitator && <span>👤 {p.facilitator}</span>}
                      {p.max_participants && <span>👥 Max {p.max_participants}</span>}
                      {isAdmin && <span>📋 {programmeNominations(p.id).length} nominations</span>}
                    </div>
                    {p.target_divisions?.length > 0 && (
                      <div className="flex gap-1 flex-wrap mt-2">
                        {p.target_divisions.map(d => <span key={d} className="text-[10px] bg-navy/5 text-navy/50 px-2 py-0.5 rounded-full">{d}</span>)}
                      </div>
                    )}
                  </div>
                  <div className="text-navy/20 text-lg flex-shrink-0">→</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
