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

const DIVISIONS = ['ATC', 'Bancassurance Retail', 'Bancassurance Corporate', 'Head Office Operations', 'Claims', 'Underwriting', 'IT', 'Finance', 'HR & Admin', 'Marketing'];
const TYPES = ['Workshop', 'Training', 'Webinar', 'Certification', 'Coaching', 'Conference'];
const SKILL_AREAS = ['Sales & Closing', 'Product Knowledge', 'Customer Service', 'Leadership', 'Communication', 'Digital Skills', 'Compliance', 'Operations', 'Finance', 'Soft Skills'];
const STATUSES = ['Scheduled', 'In Progress', 'Completed', 'Cancelled'];

const STATUS_COLORS: Record<string, string> = {
  'Scheduled': 'bg-blue-100 text-blue-700',
  'In Progress': 'bg-green-100 text-green-700',
  'Completed': 'bg-gray-100 text-gray-600',
  'Cancelled': 'bg-red-100 text-red-600',
};

const TYPE_COLORS: Record<string, string> = {
  'Workshop': 'bg-purple-100 text-purple-700',
  'Training': 'bg-navy/10 text-navy',
  'Webinar': 'bg-cyan-100 text-cyan-700',
  'Certification': 'bg-gold/20 text-yellow-800',
  'Coaching': 'bg-orange-100 text-orange-700',
  'Conference': 'bg-pink-100 text-pink-700',
};

const emptyForm = {
  title: '',
  description: '',
  programme_type: 'Workshop',
  target_divisions: [] as string[],
  target_audience: '',
  skill_area: '',
  start_date: '',
  end_date: '',
  start_time: '',
  venue: '',
  facilitator: '',
  max_participants: 20,
  status: 'Scheduled',
};

