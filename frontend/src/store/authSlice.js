import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/axios";

// Safe localStorage read — if corrupted, return null instead of crashing
const safeParseUser = () => {
  try {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    localStorage.removeItem("user");
    return null;
  }
};

const tokenFromStorage = localStorage.getItem("token");
const userFromStorage = safeParseUser();

// LOGIN
export const loginUser = createAsyncThunk("auth/login", async (data, thunkAPI) => {
  try {
    const res = await api.post("/auth/login", data);
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || "Login failed");
  }
});

// SIGNUP
export const registerUser = createAsyncThunk("auth/register", async (data, thunkAPI) => {
  try {
    const res = await api.post("/auth/signup", data);
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || "Signup failed");
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: userFromStorage,
    token: tokenFromStorage || null,
    loading: false,
    error: null,
    isAuthenticated: !!tokenFromStorage && !!userFromStorage,
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
    // Call this from axios interceptor when 401 is received
    clearAuth(state) {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
    },
  },

  extraReducers: (builder) => {
    const onFulfilled = (state, action) => {
      state.loading = false;
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.isAuthenticated = true;
      state.error = null;
      localStorage.setItem("token", action.payload.token);
      localStorage.setItem("user", JSON.stringify(action.payload.user));
    };

    builder
      .addCase(loginUser.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(loginUser.fulfilled, onFulfilled)
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      })
      .addCase(registerUser.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(registerUser.fulfilled, onFulfilled)
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout, clearAuth } = authSlice.actions;
export default authSlice.reducer;
