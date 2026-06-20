import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getApprovedEvents } from "../../api/events";
import { getMyRegisteredEvents } from "../../api/registrations";
import { CalendarDays, CheckCircle, Clock, Link } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function StudentDashboard() {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const [allEvents, setAllEvents] = useState([]);
  const [myEvents, setMyEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [allData, myData] = await Promise.all([
          getApprovedEvents(),
          getMyRegisteredEvents(),
        ]);
        setAllEvents(allData.events);
        setMyEvents(myData.events);
      } catch {
        // silently fail — stats just show 0
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // Upcoming = registered events with date in the future
  const upcoming = myEvents.filter((e) => new Date(e.date) >= new Date());
  const past = myEvents.filter((e) => new Date(e.date) < new Date());

  const stats = [
    { label: "Available Events", value: allEvents.length, icon: <CalendarDays size={20} />, color: "bg-blue-50 text-blue-600" },
    { label: "Registered", value: myEvents.length, icon: <CheckCircle size={20} />, color: "bg-green-50 text-green-600" },
    { label: "Upcoming", value: upcoming.length, icon: <Clock size={20} />, color: "bg-yellow-50 text-yellow-600" },
  ];

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-sm text-gray-400 animate-pulse">Loading dashboard...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="max-w-5xl mx-auto">

        {/* Greeting */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-800">
            Welcome back, {user?.name?.split(" ")[0]} 👋
          </h1>
          <p className="text-sm text-gray-500 mt-1">Here's what's happening on your campus.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-white border border-gray-200 rounded-2xl p-5 flex items-center gap-4">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${stat.color}`}>
                {stat.icon}
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Upcoming registered events */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-gray-800">Upcoming Events</h2>
            <button
              onClick={() => navigate("/student/my-events")}
              className="text-sm text-indigo-600 hover:underline"
            >
              View all →
            </button>
          </div>

          {upcoming.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-400 text-sm">No upcoming events.</p>
              <button
                onClick={() => navigate("/events")}
                className="mt-3 text-sm text-indigo-600 hover:underline"
              >
                Browse events to register →
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {upcoming.slice(0, 4).map((event) => (
                <div key={event._id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-gray-800">{event.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {new Date(event.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </p>
                  </div>
                  <span className="text-xs bg-green-100 text-green-700 px-2.5 py-1 rounded-full font-medium">
                    Registered
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
