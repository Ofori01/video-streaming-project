import axios, { AxiosError, type AxiosRequestConfig,  } from "axios";
import envConfig from "@/config/envConfig";
import { store } from "@/store/store";
import type { ApiErrorResponse } from "../types/errors";

// axios instance
const api = axios.create({
  baseURL: envConfig.backendUrl,
});

//Request interceptors

// add token
api.interceptors.request.use(
  (config) => {
    //retrieve token from store
    const token = store.getState().auth.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// Response interceptors
api.interceptors.response.use(
    (response) => response,
    (error: AxiosError<ApiErrorResponse>)=> {
        const apiError: ApiErrorResponse = {message: "An unexpected error occurred", success: false}
        
        if(error.response){
            apiError.message = error.response.data.message
            apiError.errors = error.response.data.errors

            //check status codes
            switch(error.response.status){
                case 401:
                    // do something
                    break
            }
        }

        return Promise.reject(apiError)
    }
)

// backend service
const backendService = {
  get: <T>(url: string, config?: AxiosRequestConfig) => api.get<T>(url, config),
  post: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    api.post<T>(url, data, config),
  put: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    api.put<T>(url, data, config),
  patch: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    api.patch<T>(url, data, config),
  delete: <T>(url: string, config?: AxiosRequestConfig) => api.delete<T>(url, config),
};

export default backendService;
