import api from './api';

export const getComments = (assignmentId, role, versionId, proposalId) => {
  if (role === 'reviewer') return api.get(`/reviewer/assignments/${assignmentId}/comments`);
  if (role === 'researcher') return api.get(`/researcher/proposals/${proposalId}/versions/${versionId}/comments`);
  return api.get(`/admin/proposals/${proposalId}/comments`);
};

export const addComment = (assignmentId, data) =>
  api.post(`/reviewer/assignments/${assignmentId}/comments`, data);

export const editComment = (commentId, data) =>
  api.put(`/comments/${commentId}`, data);

export const deleteComment = (commentId) =>
  api.delete(`/comments/${commentId}`);
