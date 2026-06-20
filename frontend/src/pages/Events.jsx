import { useEffect, useState } from "react";
import { getApprovedEvents } from "../api/events";
import { useSelector } from "react-redux";
import { CalendarDays, MapPin, Search } from "lucide-react";
import RegisterEventModal from "../components/RegisterEventModal";

export default function Events() {
  const { user } = useSelector((state) => state.auth);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const data = await getApprovedEvents();
        setEvents(data.events);
      } catch {
        setError("Failed to load events. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    loadEvents();
  }, []);

  const filteredEvents = events.filter(
    (e) =>
      e.title.toLowerCase().includes(search.toLowerCase()) ||
      e.description.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <p className="text-sm text-gray-400 animate-pulse">Loading events...</p>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <p className="text-sm text-red-500">{error}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="max-w-6xl mx-auto">

        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Campus Events</h2>
          <p className="text-gray-500 mt-2 text-sm">Browse and register for events happening on your campus</p>
        </div>

        {/* Search */}
        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2.5 max-w-md mx-auto mb-10 shadow-sm">
          <Search size={16} className="text-gray-400 shrink-0" />
          <input
            type="text"
            placeholder="Search by title or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 outline-none text-sm text-gray-700 bg-transparent"
          />
        </div>

        {filteredEvents.length === 0 && (
          <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center">
            <p className="text-gray-400">No events found{search ? ` for "${search}"` : ""}.</p>
          </div>
        )}

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredEvents.map((event) => (
            <div key={event._id} className="bg-white border border-gray-200 rounded-2xl p-5 flex flex-col justify-between hover:shadow-md transition">
              <div>
                {event.category && (
                  <span className="text-xs bg-indigo-50 text-indigo-600 px-2.5 py-1 rounded-full font-medium capitalize">
                    {event.category}
                  </span>
                )}
                <h3 className="font-semibold text-gray-800 mt-3 mb-1">{event.title}</h3>
                <p className="text-sm text-gray-500 line-clamp-2">{event.description}</p>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-xs text-gray-400">
                    <CalendarDays size={12} />
                    <span>{new Date(event.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
                  </div>
                  {event.location && (
                    <div className="flex items-center gap-1.5 text-xs text-gray-400">
                      <MapPin size={12} />
                      <span className="line-clamp-1">{event.location}</span>
                    </div>
                  )}
                </div>

                {user?.role === "STUDENT" && (
                  <button
                    onClick={() => setSelectedEventId(event._id)}
                    className="shrink-0 ml-3 px-4 py-1.5 text-sm bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition"
                  >
                    Register
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedEventId && (
        <RegisterEventModal
          eventId={selectedEventId}
          onClose={() => setSelectedEventId(null)}
        />
      )}
    </div>
  );
}
