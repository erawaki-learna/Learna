import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Profile = {
  id: string;
  email: string;
  full_name: string | null;
  division: string | null;
  role: 'admin' | 'requestor';
  created_at: string;
};

export type Request = {
  id: string;
  user_id: string;
  request_id: string;
  requestor_name: string;
  division: string;
  contact: string;
  business_problem: string;
  audience: string;
  urgency: string;
  manager_commitment: boolean;
  status: string;
  assigned_to: string | null;
  triage_decision: string | null;
  triage_notes: string | null;
  ai_analysis: Record<string, unknown> | null;
  priority: string;
  created_at: string;
};
