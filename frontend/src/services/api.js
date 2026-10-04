import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach JWT Token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('pathnova_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle Unauthorized Expiry
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.warn('Unauthorized session. Clearing credentials...');
      localStorage.removeItem('pathnova_token');
      localStorage.removeItem('pathnova_user');
    }
    return Promise.reject(error);
  }
);

// API Service Wrapper Methods
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  forgotPassword: (data) => api.post('/auth/forgot-password', data),
  resetPassword: (token, data) => api.post(`/auth/reset-password/${token}`, data),
};

export const profileAPI = {
  getProfile: () => api.get('/profile'),
  updateProfile: (data) => api.put('/profile', data),
};

export const assessmentAPI = {
  submitAssessment: (data) => api.post('/assessment', data),
  getAssessment: () => api.get('/assessment'),
};

export const careerAPI = {
  getCareers: (params) => api.get('/careers', { params }),
  getCareerById: (id) => api.get(`/careers/${id}`),
  createCareer: (data) => api.post('/careers', data),
  updateCareer: (id, data) => api.put(`/careers/${id}`, data),
  deleteCareer: (id) => api.delete(`/careers/${id}`),
};

export const recommendationAPI = {
  generateRecommendations: (data) => api.post('/recommendations', data),
  getRecommendations: () => api.get('/recommendations'),
};

export const skillGapAPI = {
  getSkillGap: (data) => api.post('/skill-gap', data),
};

export const roadmapAPI = {
  getRoadmap: () => api.get('/roadmap'),
  updateTaskStatus: (taskId, data) => api.put(`/roadmap/${taskId}`, data),
};

export const progressAPI = {
  getProgress: () => api.get('/progress'),
  updateProgress: (data) => api.put('/progress', data),
};

export const chatAPI = {
  sendMessage: (message) => api.post('/chat', { message }),
  getHistory: () => api.get('/chat'),
};

export const adminAPI = {
  getStats: () => api.get('/admin/stats'),
  getAllStudents: () => api.get('/admin/students'),
};

export default api;
