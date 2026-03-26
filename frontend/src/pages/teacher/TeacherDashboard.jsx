import { useEffect, useState } from "react";
import { getMyEvents } from "../../api/events";
import { Link } from "react-router-dom";

function TeacherDashboard() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyEvents = async () => {
      try {
        const data = await getMyEvents();
        setEvents(data.events);
      } catch (err) {
        console.error(err);
        alert("Failed to load your events");
      } finally {
        setLoading(false);
      }
    };

    fetchMyEvents();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg font-medium text-gray-600 animate-pulse">
          Loading your events...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">

        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-10">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              My Events
            </h1>
            <p className="text-gray-500 mt-1">
              Manage and track your created events
            </p>
          </div>

          <Link
            to="/teacher/create"
            className="mt-4 md:mt-0 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition duration-300"
          >
            + Create Event
          </Link>
        </div>

        {events.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-md p-10 text-center">
            <h3 className="text-xl font-semibold text-gray-700">
              No events created yet
            </h3>
            <p className="text-gray-500 mt-2">
              Click "Create Event" to add your first event.
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event) => (
              <div
                key={event._id}
                className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition duration-300 p-6 flex flex-col justify-between"
              >
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">
                    {event.title}
                  </h3>

                  <p className="text-gray-600 text-sm mt-3 line-clamp-3">
                    {event.description}
                  </p>
                </div>

                <div className="mt-6 flex justify-between items-center">
                  <span
                    className={`px-3 py-1 text-xs font-semibold rounded-full ${
                      event.status === "APPROVED"
                        ? "bg-green-100 text-green-600"
                        : event.status === "REJECTED"
                        ? "bg-red-100 text-red-600"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {event.status}
                  </span>

                  <span className="text-xs text-gray-400">
                    {new Date(event.date).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default TeacherDashboard;