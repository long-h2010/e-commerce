'use client';

import { userService } from '@/services';
import { authStore } from '@/stores';
import axios from 'axios';

export const apiNoAuth = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BE_URL,
  withCredentials: true,
});

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BE_URL,
  withCredentials: true,
});

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: any) => void;
  reject: (reason?: any) => void;
}> = [];

const processQueue = (error: any = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(null);
  });
  failedQueue = [];
};

api.interceptors.request.use((config) => {
  const token = authStore.getState().accessToken;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => api(originalRequest))
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const newToken = await userService.refreshToken();
        authStore.setState({ accessToken: newToken });

        processQueue();

        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (e) {
        processQueue(e);
        userService.logout();

        return Promise.reject(e);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);
