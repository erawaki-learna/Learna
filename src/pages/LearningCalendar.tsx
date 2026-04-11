import { useState, useEffect } from 'react';
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
  const { profile, user } = useAuth();
  const isAdmin = profile?.role === 'admin';

  const [programmes, setProgrammes] = useState<Programme[]>([]);
  const [nominations, setNominations] = useState<Nomination[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProgrammes();
    loadNominations();
  }, []);

  // ✅ FIXED
  const loadProgrammes = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from('learning_programmes')
      .select('*')
      .order('start_date', { ascending: true });

    if (error) {
      console.error('Error loading programmes:', error);
      setLoading(false);
      return;
    }

    setProgrammes(data || []);
    setLoading(false);
  };

  // ✅ FIXED
  const loadNominations = async () => {
    const { data, error } = await supabase
      .from('nominations')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading nominations:', error);
      return;
    }

    setNominations(data || []);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this programme?')) return;

    const { error } = await supabase
      .from('learning_programmes')
      .delete()
      .eq('id', id);

    if (error) {
      console.error(error);
      alert('Error deleting programme');
      return;
    }

    loadProgrammes();
  };

  const filtered = programmes;

  return (
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-serif text-navy mb-1">
            Learning Calendar
          </h1>
          <p className="text-navy/50 text-sm">
            {isAdmin
              ? 'Manage programmes and nominations'
              : 'Upcoming programmes'}
          </p>
        </div>

        {/* List */}
        <div className="space-y-4">
          {loading && (
            <div className="text-center py-12 text-navy/40">
              Loading programmes...
            </div>
          )}

          {!loading && filtered.length === 0 && (
            <div className="text-center py-12">
              No programmes found
            </div>
          )}

          {filtered.map((p) => (
            <div
              key={p.id}
              className="bg-white rounded-xl border p-4"
            >
              <h3 className="font-bold text-navy text-lg">
                {p.title}
              </h3>

              <p className="text-sm text-navy/50">
                {p.description}
              </p>

              <div className="text-xs text-navy/50 mt-2">
                📅 {p.start_date}
              </div>

              {isAdmin && (
                <button
                  onClick={() => handleDelete(p.id)}
                  className="mt-3 text-red-600 text-sm"
                >
                  Delete
                </button>
              )}
            </div>
          ))}
        </div>

      </div>
  );
}