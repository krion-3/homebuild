import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const login = (data) => API.post('/auth/login', data);

export const createUser = (data) => API.post('/users', data);
export const getAllUsers = () => API.get('/users');
export const toggleUserStatus = (id) => API.patch(`/users/${id}/toggle`);

export const createProperty = (data) => API.post('/properties', data);
export const getAllProperties = () => API.get('/properties');
export const getMyProperties = () => API.get('/properties/my');
export const verifyProperty = (id) => API.patch(`/properties/${id}/verify`);

export const createProject = (data) => API.post('/projects', data);
export const getAllProjects = () => API.get('/projects');
export const getMyProjects = () => API.get('/projects/my');
export const getProjectById = (id) => API.get(`/projects/${id}`);
export const updateProjectStatus = (id, data) => API.patch(`/projects/${id}/status`, data);

export const createMilestone = (data) => API.post('/milestones', data);
export const getProjectMilestones = (project_id) => API.get(`/milestones/project/${project_id}`);
export const updateMilestoneStatus = (id, data) => API.patch(`/milestones/${id}/status`, data);
export const uploadProgressUpdate = (data) => API.post('/milestones/progress', data);
export const getMilestoneUpdates = (milestone_id) => API.get(`/milestones/${milestone_id}/progress`);

export const makePayment = (data) => API.post('/payments', data);
export const getMyPayments = () => API.get('/payments/my');
export const getProjectPayments = (project_id) => API.get(`/payments/project/${project_id}`);
export const getPaymentSummary = (project_id) => API.get(`/payments/summary/${project_id}`);
export const updatePaymentStatus = (id, data) => API.patch(`/payments/${id}/status`, data);

export default API;