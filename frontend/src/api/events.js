import api from "./axios";

/*  STUDENT  */

// get approved events
export const getApprovedEvents = async () => {
  const res = await api.get("/events");
  return res.data; // { events }
};

// register for event WITH FORM DATA
export const registerForEvent = async (eventId, formData) => {
  const res = await api.post(`/events/${eventId}/register`, formData);
  return res.data;
};

/* TEACHER  */

export const getMyEvents = async () => {
  const res = await api.get("/events/my");
  return res.data;
};

export const createEvent = async (data) => {
  const res = await api.post("/events", data);
  return res.data;
};

/*  ADMIN  */

export const getPendingEvents = async () => {
  const res = await api.get("/events/pending");
  return res.data;
};

export const getApprovedEventsAdmin = async () => {
  const res = await api.get("/events/approved");
  return res.data;
};

export const getRejectedEventsAdmin = async () => {
  const res = await api.get("/events/rejected");
  return res.data;
};

export const approveEvent = async (eventId) => {
  const res = await api.patch(`/events/${eventId}/approve`);
  return res.data;
};

export const rejectEvent = async (eventId) => {
  const res = await api.patch(`/events/${eventId}/reject`);
  return res.data;
};
