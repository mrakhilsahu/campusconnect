import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, CalendarPlus, MapPin } from "lucide-react";
import { createEvent } from "../../api/events";

const initial = {
  title: "",
  description: "",
  date: "",
  time: "",
  location: "",
  category: "",
  capacity: "",
  mode: "offline",
};

const inputClass =
  "mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-50";

export default function CreateEvent() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState(initial);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const update = (e) =>
    setFormData((current) => ({
      ...current,
      [e.target.name]: e.target.value,
    }));

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await createEvent(formData);
      navigate("/teacher");
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to create the event."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="page-shell bg-slate-50/70 px-4 py-8 sm:px-6 lg:py-12">
      <div className="mx-auto max-w-3xl">
        <button
          onClick={() => navigate(-1)}
          className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900"
        >
          <ArrowLeft size={16} />
          Back
        </button>

        <div className="card overflow-hidden">
          <div className="bg-slate-950 p-7 text-white sm:p-8">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10">
              <CalendarPlus size={21} />
            </div>

            <h1 className="mt-5 text-2xl font-black">
              Create a campus event
            </h1>

            <p className="mt-2 text-sm leading-6 text-slate-400">
              Add the event details below. New events are sent to an admin
              for approval.
            </p>
          </div>

          <form onSubmit={submit} className="space-y-5 p-6 sm:p-8">
            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <div>
              <label className="text-sm font-semibold text-slate-700">
                Event title
              </label>
              <input
                className={inputClass}
                name="title"
                value={formData.title}
                onChange={update}
                required
                placeholder="e.g. AI Workshop"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-700">
                Description
              </label>
              <textarea
                className={`${inputClass} resize-none`}
                name="description"
                value={formData.description}
                onChange={update}
                required
                rows="4"
                placeholder="What should students know about this event?"
              />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="text-sm font-semibold text-slate-700">
                  Date
                </label>
                <input
                  className={inputClass}
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={update}
                  required
                  min={new Date().toISOString().split("T")[0]}
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-slate-700">
                  Time
                </label>
                <input
                  className={inputClass}
                  type="time"
                  name="time"
                  value={formData.time}
                  onChange={update}
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-700">
                Location / meeting link
              </label>

              <div className="relative">
                <MapPin
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  size={17}
                />
                <input
                  className={`${inputClass} pl-10`}
                  name="location"
                  value={formData.location}
                  onChange={update}
                  required
                  placeholder="Room 101 or meeting link"
                />
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="text-sm font-semibold text-slate-700">
                  Category
                </label>
                <select
                  className={inputClass}
                  name="category"
                  value={formData.category}
                  onChange={update}
                >
                  <option value="">Select category</option>
                  <option value="tech">Technical</option>
                  <option value="cultural">Cultural</option>
                  <option value="sports">Sports</option>
                  <option value="workshop">Workshop</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-semibold text-slate-700">
                  Mode
                </label>
                <select
                  className={inputClass}
                  name="mode"
                  value={formData.mode}
                  onChange={update}
                >
                  <option value="offline">Offline</option>
                  <option value="online">Online</option>
                  <option value="hybrid">Hybrid</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-700">
                Capacity{" "}
                <span className="font-normal text-slate-400">
                  (optional)
                </span>
              </label>
              <input
                className={inputClass}
                type="number"
                min="1"
                name="capacity"
                value={formData.capacity}
                onChange={update}
                placeholder="Leave blank for unlimited"
              />
            </div>

            <button
              disabled={loading}
              className="w-full rounded-xl bg-slate-950 py-3 text-sm font-semibold text-white transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Creating event..." : "Submit for approval"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}