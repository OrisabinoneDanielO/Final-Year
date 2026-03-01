import api from './api';

export const getAssignments = (params) =>
  api.get('/reviews', { params });

export const getAssignmentById = (id) =>
  api.get(`/reviews/${id}`);

export const acceptAssignment = (id) =>
  api.post(`/reviews/${id}/accept`);

export const declineAssignment = (id) =>
  api.post(`/reviews/${id}/decline`);

export const beginReview = (id) =>
  api.post(`/reviews/${id}/begin`);

export const completeReview = (id, data) =>
  api.post(`/reviews/${id}/complete`, data);
