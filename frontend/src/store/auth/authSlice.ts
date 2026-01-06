import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface authState {
  userId: number | undefined;
  token: string;
  isAuthenticated: boolean;
  role: string; //? consider using enum
}

const initialState: authState = {
  isAuthenticated: false,
  role: "",
  token: "",
  userId: undefined,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials(
      state,
      action: PayloadAction<{ userId: number; token: string; role?: string }>
    ) {
      const { userId, token, role } = action.payload;

      state.userId = userId;
      state.token = token;
      state.isAuthenticated = !!token;
      if (role !== undefined) state.role = role;
    },
    setToken(state, action: PayloadAction<string>) {
      state.token = action.payload;
      state.isAuthenticated = !!action.payload;
    },
    setRole(state, action: PayloadAction<string>) {
      state.role = action.payload;
    },
    logout(state) {
      state.userId = undefined;
      state.token = "";
      state.isAuthenticated = false;
      state.role = "";
    },
  },
});

export const {setCredentials, setRole, setToken,logout}= authSlice.actions
export default authSlice.reducer;
