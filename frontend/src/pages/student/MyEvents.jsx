import { useEffect, useState } from "react";
import { getMyRegisteredEvents } from "../../api/registrations";

function MyEvents() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const loadMyEvents = async () => {
      const data = await getMyRegisteredEvents();
      setEvents(data.events);
    };
    loadMyEvents();
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <h2 className="text-2xl font-semibold mb-6">My Events</h2>

      {events.length === 0 && (
        <p className="text-gray-500">You have not registered for any events.</p>
      )}

      <div className="space-y-4">
        {events.map((event) => (
          <div key={event._id} className="border p-4 rounded">
            <h3 className="font-medium">{event.title}</h3>
            <p className="text-sm text-gray-600">{event.description}</p>
            <p className="text-sm mt-2">
              Date: {new Date(event.date).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyEvents;
