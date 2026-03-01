import api from './api';

export const getResearchers = (params) =>
  api.get('/researchers', { params });

export const getResearcherById = (id) =>
  api.get(`/researchers/${id}`);
