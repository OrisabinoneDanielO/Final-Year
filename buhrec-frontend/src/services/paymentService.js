import api from './api';

export const getPayments = (params, role) => {
  if (role === 'admin') return api.get('/admin/payments/list', { params });
  return api.get('/payments', { params });
};

export const initiatePayment = (proposalId, data) =>
  api.post(`/researcher/proposals/${proposalId}/payment/init`, data);

export const verifyPayment = (reference) =>
  api.post('/payments/verify', { reference }); 
