import { configureStore } from '@reduxjs/toolkit';

import authReducer from './auth/authSlice'
import uploadProcessingReducer from './uploadProcessing/uploadProcessingSlice'

export const store = configureStore({
    reducer: {
        auth: authReducer,
        uploadProcessing: uploadProcessingReducer,
    }
})


export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch