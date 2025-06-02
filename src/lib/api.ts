import axios from 'axios';

// API base URL - in production, use relative path since frontend and backend are served from same domain
const API_BASE_URL = import.meta.env.VITE_API_URL ||
  (import.meta.env.PROD ? '/api' : 'http://localhost:3001/api');

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: async (userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  login: async (credentials: { email: string; password: string }) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  getProfile: async () => {
    const response = await api.get('/users/profile');
    return response.data;
  },
};

// Questions API
export const questionsAPI = {
  generate: async (params: {
    topicName: string;
    count?: number;
    difficulty?: 'easy' | 'medium' | 'hard';
    questionType?: 'text' | 'mcq';
  }) => {
    const response = await api.post('/questions/generate', params);
    return response.data;
  },

  save: async (questionData: {
    questionText: string;
    topicName: string;
    options?: string[];
    correctAnswer?: number;
    explanation?: string;
    difficulty?: 'easy' | 'medium' | 'hard';
    questionType?: 'text' | 'mcq';
  }) => {
    const response = await api.post('/questions/save', questionData);
    return response.data;
  },

  getSaved: async (page = 1, limit = 10) => {
    const response = await api.get(`/questions/saved?page=${page}&limit=${limit}`);
    return response.data;
  },

  getTopics: async () => {
    const response = await api.get('/questions/topics');
    return response.data;
  },
};

// Users API
export const usersAPI = {
  updateProfile: async (userData: {
    firstName?: string;
    lastName?: string;
    email?: string;
  }) => {
    const response = await api.put('/users/profile', userData);
    return response.data;
  },

  changePassword: async (passwordData: {
    currentPassword: string;
    newPassword: string;
  }) => {
    const response = await api.put('/users/password', passwordData);
    return response.data;
  },

  getStats: async () => {
    const response = await api.get('/users/stats');
    return response.data;
  },

  deleteAccount: async () => {
    const response = await api.delete('/users/account');
    return response.data;
  },
};

export default api;
