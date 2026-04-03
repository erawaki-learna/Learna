import Layout from '../components/Layout';
import { Calendar } from 'lucide-react';

export default function LearningCalendar() {
  return (
    <Layout currentPage="/calendar">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-serif text-navy mb-2">Learning Calendar</h1>
          <p className="text-navy/60">Upcoming learning programmes and events</p>
        </div>

        <div className="bg-white rounded-lg p-12 shadow-sm border border-navy/10 text-center">
          <div className="w-20 h-20 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Calendar className="w-10 h-10 text-gold" />
          </div>
          <h2 className="text-2xl font-serif text-navy mb-3">Coming in Sprint 5</h2>
          <p className="text-navy/60 max-w-md mx-auto">
            The learning calendar feature is currently under development and will be available
            in our next sprint. This will provide a comprehensive view of all upcoming learning
            programmes, workshops, and certification deadlines.
          </p>
        </div>
      </div>
    </Layout>
  );
}
