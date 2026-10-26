import api from "./axios";

export const getMyCertificate = async (eventId) => {
  const res = await api.get(`/certificates/${eventId}`);
  return res.data;
};

export const verifyCertificate = async (certificateId) => {
  const res = await api.get(`/certificates/verify/${encodeURIComponent(certificateId)}`);
  return res.data;
};
