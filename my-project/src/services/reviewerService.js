import api from './api';

export const getReviewers = (params) =>
  api.get('/reviewers', { params });

export const getReviewerById = (id) =>
  api.get(`/reviewers/${id}`);

export const addReviewer = (data) =>
  api.post('/reviewers', data);

export const updateReviewer = (id, data) =>
  api.put(`/reviewers/${id}`, data);

export const removeReviewer = (id) =>
  api.delete(`/reviewers/${id}`);
