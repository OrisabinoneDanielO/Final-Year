import api from './api';

export const getComments = (proposalId) =>
  api.get(`/proposals/${proposalId}/comments`);

export const addComment = (proposalId, data) =>
  api.post(`/proposals/${proposalId}/comments`, data);

export const editComment = (commentId, data) =>
  api.put(`/comments/${commentId}`, data);

export const deleteComment = (commentId) =>
  api.delete(`/comments/${commentId}`);
