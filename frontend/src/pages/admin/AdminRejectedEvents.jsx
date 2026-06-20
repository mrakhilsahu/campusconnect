import { useEffect, useState } from "react";
import { getRejectedEventsAdmin } from "../../api/events";

export default function AdminRejectedEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await getRejectedEventsAdmin();
        setEvents(data.events);
      } catch {
        setError("Failed to load rejected events.");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  if (loading) return <p className="text-sm text-gray-500 animate-pulse">Loading...</p>;
  if (error) return <p className="text-sm text-red-500">{error}</p>;
  if (events.length === 0) return <p className="text-sm text-gray-500">No rejected events.</p>;

  return (
    <div className="space-y-3">
      {events.map((event) => (
        <div key={event._id} className="bg-white border border-gray-200 rounded-xl p-5">
          <p className="font-semibold text-gray-800">{event.title}</p>
          <p className="text-sm text-gray-500 mt-1 line-clamp-2">{event.description}</p>
          <p className="text-xs text-gray-400 mt-2">
            By {event.createdBy?.name} &bull; {new Date(event.date).toLocaleDateString()}
          </p>
        </div>
      ))}
    </div>
  );
}
