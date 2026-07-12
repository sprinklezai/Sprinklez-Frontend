import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BarChart3, ShieldCheck, Store, TrendingUp } from "lucide-react";

import Input from "../components/common/Input";
import PasswordInput from "../components/common/PasswordInput";


import { login } from "../services/auth";
import { useAuth } from "../context/AuthContext";

function Login() {
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const [employeeId, setEmployeeId] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async () => {
    setErrorMessage("");

    if (!employeeId || !password) {
      setErrorMessage("Please enter Employee ID and Password.");
      return;
    }

    try {
      setLoading(true);

      const result = await login({
        emp_id: employeeId,
        password,
      });

      if (result.success) {
        loginUser(result.user, rememberMe);
        navigate("/overview");
      } else {
        setErrorMessage(result.message || "Login failed.");
      }
    } catch (error: any) {
      setErrorMessage(
        error?.response?.data?.message || "Invalid Employee ID or Password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-main)]">
      <div className="grid min-h-screen lg:grid-cols-[1.05fr_0.95fr]">
        <section className="relative hidden overflow-hidden bg-[var(--primary)] p-12 text-white lg:flex lg:flex-col lg:justify-between">
          <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-white/10" />
          <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-white/10" />

<div className="relative hidden overflow-hidden bg-[#175F49] p-8 lg:flex lg:flex-col">
  <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-white/10" />
  <div className="absolute -bottom-28 -left-24 h-72 w-72 rounded-full bg-white/10" />

  <div className="relative z-10 flex flex-1 flex-col justify-center">
    <p className="text-sm font-bold uppercase tracking-[0.32em] text-emerald-100">
      Sprinklez F&B Division
    </p>

    <h1 className="mt-6 max-w-2xl text-5xl font-black leading-tight text-white">
      Executive Analytics Platform
    </h1>

    <p className="mt-6 max-w-2xl text-lg leading-8 text-emerald-50">
      Monitor brands, stores, countries and sales performance from one secure
      management dashboard.
    </p>

    <div className="mt-10 grid gap-4 sm:grid-cols-2">
      <div className="rounded-2xl border border-white/15 bg-white/10 p-5 text-white backdrop-blur">
        <p className="font-bold">Sales Insights</p>
      </div>

      <div className="rounded-2xl border border-white/15 bg-white/10 p-5 text-white backdrop-blur">
        <p className="font-bold">Store Performance</p>
      </div>

      <div className="rounded-2xl border border-white/15 bg-white/10 p-5 text-white backdrop-blur">
        <p className="font-bold">Brand Analytics</p>
      </div>

      <div className="rounded-2xl border border-white/15 bg-white/10 p-5 text-white backdrop-blur">
        <p className="font-bold">Secure Access</p>
      </div>
    </div>
  </div>
</div>

          <div className="relative grid gap-4 sm:grid-cols-2">
            <Feature icon={<TrendingUp size={20} />} title="Sales Insights" />
            <Feature icon={<Store size={20} />} title="Store Performance" />
            <Feature icon={<BarChart3 size={20} />} title="Brand Analytics" />
            <Feature icon={<ShieldCheck size={20} />} title="Secure Access" />
          </div>
        </section>

        <section className="flex items-center justify-center p-6 sm:p-10">
          <div className="w-full max-w-md rounded-[var(--radius-card)] border border-[var(--border)] bg-white p-8 shadow-[var(--shadow-card)]">
            <div className="mb-8 lg:hidden">
              
            </div>

            <div className="mb-8">
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">
                Welcome back
              </p>

              <h2 className="text-3xl font-black tracking-tight text-[var(--text-main)]">
                Sign in to your account
              </h2>

              <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">
                Access the Sprinklez executive dashboard.
              </p>
            </div>

            {errorMessage && (
              <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                {errorMessage}
              </div>
            )}

            <Input
              label="Employee ID"
              placeholder="Enter Employee ID"
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
            />

            <PasswordInput
              label="Password"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <div className="mb-8 flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-[var(--text-muted)]">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 accent-[var(--primary)]"
                />
                Remember me
              </label>

              <button
                type="button"
                className="text-sm font-bold text-[var(--primary)] hover:text-[var(--primary-dark)]"
              >
                Forgot password?
              </button>
            </div>

            <button
              type="button"
              onClick={handleLogin}
              disabled={loading}
              className="w-full rounded-[var(--radius-button)] bg-[var(--primary)] px-5 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-[var(--primary-dark)] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>

            <p className="mt-8 text-center text-xs text-[var(--text-soft)]">
              © 2026 Sprinklez General Trading · F&B Analytics
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}

function Feature({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur">
      <div className="mb-3 inline-flex rounded-xl bg-white/15 p-3">{icon}</div>
      <p className="text-sm font-bold text-white">{title}</p>
    </div>
  );
}

export default Login;