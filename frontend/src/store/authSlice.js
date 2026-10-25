import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../api/axios";

const readStoredUser = () => {
  try {
    const value = localStorage.getItem("user");
    return value ? JSON.parse(value) : null;
  } catch {
    localStorage.removeItem("user");
    return null;
  }
};

const getErrorMessage = (error, fallback) =>
  error?.response?.data?.message || error?.userMessage || fallback;

const storedToken = localStorage.getItem("token");
const storedUser = readStoredUser();

export const loginUser = createAsyncThunk("auth/login", async (data, thunkAPI) => {
  try {
    const response = await api.post("/auth/login", data);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(getErrorMessage(error, "Login failed"));
  }
});

export const registerUser = createAsyncThunk("auth/register", async (data, thunkAPI) => {
  try {
    const response = await api.post("/auth/signup", data);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(getErrorMessage(error, "Signup failed"));
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: storedUser,
    token: storedToken || null,
    loading: false,
    error: null,
    isAuthenticated: Boolean(storedToken && storedUser),
  },
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
  },
  extraReducers: (builder) => {
    const handleSuccess = (state, action) => {
      state.loading = false;
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.isAuthenticated = true;
      state.error = null;
      localStorage.setItem("token", action.payload.token);
      localStorage.setItem("user", JSON.stringify(action.payload.user));
    };

    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, handleSuccess)
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      })
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, handleSuccess)
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
