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

// Webhook response types
interface WebhookQuestionResponse {
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

// Transform webhook response to our MCQQuestion format
const transformWebhookResponse = (webhookQuestions: WebhookQuestionResponse[]): MCQQuestion[] => {
  return webhookQuestions.map((wq, index) => {
    // Extract options (filter out empty ones)
    const options = [
      wq["Option (A)"],
      wq["Option (B)"],
      wq["Option (C)"],
      wq["Option (D)"],
      wq["Option (E)"] || ""
    ].filter(option => option && option.trim() !== "");

    // Convert correct option letter to index (A=0, B=1, C=2, D=3, E=4)
    const correctLetter = wq["Correct Option (A/B/C/D)"].toUpperCase();
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

    const difficulty = difficultyMap[wq["Difficulty Level"]] || 'medium';

    return {
      id: `webhook-${Date.now()}-${index}`,
      question: wq["Question Text"],
      options,
      correctAnswer,
      explanation: wq["Answer Explanation"],
      difficulty,
      // Additional metadata for debugging
      metadata: {
        subTopics: wq["Sub-Topics"],
        author: wq["Author"],
        topic: wq["Topic"],
        score: wq["Score"],
        questionType: wq["Question Type"]
      }
    };
  });
};

// Webhook API
export const webhookAPI = {
  sendQuestionGenerationData: async (formData: {
    context: string;
    topicName: string;
    easyCount: number;
    mediumCount: number;
    hardCount: number;
    totalQuestions: number;
    webhookId: string;
  }) => {
    const WEBHOOK_URL = 'https://primary-production-1cd8.up.railway.app/webhook/c6ef8f24-74f3-4781-9d60-13e917c7d2a7';

    try {
      console.log('🔗 Sending data to webhook:', WEBHOOK_URL);
      console.log('📊 Form data:', formData);
      console.log('🛡️ CSP Check: Attempting external request to', new URL(WEBHOOK_URL).origin);

      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          webhookId: formData.webhookId,
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
        throw new Error(`Webhook failed with status ${response.status}: ${responseData.message || 'Unknown error'}`);
      }

      console.log('✅ Webhook response:', responseData);

      // Transform webhook response to MCQQuestion format if it contains questions
      let transformedQuestions: MCQQuestion[] = [];
      if (Array.isArray(responseData) && responseData.length > 0) {
        console.log('🔄 Transforming webhook questions to MCQ format...');
        transformedQuestions = transformWebhookResponse(responseData);
        console.log('✅ Transformed questions:', transformedQuestions);
      } else if (responseData.questions && Array.isArray(responseData.questions)) {
        console.log('🔄 Transforming nested webhook questions to MCQ format...');
        transformedQuestions = transformWebhookResponse(responseData.questions);
        console.log('✅ Transformed questions:', transformedQuestions);
      }

      return {
        success: true,
        data: responseData,
        questions: transformedQuestions,
        status: response.status
      };
    } catch (error) {
      console.error('❌ Webhook error:', error);

      // Check for CSP violations
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        console.error('🛡️ Possible CSP violation: External request blocked');
        console.error('🔧 Check Content-Security-Policy headers and meta tags');
        console.error('🌐 Ensure connect-src includes:', new URL(WEBHOOK_URL).origin);
      }

      throw error;
    }
  }
};

export default api;
