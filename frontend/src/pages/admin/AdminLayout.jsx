import { NavLink, Outlet } from "react-router-dom";
import { CheckCircle2, Clock3, XCircle } from "lucide-react";

const tabs = [
  { name: "Pending", path: "/admin/pending", icon: Clock3 },
  { name: "Approved", path: "/admin/approved", icon: CheckCircle2 },
  { name: "Rejected", path: "/admin/rejected", icon: XCircle },
];

export default function AdminLayout() {
  return (
    <main className="page-shell bg-slate-50/70 px-4 py-8 sm:px-6 lg:py-12">
      <div className="mx-auto max-w-6xl">
        <div>
          <p className="text-sm font-semibold text-blue-600">
            Administration
          </p>

          <h1 className="mt-1 text-3xl font-black tracking-tight">
            Event approvals
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Review and manage event requests for your college.
          </p>
        </div>

        <div className="card mt-7 overflow-hidden p-2">
          <div className="grid grid-cols-3 gap-1">
            {tabs.map(({ name, path, icon: Icon }) => (
              <NavLink
                key={path}
                to={path}
                className={({ isActive }) =>
                  `flex items-center justify-center gap-2 rounded-xl px-3 py-3 text-sm font-semibold transition ${
                    isActive
                      ? "bg-slate-950 text-white"
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                  }`
                }
              >
                <Icon size={16} />
                <span className="hidden sm:inline">{name}</span>
              </NavLink>
            ))}
          </div>
        </div>

        <div className="mt-5">
          <Outlet />
        </div>
      </div>
    </main>
  );
}