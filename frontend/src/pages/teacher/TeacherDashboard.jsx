import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  Plus,
  Users,
} from "lucide-react";
import { getMyEvents } from "../../api/events";

const statusStyle = {
  APPROVED: "bg-emerald-50 text-emerald-700",
  REJECTED: "bg-red-50 text-red-700",
  PENDING: "bg-amber-50 text-amber-700",
  COMPLETED: "bg-blue-50 text-blue-700",
};

export default function TeacherDashboard() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getMyEvents()
      .then((data) => setEvents(data.events || []))
      .catch(() => setError("Unable to load your events."))
      .finally(() => setLoading(false));
  }, []);

  const stats = useMemo(
    () => [
      ["Total events", events.length, CalendarDays],
      [
        "Approved",
        events.filter((e) => e.status === "APPROVED").length,
        CheckCircle2,
      ],
      [
        "Pending",
        events.filter((e) => e.status === "PENDING").length,
        Clock3,
      ],
    ],
    [events]
  );

  if (loading) {
    return (
      <div className="page-shell grid place-items-center">
        <p className="animate-pulse text-sm text-slate-400">
          Loading dashboard...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-shell grid place-items-center">
        <p className="text-sm text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <main className="page-shell bg-slate-50/70 px-4 py-8 sm:px-6 lg:py-12">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-blue-600">
              Teacher workspace
            </p>
            <h1 className="mt-1 text-3xl font-black tracking-tight">
              Manage your events
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Create events, track approval status and manage attendance.
            </p>
          </div>

          <Link
            to="/teacher/create"
            className="inline-flex w-fit items-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-slate-800"
          >
            <Plus size={17} />
            Create event
          </Link>
        </div>

        <div className="mt-7 grid gap-4 sm:grid-cols-3">
          {stats.map(([label, value, Icon]) => (
            <div key={label} className="card p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-black">{value}</p>
                  <p className="mt-1 text-xs text-slate-500">{label}</p>
                </div>

                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                  <Icon size={20} />
                </span>
              </div>
            </div>
          ))}
        </div>

        {events.length === 0 ? (
          <div className="card mt-5 p-12 text-center">
            <CalendarDays className="mx-auto text-slate-300" size={40} />
            <p className="mt-4 font-semibold">No events yet</p>
            <p className="mt-1 text-sm text-slate-400">
              Create your first event to start the approval workflow.
            </p>
          </div>
        ) : (
          <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <article
                key={event._id}
                className="card card-hover flex flex-col p-5"
              >
                <div className="flex items-start justify-between gap-3">
                  <span
                    className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                      statusStyle[event.status] ||
                      "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {event.status}
                  </span>

                  <span className="text-xs text-slate-400">
                    {new Date(event.date).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                    })}
                  </span>
                </div>

                <h2 className="mt-5 font-bold text-slate-900">
                  {event.title}
                </h2>

                <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">
                  {event.description}
                </p>

                <div className="mt-auto pt-5">
                  {event.status === "APPROVED" ? (
                    <Link
                      to={`/teacher/attendance/${event._id}`}
                      className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      <Users size={15} />
                      Manage attendance
                    </Link>
                  ) : (
                    <p className="text-xs text-slate-400">
                      {event.status === "PENDING"
                        ? "Waiting for admin approval"
                        : "No action available"}
                    </p>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}