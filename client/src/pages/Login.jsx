import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, User } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(username, password);
      navigate("/overview");
    } catch (err) {
      setError(err.response?.data?.error || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-cream px-4">
      <div className="w-full max-w-[380px]">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-11 h-11 rounded-lg bg-brand-dark text-white font-bold text-lg mb-3">
            S
          </div>
          <h1 className="text-[20px] font-bold text-ink">SalesIQ Dashboard</h1>
          <p className="text-[13px] text-muted mt-1">Sign in with your company credentials</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-card border border-line rounded-card shadow-card p-6 flex flex-col gap-4">
          <div>
            <label className="text-[12.5px] text-muted mb-1 block">Username</label>
            <div className="flex items-center gap-2 border border-line rounded-md px-3 py-2.5 focus-within:border-brand">
              <User size={16} className="text-muted" />
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="outline-none w-full text-[14px] text-ink"
                placeholder="e.g. jsmith"
                autoFocus
                required
              />
            </div>
          </div>

          <div>
            <label className="text-[12.5px] text-muted mb-1 block">Password</label>
            <div className="flex items-center gap-2 border border-line rounded-md px-3 py-2.5 focus-within:border-brand">
              <Lock size={16} className="text-muted" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="outline-none w-full text-[14px] text-ink"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          {error && <div className="text-[13px] text-red-600 bg-red-50 border border-red-100 rounded-md px-3 py-2">{error}</div>}

          <button
            type="submit"
            disabled={loading}
            className="mt-1 bg-brand-dark hover:bg-brand text-white font-medium text-[14px] py-2.5 rounded-md transition-colors disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="text-center text-[11.5px] text-muted mt-4">
          Credentials are verified against the employee list synced from Google Drive.
        </p>
      </div>
    </div>
  );
}
