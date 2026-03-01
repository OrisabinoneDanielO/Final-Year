import api from './api';

export const login = (email, password, role) =>
  api.post('/auth/login', { email, password, role });

export const register = (data) =>
  api.post('/auth/register', data);

export const sendOtp = (email) =>
  api.post('/auth/send-otp', { email });

export const verifyOtp = (email, otp) =>
  api.post('/auth/verify-otp', { email, otp });

export const refreshToken = () =>
  api.post('/auth/refresh');

export const getProfile = () =>
  api.get('/auth/profile');

export const updateProfile = (data) =>
  api.put('/auth/profile', data);

export const changePassword = (oldPassword, newPassword) =>
  api.put('/auth/change-password', { oldPassword, newPassword });
