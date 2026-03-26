import api from "./axios";

export const loginUser = async (data) => {
  const response = await api.post("/auth/login", data);
  return response.data;
};


export const signup = async (data) => {
  const res = await api.post("/auth/signup", data);
  return res.data;
};
