import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authAPI } from '@/lib/api';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  dailyCredits?: number;
  lastCreditRefresh?: string;
  timezone?: string;
  createdAt?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  refreshUserProfile: () => Promise<void>;
  updateCredits: (newCredits: number) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user && !!token;

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedToken = localStorage.getItem('authToken');
        const storedUser = localStorage.getItem('user');

        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));

          // Skip token validation if database is not available
          // This allows the app to work in demo mode
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        // Don't logout on initialization errors - allow demo mode
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await authAPI.login({ email, password });
      const { user: userData, token: authToken } = response;

      setUser(userData);
      setToken(authToken);

      // Store in localStorage
      localStorage.setItem('authToken', authToken);
      localStorage.setItem('user', JSON.stringify(userData));
    } catch (error: any) {
      console.error('Login error:', error);

      // Handle specific error responses from backend
      if (error.response?.status === 503) {
        // Database unavailable
        throw new Error(
          error.response.data?.message || 'Database is currently unavailable. Please try the question generation features without logging in.'
        );
      }

      if (error.response?.status === 401) {
        // Authentication failed
        throw new Error(
          error.response.data?.message || 'Invalid email or password. Please check your credentials and try again.'
        );
      }

      if (error.response?.status === 400) {
        // Validation error
        const details = error.response.data?.details;
        if (details && details.length > 0) {
          throw new Error(details.map((d: any) => d.message).join(', '));
        }
        throw new Error(error.response.data?.message || 'Please check your input and try again.');
      }

      // Network or other errors
      if (!error.response) {
        throw new Error('Network error. Please check your connection and try again.');
      }

      throw new Error(
        error.response?.data?.message || 'Login failed. Please try again later.'
      );
    }
  };

  const register = async (userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }) => {
    try {
      const response = await authAPI.register(userData);
      const { user: newUser, token: authToken } = response;

      setUser(newUser);
      setToken(authToken);

      // Store in localStorage
      localStorage.setItem('authToken', authToken);
      localStorage.setItem('user', JSON.stringify(newUser));
    } catch (error: any) {
      console.error('Registration error:', error);

      // Handle specific error responses from backend
      if (error.response?.status === 503) {
        // Database unavailable
        throw new Error(
          error.response.data?.message || 'Database is currently unavailable. Please try the question generation features without logging in.'
        );
      }

      if (error.response?.status === 409) {
        // User already exists
        throw new Error(
          error.response.data?.message || 'An account with this email already exists. Please try logging in instead.'
        );
      }

      if (error.response?.status === 400) {
        // Validation error
        const details = error.response.data?.details;
        if (details && details.length > 0) {
          throw new Error(details.map((d: any) => d.message).join(', '));
        }
        throw new Error(error.response.data?.message || 'Please check your input and try again.');
      }

      // Network or other errors
      if (!error.response) {
        throw new Error('Network error. Please check your connection and try again.');
      }

      throw new Error(
        error.response?.data?.message || 'Registration failed. Please try again later.'
      );
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  const refreshUserProfile = async () => {
    try {
      if (token) {
        const response = await authAPI.getProfile();
        const userData = response.user;
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
      }
    } catch (error) {
      console.error('Failed to refresh user profile:', error);
      // Don't logout on profile refresh failure
    }
  };

  const updateCredits = (newCredits: number) => {
    if (user) {
      const updatedUser = { ...user, dailyCredits: newCredits };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  const value: AuthContextType = {
    user,
    token,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
    updateUser,
    refreshUserProfile,
    updateCredits,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
