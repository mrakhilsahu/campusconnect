import { useState } from "react";
import { registerForEvent } from "../api/events";

function RegisterEventModal({ eventId, onClose }) {
  const [form, setForm] = useState({
    phone: "",
    branch: "",
    year: "",
    rollNo: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await registerForEvent(eventId, form);
    onClose(true);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Event Registration</h2>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            name="phone"
            placeholder="Phone"
            value={form.phone}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
          <input
            name="branch"
            placeholder="Branch"
            value={form.branch}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
          <input
            name="year"
            type="number"
            placeholder="Year"
            value={form.year}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
          <input
            name="rollNo"
            placeholder="Roll Number"
            value={form.rollNo}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />

          <div className="flex justify-end gap-2 pt-3">
            <button
              type="button"
              onClick={() => onClose(false)}
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
  );
}

export default RegisterEventModal;
