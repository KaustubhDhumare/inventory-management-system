import api from './axios.js';
const data = (request) => request.then((r) => r.data?.data);
const q = (params) => ({ params });
export const authApi = {
  login: (body) => data(api.post('/auth/login', body)),
  register: (body) => data(api.post('/auth/register', body)),
  refresh: () => data(api.post('/auth/refresh-token')),
  logout: () => data(api.post('/auth/logout')),
  changePassword: (body) => data(api.patch('/auth/change-password', body)),
};
export const resourceApi = {
  list: (path, params = {}) => data(api.get(path, q(params))),
  get: (path, id) => data(api.get(`${path}/${id}`)),
  create: (path, body) => data(api.post(path, body)),
  update: (path, id, body) => data(api.patch(`${path}/${id}`, body)),
  status: (path, id, isActive) => data(api.patch(`${path}/${id}/status`, { isActive })),
  cancelPo: (id) => data(api.patch(`/purchase-orders/${id}/status`, { status: 'CANCELLED' })),
  receivePo: (id, body) => data(api.post(`/inventory-transactions/purchase-order/${id}/receive`, body)),
  inventory: (kind, body) => data(api.post(`/inventory-transactions/${kind}`, body)),
  transactions: (params = {}) => data(api.get('/inventory-transactions', q(params))),
  dashboard: () => data(api.get('/dashboard')),
  users: (params = {}) => data(api.get('/users', q(params))),
  permissionOptions: () => data(api.get('/users/permissions')),
  auditLogs: (params = {}) => data(api.get('/users/audit-logs', q(params))),
  updateEmployeePermissions: (id, permissions) => data(api.patch(`/users/${id}/permissions`, { permissions })),
  updateEmployeeStatus: (id, isActive) => data(api.patch(`/users/${id}/status`, { isActive })),
};
