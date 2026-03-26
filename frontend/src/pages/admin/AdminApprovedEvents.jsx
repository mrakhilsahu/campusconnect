import { useEffect, useState } from "react";
import { getApprovedEventsAdmin } from "../../api/events";

function AdminApprovedEvents() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    getApprovedEventsAdmin().then(res => {
      setEvents(res.events);
    });
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Approved Events</h1>

      {events.length === 0 && <p>No approved events</p>}

      {events.map(event => (
        <div key={event._id} className="border p-4 rounded mb-3">
          <h3 className="font-semibold">{event.title}</h3>
          <p className="text-sm text-gray-600">{event.description}</p>
        </div>
      ))}
    </div>
  );
}

export default AdminApprovedEvents;
