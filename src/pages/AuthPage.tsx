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
      style={{
        minHeight: '100vh',
        backgroundImage: 'url(/learna-bg.png)',
        backgroundSize: 'contain',
        backgroundPosition: 'center top',
        backgroundRepeat: 'no-repeat',
        backgroundColor: '#080f1e',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-end',
        paddingBottom: '48px',
        paddingLeft: '16px',
        paddingRight: '16px',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '360px',
          borderRadius: '16px',
          padding: '28px',
          background: 'rgba(6, 12, 32, 0.80)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(100, 160, 255, 0.20)',
          boxShadow: '0 8px 48px rgba(0,0,0,0.6)',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <h2 style={{ color: 'white', fontSize: '18px', fontWeight: 600, margin: 0 }}>
            {isSignUp ? 'Create Account' : 'Welcome Back'}
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '12px', marginTop: '4px' }}>
            {isSignUp ? 'Join the L&D portal' : 'Sign in to continue'}
          </p>
        </div>

        {error && (
          <div style={{ marginBottom: '12px', padding: '10px', background: 'rgba(220,50,50,0.2)', border: '1px solid rgba(220,50,50,0.3)', borderRadius: '8px', color: '#fca5a5', fontSize: '12px' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {isSignUp && (
            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', color: 'rgba(255,255,255,0.5)', fontSize: '11px', marginBottom: '6px' }}>Full Name</label>
              <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', color: 'white', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }}
                required disabled={loading} />
            </div>
          )}

          <div style={{ marginBottom: '12px' }}>
            <label style={{ display: 'block', color: 'rgba(255,255,255,0.5)', fontSize: '11px', marginBottom: '6px' }}>Email Address</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', color: 'white', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }}
              required disabled={loading} />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', color: 'rgba(255,255,255,0.5)', fontSize: '11px', marginBottom: '6px' }}>Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
              style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', color: 'white', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }}
              required disabled={loading} minLength={6} />
          </div>

          <button type="submit" disabled={loading}
            style={{ width: '100%', padding: '11px', borderRadius: '8px', background: 'linear-gradient(135deg, #c9940a, #f0b429)', color: '#0a1628', fontWeight: 700, fontSize: '14px', border: 'none', cursor: 'pointer', boxShadow: '0 4px 20px rgba(201,148,10,0.4)' }}>
            {loading ? 'Please wait...' : isSignUp ? 'Create Account' : 'Sign In'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '16px' }}>
          <button onClick={() => { setIsSignUp(!isSignUp); setError(''); }} disabled={loading}
            style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.25)', fontSize: '11px', cursor: 'pointer' }}>
            {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
          </button>
        </div>
      </div>

      <p style={{ color: 'rgba(255,255,255,0.12)', fontSize: '10px', marginTop: '16px' }}>
        © 2026 HNB Assurance PLC. All rights reserved.
      </p>
    </div>
  );
}
