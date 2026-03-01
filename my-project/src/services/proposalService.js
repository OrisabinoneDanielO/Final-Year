import api from './api';

export const getProposals = (params) =>
  api.get('/proposals', { params });

export const getProposalById = (id) =>
  api.get(`/proposals/${id}`);

export const createProposal = (data) =>
  api.post('/proposals', data);

export const updateProposal = (id, data) =>
  api.put(`/proposals/${id}`, data);

export const submitProposal = (id) =>
  api.post(`/proposals/${id}/submit`);

export const resubmitProposal = (id, data) =>
  api.post(`/proposals/${id}/resubmit`, data);

export const assignReviewer = (proposalId, reviewerId) =>
  api.post(`/proposals/${proposalId}/assign`, { reviewerId });

export const unassignReviewer = (proposalId) =>
  api.post(`/proposals/${proposalId}/unassign`);
