import { useEffect, useState } from "react";
import { getMyRegisteredEvents } from "../../api/registrations";
import { useSelector } from "react-redux";
import { CalendarDays, MapPin, Download } from "lucide-react";

export default function MyEvents() {
  const { user } = useSelector((state) => state.auth);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getMyRegisteredEvents();
        setEvents(data.events);
      } catch {
        setError("Failed to load your events.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const downloadCertificate = (event) => {
    const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8"/>
  <title>Certificate - ${event.title}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: Georgia, serif; background: #f8fafc; display: flex; justify-content: center; align-items: center; min-height: 100vh; }
    .page { background: white; width: 850px; padding: 70px 80px; border: 6px double #1e3a8a; }
    .top { text-align: center; margin-bottom: 40px; }
    .logo { font-size: 14px; color: #6b7280; letter-spacing: 3px; text-transform: uppercase; margin-bottom: 10px; }
    .title { font-size: 34px; font-weight: bold; color: #1e3a8a; }
    .divider { width: 60px; height: 3px; background: #1e3a8a; margin: 16px auto; }
    .body { text-align: center; }
    .label { font-size: 15px; color: #6b7280; margin-bottom: 10px; }
    .name { font-size: 36px; font-weight: bold; color: #1e293b; border-bottom: 2px solid #1e3a8a; display: inline-block; padding-bottom: 6px; margin-bottom: 20px; }
    .event-label { font-size: 15px; color: #6b7280; }
    .event-name { font-size: 22px; font-weight: bold; color: #1e3a8a; margin: 8px 0 6px; }
    .event-date { font-size: 13px; color: #9ca3af; margin-bottom: 50px; }
    .footer { display: flex; justify-content: space-between; align-items: flex-end; margin-top: 20px; border-top: 1px solid #e5e7eb; padding-top: 20px; }
    .issued { font-size: 12px; color: #9ca3af; }
    .org { font-size: 14px; font-weight: bold; color: #1e3a8a; }
  </style>
</head>
<body>
  <div class="page">
    <div class="top">
      <div class="logo">CampusConnect</div>
      <div class="title">Certificate of Participation</div>
      <div class="divider"></div>
    </div>
    <div class="body">
      <p class="label">This is to certify that</p>
      <div class="name">${user?.name || "Student"}</div>
      <p class="event-label">has successfully participated in</p>
      <div class="event-name">${event.title}</div>
      <p class="event-date">${new Date(event.date).toDateString()}</p>
    </div>
    <div class="footer">
      <div class="issued">Issued on ${new Date().toDateString()}</div>
      <div class="org">CampusConnect Platform</div>
    </div>
  </div>
</body>
</html>`;

    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const win = window.open(url, "_blank");
    if (win) win.onload = () => URL.revokeObjectURL(url);
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-sm text-gray-500 animate-pulse">Loading your events...</p>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-sm text-red-500">{error}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="max-w-4xl mx-auto">

        <h2 className="text-2xl font-semibold text-gray-800 mb-6">My Registered Events</h2>

        {events.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-2xl p-10 text-center">
            <p className="text-gray-500">You haven't registered for any events yet.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {events.map((event) => (
              <div
                key={event._id}
                className="bg-white border border-gray-200 rounded-xl px-5 py-4 flex items-start justify-between gap-4"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-800">{event.title}</p>
                  <p className="text-sm text-gray-500 mt-1 line-clamp-2">{event.description}</p>
                  <div className="flex gap-4 mt-2 text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                      <CalendarDays size={12} /> {new Date(event.date).toLocaleDateString()}
                    </span>
                    {event.location && (
                      <span className="flex items-center gap-1">
                        <MapPin size={12} /> {event.location}
                      </span>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => downloadCertificate(event)}
                  className="shrink-0 flex items-center gap-1.5 text-sm border border-indigo-500 text-indigo-600 px-4 py-2 rounded-lg hover:bg-indigo-50 transition"
                >
                  <Download size={14} /> Certificate
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
