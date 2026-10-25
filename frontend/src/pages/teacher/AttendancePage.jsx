import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Search, Users, UserCheck, UserX } from "lucide-react";
import {
  getRegisteredStudents,
  markAttendance,
} from "../../api/attendance";

export default function AttendancePage() {
  const { eventId } = useParams();

  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState("");

  useEffect(() => {
    getRegisteredStudents(eventId)
      .then((data) => setStudents(data.students || []))
      .catch(() => setError("Failed to load registered students."))
      .finally(() => setLoading(false));
  }, [eventId]);

  const handleMark = async (studentId, present) => {
    setSaving(studentId);
    setError("");

    try {
      await markAttendance(eventId, studentId, present);

      setStudents((prev) =>
        prev.map((student) =>
          student.studentId === studentId
            ? { ...student, present }
            : student
        )
      );
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "Failed to mark attendance."
      );
    } finally {
      setSaving("");
    }
  };

  const visibleStudents = useMemo(() => {
    const value = search.trim().toLowerCase();

    if (!value) return students;

    return students.filter((student) =>
      `${student.name} ${student.email} ${student.rollNo} ${student.branch}`
        .toLowerCase()
        .includes(value)
    );
  }, [students, search]);

  const presentCount = students.filter(
    (student) => student.present === true
  ).length;

  const absentCount = students.filter(
    (student) => student.present === false
  ).length;

  if (loading) {
    return (
      <div className="page-shell grid place-items-center">
        <p className="animate-pulse text-sm text-slate-400">
          Loading attendance...
        </p>
      </div>
    );
  }

  return (
    <main className="page-shell bg-[radial-gradient(circle_at_top_right,_rgba(59,130,246,.09),_transparent_30%),#f8fafc] px-4 py-8 sm:px-6 lg:py-12">
      <div className="mx-auto max-w-5xl">
        <Link
          to="/teacher"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-slate-900"
        >
          <ArrowLeft size={16} />
          Back to dashboard
        </Link>

        <div className="mt-5 overflow-hidden rounded-[28px] bg-slate-950 p-6 text-white shadow-xl shadow-slate-900/10 sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[.18em] text-blue-300">
                Teacher workspace
              </p>
              <h1 className="mt-2 text-3xl font-black tracking-tight">
                Manage attendance
              </h1>
              <p className="mt-2 max-w-xl text-sm leading-6 text-slate-400">
                Mark registered students as present or absent. Attendance is
                saved immediately.
              </p>
            </div>

            <div className="flex gap-2">
              <div className="rounded-2xl bg-white/10 px-4 py-3">
                <p className="text-xl font-black">{students.length}</p>
                <p className="text-[11px] text-slate-400">Registered</p>
              </div>

              <div className="rounded-2xl bg-emerald-400/10 px-4 py-3">
                <p className="text-xl font-black text-emerald-300">
                  {presentCount}
                </p>
                <p className="text-[11px] text-slate-400">Present</p>
              </div>

              <div className="rounded-2xl bg-red-400/10 px-4 py-3">
                <p className="text-xl font-black text-red-300">
                  {absentCount}
                </p>
                <p className="text-[11px] text-slate-400">Absent</p>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {error}
          </div>
        )}

        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              size={17}
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, roll number or branch..."
              className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm outline-none shadow-sm focus:border-blue-400 focus:ring-4 focus:ring-blue-50"
            />
          </div>

          <div className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-xs font-semibold text-slate-500 shadow-sm">
            <Users size={15} />
            {visibleStudents.length} shown
          </div>
        </div>

        {students.length === 0 ? (
          <div className="card mt-5 p-12 text-center">
            <Users className="mx-auto text-slate-300" size={40} />
            <p className="mt-4 font-semibold text-slate-700">
              No students registered yet.
            </p>
            <p className="mt-1 text-sm text-slate-400">
              Registered students will appear here.
            </p>
          </div>
        ) : visibleStudents.length === 0 ? (
          <div className="card mt-5 p-10 text-center">
            <Search className="mx-auto text-slate-300" size={34} />
            <p className="mt-4 font-semibold text-slate-700">
              No students match your search.
            </p>
          </div>
        ) : (
          <div className="mt-5 space-y-3">
            {visibleStudents.map((student) => (
              <div
                key={student.studentId}
                className="card flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-sm font-black text-blue-700">
                    {student.name?.charAt(0)?.toUpperCase() || "S"}
                  </div>

                  <div className="min-w-0">
                    <p className="truncate font-bold text-slate-900">
                      {student.name}
                    </p>
                    <p className="mt-1 truncate text-xs text-slate-500">
                      {student.rollNo} · {student.branch} · Year {student.year}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2 sm:shrink-0">
                  <button
                    disabled={saving === student.studentId}
                    onClick={() => handleMark(student.studentId, true)}
                    className={`inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-bold transition sm:flex-none ${
                      student.present === true
                        ? "bg-emerald-600 text-white"
                        : "border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                    }`}
                  >
                    <UserCheck size={15} />
                    Present
                  </button>

                  <button
                    disabled={saving === student.studentId}
                    onClick={() => handleMark(student.studentId, false)}
                    className={`inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-bold transition sm:flex-none ${
                      student.present === false
                        ? "bg-red-500 text-white"
                        : "border border-red-200 bg-red-50 text-red-600 hover:bg-red-100"
                    }`}
                  >
                    <UserX size={15} />
                    Absent
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}