import { useEffect, useState } from "react";
import { getMyEvents } from "../../api/events";
import { Link } from "react-router-dom";

export default function TeacherDashboard() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await getMyEvents();
        setEvents(data.events);
      } catch {
        setError("Failed to load your events.");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const statusStyle = {
    APPROVED: "bg-green-100 text-green-700",
    REJECTED: "bg-red-100 text-red-600",
    PENDING: "bg-yellow-100 text-yellow-700",
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-sm text-gray-500 animate-pulse">Loading events...</p>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-sm text-red-500">{error}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="max-w-5xl mx-auto">

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">My Events</h1>
            <p className="text-sm text-gray-500 mt-1">Events you have created</p>
          </div>
          <Link
            to="/teacher/create"
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition"
          >
            + Create Event
          </Link>
        </div>

        {events.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-2xl p-10 text-center">
            <p className="text-gray-600 font-medium">No events created yet</p>
            <p className="text-sm text-gray-400 mt-1">Click "Create Event" to get started.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {events.map((event) => (
              <div
                key={event._id}
                className="bg-white border border-gray-200 rounded-2xl p-5 flex flex-col justify-between"
              >
                <div>
                  <p className="font-semibold text-gray-800">{event.title}</p>
                  <p className="text-sm text-gray-500 mt-2 line-clamp-2">{event.description}</p>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusStyle[event.status] || "bg-gray-100 text-gray-600"}`}>
                    {event.status}
                  </span>
                  <span className="text-xs text-gray-400">
                    {new Date(event.date).toLocaleDateString()}
                  </span>
                </div>

                {event.status === "APPROVED" && (
                  <Link
                    to={`/teacher/attendance/${event._id}`}
                    className="mt-4 text-center text-sm border border-indigo-500 text-indigo-600 px-4 py-2 rounded-lg hover:bg-indigo-50 transition"
                  >
                    Mark Attendance
                  </Link>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}