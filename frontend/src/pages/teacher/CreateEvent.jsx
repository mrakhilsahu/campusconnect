import { useState } from "react";
import { createEvent } from "../../api/events";
import { useNavigate } from "react-router-dom";

function CreateEvent() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
    category: "",
    capacity: "",
    mode: "offline",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await createEvent(formData);
      navigate("/teacher");
    } catch (err) {
      console.error(err);
      alert("Failed to create event");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-2xl bg-white border border-gray-200 rounded-2xl shadow-sm p-8">

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">
            Create Event
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Add details for your event. It will be reviewed before publishing.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Title */}
          <div>
            <label className="text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full mt-1 px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-1 focus:ring-indigo-500 outline-none"
              placeholder="e.g. AI Workshop"
            />
          </div>

          {/* Category + Mode */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full mt-1 px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-1 focus:ring-indigo-500"
              >
                <option value="">Select</option>
                <option value="tech">Technical</option>
                <option value="cultural">Cultural</option>
                <option value="sports">Sports</option>
                <option value="workshop">Workshop</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Mode</label>
              <select
                name="mode"
                value={formData.mode}
                onChange={handleChange}
                className="w-full mt-1 px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-1 focus:ring-indigo-500"
              >
                <option value="offline">Offline</option>
                <option value="online">Online</option>
                <option value="hybrid">Hybrid</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="text-sm font-medium text-gray-700">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows="3"
              className="w-full mt-1 px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-1 focus:ring-indigo-500 resize-none"
              placeholder="Briefly describe the event"
            />
          </div>

          {/* Date + Time */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Date</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                className="w-full mt-1 px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Time</label>
              <input
                type="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                className="w-full mt-1 px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="text-sm font-medium text-gray-700">Location / Link</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
              className="w-full mt-1 px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-1 focus:ring-indigo-500"
              placeholder="Room / Google Meet link"
            />
          </div>

          {/* Capacity */}
          <div>
            <label className="text-sm font-medium text-gray-700">Capacity</label>
            <input
              type="number"
              name="capacity"
              value={formData.capacity}
              onChange={handleChange}
              min="1"
              className="w-full mt-1 px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-1 focus:ring-indigo-500"
              placeholder="Optional"
            />
          </div>

          {/* Submit */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium py-2.5 rounded-lg transition"
            >
              {loading ? "Creating..." : "Create Event"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

export default CreateEvent;