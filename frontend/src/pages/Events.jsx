import { useEffect, useState } from "react";
import { getApprovedEvents } from "../api/events";
import { useSelector } from "react-redux";
import { CalendarDays, MapPin } from "lucide-react";

function Events() {
  const { user } = useSelector((state) => state.auth);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const data = await getApprovedEvents();
        setEvents(data.events);
      } catch (err) {
        console.error("Failed to load events");
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, []);

  const getEventImage = (event) => {
    if (event.image) return event.image;

    // Dynamic unique image based on title
    return `https://source.unsplash.com/600x400/?${event.title},event`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-slate-500 text-lg animate-pulse">
          Loading events...
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-slate-50 to-slate-100 min-h-screen">
      <div className="max-w-6xl mx-auto px-6 py-12">
        
        {/* Header */}
        <div className="mb-14 text-center">
          <h2 className="text-4xl font-bold text-slate-900 tracking-tight">
            Discover Events
          </h2>
          <p className="text-slate-500 mt-3">
            Explore curated campus experiences ✨
          </p>
        </div>

        {events.length === 0 && (
          <div className="bg-white p-10 rounded-2xl shadow text-center">
            <p className="text-slate-500 text-lg">
              No events available right now.
            </p>
          </div>
        )}

        {/* GRID */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 place-items-center">
          {events.map((event) => (
            <div
              key={event._id}
              className="group w-full max-w-sm bg-white/70 backdrop-blur-xl border border-white/40 rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition duration-500 hover:-translate-y-2"
            >
              {/* IMAGE */}
              <div className="relative h-44 overflow-hidden">
                <img
                  src={getEventImage(event)}
                  alt={event.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                {/* Badge */}
                <div className="absolute top-3 left-3 bg-white/90 text-xs px-3 py-1 rounded-full font-medium shadow">
                  Event
                </div>
              </div>

              {/* CONTENT */}
              <div className="p-5 flex flex-col justify-between h-[200px]">
                <div>
                  {/* DATE */}
                  <div className="flex items-center gap-2 text-xs text-blue-700 mb-2">
                    <CalendarDays size={14} />
                    <span>
                      {new Date(event.date).toDateString()}
                    </span>
                  </div>

                  {/* TITLE */}
                  <h3 className="text-lg font-semibold text-slate-900 mb-1 line-clamp-1">
                    {event.title}
                  </h3>

                  {/* DESC */}
                  <p className="text-sm text-slate-600 line-clamp-2">
                    {event.description}
                  </p>
                </div>

                {/* FOOTER */}
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center gap-1 text-xs text-slate-500">
                    <MapPin size={14} />
                    <span>{event.location || "Campus"}</span>
                  </div>

                  {user?.role === "STUDENT" && (
                    <button className="relative px-4 py-1.5 text-sm rounded-lg bg-gradient-to-r from-blue-900 to-indigo-600 text-white overflow-hidden">
                      <span className="relative z-10">Register</span>

                      {/* Glow Effect */}
                      <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition bg-white/20 blur-md"></span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Events;