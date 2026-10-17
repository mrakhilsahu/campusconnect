import { useState } from "react";
import { CalendarCheck2, X } from "lucide-react";
import { registerForEvent } from "../api/events";
import { getApiError } from "../api/error";

const inputClass =
  "mt-1.5 w-full rounded-xl border border-slate-200 px-3.5 py-3 text-sm outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-50";

export default function RegisterEventModal({
  eventId,
  eventTitle,
  onClose,
}) {
  const [form, setForm] = useState({
    phone: "",
    branch: "",
    year: "",
    rollNo: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const updateField = (field) => (event) =>
    setForm((current) => ({
      ...current,
      [field]: event.target.value,
    }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      await registerForEvent(eventId, form);
      onClose(true);
    } catch (requestError) {
      setError(
        getApiError(requestError, "Unable to complete registration.")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-slate-950/60 p-4 backdrop-blur-sm"
      onMouseDown={(event) =>
        event.target === event.currentTarget && onClose(false)
      }
    >
      <div
        className="w-full max-w-lg overflow-hidden rounded-[26px] bg-white shadow-2xl"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header className="flex items-start justify-between bg-slate-950 p-6 text-white">
          <div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
              <CalendarCheck2 size={19} />
            </div>

            <h2 className="mt-4 text-xl font-black">
              Register for event
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              {eventTitle}
            </p>
          </div>

          <button
            type="button"
            onClick={() => onClose(false)}
            className="rounded-xl p-2 text-slate-400 transition hover:bg-white/10 hover:text-white"
          >
            <X size={19} />
          </button>
        </header>

        <form onSubmit={handleSubmit} className="space-y-4 p-6">
          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              {error}
            </div>
          )}

          <label className="block text-xs font-bold text-slate-600">
            Phone number
            <input
              className={inputClass}
              value={form.phone}
              onChange={updateField("phone")}
              inputMode="numeric"
              placeholder="9876543210"
              required
            />
          </label>

          <label className="block text-xs font-bold text-slate-600">
            Branch / department
            <input
              className={inputClass}
              value={form.branch}
              onChange={updateField("branch")}
              placeholder="Computer Science"
              required
            />
          </label>

          <div className="grid grid-cols-2 gap-4">
            <label className="block text-xs font-bold text-slate-600">
              Year
              <input
                className={inputClass}
                type="number"
                min="1"
                max="6"
                value={form.year}
                onChange={updateField("year")}
                placeholder="3"
                required
              />
            </label>

            <label className="block text-xs font-bold text-slate-600">
              Roll number
              <input
                className={inputClass}
                value={form.rollNo}
                onChange={updateField("rollNo")}
                placeholder="CS2101"
                required
              />
            </label>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              disabled={loading}
              onClick={() => onClose(false)}
              className="flex-1 rounded-xl border border-slate-200 py-3 text-sm font-bold text-slate-600 transition hover:bg-slate-50"
            >
              Cancel
            </button>

            <button
              disabled={loading}
              className="flex-1 rounded-xl bg-slate-950 py-3 text-sm font-bold text-white transition hover:bg-blue-600 disabled:opacity-50"
            >
              {loading ? "Registering..." : "Confirm registration"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}