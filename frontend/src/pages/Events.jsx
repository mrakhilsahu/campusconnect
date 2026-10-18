import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import {
  CalendarDays,
  MapPin,
  Search,
  Users,
  ArrowUpRight,
  Clock3,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { getApprovedEvents } from "../api/events";
import RegisterEventModal from "../components/RegisterEventModal";

const categoryStyle = {
  tech: "bg-blue-50 text-blue-700",
  cultural: "bg-fuchsia-50 text-fuchsia-700",
  sports: "bg-emerald-50 text-emerald-700",
  workshop: "bg-amber-50 text-amber-700",
};

const formatDate = (date) =>
  new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

export default function Events() {
  const { user } = useSelector((state) => state.auth);
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [mode, setMode] = useState("all");
  const [sort, setSort] = useState("soonest");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    getApprovedEvents()
      .then((data) => setEvents(data.events || []))
      .catch(() => setError("Unable to load events right now."))
      .finally(() => setLoading(false));
  }, []);

  const filteredEvents = useMemo(() => {
    const value = search.toLowerCase().trim();
    const result = events.filter((event) => {
      const matchesSearch =
        !value ||
        `${event.title} ${event.description} ${event.category || ""} ${event.location || ""}`
          .toLowerCase()
          .includes(value);
      const matchesCategory = category === "all" || event.category === category;
      const matchesMode = mode === "all" || event.mode === mode;
      return matchesSearch && matchesCategory && matchesMode;
    });

    return [...result].sort((a, b) => {
      if (sort === "latest") return new Date(b.date) - new Date(a.date);
      return new Date(a.date) - new Date(b.date);
    });
  }, [events, search, category, mode, sort]);

  const hasFilters = search || category !== "all" || mode !== "all";

  const clearFilters = () => {
    setSearch("");
    setCategory("all");
    setMode("all");
    setSort("soonest");
  };

  const handleClose = (registered) => {
    setSelectedEvent(null);
    if (registered) {
      setSuccess("Registration completed successfully.");
      setTimeout(() => setSuccess(""), 3500);
    }
  };

  return (
    <main className="page-shell bg-[radial-gradient(circle_at_top_right,_rgba(59,130,246,.10),_transparent_30%),#f8fafc] px-4 py-8 sm:px-6 lg:py-12">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-bold text-blue-600">Campus calendar</p>
            <h1 className="mt-1 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
              Discover events
            </h1>
            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
              Find approved workshops, technical events, cultural programs and activities happening on your campus.
            </p>
          </div>

          <div className="flex w-full gap-2 lg:max-w-xl">
            <div className="relative min-w-0 flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search title, category or location..."
                className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm outline-none shadow-sm transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
              />
            </div>
            <button
              onClick={() => setShowFilters((value) => !value)}
              className={`inline-flex items-center gap-2 rounded-2xl border px-4 py-3 text-sm font-semibold shadow-sm transition ${
                showFilters || hasFilters
                  ? "border-blue-200 bg-blue-50 text-blue-700"
                  : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
              }`}
            >
              <SlidersHorizontal size={17} />
              <span className="hidden sm:inline">Filters</span>
            </button>
          </div>
        </div>

        {showFilters && (
          <div className="mt-5 rounded-3xl border border-slate-200 bg-white/90 p-4 shadow-sm backdrop-blur sm:p-5">
            <div className="grid gap-4 sm:grid-cols-3">
              <label className="text-xs font-bold uppercase tracking-wide text-slate-400">
                Category
                <select value={category} onChange={(e) => setCategory(e.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium text-slate-700 outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-50">
                  <option value="all">All categories</option>
                  <option value="tech">Technology</option>
                  <option value="cultural">Cultural</option>
                  <option value="sports">Sports</option>
                  <option value="workshop">Workshop</option>
                </select>
              </label>
              <label className="text-xs font-bold uppercase tracking-wide text-slate-400">
                Mode
                <select value={mode} onChange={(e) => setMode(e.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium text-slate-700 outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-50">
                  <option value="all">All modes</option>
                  <option value="offline">Offline</option>
                  <option value="online">Online</option>
                  <option value="hybrid">Hybrid</option>
                </select>
              </label>
              <label className="text-xs font-bold uppercase tracking-wide text-slate-400">
                Sort
                <select value={sort} onChange={(e) => setSort(e.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium text-slate-700 outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-50">
                  <option value="soonest">Soonest first</option>
                  <option value="latest">Latest first</option>
                </select>
              </label>
            </div>
            {hasFilters && (
              <button onClick={clearFilters} className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-blue-600">
                <X size={14} /> Clear filters
              </button>
            )}
          </div>
        )}

        {success && <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">{success}</div>}
        {error && <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

        <div className="mt-8 flex items-center justify-between text-xs text-slate-400">
          <span>{loading ? "Loading events..." : `${filteredEvents.length} event${filteredEvents.length === 1 ? "" : "s"} available`}</span>
          {hasFilters && !loading && <span>Filtered results</span>}
        </div>

        {loading ? (
          <div className="grid gap-5 pt-5 sm:grid-cols-2 lg:grid-cols-3">{[1,2,3,4,5,6].map((i) => <div key={i} className="h-80 animate-pulse rounded-3xl bg-slate-200" />)}</div>
        ) : filteredEvents.length === 0 ? (
          <div className="card mt-5 px-6 py-16 text-center">
            <CalendarDays className="mx-auto text-slate-300" size={40} />
            <h2 className="mt-4 font-semibold text-slate-700">No matching events</h2>
            <p className="mt-1 text-sm text-slate-400">Try another search or clear your filters.</p>
            {hasFilters && <button onClick={clearFilters} className="mt-5 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-600">Clear filters</button>}
          </div>
        ) : (
          <div className="grid gap-5 pt-5 sm:grid-cols-2 lg:grid-cols-3">
            {filteredEvents.map((event) => {
              const spotsLeft = event.capacity ? Math.max(event.capacity - (event.registeredCount || 0), 0) : null;
              return (
                <article key={event._id} className="group card card-hover flex flex-col overflow-hidden">
                  <div className="relative h-36 overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950 to-blue-600 p-5 text-white">
                    <div className="absolute -right-8 -top-12 h-32 w-32 rounded-full bg-blue-400/20 blur-2xl transition group-hover:scale-125" />
                    <div className="relative flex items-start justify-between gap-3">
                      <span className="rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-blue-100 backdrop-blur">{event.mode || "offline"}</span>
                      <ArrowUpRight size={17} className="text-blue-100 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </div>
                    <h2 className="relative mt-5 line-clamp-2 text-xl font-bold leading-6">{event.title}</h2>
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <div className="flex items-center justify-between gap-3">
                      <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold capitalize ${categoryStyle[event.category] || "bg-slate-100 text-slate-600"}`}>{event.category || "Campus event"}</span>
                      {event.capacity && <span className={`text-xs font-semibold ${spotsLeft === 0 ? "text-red-500" : "text-slate-400"}`}>{spotsLeft === 0 ? "Full" : `${spotsLeft} spots left`}</span>}
                    </div>
                    <p className="mt-4 line-clamp-2 text-sm leading-6 text-slate-500">{event.description}</p>
                    <div className="mt-5 space-y-2.5 border-t border-slate-100 pt-4 text-xs text-slate-500">
                      <div className="flex items-center gap-2"><CalendarDays size={14} className="text-blue-500" />{formatDate(event.date)}</div>
                      {event.time && <div className="flex items-center gap-2"><Clock3 size={14} className="text-blue-500" />{event.time}</div>}
                      <div className="flex items-center gap-2"><MapPin size={14} className="text-blue-500" /><span className="truncate">{event.location || "Location to be announced"}</span></div>
                    </div>
                    {user?.role === "STUDENT" && (
                      <button
                        disabled={spotsLeft === 0}
                        onClick={() => setSelectedEvent(event)}
                        className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
                      >
                        <Users size={15} /> {spotsLeft === 0 ? "Event full" : "Register now"}
                      </button>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
      {selectedEvent && <RegisterEventModal eventId={selectedEvent._id} eventTitle={selectedEvent.title} onClose={handleClose} />}
    </main>
  );
}
