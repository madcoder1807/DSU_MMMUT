import { useState, FormEvent } from "react";

interface AuthModalProps {
  onClose: () => void;
  onAuthSuccess: (user: any) => void;
}

export default function AuthModal({ onClose, onAuthSuccess }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    rollNumber: "",
    branch: "Computer Science & Engineering",
    password: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register";
      const payload = isLogin
        ? { rollOrEmail: formData.email || formData.rollNumber }
        : formData;

      if (isLogin && !formData.email && !formData.rollNumber) {
        throw new Error("Please fill in your registered Email or Roll Number.");
      }
      if (!isLogin && (!formData.name || !formData.email || !formData.rollNumber)) {
        throw new Error("Please fill in all mandatory fields.");
      }

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Something went wrong. Please check your inputs.");
      }

      onAuthSuccess(data);
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to authenticate.");
    } finally {
      setLoading(false);
    }
  };

  const signInAsGuest = async () => {
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rollOrEmail: "ritika.cp@mmmut.ac.in" })
      });
      const data = await res.json();
      if (res.ok) {
        onAuthSuccess(data);
        onClose();
      } else {
        throw new Error();
      }
    } catch (e) {
      // Fallback local mock user load if server database drops
      onAuthSuccess({
        user: {
          id: "senior_ritika",
          name: "Ritika Mishra",
          email: "ritika.cp@mmmut.ac.in",
          rollNumber: "2022011032",
          branch: "Information Technology",
          role: "student",
          points: 1210,
          completedProblems: ["arr_1", "ll_1", "graph_1"],
          notes: []
        },
        token: "senior_ritika"
      });
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="auth-modal-screen" className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 transition-opacity duration-300">
      <div 
        id="auth-card-body" 
        className="relative w-full max-w-md overflow-hidden rounded-2xl border border-blue-500/30 bg-gray-950/90 p-8 shadow-[0_0_50px_rgba(59,130,246,0.15)] transition-all duration-300"
      >
        <div className="absolute -top-12 -left-12 h-32 w-32 rounded-full bg-blue-500/10 blur-3xl"></div>
        <div className="absolute -bottom-12 -right-12 h-32 w-32 rounded-full bg-cyan-500/10 blur-3xl"></div>

        <button 
          id="auth-close-btn"
          onClick={onClose}
          className="absolute top-4 right-4 rounded-full border border-gray-800 p-1 text-gray-400 hover:bg-gray-900 hover:text-white transition-colors"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="text-center mb-6">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 text-white font-mono font-bold text-xl shadow-[0_0_15px_rgba(59,130,246,0.5)]">
            ∪
          </div>
          <h2 id="auth-main-headline" className="mt-4 text-2xl font-bold text-white tracking-tight">
            {isLogin ? "Welcome Back to DSU" : "Create Student Account"}
          </h2>
          <p className="mt-1 text-xs text-gray-400">
            {isLogin ? "Sign in to track CP roadmaps & save DSA progress" : "Join the MMMUT Coding Family & track scores"}
          </p>
        </div>

        {error && (
          <div id="auth-error-banner" className="mb-4 rounded-lg bg-red-950/50 border border-red-500/30 p-3 text-center text-xs text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">Full Name</label>
              <input
                type="text"
                required={!isLogin}
                placeholder="Aman Verma"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full rounded-lg border border-gray-800 bg-gray-900/50 px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-blue-500/60 focus:outline-none transition-colors"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">
              {isLogin ? "Email or Roll Number" : "College Email ID"}
            </label>
            <input
              type="text"
              required
              placeholder={isLogin ? "2023021001 or aman@mmmut.ac.in" : "aman@mmmut.ac.in"}
              value={isLogin ? (formData.email || formData.rollNumber) : formData.email}
              onChange={e => {
                const val = e.target.value;
                if (isLogin) {
                  setFormData({ ...formData, email: val, rollNumber: val });
                } else {
                  setFormData({ ...formData, email: val });
                }
              }}
              className="w-full rounded-lg border border-gray-800 bg-gray-900/50 px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-blue-500/60 focus:outline-none transition-colors"
            />
          </div>

          {!isLogin && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Roll Number</label>
                <input
                  type="text"
                  required={!isLogin}
                  placeholder="2024021001"
                  value={formData.rollNumber}
                  onChange={e => setFormData({ ...formData, rollNumber: e.target.value })}
                  className="w-full rounded-lg border border-gray-800 bg-gray-900/50 px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-blue-500/60 focus:outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Branch</label>
                <select
                  value={formData.branch}
                  onChange={e => setFormData({ ...formData, branch: e.target.value })}
                  className="w-full rounded-lg border border-gray-800 bg-gray-900/50 px-3 py-2 text-sm text-white focus:border-blue-500/60 focus:outline-none transition-colors"
                >
                  <option className="bg-gray-950 text-white" value="Computer Science">CSE</option>
                  <option className="bg-gray-950 text-white" value="Information Technology">IT</option>
                  <option className="bg-gray-950 text-white" value="Electronics & Comm">ECE</option>
                  <option className="bg-gray-950 text-white" value="Electrical Eng">EE</option>
                </select>
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={e => setFormData({ ...formData, password: e.target.value })}
              className="w-full rounded-lg border border-gray-800 bg-gray-900/50 px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-blue-500/60 focus:outline-none transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 py-2.5 text-sm font-semibold text-white hover:from-blue-500 hover:to-cyan-400 transition-all font-mono shadow-[0_4px_15px_rgba(59,130,246,0.3)] disabled:opacity-50"
          >
            {loading ? "Authenticating..." : isLogin ? "Launch Dashboard" : "Enroll & Begin Team Tracking"}
          </button>
        </form>

        <div className="relative my-6 flex py-1 items-center">
          <div className="flex-grow border-t border-gray-800"></div>
          <span className="flex-shrink mx-3 text-xs text-gray-500">OR</span>
          <div className="flex-grow border-t border-gray-800"></div>
        </div>

        <button
          onClick={signInAsGuest}
          disabled={loading}
          className="w-full rounded-lg border border-cyan-500/30 bg-cyan-950/20 py-2 text-sm font-semibold text-cyan-400 hover:bg-cyan-950/40 transition-all font-mono"
        >
          🔑 One-Click Guest Account Preview
        </button>

        <div className="mt-5 text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-xs text-blue-400 hover:underline hover:text-blue-300 transition-colors"
          >
            {isLogin ? "New student? Register account here" : "Already have a profile? Login instead"}
          </button>
        </div>
      </div>
    </div>
  );
}
