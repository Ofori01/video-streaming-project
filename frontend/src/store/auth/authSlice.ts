import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

// Helper functions
const saveToLocalStorage = (data: authState) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("auth-state", JSON.stringify(data));
  }
};

const loadFromLocalStorage = (): authState | null => {
  const data = localStorage.getItem("auth-state");
  if (!data) return null;

  try {
    return JSON.parse(data) as authState;
  } catch {
    return null;
  }
};

const savedAuthState = loadFromLocalStorage();

export interface authState {
  userId: number | undefined;
  token: string;
  isAuthenticated: boolean;
  email: string;
  username: string;
  role: string; //? consider using enum
}

const initialState: authState = savedAuthState
  ? savedAuthState
  : {
      isAuthenticated: false,
      email: "",
      role: "",
      token: "",
      username: "",
      userId: undefined,
    };

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials(
      state,
      action: PayloadAction<{
        userId: number;
        token: string;
        role?: string;
        email: string;
        username: string;
      }>,
    ) {
      const { userId, token, role, email, username } = action.payload;

      state.userId = userId;
      state.token = token;
      state.email = email;
      state.username = username;
      state.isAuthenticated = !!token;
      if (role !== undefined) state.role = role;
      saveToLocalStorage(state);
    },
    setToken(state, action: PayloadAction<string>) {
      state.token = action.payload;
      state.isAuthenticated = !!action.payload;
      saveToLocalStorage(state);
    },
    setRole(state, action: PayloadAction<string>) {
      state.role = action.payload;
      saveToLocalStorage(state);
    },
    logout(state) {
      state.userId = undefined;
      state.token = "";
      state.isAuthenticated = false;
      state.role = "";
      saveToLocalStorage(state);
    },
  },
});

export const { setCredentials, setRole, setToken, logout } = authSlice.actions;
export default authSlice.reducer;
