import api from './api';

export const getAssignments = (params, role) => {
  if (role === 'admin') return api.get('/admin/assignments/list', { params });
  return api.get('/reviewer/assignments', { params });
};

export const getAssignmentById = (id) =>
  api.get(`/reviewer/assignments/${id}`);

export const acceptAssignment = (id) =>
  api.patch(`/reviewer/assignments/${id}/accept`);

export const declineAssignment = (id) =>
  api.patch(`/reviewer/assignments/${id}/decline`);

export const beginReview = (id) =>
  api.get(`/reviewer/assignments/${id}/proposal`);

export const completeReview = (id, data) =>
  api.post(`/reviewer/assignments/${id}/decision`, data);
