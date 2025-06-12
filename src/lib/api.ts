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

// Fallback transformation for different response structures
const transformGenericResponse = (data: any[]): MCQQuestion[] => {
  console.log('🔄 Using generic transformation for:', data);

  return data.map((item, index) => {
    // Try to extract question data from various possible structures
    const question = item.question || item.Question || item["Question Text"] || item.text || `Question ${index + 1}`;

    // Try to extract options from various possible structures
    let options: string[] = [];
    if (item.options && Array.isArray(item.options)) {
      options = item.options;
    } else if (item.Options && Array.isArray(item.Options)) {
      options = item.Options;
    } else {
      // Try to extract from individual option fields
      const optionFields = [
        item["Option (A)"] || item.optionA || item.a,
        item["Option (B)"] || item.optionB || item.b,
        item["Option (C)"] || item.optionC || item.c,
        item["Option (D)"] || item.optionD || item.d,
        item["Option (E)"] || item.optionE || item.e
      ].filter(opt => opt && opt.trim() !== "");

      if (optionFields.length > 0) {
        options = optionFields;
      } else {
        options = ["Option A", "Option B", "Option C", "Option D"];
      }
    }

    // Try to extract correct answer
    let correctAnswer = 0;
    if (typeof item.correctAnswer === 'number') {
      correctAnswer = item.correctAnswer;
    } else if (typeof item.correct_answer === 'number') {
      correctAnswer = item.correct_answer;
    } else if (item["Correct Option (A/B/C/D)"]) {
      const letter = item["Correct Option (A/B/C/D)"].toUpperCase();
      correctAnswer = letter.charCodeAt(0) - 65;
    }

    // Try to extract explanation
    const explanation = item.explanation || item.Explanation || item["Answer Explanation"] || "No explanation provided.";

    // Try to extract difficulty
    const difficultyRaw = item.difficulty || item.Difficulty || item["Difficulty Level"] || "medium";
    const difficulty = difficultyRaw.toLowerCase() as 'easy' | 'medium' | 'hard';

    return {
      id: `generated-${Date.now()}-${index}`,
      question,
      options,
      correctAnswer: Math.max(0, Math.min(correctAnswer, options.length - 1)), // Ensure valid index
      explanation,
      difficulty: ['easy', 'medium', 'hard'].includes(difficulty) ? difficulty : 'medium',
      metadata: {
        subTopics: item["Sub-Topics"] || item.subTopics,
        author: item.Author || item.author,
        topic: item.Topic || item.topic,
        score: item.Score || item.score,
        questionType: item["Question Type"] || item.questionType || "MCQ"
      }
    };
  });
};

// Progressive Loading Types
interface ProgressiveLoadingState {
  phase: 'initial' | 'background' | 'complete';
  questionsLoaded: number;
  totalExpected: number;
  isLoading: boolean;
  error?: string;
}

interface ProgressiveQuestionResponse {
  questions: MCQQuestion[];
  loadingState: ProgressiveLoadingState;
  hasMore: boolean;
}

