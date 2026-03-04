import api from './api';

export const getReviewers = (params) =>
  api.get('/admin/reviewers', { params });

export const getReviewerById = (id) =>
  api.get(`/admin/reviewers/${id}`);

export const addReviewer = (data) =>
  api.post('/admin/add-reviewer', data);

export const updateReviewer = (id, data) =>
  api.put(`/admin/reviewers/${id}`, data);

export const removeReviewer = (id) =>
  api.patch(`/admin/reviewers/${id}/deactivate`);

export const reactivateReviewer = (id) =>
  api.patch(`/admin/reviewers/${id}/reactivate`);
