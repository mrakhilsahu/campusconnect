import { useEffect, useState } from "react";
import { getPendingEvents, approveEvent, rejectEvent } from "../../api/events";

export default function AdminDashboard() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await getPendingEvents();
        setEvents(data.events);
      } catch {
        setError("Failed to load pending events.");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const handleApprove = async (id) => {
    try {
      await approveEvent(id);
      setEvents((prev) => prev.filter((e) => e._id !== id));
    } catch {
      alert("Failed to approve event.");
    }
  };

  const handleReject = async (id) => {
    try {
      await rejectEvent(id);
      setEvents((prev) => prev.filter((e) => e._id !== id));
    } catch {
      alert("Failed to reject event.");
    }
  };

  if (loading) return <p className="text-sm text-gray-500 animate-pulse">Loading...</p>;
  if (error) return <p className="text-sm text-red-500">{error}</p>;
  if (events.length === 0) return <p className="text-sm text-gray-500">No pending events.</p>;

  return (
    <div className="space-y-3">
      {events.map((event) => (
        <div key={event._id} className="bg-white border border-gray-200 rounded-xl p-5 flex justify-between items-start gap-4">
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-gray-800">{event.title}</p>
            <p className="text-sm text-gray-500 mt-1 line-clamp-2">{event.description}</p>
            <p className="text-xs text-gray-400 mt-2">
              By {event.createdBy?.name} &bull; {new Date(event.date).toLocaleDateString()}
            </p>
          </div>
          <div className="flex gap-2 shrink-0">
            <button
              onClick={() => handleApprove(event._id)}
              className="px-4 py-1.5 text-sm bg-green-600 hover:bg-green-700 text-white rounded-lg transition"
            >
              Approve
            </button>
            <button
              onClick={() => handleReject(event._id)}
              className="px-4 py-1.5 text-sm bg-red-500 hover:bg-red-600 text-white rounded-lg transition"
            >
              Reject
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
