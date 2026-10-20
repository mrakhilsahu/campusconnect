import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  MapPin,
} from "lucide-react";
import { getApprovedEvents } from "../../api/events";
import { getMyRegisteredEvents } from "../../api/registrations";

export default function StudentDashboard() {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const [allEvents, setAllEvents] = useState([]);
  const [myEvents, setMyEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getApprovedEvents(), getMyRegisteredEvents()])
      .then(([all, mine]) => {
        setAllEvents(all.events || []);
        setMyEvents(mine.events || []);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="page-shell grid place-items-center">
        <p className="animate-pulse text-sm text-slate-400">
          Loading dashboard...
        </p>
      </div>
    );
  }

  const upcoming = myEvents
    .filter((event) => new Date(event.date) >= new Date())
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  const stats = [
    ["Available events", allEvents.length, CalendarDays],
    ["Registered", myEvents.length, CheckCircle2],
    ["Upcoming", upcoming.length, Clock3],
  ];

  return (
    <main className="page-shell bg-slate-50/70 px-4 py-8 sm:px-6 lg:py-12">
      <div className="mx-auto max-w-6xl">
        <div className="rounded-[28px] bg-slate-950 p-7 text-white shadow-xl shadow-slate-900/10 sm:p-9">
          <p className="text-sm font-medium text-blue-300">
            Student workspace
          </p>

          <h1 className="mt-2 text-3xl font-black tracking-tight">
            Welcome back, {user?.name?.split(" ")[0]}.
          </h1>

          <p className="mt-2 max-w-xl text-sm leading-6 text-slate-400">
            Keep track of campus events, your registrations and upcoming
            activities from one place.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={() => navigate("/events")}
              className="rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-slate-950"
            >
              Browse events
            </button>

            <button
              onClick={() => navigate("/student/my-events")}
              className="rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white"
            >
              My registrations
            </button>
          </div>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          {stats.map(([label, value, Icon]) => (
            <div key={label} className="card p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-black text-slate-950">
                    {value}
                  </p>

                  <p className="mt-1 text-xs font-medium text-slate-500">
                    {label}
                  </p>
                </div>

                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                  <Icon size={20} />
                </span>
              </div>
            </div>
          ))}
        </div>

        <section className="card mt-5 p-6 sm:p-7">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
                Your schedule
              </p>

              <h2 className="mt-1 text-xl font-bold">
                Upcoming registrations
              </h2>
            </div>

            <button
              onClick={() => navigate("/student/my-events")}
              className="hidden items-center gap-1 text-sm font-semibold text-blue-600 sm:flex"
            >
              View all <ArrowRight size={15} />
            </button>
          </div>

          {upcoming.length === 0 ? (
            <div className="py-12 text-center">
              <CalendarDays
                className="mx-auto text-slate-300"
                size={36}
              />

              <p className="mt-3 text-sm font-medium text-slate-600">
                No upcoming registrations
              </p>

              <button
                onClick={() => navigate("/events")}
                className="mt-2 text-sm font-semibold text-blue-600"
              >
                Find an event
              </button>
            </div>
          ) : (
            <div className="mt-5 space-y-2">
              {upcoming.slice(0, 5).map((event) => (
                <div
                  key={event._id}
                  className="flex flex-col gap-3 rounded-2xl bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="font-semibold text-slate-800">
                      {event.title}
                    </p>

                    <div className="mt-1 flex flex-wrap gap-3 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <CalendarDays size={13} />
                        {new Date(event.date).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>

                      {event.location && (
                        <span className="flex items-center gap-1">
                          <MapPin size={13} />
                          {event.location}
                        </span>
                      )}
                    </div>
                  </div>

                  <span className="w-fit rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                    Registered
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}