import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type AuthUser = {
  id: string;
  email: string;
};

type AuthState = {
  user: AuthUser | null;
  status: "idle" | "loading" | "authenticated";
  error: string | null;
};

const initialState: AuthState = {
  user: null,
  status: "idle",
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<AuthUser | null>) => {
      state.user = action.payload;
      state.status = action.payload ? "authenticated" : "idle";
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.status = action.payload ? "loading" : state.user ? "authenticated" : "idle";
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    clearAuth: (state) => {
      state.user = null;
      state.status = "idle";
      state.error = null;
    },
  },
});

export const { setUser, setLoading, setError, clearAuth } = authSlice.actions;
export default authSlice.reducer;
