import axios from 'axios';

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1', withCredentials: true, headers: { 'Content-Type': 'application/json' } });
const authPaths = ['/auth/login', '/auth/register', '/auth/refresh-token'];
let refreshing = false;
let waiters = [];
const settle = (error) => { waiters.forEach(({ resolve, reject }) => error ? reject(error) : resolve()); waiters = []; };

api.interceptors.response.use((response) => response, async (error) => {
  const config = error.config || {};
  const url = config.url || '';
  if (error.response?.status !== 401 || config._retried || authPaths.some((path) => url.includes(path))) return Promise.reject(error);
  if (refreshing) {
    return new Promise((resolve, reject) => waiters.push({ resolve, reject })).then(() => { config._retried = true; return api(config); });
  }
  config._retried = true; refreshing = true;
  try { await api.post('/auth/refresh-token'); settle(); return api(config); }
  catch (refreshError) { settle(refreshError); window.dispatchEvent(new Event('auth:expired')); return Promise.reject(refreshError); }
  finally { refreshing = false; }
});

export const getErrorMessage = (error) => {
  const status = error?.response?.status;
  const message = error?.response?.data?.message;
  if (status === 403) return message || 'You do not have permission to do that.';
  if (status === 404) return message || 'The requested item could not be found.';
  if (status === 409) return message || 'This change conflicts with existing data.';
  if (status >= 500) return 'Something went wrong on the server. Please try again.';
  if (!error?.response) return 'Could not reach the server. Check your connection and try again.';
  return message || 'Please check the information and try again.';
};
export const mapValidationErrors = (error) => (error?.response?.data?.error || []).map((item) => ({ path: item.path || item.field, message: item.msg || item.message })).filter((item) => item.message);
export default api;
