import axios from 'axios';

// MCQQuestion interface for type safety
interface MCQQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  metadata?: {
    subTopics?: string;
    author?: string;
    topic?: string;
    score?: string;
    questionType?: string;
  };
}

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

// API response types
interface APIQuestionResponse {
  "Question Type": string;
  "Difficulty Level": string;
  "Question Text": string;
  "Option (A)": string;
  "Option (B)": string;
  "Option (C)": string;
  "Option (D)": string;
  "Option (E)"?: string;
  "Correct Option (A/B/C/D)": string;
  "Answer Explanation": string;
  "Score": string;
  "Sub-Topics": string;
  "Author": string;
  "Topic": string;
}

// Transform API response to our MCQQuestion format
const transformAPIResponse = (apiQuestions: APIQuestionResponse[]): MCQQuestion[] => {
  return apiQuestions.map((aq, index) => {
    // Extract options (filter out empty ones)
    const options = [
      aq["Option (A)"],
      aq["Option (B)"],
      aq["Option (C)"],
      aq["Option (D)"],
      aq["Option (E)"] || ""
    ].filter(option => option && option.trim() !== "");

    // Convert correct option letter to index (A=0, B=1, C=2, D=3, E=4)
    const correctLetter = aq["Correct Option (A/B/C/D)"].toUpperCase();
    const correctAnswer = correctLetter.charCodeAt(0) - 65; // A=0, B=1, etc.

    // Map difficulty level to our format
    const difficultyMap: { [key: string]: 'easy' | 'medium' | 'hard' } = {
      'Easy': 'easy',
      'Medium': 'medium',
      'Hard': 'hard',
      'easy': 'easy',
      'medium': 'medium',
      'hard': 'hard'
    };

    const difficulty = difficultyMap[aq["Difficulty Level"]] || 'medium';

    return {
      id: `generated-${Date.now()}-${index}`,
      question: aq["Question Text"],
      options,
      correctAnswer,
      explanation: aq["Answer Explanation"],
      difficulty,
      // Additional metadata for enhanced display
      metadata: {
        subTopics: aq["Sub-Topics"],
        author: aq["Author"],
        topic: aq["Topic"],
        score: aq["Score"],
        questionType: aq["Question Type"]
      }
    };
  });
};

// Question Generation API
export const questionGenerationAPI = {
  generateQuestions: async (formData: {
    context: string;
    topicName: string;
    easyCount: number;
    mediumCount: number;
    hardCount: number;
    totalQuestions: number;
    serviceId: string;
  }) => {
    const API_ENDPOINT = 'https://primary-production-1cd8.up.railway.app/webhook/c6ef8f24-74f3-4781-9d60-13e917c7d2a7';

    try {
      console.log('🚀 Generating questions via API:', API_ENDPOINT);
      console.log('📊 Generation parameters:', formData);
      console.log('🛡️ CSP Check: Attempting external request to', new URL(API_ENDPOINT).origin);

      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          serviceId: formData.serviceId,
          timestamp: new Date().toISOString(),
          formData: {
            context: formData.context,
            topicName: formData.topicName,
            easyCount: formData.easyCount,
            mediumCount: formData.mediumCount,
            hardCount: formData.hardCount,
            totalQuestions: formData.totalQuestions
          },
          metadata: {
            source: 'iQube Question Generator',
            userAgent: navigator.userAgent,
            url: window.location.href
          }
        })
      });

      const responseData = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(`Question generation failed with status ${response.status}: ${responseData.message || 'Unknown error'}`);
      }

      console.log('✅ API response received:', responseData);

      // Transform API response to MCQQuestion format if it contains questions
      let transformedQuestions: MCQQuestion[] = [];
      if (Array.isArray(responseData) && responseData.length > 0) {
        console.log('🔄 Transforming API questions to MCQ format...');
        transformedQuestions = transformAPIResponse(responseData);
        console.log('✅ Transformed questions:', transformedQuestions);
      } else if (responseData.questions && Array.isArray(responseData.questions)) {
        console.log('🔄 Transforming nested API questions to MCQ format...');
        transformedQuestions = transformAPIResponse(responseData.questions);
        console.log('✅ Transformed questions:', transformedQuestions);
      }

      return {
        success: true,
        data: responseData,
        questions: transformedQuestions,
        status: response.status
      };
    } catch (error) {
      console.error('❌ Question generation error:', error);

      // Check for CSP violations
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        console.error('🛡️ Possible CSP violation: External request blocked');
        console.error('🔧 Check Content-Security-Policy headers and meta tags');
        console.error('🌐 Ensure connect-src includes:', new URL(API_ENDPOINT).origin);
      }

      throw error;
    }
  }
};

export default api;
