import { useEffect, useState } from "react";
import { getApprovedEvents, registerForEvent } from "../../api/events";

function StudentDashboard() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const [form, setForm] = useState({
    phone: "",
    branch: "",
    year: "",
    rollNo: "",
  });

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

  const openModal = (eventId) => {
    setSelectedEvent(eventId);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedEvent(null);
    setForm({ phone: "", branch: "", year: "", rollNo: "" });
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await registerForEvent(selectedEvent, form);
      alert("Registered successfully");
      closeModal();
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <h2 className="text-2xl font-semibold mb-6">Approved Events</h2>

      {loading && <p>Loading...</p>}

      {!loading && events.length === 0 && (
        <p className="text-gray-500">No events available.</p>
      )}

      <div className="space-y-4">
        {events.map((event) => (
          <div key={event._id} className="border p-4 rounded-md">
            <h3 className="font-medium">{event.title}</h3>
            <p className="text-sm text-gray-600">{event.description}</p>
            <p className="text-sm mt-2">
              Date: {new Date(event.date).toLocaleDateString()}
            </p>

            <button
              onClick={() => openModal(event._id)}
              className="mt-3 text-sm border px-3 py-1 rounded hover:bg-black hover:text-white"
            >
              Register
            </button>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">
              Event Registration
            </h3>

            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                name="phone"
                placeholder="Phone"
                value={form.phone}
                onChange={handleChange}
                required
                className="w-full border p-2 rounded"
              />
              <input
                name="branch"
                placeholder="Branch"
                value={form.branch}
                onChange={handleChange}
                required
                className="w-full border p-2 rounded"
              />
              <input
                type="number"
                name="year"
                placeholder="Year"
                value={form.year}
                onChange={handleChange}
                required
                className="w-full border p-2 rounded"
              />
              <input
                name="rollNo"
                placeholder="Roll Number"
                value={form.rollNo}
                onChange={handleChange}
                required
                className="w-full border p-2 rounded"
              />

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="border px-4 py-1 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-black text-white px-4 py-1 rounded"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default StudentDashboard;
