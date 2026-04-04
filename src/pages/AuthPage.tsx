import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

export default function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (isSignUp) {
        if (!fullName.trim()) { setError("Please enter your full name"); setLoading(false); return; }
        const { error: signUpError } = await signUp(email, password, fullName);
        if (signUpError) throw signUpError;
      } else {
        const { error: signInError } = await signIn(email, password);
        if (signInError) throw signInError;
      }
      window.location.href = "/";
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", background: "#07101f" }}>

      {/* LEFT — Logo Panel */}
      <div style={{
        flex: "0 0 60%",
        backgroundImage: "url(/learna-bg.png)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }} />

      {/* RIGHT — Login Panel */}
      <div style={{
        flex: "0 0 40%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "48px 32px",
        background: "rgba(4, 8, 20, 0.95)",
        borderLeft: "1px solid rgba(100,160,255,0.08)",
      }}>
        <div style={{ width: "100%", maxWidth: "320px" }}>

          <div style={{ textAlign: "center", marginBottom: "32px" }}>
            <h2 style={{ color: "white", fontSize: "22px", fontWeight: 700, margin: 0, letterSpacing: "0.5px" }}>
              {isSignUp ? "Create Account" : "Welcome Back"}
            </h2>
            <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "13px", marginTop: "6px" }}>
              {isSignUp ? "Join the L&D portal" : "Sign in to continue"}
            </p>
          </div>

          {error && (
            <div style={{ marginBottom: "16px", padding: "10px 12px", background: "rgba(220,50,50,0.15)", border: "1px solid rgba(220,50,50,0.3)", borderRadius: "8px", color: "#fca5a5", fontSize: "12px" }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {isSignUp && (
              <div style={{ marginBottom: "14px" }}>
                <label style={{ display: "block", color: "rgba(255,255,255,0.45)", fontSize: "11px", marginBottom: "6px", letterSpacing: "0.5px", textTransform: "uppercase" }}>Full Name</label>
                <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)}
                  style={{ width: "100%", padding: "11px 14px", borderRadius: "8px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.10)", color: "white", fontSize: "14px", outline: "none", boxSizing: "border-box" }}
                  required disabled={loading} />
              </div>
            )}

            <div style={{ marginBottom: "14px" }}>
              <label style={{ display: "block", color: "rgba(255,255,255,0.45)", fontSize: "11px", marginBottom: "6px", letterSpacing: "0.5px", textTransform: "uppercase" }}>Email Address</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                style={{ width: "100%", padding: "11px 14px", borderRadius: "8px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.10)", color: "white", fontSize: "14px", outline: "none", boxSizing: "border-box" }}
                required disabled={loading} />
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", color: "rgba(255,255,255,0.45)", fontSize: "11px", marginBottom: "6px", letterSpacing: "0.5px", textTransform: "uppercase" }}>Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                style={{ width: "100%", padding: "11px 14px", borderRadius: "8px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.10)", color: "white", fontSize: "14px", outline: "none", boxSizing: "border-box" }}
                required disabled={loading} minLength={6} />
            </div>

            <button type="submit" disabled={loading}
              style={{ width: "100%", padding: "13px", borderRadius: "8px", background: "linear-gradient(135deg, #c9940a, #f0b429)", color: "#07101f", fontWeight: 700, fontSize: "15px", border: "none", cursor: loading ? "not-allowed" : "pointer", boxShadow: "0 4px 24px rgba(201,148,10,0.35)", opacity: loading ? 0.6 : 1 }}>
              {loading ? "Please wait..." : isSignUp ? "Create Account" : "Sign In"}
            </button>
          </form>

          <div style={{ textAlign: "center", marginTop: "20px" }}>
            <button onClick={() => { setIsSignUp(!isSignUp); setError(""); }} disabled={loading}
              style={{ background: "none", border: "none", color: "rgba(255,255,255,0.25)", fontSize: "12px", cursor: "pointer" }}>
              {isSignUp ? "Already have an account? Sign in" : "Don't have an account? Sign up"}
            </button>
          </div>

          <p style={{ color: "rgba(255,255,255,0.10)", fontSize: "10px", textAlign: "center", marginTop: "32px" }}>
            © 2026 HNB Assurance PLC. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
