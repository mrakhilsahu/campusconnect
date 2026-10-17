import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, GraduationCap, Sparkles, Users } from "lucide-react";
import { registerUser } from "../store/authSlice";

const inputClass = "mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-50";
const getDashboard = (role) => {
  if (role === "STUDENT") return "/student";
  if (role === "TEACHER") return "/teacher";
  return "/admin/pending";
};

export default function Signup() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, token, loading, error } = useSelector((state) => state.auth);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "STUDENT", collegeCode: "" });

  useEffect(() => {
    if (user && token) navigate(getDashboard(user.role), { replace: true });
  }, [user, token, navigate]);

  const updateField = (field) => (event) => {
    const value = field === "collegeCode" ? event.target.value.toUpperCase() : event.target.value;
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    dispatch(registerUser(form));
  };

  return (
    <main className="min-h-[calc(100vh-72px)] bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,.12),transparent_32%),#f8fafc] px-4 py-8 sm:py-12">
      <div className="mx-auto grid max-w-5xl overflow-hidden rounded-[30px] border border-slate-200 bg-white shadow-[0_30px_90px_rgba(15,23,42,.10)] md:grid-cols-2">
        <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-slate-950 p-8 text-white sm:p-10">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          <div className="relative flex h-full flex-col justify-between">
            <div>
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/10"><Sparkles size={20} /></div>
              <p className="mt-8 text-sm font-semibold text-blue-100">Join CampusConnect</p>
              <h1 className="mt-2 max-w-sm text-4xl font-black leading-tight tracking-tight">A cleaner way to run campus events.</h1>
              <p className="mt-5 max-w-sm text-sm leading-6 text-blue-100/75">Create an account and explore the complete student or teacher workflow.</p>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-10">
              <div className="rounded-2xl border border-white/10 bg-white/10 p-4"><GraduationCap size={17} /><p className="mt-3 font-bold">Students</p><p className="mt-1 text-xs text-blue-100/70">Discover & register</p></div>
              <div className="rounded-2xl border border-white/10 bg-white/10 p-4"><Users size={17} /><p className="mt-3 font-bold">Teachers</p><p className="mt-1 text-xs text-blue-100/70">Create & manage</p></div>
            </div>
          </div>
        </section>

        <section className="p-7 sm:p-10">
          <h2 className="text-2xl font-black tracking-tight text-slate-950">Create your account</h2>
          <p className="mt-2 text-sm leading-6 text-slate-500">Use your college code to join the correct campus.</p>

          {error && <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{error}</div>}

          <form onSubmit={handleSubmit} className="mt-7 space-y-4">
            <label className="block text-sm font-semibold text-slate-700">Full name<input className={inputClass} value={form.name} onChange={updateField("name")} placeholder="Akhil Sahu" autoComplete="name" required /></label>
            <label className="block text-sm font-semibold text-slate-700">Email<input className={inputClass} type="email" value={form.email} onChange={updateField("email")} placeholder="you@example.com" autoComplete="email" required /></label>
            <label className="block text-sm font-semibold text-slate-700">
              Password
              <div className="relative">
                <input className={`${inputClass} pr-11`} type={showPassword ? "text" : "password"} value={form.password} onChange={updateField("password")} minLength={6} maxLength={72} placeholder="At least 6 characters" autoComplete="new-password" required />
                <button type="button" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? "Hide password" : "Show password"} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700">{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button>
              </div>
            </label>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block text-sm font-semibold text-slate-700">College code<input className={`${inputClass} uppercase`} value={form.collegeCode} onChange={updateField("collegeCode")} placeholder="DEMO" required /></label>
              <label className="block text-sm font-semibold text-slate-700">Account type<select className={`${inputClass} bg-white`} value={form.role} onChange={updateField("role")}><option value="STUDENT">Student</option><option value="TEACHER">Teacher</option></select></label>
            </div>

            <button disabled={loading} className="w-full rounded-xl bg-slate-950 py-3.5 text-sm font-bold text-white shadow-lg shadow-slate-900/10 transition hover:-translate-y-0.5 hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50">{loading ? "Creating account..." : "Create account"}</button>
          </form>

          <p className="mt-7 text-center text-sm text-slate-500">Already have an account? <Link to="/login" className="font-bold text-blue-600 hover:text-blue-700">Sign in</Link></p>
        </section>
      </div>
    </main>
  );
}
