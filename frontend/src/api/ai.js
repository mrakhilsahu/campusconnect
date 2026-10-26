import api from "./axios";

// Sends a message (plus recent chat history) to the backend AI assistant.
// The backend derives the user's role/college from their JWT — we never
// send any user/college id from the frontend for this call.
export const sendAIMessage = async (message, history = []) => {
  const res = await api.post("/ai/chat", { message, history });
  return res.data; // { reply, model }
};
