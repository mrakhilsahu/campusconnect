import { useEffect, useState } from "react";
import { CalendarDays, CheckCircle2, UserRound } from "lucide-react";
import { getApprovedEventsAdmin } from "../../api/events";

export default function AdminApprovedEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getApprovedEventsAdmin()
      .then((d) => setEvents(d.events || []))
      .catch(() => setError("Unable to load approved events."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="card animate-pulse p-10 text-center text-sm text-slate-400">
        Loading approved events...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
        {error}
      </div>
    );
  }

  if (!events.length) {
    return (
      <div className="card p-12 text-center">
        <CheckCircle2 className="mx-auto text-slate-300" size={40} />
        <p className="mt-4 font-semibold">No approved events</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {events.map((e) => (
        <article key={e._id} className="card card-hover p-5">
          <div className="flex items-center justify-between">
            <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
              Approved
            </span>

            <span className="text-xs text-slate-400">
              {new Date(e.date).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </span>
          </div>

          <h2 className="mt-5 font-bold">{e.title}</h2>

          <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">
            {e.description}
          </p>

          <div className="mt-5 flex items-center gap-2 text-xs text-slate-500">
            <UserRound size={14} />
            {e.createdBy?.name || "Unknown teacher"}
            <span className="mx-1">·</span>
            <CalendarDays size={14} />
            {e.location || "Location not set"}
          </div>
        </article>
      ))}
    </div>
  );
}