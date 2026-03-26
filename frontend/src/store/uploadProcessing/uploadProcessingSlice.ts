import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type ProcessingStatus =
  | "idle"
  | "connecting"
  | "processing"
  | "complete"
  | "error";

interface UploadProcessingState {
  activeVideoId: number | null;
  title: string | null;
  percent: number;
  status: ProcessingStatus;
  error: string | null;
}

const initialState: UploadProcessingState = {
  activeVideoId: null,
  title: null,
  percent: 0,
  status: "idle",
  error: null,
};

const uploadProcessingSlice = createSlice({
  name: "uploadProcessing",
  initialState,
  reducers: {
    startProcessingTracking(
      state,
      action: PayloadAction<{ videoId: number; title: string }>,
    ) {
      state.activeVideoId = action.payload.videoId;
      state.title = action.payload.title;
      state.percent = 0;
      state.status = "connecting";
      state.error = null;
    },
    updateProcessingPercent(state, action: PayloadAction<number>) {
      state.percent = action.payload;
    },
    updateProcessingStatus(state, action: PayloadAction<ProcessingStatus>) {
      state.status = action.payload;
    },
    setProcessingError(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.status = "error";
    },
    clearProcessingTracking(state) {
      state.activeVideoId = null;
      state.title = null;
      state.percent = 0;
      state.status = "idle";
      state.error = null;
    },
  },
});

export const {
  startProcessingTracking,
  updateProcessingPercent,
  updateProcessingStatus,
  setProcessingError,
  clearProcessingTracking,
} = uploadProcessingSlice.actions;

export default uploadProcessingSlice.reducer;
