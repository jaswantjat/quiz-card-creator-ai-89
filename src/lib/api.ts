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

// Comments API
export const commentsAPI = {
  getComments: async (questionId: string) => {
    const response = await api.get(`/questions/${questionId}/comments`);
    return response.data;
  },

  addComment: async (questionId: string, commentText: string) => {
    const response = await api.post(`/questions/${questionId}/comments`, {
      commentText
    });
    return response.data;
  },

  updateComment: async (questionId: string, commentId: string, commentText: string) => {
    const response = await api.put(`/questions/${questionId}/comments/${commentId}`, {
      commentText
    });
    return response.data;
  },

  deleteComment: async (questionId: string, commentId: string) => {
    const response = await api.delete(`/questions/${questionId}/comments/${commentId}`);
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

  // Credit management
  getCredits: async () => {
    const response = await api.get('/users/credits');
    return response.data;
  },

  refreshCredits: async () => {
    const response = await api.post('/users/credits/refresh');
    return response.data;
  },

  getCreditHistory: async (limit = 50) => {
    const response = await api.get(`/users/credits/history?limit=${limit}`);
    return response.data;
  },

  updateTimezone: async (timezone: string) => {
    const response = await api.put('/users/timezone', { timezone });
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

// Enhanced unique ID generator with multiple entropy sources
const generateUniqueId = (() => {
  let counter = 0;
  let lastTimestamp = 0;

  return (prefix: string = 'generated') => {
    counter++;
    let timestamp = Date.now();

    // Ensure timestamp is always unique by incrementing if same as last
    if (timestamp <= lastTimestamp) {
      timestamp = lastTimestamp + 1;
    }
    lastTimestamp = timestamp;

    // Generate multiple random components for better entropy
    const random1 = Math.random().toString(36).substring(2, 8);
    const random2 = Math.random().toString(36).substring(2, 6);
    const processId = Math.floor(Math.random() * 10000);

    // Use crypto.randomUUID if available, fallback to enhanced random
    let cryptoComponent = '';
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      cryptoComponent = crypto.randomUUID().substring(0, 8);
    } else {
      cryptoComponent = Math.random().toString(36).substring(2, 10);
    }

    const uniqueId = `${prefix}-${timestamp}-${counter}-${processId}-${random1}-${random2}-${cryptoComponent}`;
    return uniqueId;
  };
})();

// Question deduplication system to prevent duplicate processing
const processedQuestions = new Set<string>();

const createQuestionHash = (question: any): string => {
  try {
    // Create a hash based on question content to detect duplicates
    const content = JSON.stringify({
      question: question["Question Text"] || question.question,
      options: [
        question["Option (A)"] || question.optionA,
        question["Option (B)"] || question.optionB,
        question["Option (C)"] || question.optionC,
        question["Option (D)"] || question.optionD
      ]
    });

    // Use TextEncoder to handle Unicode characters properly
    // Convert string to UTF-8 bytes, then to base64
    const encoder = new TextEncoder();
    const utf8Bytes = encoder.encode(content);

    // Convert Uint8Array to binary string for btoa()
    let binaryString = '';
    for (let i = 0; i < utf8Bytes.length; i++) {
      binaryString += String.fromCharCode(utf8Bytes[i]);
    }

    // ✅ CRITICAL FIX: Use longer hash and add content-based suffix for better differentiation
    const fullHash = btoa(binaryString);

    // Create a more unique hash by combining:
    // 1. First 24 characters of base64 (instead of 16)
    // 2. Content length as hex
    // 3. Simple checksum of content
    const contentChecksum = content.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const lengthHex = content.length.toString(16).padStart(4, '0');
    const checksumHex = (contentChecksum % 65536).toString(16).padStart(4, '0');

    const hash = `${fullHash.substring(0, 24)}-${lengthHex}-${checksumHex}`;
    return hash;
  } catch (error) {
    console.error('Error creating question hash:', error);

    // Fallback: create a simple hash based on timestamp and random number
    const fallbackHash = `fallback-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
    return fallbackHash;
  }
};

// Clear processed questions cache (useful for new generation sessions)
const clearProcessedQuestions = () => {
  console.log(`🧹 Clearing processed questions cache (${processedQuestions.size} items)`);
  processedQuestions.clear();
};

// Enhanced deduplication with ID tracking
const processedQuestionIds = new Set<string>();

const clearProcessedQuestionIds = () => {
  console.log(`🧹 Clearing processed question IDs cache (${processedQuestionIds.size} items)`);
  processedQuestionIds.clear();
};

// Transform API response to our MCQQuestion format
const transformAPIResponse = (apiQuestions: APIQuestionResponse[], phase: string = 'unknown'): MCQQuestion[] => {
  console.log(`🔄 Transforming API response for ${phase} phase with enhanced deduplication...`);
  console.log(`📊 Input: ${apiQuestions.length} questions, Cache size: ${processedQuestions.size}`);

  const transformedQuestions: MCQQuestion[] = [];

  apiQuestions.forEach((aq, index) => {
    // Check for duplicates with enhanced logging
    const questionHash = createQuestionHash(aq);

    if (processedQuestions.has(questionHash)) {
      console.warn(`⚠️ [${phase}] Duplicate question detected and skipped at index ${index}`);
      console.log(`🔍 [${phase}] Duplicate hash: ${questionHash}`);
      console.log(`🔍 [${phase}] Question preview: "${(aq["Question Text"] || '').substring(0, 100)}..."`);
      return;
    }

    console.log(`✅ [${phase}] New question hash: ${questionHash}`);
    processedQuestions.add(questionHash);

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

    const uniqueId = generateUniqueId('mcq');
    console.log(`🆔 Generated unique ID for question ${index + 1}: ${uniqueId}`);

    // ✅ Enhanced ID deduplication check
    let finalId = uniqueId;
    if (processedQuestionIds.has(uniqueId)) {
      console.warn(`⚠️ Duplicate ID detected and regenerating: ${uniqueId}`);
      // Regenerate ID if duplicate (should be extremely rare with enhanced system)
      finalId = generateUniqueId('mcq-retry');
      console.log(`🔄 Regenerated ID: ${finalId}`);
    }
    processedQuestionIds.add(finalId);

    const transformedQuestion = {
      id: finalId,
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

    transformedQuestions.push(transformedQuestion);
  });

  console.log(`✅ Transformation complete: ${transformedQuestions.length} unique questions processed`);
  return transformedQuestions;
};

// Convert MCQQuestion back to APIQuestionResponse format for webhook payload
const convertToAPIFormat = (question: MCQQuestion): APIQuestionResponse => {
  console.log('🔄 Converting MCQQuestion to API format:', question.id);

  // Convert numeric correctAnswer back to letter format (0=A, 1=B, 2=C, 3=D, 4=E)
  const correctLetter = String.fromCharCode(65 + question.correctAnswer); // 0=A, 1=B, etc.

  // Ensure we have at least 4 options, pad with empty strings if needed
  const paddedOptions = [...question.options];
  while (paddedOptions.length < 4) {
    paddedOptions.push('');
  }

  // Map difficulty to proper case
  const difficultyMap: { [key: string]: string } = {
    'easy': 'Easy',
    'medium': 'Medium',
    'hard': 'Hard'
  };

  const apiFormat: APIQuestionResponse = {
    "Question Type": question.metadata?.questionType || "MCQ",
    "Difficulty Level": difficultyMap[question.difficulty] || "Medium",
    "Question Text": question.question,
    "Option (A)": paddedOptions[0] || '',
    "Option (B)": paddedOptions[1] || '',
    "Option (C)": paddedOptions[2] || '',
    "Option (D)": paddedOptions[3] || '',
    "Correct Option (A/B/C/D)": correctLetter,
    "Answer Explanation": question.explanation,
    "Score": question.metadata?.score || "1",
    "Sub-Topics": question.metadata?.subTopics || "",
    "Author": question.metadata?.author || "iQube",
    "Topic": question.metadata?.topic || ""
  };

  // Add Option (E) if it exists
  if (paddedOptions[4]) {
    apiFormat["Option (E)"] = paddedOptions[4];
  }

  console.log('✅ Converted to API format:', apiFormat);
  return apiFormat;
};

// Fallback transformation for different response structures
const transformGenericResponse = (data: any[], phase: string = 'unknown'): MCQQuestion[] => {
  console.log(`🔄 Using generic transformation for ${phase} phase with enhanced deduplication:`, data);
  console.log(`📊 Input: ${data.length} items, Cache size: ${processedQuestions.size}`);

  const transformedQuestions: MCQQuestion[] = [];

  data.forEach((item, index) => {
    // Check for duplicates using generic hash with enhanced logging
    const genericHash = createQuestionHash(item);

    if (processedQuestions.has(genericHash)) {
      console.warn(`⚠️ [${phase}] Duplicate generic question detected and skipped at index ${index}`);
      console.log(`🔍 [${phase}] Duplicate hash: ${genericHash}`);
      console.log(`🔍 [${phase}] Question preview: "${(item.question || item.Question || item["Question Text"] || '').substring(0, 100)}..."`);
      return;
    }

    console.log(`✅ [${phase}] New generic question hash: ${genericHash}`);
    processedQuestions.add(genericHash);
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

    const uniqueId = generateUniqueId('generic');
    console.log(`🆔 Generated unique ID for generic question ${index + 1}: ${uniqueId}`);

    // ✅ Enhanced ID deduplication check
    let finalId = uniqueId;
    if (processedQuestionIds.has(uniqueId)) {
      console.warn(`⚠️ Duplicate generic ID detected and regenerating: ${uniqueId}`);
      finalId = generateUniqueId('generic-retry');
      console.log(`🔄 Regenerated generic ID: ${finalId}`);
    }
    processedQuestionIds.add(finalId);

    const transformedQuestion = {
      id: finalId,
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

    transformedQuestions.push(transformedQuestion);
  });

  console.log(`✅ Generic transformation complete: ${transformedQuestions.length} unique questions processed`);
  return transformedQuestions;
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
            console.log('🔄 Transforming direct array response for legacy method...');
            try {
              transformedQuestions = transformAPIResponse(responseData, 'legacy');
            } catch (specificError) {
              console.warn('⚠️ Specific transform failed, trying generic:', specificError);
              transformedQuestions = transformGenericResponse(responseData, 'legacy');
            }
          } else if (responseData.questions && Array.isArray(responseData.questions)) {
            console.log('🔄 Transforming nested questions array for legacy method...');
            try {
              transformedQuestions = transformAPIResponse(responseData.questions, 'legacy');
            } catch (specificError) {
              console.warn('⚠️ Specific transform failed, trying generic:', specificError);
              transformedQuestions = transformGenericResponse(responseData.questions, 'legacy');
            }
          } else {
            console.warn('⚠️ Unexpected response structure:', responseData);
            // Try to transform the entire response as a single question array
            if (responseData && typeof responseData === 'object') {
              transformedQuestions = transformGenericResponse([responseData], 'legacy');
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
            id: generateUniqueId('error-placeholder'),
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
  }, externalAbortSignal?: AbortSignal): AsyncGenerator<ProgressiveQuestionResponse, void, unknown> {
    const API_ENDPOINT = 'https://primary-production-1cd8.up.railway.app/webhook/c6ef8f24-74f3-4781-9d60-13e917c7d2a7';

    console.log('🚀 Starting progressive question generation...');

    // Clear processed questions cache for new generation session
    clearProcessedQuestions();
    clearProcessedQuestionIds();

    try {
      // Phase 1: Initial request for immediate response
      console.log('📡 Phase 1: Sending initial request...');

      // Create combined AbortController for timeout and external cancellation
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        console.log('⏰ Request timeout after 45 seconds');
        controller.abort();
      }, 45000); // Increased to 45 seconds for better reliability

      // Listen for external abort signal
      if (externalAbortSignal) {
        externalAbortSignal.addEventListener('abort', () => {
          console.log('🛑 External abort signal received');
          controller.abort();
        });
      }

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

      // Transform initial response with comprehensive error handling
      let initialQuestions: MCQQuestion[] = [];
      try {
        if (Array.isArray(initialData) && initialData.length > 0) {
          console.log('🔄 Transforming direct array response for initial phase...');
          initialQuestions = transformAPIResponse(initialData, 'initial');
        } else if (initialData.questions && Array.isArray(initialData.questions)) {
          console.log('🔄 Transforming nested questions array for initial phase...');
          initialQuestions = transformAPIResponse(initialData.questions, 'initial');
        } else {
          console.warn('⚠️ Unexpected response structure, trying generic transform for initial phase...');
          if (initialData && typeof initialData === 'object') {
            initialQuestions = transformGenericResponse([initialData], 'initial');
          }
        }
      } catch (transformError) {
        console.error('❌ Transform error in progressive loading:', transformError);
        console.log('🔍 Raw data that failed to transform:', initialData);

        // Create a debug question to show the issue
        initialQuestions = [{
          id: generateUniqueId('debug-transform-error'),
          question: 'Transform Error: Could not parse webhook response data',
          options: [
            'Check browser console for details',
            'Response structure may have changed',
            'Transform function needs update',
            'Contact developer for assistance'
          ],
          correctAnswer: 0,
          explanation: `Transform error: ${transformError instanceof Error ? transformError.message : 'Unknown error'}. Raw response: ${JSON.stringify(initialData).substring(0, 200)}...`,
          difficulty: 'medium' as const,
          metadata: {
            subTopics: 'Debug',
            author: 'System',
            topic: 'Error Handling',
            score: '0',
            questionType: 'Debug'
          }
        }];
      }

      console.log(`✅ Phase 1 complete: ${initialQuestions.length} questions received`);
      console.log('🔍 Initial questions structure:', initialQuestions);
      console.log('🔍 First question detailed:', JSON.stringify(initialQuestions[0], null, 2));

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
          // Check for abort before each iteration
          if (externalAbortSignal?.aborted || controller.signal.aborted) {
            console.log('🛑 Background loading cancelled');
            break;
          }

          await new Promise(resolve => setTimeout(resolve, 1500)); // 1.5s delay between batches

          // Check again after delay
          if (externalAbortSignal?.aborted || controller.signal.aborted) {
            console.log('🛑 Background loading cancelled after delay');
            break;
          }

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
              }),
              signal: controller.signal // Use the same controller for background requests
            });

            if (backgroundResponse.ok) {
              const backgroundData = await backgroundResponse.json().catch(() => ({}));
              let additionalQuestions: MCQQuestion[] = [];

              console.log(`🔍 Background batch ${i + 1} raw data:`, backgroundData);

              if (Array.isArray(backgroundData) && backgroundData.length > 0) {
                additionalQuestions = transformAPIResponse(backgroundData, `background-batch-${i + 1}`);
              } else if (backgroundData.questions && Array.isArray(backgroundData.questions)) {
                additionalQuestions = transformAPIResponse(backgroundData.questions, `background-batch-${i + 1}`);
              } else {
                console.warn(`⚠️ Background batch ${i + 1}: Unexpected response structure, trying generic transform...`);
                if (backgroundData && typeof backgroundData === 'object') {
                  additionalQuestions = transformGenericResponse([backgroundData], `background-batch-${i + 1}`);
                }
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

      // Phase 3: Complete - ✅ CRITICAL FIX: Yield empty array to prevent duplication
      console.log('🎉 Progressive loading complete');
      yield {
        questions: [], // ✅ FIXED: Don't yield questions again to prevent duplication
        loadingState: {
          phase: 'complete',
          questionsLoaded: initialQuestions.length,
          totalExpected: formData.totalQuestions,
          isLoading: false
        },
        hasMore: false
      };

    } catch (error) {
      // Handle AbortError specifically
      if (error instanceof Error && error.name === 'AbortError') {
        console.log('🛑 Progressive generation aborted:', error.message);

        // Yield cancellation state
        yield {
          questions: [],
          loadingState: {
            phase: 'initial',
            questionsLoaded: 0,
            totalExpected: formData.totalQuestions,
            isLoading: false,
            error: 'Generation cancelled'
          },
          hasMore: false
        };
      } else {
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
  },

  // NEW: Individual question regeneration with webhook integration
  regenerateQuestion: async (questionData: {
    questionId: string;
    originalQuestion: MCQQuestion;
    context: string;
    topicName: string;
  }) => {
    const REGENERATION_ENDPOINT = 'https://primary-production-1cd8.up.railway.app/webhook/a14e30ef-99a0-4689-88cc-b8b2fb1a4f19';
    const SERVICE_ID = 'a14e30ef-99a0-4689-88cc-b8b2fb1a4f19';

    try {
      console.log('🔄 Regenerating individual question via webhook:', REGENERATION_ENDPOINT);
      console.log('📊 Regeneration parameters:', {
        questionId: questionData.questionId,
        difficulty: questionData.originalQuestion.difficulty,
        topic: questionData.topicName
      });

      // Convert original question to API format for webhook
      const originalQuestionAPIFormat = convertToAPIFormat(questionData.originalQuestion);
      console.log('🔄 Original question converted to API format:', originalQuestionAPIFormat);

      // Create AbortController for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 25000); // 25 second timeout for single question

      try {
        const response = await fetch(REGENERATION_ENDPOINT, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify({
            serviceId: SERVICE_ID,
            timestamp: new Date().toISOString(),
            operation: 'regenerate_question',
            questionId: questionData.questionId,
            formData: {
              context: questionData.context,
              topicName: questionData.topicName,
              difficulty: questionData.originalQuestion.difficulty,
              totalQuestions: 1, // Single question regeneration
              easyCount: questionData.originalQuestion.difficulty === 'easy' ? 1 : 0,
              mediumCount: questionData.originalQuestion.difficulty === 'medium' ? 1 : 0,
              hardCount: questionData.originalQuestion.difficulty === 'hard' ? 1 : 0,
              // Convert original question to API format for webhook compatibility
              originalQuestion: originalQuestionAPIFormat,
              // Also include the raw MCQ format for backward compatibility
              originalQuestionMCQ: {
                id: questionData.originalQuestion.id,
                question: questionData.originalQuestion.question,
                options: questionData.originalQuestion.options,
                correctAnswer: questionData.originalQuestion.correctAnswer,
                explanation: questionData.originalQuestion.explanation,
                difficulty: questionData.originalQuestion.difficulty,
                metadata: questionData.originalQuestion.metadata
              }
            },
            metadata: {
              source: 'iQube Question Regeneration',
              userAgent: navigator.userAgent,
              url: window.location.href,
              regenerationType: 'individual'
            }
          }),
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          const errorText = await response.text().catch(() => 'Unknown error');
          throw new Error(`Webhook request failed: ${response.status} ${response.statusText}. ${errorText}`);
        }

        const responseData = await response.json().catch(() => {
          throw new Error('Invalid JSON response from regeneration webhook');
        });

        console.log('✅ Regeneration webhook response:', responseData);

        // Transform response using existing transformation functions
        let regeneratedQuestions: MCQQuestion[] = [];

        try {
          console.log('🔄 Processing regeneration webhook response...');
          console.log('📊 Response structure:', {
            type: typeof responseData,
            isArray: Array.isArray(responseData),
            keys: Object.keys(responseData || {}),
            hasQuestions: !!(responseData.questions),
            questionsLength: responseData.questions?.length
          });

          // Use existing transformation functions for consistent parsing
          if (Array.isArray(responseData) && responseData.length > 0) {
            console.log('🔄 Transforming direct array response for regeneration...');
            try {
              regeneratedQuestions = transformAPIResponse(responseData, 'regeneration');
            } catch (specificError) {
              console.warn('⚠️ API transform failed, trying generic:', specificError);
              regeneratedQuestions = transformGenericResponse(responseData, 'regeneration');
            }
          } else if (responseData.questions && Array.isArray(responseData.questions)) {
            console.log('🔄 Transforming nested questions array for regeneration...');
            try {
              regeneratedQuestions = transformAPIResponse(responseData.questions, 'regeneration');
            } catch (specificError) {
              console.warn('⚠️ API transform failed, trying generic:', specificError);
              regeneratedQuestions = transformGenericResponse(responseData.questions, 'regeneration');
            }
          } else if (responseData.data && responseData.data.questions && Array.isArray(responseData.data.questions)) {
            console.log('🔄 Transforming nested data.questions array for regeneration...');
            try {
              regeneratedQuestions = transformAPIResponse(responseData.data.questions, 'regeneration');
            } catch (specificError) {
              console.warn('⚠️ API transform failed, trying generic:', specificError);
              regeneratedQuestions = transformGenericResponse(responseData.data.questions, 'regeneration');
            }
          } else if (responseData && typeof responseData === 'object') {
            console.log('🔄 Transforming single object response for regeneration...');
            try {
              regeneratedQuestions = transformGenericResponse([responseData], 'regeneration');
            } catch (specificError) {
              console.warn('⚠️ Generic transform failed:', specificError);
              throw new Error('Could not parse regeneration response');
            }
          } else {
            throw new Error('Unexpected response structure from regeneration webhook');
          }

          if (regeneratedQuestions.length > 0) {
            const regeneratedQuestion = regeneratedQuestions[0];

            // Enhance metadata with regeneration tracking
            regeneratedQuestion.metadata = {
              ...questionData.originalQuestion.metadata,
              ...regeneratedQuestion.metadata,
              regeneratedFrom: questionData.originalQuestion.id,
              regeneratedAt: new Date().toISOString(),
              regenerationType: 'individual'
            };

            console.log('✅ Successfully transformed regenerated question:', regeneratedQuestion.id);
            return { question: regeneratedQuestion };
          } else {
            throw new Error('No questions found in regeneration response after transformation');
          }
        } catch (parseError) {
          console.error('❌ Error parsing regeneration response:', parseError);
          throw new Error(`Failed to parse regenerated question: ${parseError instanceof Error ? parseError.message : 'Unknown parsing error'}`);
        }

      } catch (error) {
        clearTimeout(timeoutId);
        if (error.name === 'AbortError') {
          throw new Error('Regeneration request timed out after 25 seconds. Please try again.');
        }
        throw error;
      }
    } catch (error) {
      console.error('❌ Question regeneration error:', error);
      throw error;
    }
  }
};

export default api;
