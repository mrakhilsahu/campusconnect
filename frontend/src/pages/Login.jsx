import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, LogIn, ShieldCheck, Sparkles } from "lucide-react";
import { loginUser } from "../store/authSlice";

const inputClass = "mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-50";

const getDashboard = (role) => {
  if (role === "STUDENT") return "/student";
  if (role === "TEACHER") return "/teacher";
  return "/admin/pending";
};

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, token, loading, error } = useSelector((state) => state.auth);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });

  useEffect(() => {
    if (user && token) navigate(getDashboard(user.role), { replace: true });
  }, [user, token, navigate]);

  const updateField = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    dispatch(loginUser(form));
  };

  return (
    <main className="min-h-[calc(100vh-72px)] bg-[radial-gradient(circle_at_top_left,rgba(37,99,235,.12),transparent_32%),#f8fafc] px-4 py-8 sm:py-12">
      <div className="mx-auto grid max-w-5xl overflow-hidden rounded-[30px] border border-slate-200 bg-white shadow-[0_30px_90px_rgba(15,23,42,.10)] md:grid-cols-2">
        <section className="relative hidden overflow-hidden bg-slate-950 p-10 text-white md:flex md:flex-col md:justify-between">
          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl" />
          <div className="relative">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/10">
              <Sparkles size={20} />
            </div>
            <p className="mt-8 text-sm font-semibold text-blue-300">CampusConnect</p>
            <h1 className="mt-2 max-w-sm text-4xl font-black leading-tight tracking-tight">Everything happening on campus, in one place.</h1>
            <p className="mt-5 max-w-sm text-sm leading-6 text-slate-400">Discover events, manage participation and keep your campus workflow organized.</p>
          </div>
          <div className="relative grid grid-cols-2 gap-3 text-xs text-slate-300">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4"><ShieldCheck size={16} className="text-blue-300" /><p className="mt-3 font-semibold">Role-based access</p></div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4"><LogIn size={16} className="text-blue-300" /><p className="mt-3 font-semibold">Simple workflow</p></div>
          </div>
        </section>

        <section className="p-7 sm:p-10">
          <div className="md:hidden">
            <p className="text-sm font-bold text-blue-600">CampusConnect</p>
          </div>
          <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950">Welcome back</h2>
          <p className="mt-2 text-sm leading-6 text-slate-500">Sign in to continue to your campus workspace.</p>

          {error && <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{error}</div>}

          <form onSubmit={handleSubmit} className="mt-7 space-y-5">
            <label className="block text-sm font-semibold text-slate-700">
              Email
              <input className={inputClass} type="email" value={form.email} onChange={updateField("email")} placeholder="you@example.com" autoComplete="email" required />
            </label>

            <label className="block text-sm font-semibold text-slate-700">
              Password
              <div className="relative">
                <input className={`${inputClass} pr-11`} type={showPassword ? "text" : "password"} value={form.password} onChange={updateField("password")} placeholder="Enter your password" autoComplete="current-password" required />
                <button type="button" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? "Hide password" : "Show password"} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </label>

            <button disabled={loading} className="w-full rounded-xl bg-slate-950 py-3.5 text-sm font-bold text-white shadow-lg shadow-slate-900/10 transition hover:-translate-y-0.5 hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50">
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <p className="mt-7 text-center text-sm text-slate-500">Don't have an account? <Link to="/signup" className="font-bold text-blue-600 hover:text-blue-700">Create one</Link></p>
        </section>
      </div>
    </main>
  );
}
