import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getRegisteredStudents, markAttendance } from "../../api/attendance";

export default function AttendancePage() {
  const { eventId } = useParams();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await getRegisteredStudents(eventId);
        setStudents(data.students);
      } catch {
        setError("Failed to load students.");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [eventId]);

  const handleMark = async (studentId, present) => {
    setSaving(studentId);
    try {
      await markAttendance(eventId, studentId, present);
      setStudents((prev) =>
        prev.map((s) => (s.studentId === studentId ? { ...s, present } : s))
      );
    } catch {
      alert("Failed to mark attendance.");
    } finally {
      setSaving(null);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-sm text-gray-500 animate-pulse">Loading students...</p>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-sm text-red-500">{error}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="max-w-3xl mx-auto">

        <div className="flex items-center gap-3 mb-6">
          <Link to="/teacher" className="text-sm text-indigo-600 hover:underline">
            ← Back
          </Link>
          <h2 className="text-xl font-semibold text-gray-800">Mark Attendance</h2>
        </div>

        {students.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-2xl p-8 text-center">
            <p className="text-gray-500 text-sm">No students registered for this event.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {students.map((student) => (
              <div
                key={student.studentId}
                className="bg-white border border-gray-200 rounded-xl px-5 py-4 flex items-center justify-between gap-4"
              >
                <div>
                  <p className="font-medium text-gray-800">{student.name}</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {student.rollNo} &bull; {student.branch} &bull; Year {student.year}
                  </p>
                </div>

                <div className="flex gap-2 shrink-0">
                  <button
                    disabled={saving === student.studentId}
                    onClick={() => handleMark(student.studentId, true)}
                    className={`px-4 py-1.5 text-sm rounded-lg font-medium transition ${
                      student.present === true
                        ? "bg-green-600 text-white"
                        : "border border-green-600 text-green-600 hover:bg-green-50"
                    }`}
                  >
                    Present
                  </button>
                  <button
                    disabled={saving === student.studentId}
                    onClick={() => handleMark(student.studentId, false)}
                    className={`px-4 py-1.5 text-sm rounded-lg font-medium transition ${
                      student.present === false
                        ? "bg-red-500 text-white"
                        : "border border-red-500 text-red-500 hover:bg-red-50"
                    }`}
                  >
                    Absent
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