export default function LearningCalendar() {
  const { profile } = useAuth();
  const isAdmin = profile?.role === 'admin';
  const [programmes, setProgrammes] = useState<Programme[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [filter, setFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [selectedMonth, setSelectedMonth] = useState(new Date());

  useEffect(() => { loadProgrammes(); }, []);

  const loadProgrammes = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('learning_programmes')
      .select('*')
      .order('start_date', { ascending: true });
    setProgrammes(data || []);
    setLoading(false);
  };

  const handleSave = async () => {
    if (!form.title || !form.start_date) return;
    setSaving(true);
    if (editId) {
      await supabase.from('learning_programmes').update(form).eq('id', editId);
    } else {
      await supabase.from('learning_programmes').insert(form);
    }
    setSaving(false);
    setShowForm(false);
    setEditId(null);
    setForm(emptyForm);
    loadProgrammes();
  };

  const handleEdit = (p: Programme) => {
    setForm({
      title: p.title,
      description: p.description || '',
      programme_type: p.programme_type,
      target_divisions: p.target_divisions || [],
      target_audience: p.target_audience || '',
      skill_area: p.skill_area || '',
      start_date: p.start_date,
      end_date: p.end_date || '',
      start_time: p.start_time || '',
      venue: p.venue || '',
      facilitator: p.facilitator || '',
      max_participants: p.max_participants || 20,
      status: p.status,
    });
    setEditId(p.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this programme?')) return;
    await supabase.from('learning_programmes').delete().eq('id', id);
    loadProgrammes();
  };

  const toggleDivision = (div: string) => {
    setForm(f => ({
      ...f,
      target_divisions: f.target_divisions.includes(div)
        ? f.target_divisions.filter(d => d !== div)
        : [...f.target_divisions, div]
    }));
  };

  const filtered = programmes.filter(p => {
    if (filter === 'all') return true;
    if (filter === 'upcoming') return new Date(p.start_date) >= new Date();
    if (filter === 'completed') return p.status === 'Completed';
    return p.status === filter;
  });

  // Calendar view helpers
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    return { firstDay, daysInMonth };
  };

  const getProgrammesForDay = (day: number) => {
    const year = selectedMonth.getFullYear();
    const month = String(selectedMonth.getMonth() + 1).padStart(2, '0');
    const dayStr = String(day).padStart(2, '0');
    const dateStr = `${year}-${month}-${dayStr}`;
    return programmes.filter(p => p.start_date === dateStr);
  };

  const { firstDay, daysInMonth } = getDaysInMonth(selectedMonth);

  return (
    <Layout currentPage="/calendar">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-serif text-navy mb-1">Learning Calendar</h1>
            <p className="text-navy/50 text-sm">Upcoming programmes and development events</p>
          </div>
          <div className="flex items-center gap-3">
            {/* View Toggle */}
            <div className="flex bg-navy/5 rounded-lg p-1">
              <button onClick={() => setViewMode('list')}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${viewMode === 'list' ? 'bg-white text-navy shadow-sm' : 'text-navy/50'}`}>
                List
              </button>
              <button onClick={() => setViewMode('calendar')}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${viewMode === 'calendar' ? 'bg-white text-navy shadow-sm' : 'text-navy/50'}`}>
                Calendar
              </button>
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
          {['all', 'upcoming', 'Scheduled', 'In Progress', 'Completed'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${filter === f ? 'bg-navy text-white' : 'bg-navy/5 text-navy/60 hover:bg-navy/10'}`}>
              {f === 'all' ? 'All' : f}
            </button>
          ))}
        </div>

        {/* Add/Edit Form */}
        {showForm && isAdmin && (
          <div className="bg-white rounded-2xl border border-navy/10 p-6 mb-6 shadow-sm">
            <h3 className="font-serif font-bold text-navy text-lg mb-4">{editId ? 'Edit Programme' : 'New Programme'}</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-xs font-semibold text-navy/50 uppercase tracking-wider mb-1">Programme Title *</label>
                <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-navy/20 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold"
                  placeholder="e.g. Advanced Closing Techniques Workshop" />
              </div>

              <div>
                <label className="block text-xs font-semibold text-navy/50 uppercase tracking-wider mb-1">Type</label>
                <select value={form.programme_type} onChange={e => setForm(f => ({ ...f, programme_type: e.target.value }))}
                  className="w-full px-3 py-2 border border-navy/20 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold">
                  {TYPES.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-navy/50 uppercase tracking-wider mb-1">Skill Area</label>
                <select value={form.skill_area} onChange={e => setForm(f => ({ ...f, skill_area: e.target.value }))}
                  className="w-full px-3 py-2 border border-navy/20 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold">
                  <option value="">Select skill area</option>
                  {SKILL_AREAS.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-navy/50 uppercase tracking-wider mb-1">Start Date *</label>
                <input type="date" value={form.start_date} onChange={e => setForm(f => ({ ...f, start_date: e.target.value }))}
                  className="w-full px-3 py-2 border border-navy/20 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold" />
              </div>

              <div>
                <label className="block text-xs font-semibold text-navy/50 uppercase tracking-wider mb-1">End Date</label>
                <input type="date" value={form.end_date} onChange={e => setForm(f => ({ ...f, end_date: e.target.value }))}
                  className="w-full px-3 py-2 border border-navy/20 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold" />
              </div>

              <div>
                <label className="block text-xs font-semibold text-navy/50 uppercase tracking-wider mb-1">Time</label>
                <input type="time" value={form.start_time} onChange={e => setForm(f => ({ ...f, start_time: e.target.value }))}
                  className="w-full px-3 py-2 border border-navy/20 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold" />
              </div>

              <div>
                <label className="block text-xs font-semibold text-navy/50 uppercase tracking-wider mb-1">Venue</label>
                <input value={form.venue} onChange={e => setForm(f => ({ ...f, venue: e.target.value }))}
                  className="w-full px-3 py-2 border border-navy/20 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold"
                  placeholder="e.g. Training Room 1 / Zoom" />
              </div>

              <div>
                <label className="block text-xs font-semibold text-navy/50 uppercase tracking-wider mb-1">Facilitator</label>
                <input value={form.facilitator} onChange={e => setForm(f => ({ ...f, facilitator: e.target.value }))}
                  className="w-full px-3 py-2 border border-navy/20 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold"
                  placeholder="Facilitator name" />
              </div>

              <div>
                <label className="block text-xs font-semibold text-navy/50 uppercase tracking-wider mb-1">Max Participants</label>
                <input type="number" value={form.max_participants} onChange={e => setForm(f => ({ ...f, max_participants: Number(e.target.value) }))}
                  className="w-full px-3 py-2 border border-navy/20 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold" />
              </div>

              <div>
                <label className="block text-xs font-semibold text-navy/50 uppercase tracking-wider mb-1">Status</label>
                <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
                  className="w-full px-3 py-2 border border-navy/20 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold">
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
                  rows={3} className="w-full px-3 py-2 border border-navy/20 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold resize-none"
                  placeholder="Programme overview and objectives..." />
              </div>
            </div>

            <div className="flex gap-3 mt-4 pt-4 border-t border-navy/10">
              <button onClick={handleSave} disabled={saving}
                className="bg-gold text-navy font-bold px-6 py-2.5 rounded-lg text-sm hover:bg-gold/90 transition-colors disabled:opacity-50">
                {saving ? 'Saving...' : editId ? 'Update Programme' : 'Create Programme'}
              </button>
              <button onClick={() => { setShowForm(false); setEditId(null); setForm(emptyForm); }}
                className="bg-navy/10 text-navy font-semibold px-6 py-2.5 rounded-lg text-sm hover:bg-navy/20 transition-colors">
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Calendar View */}
        {viewMode === 'calendar' && (
          <div className="bg-white rounded-2xl border border-navy/10 p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <button onClick={() => setSelectedMonth(m => new Date(m.getFullYear(), m.getMonth() - 1))}
                className="p-2 hover:bg-navy/5 rounded-lg transition-colors text-navy">←</button>
              <h3 className="font-serif font-bold text-navy text-lg">
                {selectedMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
              </h3>
              <button onClick={() => setSelectedMonth(m => new Date(m.getFullYear(), m.getMonth() + 1))}
                className="p-2 hover:bg-navy/5 rounded-lg transition-colors text-navy">→</button>
            </div>
            <div className="grid grid-cols-7 gap-1 mb-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                <div key={d} className="text-center text-xs font-semibold text-navy/40 py-2">{d}</div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: firstDay }).map((_, i) => <div key={`empty-${i}`} />)}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const dayProgrammes = getProgrammesForDay(day);
                const isToday = new Date().getDate() === day &&
                  new Date().getMonth() === selectedMonth.getMonth() &&
                  new Date().getFullYear() === selectedMonth.getFullYear();
                return (
                  <div key={day} className={`min-h-[60px] p-1 rounded-lg border transition-all ${isToday ? 'border-gold bg-gold/5' : 'border-transparent hover:border-navy/10 hover:bg-navy/2'}`}>
                    <div className={`text-xs font-medium mb-1 ${isToday ? 'text-gold font-bold' : 'text-navy/50'}`}>{day}</div>
                    {dayProgrammes.map(p => (
                      <div key={p.id} className="text-[10px] bg-navy text-white rounded px-1 py-0.5 mb-0.5 truncate" title={p.title}>
                        {p.title}
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* List View */}
        {viewMode === 'list' && (
          <div className="space-y-4">
            {loading && (
              <div className="text-center py-12 text-navy/40">Loading programmes...</div>
            )}
            {!loading && filtered.length === 0 && (
              <div className="bg-white rounded-2xl border border-navy/10 p-12 text-center">
                <div className="text-4xl mb-3">📅</div>
                <h3 className="font-serif font-bold text-navy mb-1">No programmes found</h3>
                <p className="text-navy/40 text-sm">
                  {isAdmin ? 'Click "Add Programme" to create the first one.' : 'Check back soon for upcoming programmes.'}
                </p>
              </div>
            )}
            {filtered.map(p => (
              <div key={p.id} className="bg-white rounded-2xl border border-navy/10 p-5 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap mb-2">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${TYPE_COLORS[p.programme_type] || 'bg-navy/10 text-navy'}`}>
                        {p.programme_type}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[p.status] || 'bg-gray-100 text-gray-600'}`}>
                        {p.status}
                      </span>
                      {p.skill_area && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-cream text-navy/60 font-medium">
                          {p.skill_area}
                        </span>
                      )}
                    </div>
                    <h3 className="font-serif font-bold text-navy text-lg mb-1">{p.title}</h3>
                    {p.description && <p className="text-navy/50 text-sm mb-3 line-clamp-2">{p.description}</p>}
                    <div className="flex items-center gap-4 flex-wrap text-xs text-navy/50">
                      <span>📅 {new Date(p.start_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                      {p.start_time && <span>🕐 {p.start_time}</span>}
                      {p.venue && <span>📍 {p.venue}</span>}
                      {p.facilitator && <span>👤 {p.facilitator}</span>}
                      {p.max_participants && <span>👥 Max {p.max_participants}</span>}
                    </div>
                    {p.target_divisions?.length > 0 && (
                      <div className="flex gap-1 flex-wrap mt-2">
                        {p.target_divisions.map(d => (
                          <span key={d} className="text-[10px] bg-navy/5 text-navy/50 px-2 py-0.5 rounded-full">{d}</span>
                        ))}
                      </div>
                    )}
                  </div>
                  {isAdmin && (
                    <div className="flex gap-2 flex-shrink-0">
                      <button onClick={() => handleEdit(p)}
                        className="text-xs px-3 py-1.5 bg-navy/5 hover:bg-navy/10 text-navy rounded-lg transition-colors font-medium">
                        Edit
                      </button>
                      <button onClick={() => handleDelete(p.id)}
                        className="text-xs px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors font-medium">
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
