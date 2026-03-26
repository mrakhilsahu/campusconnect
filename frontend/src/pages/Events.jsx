import { useEffect, useState } from "react";
import { getApprovedEvents } from "../api/events";
import { useSelector } from "react-redux";
import { CalendarDays } from "lucide-react";

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

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-10">
        <p className="text-slate-600 text-lg">Loading events...</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-10">
        
        {/* Page Header */}
        <div className="mb-10">
          <h2 className="text-3xl font-bold text-slate-900">
            Approved Events
          </h2>
          <p className="text-slate-600 mt-2">
            Explore all officially approved campus events.
          </p>
        </div>

        {events.length === 0 && (
          <div className="bg-white p-10 rounded-2xl shadow-sm border text-center">
            <p className="text-slate-500 text-lg">
              No events available right now.
            </p>
          </div>
        )}

        {/* Event Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event) => (
            <div
              key={event._id}
              className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-lg transition duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-2 mb-4 text-blue-900">
                  <CalendarDays size={18} />
                  <span className="text-sm font-medium">
                    Campus Event
                  </span>
                </div>

                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  {event.title}
                </h3>

                <p className="text-sm text-slate-600 leading-relaxed line-clamp-3">
                  {event.description}
                </p>
              </div>

              {/* Register Button */}
              {user?.role === "STUDENT" && (
                <button className="mt-6 w-full py-2 rounded-xl bg-blue-900 text-white font-medium hover:bg-blue-800 transition">
                  Register
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Events;