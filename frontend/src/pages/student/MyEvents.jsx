import { useEffect, useState } from "react";
import { getMyRegisteredEvents } from "../../api/registrations";
import { getMyAttendance } from "../../api/attendance";
import { getMyCertificate } from "../../api/certificates";
import {
  CalendarDays,
  MapPin,
  Download,
  CheckCircle,
  XCircle,
  Clock,
  ShieldCheck,
  ExternalLink,
} from "lucide-react";

const escapeHtml = (value = "") =>
  String(value).replace(/[&<>\"']/g, (character) =>
    ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;",
    })[character]
  );

const formatDate = (date) =>
  new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

const openCertificate = (certificate) => {
  const verificationUrl = `${window.location.origin}/verify/${encodeURIComponent(certificate.certificateId)}`;

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8"/>
  <title>${escapeHtml(certificate.event.title)} - Certificate</title>
  <style>
    * { box-sizing: border-box }
    body { margin: 0; background: #f1f5f9; font-family: Inter, Arial, sans-serif; color: #0f172a; display: grid; place-items: center; min-height: 100vh; padding: 32px }
    .certificate { width: min(1000px, 100%); background: #fff; padding: 70px 80px; border: 1px solid #cbd5e1; box-shadow: 0 30px 80px rgba(15,23,42,.12); position: relative }
    .certificate:before { content: ""; position: absolute; inset: 14px; border: 2px solid #dbeafe; pointer-events: none }
    .brand { text-align: center; color: #2563eb; font-weight: 800; letter-spacing: .2em; text-transform: uppercase; font-size: 12px }
    .title { text-align: center; font-family: Georgia, serif; font-size: 42px; margin: 20px 0 8px; color: #0f172a }
    .subtitle { text-align: center; color: #64748b; font-size: 14px }
    .name { text-align: center; font-family: Georgia, serif; font-size: 46px; font-weight: 700; margin: 38px 0 14px; color: #172554 }
    .event { text-align: center; font-size: 22px; font-weight: 700; color: #1e3a8a; margin-top: 8px }
    .date { text-align: center; color: #64748b; margin-top: 8px }
    .footer { margin-top: 60px; border-top: 1px solid #e2e8f0; padding-top: 18px; display: flex; justify-content: space-between; gap: 24px; font-size: 11px; color: #64748b }
    .id { font-family: monospace; font-weight: 700; color: #334155 }
    .verify { word-break: break-all; text-align: right }
    @media print {
      body { background: white; padding: 0 }
      .certificate { box-shadow: none; border: 0; width: 100%; min-height: 100vh }
      .certificate:before { inset: 8px }
    }
  </style>
</head>
<body>
  <div class="certificate">
    <div class="brand">CampusConnect</div>
    <div class="title">Certificate of Participation</div>
    <div class="subtitle">This is to certify that</div>
    <div class="name">${escapeHtml(certificate.student.name)}</div>
    <div class="subtitle">has successfully participated in</div>
    <div class="event">${escapeHtml(certificate.event.title)}</div>
    <div class="date">${escapeHtml(formatDate(certificate.event.date))}</div>
    <div class="footer">
      <div>
        <div>Certificate ID</div>
        <div class="id">${escapeHtml(certificate.certificateId)}</div>
      </div>
      <div class="verify">
        Verify online<br/>
        ${escapeHtml(verificationUrl)}
      </div>
    </div>
  </div>
  <script>window.onload=()=>window.print()</script>
</body>
</html>`;

  const blob = new Blob([html], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const win = window.open(url, "_blank");

  if (win) {
    win.onload = () => setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
};

export default function MyEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [certificateLoading, setCertificateLoading] = useState("");
  const [certificateError, setCertificateError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getMyRegisteredEvents();
        const rawEvents = data.events || [];

        const eventsWithAttendance = await Promise.all(
          rawEvents.map(async (event) => {
            try {
              const att = await getMyAttendance(event._id);

              return {
                ...event,
                attendancePresent: att.present,
              };
            } catch {
              return {
                ...event,
                attendancePresent: null,
              };
            }
          })
        );

        setEvents(eventsWithAttendance);
      } catch {
        setError("Failed to load your events.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const downloadCertificate = async (event) => {
    setCertificateLoading(event._id);
    setCertificateError("");

    try {
      const data = await getMyCertificate(event._id);
      openCertificate(data.certificate);
    } catch (error) {
      setCertificateError(
        error.response?.data?.message ||
          "Unable to generate certificate."
      );
    } finally {
      setCertificateLoading("");
    }
  };

  const AttendanceBadge = ({ present }) => {
    if (present === true) {
      return (
        <span className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700">
          <CheckCircle size={12} />
          Present
        </span>
      );
    }

    if (present === false) {
      return (
        <span className="flex items-center gap-1.5 rounded-full bg-red-50 px-2.5 py-1 text-xs font-bold text-red-600">
          <XCircle size={12} />
          Absent
        </span>
      );
    }

    return (
      <span className="flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-500">
        <Clock size={12} />
        Not marked
      </span>
    );
  };

  if (loading) {
    return (
      <div className="page-shell grid place-items-center">
        <p className="animate-pulse text-sm text-slate-400">
          Loading your events...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-shell grid place-items-center px-4">
        <p className="text-sm text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <main className="page-shell bg-[radial-gradient(circle_at_top_right,_rgba(59,130,246,.09),_transparent_30%),#f8fafc] px-4 py-8 sm:px-6 lg:py-12">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-bold text-blue-600">
              Your activity
            </p>

            <h1 className="mt-1 text-3xl font-black tracking-tight text-slate-950">
              My events
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Track registrations, attendance and verified participation
              certificates.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-xs font-semibold text-slate-500 shadow-sm">
            {events.length} registered event
            {events.length === 1 ? "" : "s"}
          </div>
        </div>

        {certificateError && (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {certificateError}
          </div>
        )}

        {events.length === 0 ? (
          <div className="card mt-8 p-12 text-center">
            <CalendarDays
              className="mx-auto text-slate-300"
              size={40}
            />

            <p className="mt-4 font-semibold text-slate-700">
              You haven't registered for any events yet.
            </p>

            <p className="mt-1 text-sm text-slate-400">
              Explore the event calendar to find something interesting.
            </p>
          </div>
        ) : (
          <div className="mt-8 space-y-4">
            {events.map((event) => (
              <article
                key={event._id}
                className="card card-hover overflow-hidden p-5 sm:p-6"
              >
                <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-blue-700">
                        Registered
                      </span>

                      <AttendanceBadge
                        present={event.attendancePresent}
                      />
                    </div>

                    <h2 className="mt-4 text-xl font-bold text-slate-900">
                      {event.title}
                    </h2>

                    <p className="mt-2 line-clamp-2 max-w-2xl text-sm leading-6 text-slate-500">
                      {event.description}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-4 text-xs text-slate-500">
                      <span className="flex items-center gap-1.5">
                        <CalendarDays
                          size={13}
                          className="text-blue-500"
                        />
                        {formatDate(event.date)}
                      </span>

                      {event.location && (
                        <span className="flex items-center gap-1.5">
                          <MapPin
                            size={13}
                            className="text-blue-500"
                          />
                          {event.location}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="shrink-0 lg:w-64">
                    {event.attendancePresent === true ? (
                      <button
                        disabled={certificateLoading === event._id}
                        onClick={() => downloadCertificate(event)}
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-3 text-sm font-bold text-white transition hover:bg-blue-600 disabled:opacity-60"
                      >
                        <ShieldCheck size={16} />
                        {certificateLoading === event._id
                          ? "Preparing..."
                          : "Get verified certificate"}
                      </button>
                    ) : (
                      <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs leading-5 text-slate-500">
                        <div className="flex items-center gap-2 font-bold text-slate-600">
                          <Download size={14} />
                          Certificate locked
                        </div>

                        <p className="mt-1">
                          Your certificate becomes available after you are
                          marked present.
                        </p>
                      </div>
                    )}

                    {event.attendancePresent === true && (
                      <p className="mt-2 flex items-center justify-center gap-1 text-[11px] font-medium text-slate-400">
                        <ExternalLink size={11} />
                        Includes online verification ID
                      </p>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}