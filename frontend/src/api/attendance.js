import api from "./axios";

export const getRegisteredStudents = async (eventId) => {
  const res = await api.get(`/attendance/${eventId}`);
  return res.data;
};

export const markAttendance = async (eventId, studentId, present) => {
  const res = await api.post(`/attendance/${eventId}`, {
    studentId,
    present,
  });

  return res.data;
};