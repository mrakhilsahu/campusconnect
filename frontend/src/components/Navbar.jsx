import { Link, NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { useState } from "react";
import { CalendarDays, Menu, X } from "lucide-react";
import ProfileMenu from "./ProfileMenu";

const linksForRole = (role) => {
  if (role === "STUDENT") return [{ label: "Dashboard", to: "/student" }, { label: "Events", to: "/events" }, { label: "My Events", to: "/student/my-events" }];
  if (role === "TEACHER") return [{ label: "Dashboard", to: "/teacher" }, { label: "Events", to: "/events" }, { label: "Create Event", to: "/teacher/create" }];
  if (role === "ADMIN") return [{ label: "Pending", to: "/admin/pending" }, { label: "Approved", to: "/admin/approved" }, { label: "Rejected", to: "/admin/rejected" }];
  return [{ label: "Events", to: "/events" }];
};

export default function Navbar() {
  const { user } = useSelector((state) => state.auth);
  const [open, setOpen] = useState(false);
  const links = linksForRole(user?.role);

  return (
    <nav className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/85 backdrop-blur-xl">
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link to="/" onClick={() => setOpen(false)} className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-950 text-white shadow-sm"><CalendarDays size={19} /></span>
          <span className="text-lg font-bold tracking-tight text-slate-950">Campus<span className="text-blue-600">Connect</span></span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} className={({ isActive }) => `rounded-xl px-3.5 py-2 text-sm font-medium transition ${isActive ? "bg-slate-100 text-slate-950" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"}`}>
              {link.label}
            </NavLink>
          ))}
          {!user ? (
            <div className="ml-3 flex items-center gap-2">
              <Link to="/login" className="rounded-xl px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50">Login</Link>
              <Link to="/signup" className="rounded-xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800">Get started</Link>
            </div>
          ) : <div className="ml-3"><ProfileMenu /></div>}
        </div>

        <button aria-label="Toggle menu" onClick={() => setOpen((v) => !v)} className="rounded-xl p-2 text-slate-600 hover:bg-slate-100 md:hidden">
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="border-t border-slate-100 bg-white px-4 py-4 shadow-lg md:hidden">
          <div className="mx-auto max-w-7xl space-y-1">
            {links.map((link) => (
              <NavLink key={link.to} to={link.to} onClick={() => setOpen(false)} className={({ isActive }) => `block rounded-xl px-4 py-3 text-sm font-medium ${isActive ? "bg-slate-100 text-slate-950" : "text-slate-600 hover:bg-slate-50"}`}>
                {link.label}
              </NavLink>
            ))}
            {!user ? (
              <div className="grid grid-cols-2 gap-2 pt-2">
                <Link to="/login" onClick={() => setOpen(false)} className="rounded-xl border border-slate-200 py-2.5 text-center text-sm font-medium text-slate-700">Login</Link>
                <Link to="/signup" onClick={() => setOpen(false)} className="rounded-xl bg-slate-950 py-2.5 text-center text-sm font-semibold text-white">Get started</Link>
              </div>
            ) : <div className="pt-2"><ProfileMenu /></div>}
          </div>
        </div>
      )}
    </nav>
  );
}
