import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isSignUp) {
        if (!fullName.trim()) { setError('Please enter your full name'); setLoading(false); return; }
        const { error: signUpError } = await signUp(email, password, fullName);
        if (signUpError) throw signUpError;
      } else {
        const { error: signInError } = await signIn(email, password);
        if (signInError) throw signInError;
      }
      window.location.href = '/';
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream flex flex-col items-center justify-center p-8">
      {/* Logo */}
      <div className="mb-6 flex flex-col items-center">
        <img src="/learna-logo-v2.png" alt="Learna" className="w-56 h-56 object-contain drop-shadow-lg" />
        <p className="text-navy/50 text-xs tracking-widest uppercase mt-1 font-medium">HNB Assurance PLC</p>
      </div>

      {/* Login Card */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <div>
              <label className="block text-sm font-medium text-navy mb-2">Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-3 border border-navy/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                required
                disabled={loading}
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-navy mb-2">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-navy/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
              required
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-navy mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-navy/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
              required
              disabled={loading}
              minLength={6}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gold hover:bg-gold/90 text-navy font-semibold py-3 rounded-lg transition-colors disabled:opacity-50 mt-2"
          >
            {loading ? 'Please wait...' : isSignUp ? 'Create Account' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => { setIsSignUp(!isSignUp); setError(''); }}
            className="text-navy/60 hover:text-gold transition-colors text-sm"
            disabled={loading}
          >
            {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
          </button>
        </div>
      </div>

      <p className="mt-8 text-navy/30 text-xs">© 2026 HNB Assurance PLC. All rights reserved.</p>
    </div>
  );
}
