import axios from "axios";

const BASE_URL = import.meta.env.VITE_SERVER_BASE_URL || "";
const TOKEN_KEY = "accessToken"; 

export function setAccessToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
}

export function getAccessToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function clearAccessToken() {
  localStorage.removeItem(TOKEN_KEY);
}

function assertNoApiPrefix(path) {
  if (path.includes("/api/v1")) {
    if (import.meta.env.DEV) {
      console.warn(
        `[http] Do not include /api/v1 in path: "${path}". Pass only the route segment like "/auth/login".`
      );
    }
  }
}

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  timeout: 20000,
});

api.interceptors.request.use((config) => {
  assertNoApiPrefix(config.url || "");

  const token = getAccessToken();
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let isRefreshing = false;
let pendingQueue = [];

function flushQueue(error, token = null) {
  pendingQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(token);
  });
  pendingQueue = [];
}

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config || {};
    const status = error?.response?.status;

    if (status === 401 && !original._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          pendingQueue.push({
            resolve: (token) => {
              if (token) {
                original.headers = original.headers || {};
                original.headers.Authorization = `Bearer ${token}`;
              } else {
                delete original.headers?.Authorization;
              }
              resolve(api(original));
            },
            reject,
          });
        });
      }

      original._retry = true;
      isRefreshing = true;

      try {
        const refreshRes = await api.post("/auth/refresh");
        const newAccess = refreshRes?.data?.data?.accessToken;

        if (newAccess) {
          setAccessToken(newAccess);
          api.defaults.headers.common.Authorization = `Bearer ${newAccess}`;
        }

        flushQueue(null, newAccess);
        if (newAccess) {
          original.headers = original.headers || {};
          original.headers.Authorization = `Bearer ${newAccess}`;
        }
        return api(original);
      } catch (refreshErr) {
        clearAccessToken();
        flushQueue(refreshErr, null);
        return Promise.reject(refreshErr);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export async function getData(path, config = {}) {
  assertNoApiPrefix(path);
  const res = await api.get(path, config);
  return res.data;
}

export async function postData(path, payload = {}, config = {}) {
  assertNoApiPrefix(path);
  const res = await api.post(path, payload, config);
  return res.data;
}

export async function putData(path, payload = {}, config = {}) {
  assertNoApiPrefix(path);
  const res = await api.put(path, payload, config);
  return res.data;
}

export default api;