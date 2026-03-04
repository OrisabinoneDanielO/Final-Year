import api from './api';

export const getProposals = (params, role) => {
  if (role === 'admin') return api.get('/admin/proposals', { params });
  return api.get('/researcher/proposals', { params });
};

export const getProposalById = (id, role) => {
  if (role === 'admin') return api.get(`/admin/proposals/${id}/details`);
  if (role === 'reviewer') return api.get(`/reviewer/assignments/${id}/proposal`);
  return api.get(`/researcher/proposals/${id}`);
};

export const createProposal = (data) =>
  api.post('/researcher/create-proposal', data);

export const updateProposal = (id, data) =>
  api.patch(`/researcher/proposals/${id}/draft`, data);

export const submitProposal = (id) =>
  api.post(`/researcher/proposals/${id}/submit`);

export const resubmitProposal = (id, data) =>
  api.post(`/researcher/proposals/${id}/versions`, data);

export const assignReviewer = (proposalId, reviewerId) =>
  api.post(`/admin/proposals/${proposalId}/assign-reviewer`, { reviewerId });

export const unassignReviewer = (assignmentId) =>
  api.put(`/admin/assignments/${assignmentId}/unassign`);