// Question Generation API with Progressive Loading
export const questionGenerationAPI = {
  // Original single-request method (kept for backward compatibility)
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

      // Create AbortController for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

      try {
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
          }),
          signal: controller.signal
        });

        clearTimeout(timeoutId);
        const responseData = await response.json().catch(() => ({}));

        if (!response.ok) {
          throw new Error(`Question generation failed with status ${response.status}: ${responseData.message || 'Unknown error'}`);
        }

        console.log('✅ API response received:', responseData);
        console.log('🔍 Response type:', typeof responseData);
        console.log('🔍 Is array:', Array.isArray(responseData));
        console.log('🔍 Response keys:', Object.keys(responseData || {}));

        if (responseData && typeof responseData === 'object') {
          console.log('🔍 First item structure:', responseData[0] || responseData.questions?.[0]);
        }

        // Transform API response to MCQQuestion format
        let transformedQuestions: MCQQuestion[] = [];

        try {
          if (Array.isArray(responseData) && responseData.length > 0) {
            console.log('🔄 Transforming direct array response...');
            try {
              transformedQuestions = transformAPIResponse(responseData);
            } catch (specificError) {
              console.warn('⚠️ Specific transform failed, trying generic:', specificError);
              transformedQuestions = transformGenericResponse(responseData);
            }
          } else if (responseData.questions && Array.isArray(responseData.questions)) {
            console.log('🔄 Transforming nested questions array...');
            try {
              transformedQuestions = transformAPIResponse(responseData.questions);
            } catch (specificError) {
              console.warn('⚠️ Specific transform failed, trying generic:', specificError);
              transformedQuestions = transformGenericResponse(responseData.questions);
            }
          } else {
            console.warn('⚠️ Unexpected response structure:', responseData);
            // Try to transform the entire response as a single question array
            if (responseData && typeof responseData === 'object') {
              transformedQuestions = transformGenericResponse([responseData]);
            }
          }

          console.log('✅ Transformed questions:', transformedQuestions.length);
          console.log('🔍 First transformed question:', transformedQuestions[0]);
        } catch (transformError) {
          console.error('❌ Transform error:', transformError);
          console.log('🔍 Raw data that failed to transform:', responseData);

          // Last resort: create a placeholder question to test UI rendering
          console.log('🆘 Creating placeholder question for UI testing...');
          transformedQuestions = [{
            id: 'error-placeholder',
            question: 'Error: Could not parse question data. Raw response received but transformation failed.',
            options: ['Check console for details', 'Response structure mismatch', 'Transform function needs update', 'Contact developer'],
            correctAnswer: 0,
            explanation: `Raw response: ${JSON.stringify(responseData).substring(0, 200)}...`,
            difficulty: 'medium' as const
          }];
        }

        return {
          success: true,
          data: responseData,
          questions: transformedQuestions,
          status: response.status
        };
      } catch (error) {
        clearTimeout(timeoutId);
        if (error.name === 'AbortError') {
          throw new Error('Request timed out after 30 seconds. The webhook service may be unavailable.');
        }
        throw error;
      }
    } catch (error) {
      console.error('❌ Question generation error:', error);
      throw error;
    }
  },

  // NEW: Progressive question generation with immediate first response
  generateQuestionsProgressive: async function* (formData: {
    context: string;
    topicName: string;
    easyCount: number;
    mediumCount: number;
    hardCount: number;
    totalQuestions: number;
    serviceId: string;
  }): AsyncGenerator<ProgressiveQuestionResponse, void, unknown> {
    const API_ENDPOINT = 'https://primary-production-1cd8.up.railway.app/webhook/c6ef8f24-74f3-4781-9d60-13e917c7d2a7';

    console.log('🚀 Starting progressive question generation...');

    try {
      // Phase 1: Initial request for immediate response
      console.log('📡 Phase 1: Sending initial request...');

      // Create AbortController for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          serviceId: formData.serviceId,
          timestamp: new Date().toISOString(),
          phase: 'initial', // Indicate this is the initial request
          formData: {
            context: formData.context,
            topicName: formData.topicName,
            easyCount: formData.easyCount,
            mediumCount: formData.mediumCount,
            hardCount: formData.hardCount,
            totalQuestions: formData.totalQuestions
          },
          metadata: {
            source: 'iQube Question Generator Progressive',
            userAgent: navigator.userAgent,
            url: window.location.href
          }
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      const initialData = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(`Initial request failed: ${response.status}`);
      }

      // Transform initial response
      let initialQuestions: MCQQuestion[] = [];
      if (Array.isArray(initialData) && initialData.length > 0) {
        initialQuestions = transformAPIResponse(initialData);
      } else if (initialData.questions && Array.isArray(initialData.questions)) {
        initialQuestions = transformAPIResponse(initialData.questions);
      }

      console.log(`✅ Phase 1 complete: ${initialQuestions.length} questions received`);

      // Yield initial questions immediately
      yield {
        questions: initialQuestions,
        loadingState: {
          phase: 'initial',
          questionsLoaded: initialQuestions.length,
          totalExpected: formData.totalQuestions,
          isLoading: true
        },
        hasMore: initialQuestions.length < formData.totalQuestions
      };

      // Phase 2: Background loading for additional questions
      if (initialQuestions.length < formData.totalQuestions) {
        console.log('🔄 Phase 2: Starting background loading...');

        // Simulate polling or additional requests for more questions
        // In a real implementation, this might poll a status endpoint or make additional requests
        const remainingQuestions = formData.totalQuestions - initialQuestions.length;

        // Simulate background processing with delays
        for (let i = 0; i < 3; i++) { // Up to 3 additional batches
          await new Promise(resolve => setTimeout(resolve, 1500)); // 1.5s delay between batches

          try {
            // Make additional request for more questions
            const backgroundResponse = await fetch(API_ENDPOINT, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
              },
              body: JSON.stringify({
                serviceId: formData.serviceId,
                timestamp: new Date().toISOString(),
                phase: 'background',
                batch: i + 1,
                formData: {
                  ...formData,
                  totalQuestions: Math.min(remainingQuestions, 2) // Request 2 questions per batch
                }
              })
            });

            if (backgroundResponse.ok) {
              const backgroundData = await backgroundResponse.json().catch(() => ({}));
              let additionalQuestions: MCQQuestion[] = [];

              if (Array.isArray(backgroundData) && backgroundData.length > 0) {
                additionalQuestions = transformAPIResponse(backgroundData);
              } else if (backgroundData.questions && Array.isArray(backgroundData.questions)) {
                additionalQuestions = transformAPIResponse(backgroundData.questions);
              }

              if (additionalQuestions.length > 0) {
                console.log(`✅ Background batch ${i + 1}: ${additionalQuestions.length} additional questions`);

                const totalLoaded = initialQuestions.length + additionalQuestions.length;

                yield {
                  questions: additionalQuestions,
                  loadingState: {
                    phase: 'background',
                    questionsLoaded: totalLoaded,
                    totalExpected: formData.totalQuestions,
                    isLoading: totalLoaded < formData.totalQuestions
                  },
                  hasMore: totalLoaded < formData.totalQuestions
                };

                // Update initial questions array for next iteration
                initialQuestions = [...initialQuestions, ...additionalQuestions];

                if (totalLoaded >= formData.totalQuestions) {
                  break; // We have enough questions
                }
              }
            }
          } catch (backgroundError) {
            console.warn(`⚠️ Background batch ${i + 1} failed:`, backgroundError);
            // Continue with next batch even if one fails
          }
        }
      }

      // Phase 3: Complete - ✅ CRITICAL FIX: Don't yield empty questions array
      console.log('🎉 Progressive loading complete');
      yield {
        questions: [], // Empty array is OK here - it signals completion, not replacement
        loadingState: {
          phase: 'complete',
          questionsLoaded: initialQuestions.length,
          totalExpected: formData.totalQuestions,
          isLoading: false
        },
        hasMore: false
      };

    } catch (error) {
      console.error('❌ Progressive generation error:', error);

      // Yield error state
      yield {
        questions: [],
        loadingState: {
          phase: 'initial',
          questionsLoaded: 0,
          totalExpected: formData.totalQuestions,
          isLoading: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        },
        hasMore: false
      };
    }
  }
};

export default api;
