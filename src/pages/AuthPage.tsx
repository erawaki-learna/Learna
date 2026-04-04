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
    <div
      className="min-h-screen flex items-center justify-center p-6"
      style={{
        backgroundImage: 'url(/learna-bg.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center top',
        backgroundRepeat: 'no-repeat',
        backgroundColor: '#080f1e',
      }}
    >
      {/* Glassmorphism Login Card */}
      <div
        className="w-full max-w-sm rounded-2xl p-7"
        style={{
          background: 'rgba(8, 15, 40, 0.72)',
          backdropFilter: 'blur(18px)',
          WebkitBackdropFilter: 'blur(18px)',
          border: '1px solid rgba(100, 160, 255, 0.18)',
          boxShadow: '0 8px 48px rgba(0,0,0,0.5)',
        }}
      >
        {/* Card Header */}
        <div className="text-center mb-6">
          <h2 className="text-xl font-semibold text-white tracking-wide">
            {isSignUp ? 'Create Account' : 'Welcome Back'}
          </h2>
          <p className="text-white/40 text-xs mt-1">
            {isSignUp ? 'Join the L&D portal' : 'Sign in to continue'}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-2.5 bg-red-500/20 border border-red-400/30 rounded-lg text-red-300 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          {isSignUp && (
            <div>
              <label className="block text-xs font-medium text-white/60 mb-1.5">Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg text-sm text-white placeholder-white/20 focus:outline-none focus:ring-1 focus:ring-blue-400/50"
                style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)' }}
                required
                disabled={loading}
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-white/60 mb-1.5">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg text-sm text-white placeholder-white/20 focus:outline-none focus:ring-1 focus:ring-blue-400/50"
              style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)' }}
              required
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-white/60 mb-1.5">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg text-sm text-white placeholder-white/20 focus:outline-none focus:ring-1 focus:ring-blue-400/50"
              style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)' }}
              required
              disabled={loading}
              minLength={6}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-lg text-sm font-semibold transition-all disabled:opacity-50 mt-1"
            style={{
              background: 'linear-gradient(135deg, #c9940a 0%, #f0b429 100%)',
              color: '#0a1628',
              boxShadow: '0 4px 20px rgba(201,148,10,0.35)',
            }}
          >
            {loading ? 'Please wait...' : isSignUp ? 'Create Account' : 'Sign In'}
          </button>
        </form>

        <div className="mt-4 text-center">
          <button
            onClick={() => { setIsSignUp(!isSignUp); setError(''); }}
            className="text-white/30 hover:text-white/60 transition-colors text-xs"
            disabled={loading}
          >
            {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
          </button>
        </div>
      </div>

      {/* Footer */}
      <p className="absolute bottom-4 text-white/15 text-xs">
        © 2026 HNB Assurance PLC. All rights reserved.
      </p>
    </div>
  );
}
