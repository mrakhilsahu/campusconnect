import api from "./axios";

/*  STUDENT  */

// register for an event (with form data)
export const registerForEvent = async (eventId, formData) => {
  const res = await api.post(`/events/${eventId}/register`, formData);
  return res.data;
};

// get my registered events
export const getMyRegisteredEvents = async () => {
  const res = await api.get("/registrations/my");
  return res.data;
};
