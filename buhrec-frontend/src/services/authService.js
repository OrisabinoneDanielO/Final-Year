import api from './api';

export const login = (email, password, role) => {
  if (role === 'admin') return api.post('/auth/login/admin', { email, password });
  if (role === 'reviewer') return api.post('/auth/login/reviewer', { email, password });
  return api.post('/auth/login/researcher', { email, password });
};

export const register = (data) => {
  if (data.role === 'admin') return api.post('/auth/admin/register', data);
  return api.post('/auth/researcher/register', data);
};

export const sendOtp = (email) =>
  api.post('/auth/resend-verification-code', { email });

export const verifyOtp = (email, otp) =>
  api.post('/auth/verify-email', { email, code: otp });

export const refreshToken = () =>
  api.post('/auth/refresh'); // Note: Make sure backend supports this or remove it

export const getProfile = (role) => {
  if (role === 'admin') return api.get('/admin/profile'); // Placeholder if admin profile exists
  if (role === 'reviewer') return api.get('/reviewer/profile');
  return api.get('/researcher/profile');
};

export const updateProfile = (data, role) => {
  if (role === 'reviewer') return api.put('/reviewer/profile', data);
  return api.put('/researcher/profile', data);
};

export const changePassword = (oldPassword, newPassword, role) => {
  if (role === 'reviewer') return api.put('/reviewer/password', { currentPassword: oldPassword, newPassword });
  return api.put('/researcher/password', { currentPassword: oldPassword, newPassword });
};
