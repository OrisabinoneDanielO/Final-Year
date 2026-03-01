import api from './api';

export const getPayments = (params) =>
  api.get('/payments', { params });

export const initiatePayment = (proposalId, data) =>
  api.post('/payments/initiate', { proposalId, ...data });

export const verifyPayment = (reference) =>
  api.post('/payments/verify', { reference });
