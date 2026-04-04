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
        if (!fullName.trim()) {
          setError('Please enter your full name');
          setLoading(false);
          return;
        }
        const { error: signUpError } = await signUp(email, password, fullName);
        if (signUpError) throw signUpError;
      } else {
        const { error: signInError } = await signIn(email, password);
        if (signInError) throw signInError;
      }

      window.location.href = '/';
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An error occurred. Please try again.');
      }
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-navy flex-col justify-between p-12">
        <div>
          <div className="flex items-center gap-3 mb-8">
            <img
              src="/learna-logo.png"
              alt="Learna"
              className="w-48 h-auto object-contain"
              style={{ mixBlendMode: 'screen' }}
            />
          </div>
          <div className="mt-8">
            <h2 className="text-4xl font-serif text-white leading-tight mb-4">
              Continuous Learning.<br />Measurable Performance.
            </h2>
            <p className="text-cream/80 text-lg leading-relaxed">
              Streamline your learning and development requests with our comprehensive portal designed for HNB Assurance PLC.
            </p>
          </div>
        </div>
        <div className="text-cream/60 text-sm">
          © 2026 HNB Assurance PLC. All rights reserved.
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 bg-cream flex items-center justify-center p-8">
        <div className="w-full max-w-md">

          {/* Logo - always visible on right panel */}
          <div className="flex justify-center mb-8">
            <img
              src="/learna-logo.png"
              alt="Learna"
              className="w-48 h-48 object-contain"
            />
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="flex justify-center mb-6">
              <img
                src="/learna-logo.png"
                alt="Learna"
                className="w-40 h-40 object-contain"
              />
            </div>
            {isSignUp && (
              <p className="text-center text-navy/60 mb-6 text-sm">Sign up to access the L&D portal</p>
            )}

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
                    className="w-full px-4 py-2 border border-navy/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
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
                  className="w-full px-4 py-2 border border-navy/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
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
                  className="w-full px-4 py-2 border border-navy/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                  required
                  disabled={loading}
                  minLength={6}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gold hover:bg-gold/90 text-navy font-medium py-3 rounded-lg transition-colors disabled:opacity-50"
              >
                {loading ? 'Please wait...' : isSignUp ? 'Create Account' : 'Sign In'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={() => { setIsSignUp(!isSignUp); setError(''); }}
                className="text-navy hover:text-gold transition-colors text-sm"
                disabled={loading}
              >
                {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
