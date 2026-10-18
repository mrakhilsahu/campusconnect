import { useEffect, useState } from "react";
import { Check, CalendarDays, UserRound, X } from "lucide-react";
import {
  getPendingEvents,
  approveEvent,
  rejectEvent,
} from "../../api/events";

export default function AdminDashboard() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState("");

  useEffect(() => {
    getPendingEvents()
      .then((data) => setEvents(data.events || []))
      .catch(() => setError("Unable to load pending events."))
      .finally(() => setLoading(false));
  }, []);

  const action = async (id, type) => {
    setBusy(id + type);

    try {
      if (type === "approve") {
        await approveEvent(id);
      } else {
        await rejectEvent(id);
      }

      setEvents((items) => items.filter((e) => e._id !== id));
    } catch {
      setError(`Unable to ${type} this event.`);
    } finally {
      setBusy("");
    }
  };

  if (loading) {
    return (
      <div className="card animate-pulse p-10 text-center text-sm text-slate-400">
        Loading pending events...
      </div>
    );
  }

  if (error && !events.length) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
        {error}
      </div>
    );
  }

  if (!events.length) {
    return (
      <div className="card p-12 text-center">
        <CalendarDays className="mx-auto text-slate-300" size={40} />
        <p className="mt-4 font-semibold">All caught up</p>
        <p className="mt-1 text-sm text-slate-400">
          There are no pending event requests.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {events.map((event) => (
        <article key={event._id} className="card p-5 sm:p-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <span className="rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-semibold text-amber-700">
                Pending review
              </span>

              <h2 className="mt-4 text-lg font-bold text-slate-900">
                {event.title}
              </h2>

              <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-500">
                {event.description}
              </p>

              <div className="mt-4 flex flex-wrap gap-4 text-xs text-slate-500">
                <span className="flex items-center gap-1.5">
                  <UserRound size={14} />
                  {event.createdBy?.name || "Unknown teacher"}
                </span>

                <span className="flex items-center gap-1.5">
                  <CalendarDays size={14} />
                  {new Date(event.date).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>

            <div className="flex shrink-0 gap-2">
              <button
                disabled={!!busy}
                onClick={() => action(event._id, "reject")}
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
              >
                <X size={16} />
                Reject
              </button>

              <button
                disabled={!!busy}
                onClick={() => action(event._id, "approve")}
                className="inline-flex items-center gap-1.5 rounded-xl bg-slate-950 px-3.5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-600 disabled:opacity-50"
              >
                <Check size={16} />
                {busy === event._id + "approve"
                  ? "Approving..."
                  : "Approve"}
              </button>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}