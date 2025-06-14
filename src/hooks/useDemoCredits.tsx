import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';

const DEMO_CREDITS_KEY = 'imocha_demo_credits';
const DEMO_CREDITS_DEFAULT = 10;

interface DemoCreditState {
  credits: number;
  isDemo: boolean;
  lastRefresh: string;
}

/**
 * Custom hook for managing credits in both authenticated and demo modes
 * Demo mode: Credits persist in localStorage but reset to 10 on page refresh
 * Authenticated mode: Uses user's actual credits from the database
 */
export const useDemoCredits = () => {
  const { user, isAuthenticated, updateCredits: updateUserCredits } = useAuth();
  const [demoCredits, setDemoCredits] = useState<number>(DEMO_CREDITS_DEFAULT);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize demo credits on component mount
  useEffect(() => {
    if (!isAuthenticated) {
      // Demo mode - always start with 10 credits on page load/refresh
      const currentTime = new Date().toISOString();
      const demoState: DemoCreditState = {
        credits: DEMO_CREDITS_DEFAULT,
        isDemo: true,
        lastRefresh: currentTime
      };
      
      localStorage.setItem(DEMO_CREDITS_KEY, JSON.stringify(demoState));
      setDemoCredits(DEMO_CREDITS_DEFAULT);
      
      console.log('🎮 Demo mode initialized with 10 credits');
    }
    setIsInitialized(true);
  }, [isAuthenticated]);

  // Get current credits based on mode
  const getCurrentCredits = useCallback((): number => {
    if (isAuthenticated && user) {
      return user.dailyCredits || 0;
    }
    return demoCredits;
  }, [isAuthenticated, user, demoCredits]);

  // Update credits based on mode
  const updateCredits = useCallback((newCredits: number) => {
    if (isAuthenticated && user) {
      // Authenticated mode - update user credits
      updateUserCredits(newCredits);
    } else {
      // Demo mode - update localStorage
      const currentTime = new Date().toISOString();
      const demoState: DemoCreditState = {
        credits: Math.max(0, newCredits),
        isDemo: true,
        lastRefresh: currentTime
      };
      
      localStorage.setItem(DEMO_CREDITS_KEY, JSON.stringify(demoState));
      setDemoCredits(Math.max(0, newCredits));
      
      console.log(`🎮 Demo credits updated: ${Math.max(0, newCredits)}`);
    }
  }, [isAuthenticated, user, updateUserCredits]);

  // Deduct credits (for question generation)
  const deductCredits = useCallback((amount: number): boolean => {
    const currentCredits = getCurrentCredits();
    
    if (currentCredits < amount) {
      console.warn(`❌ Insufficient credits: need ${amount}, have ${currentCredits}`);
      return false;
    }
    
    const newCredits = currentCredits - amount;
    updateCredits(newCredits);
    
    console.log(`💳 Credits deducted: -${amount}, remaining: ${newCredits}`);
    return true;
  }, [getCurrentCredits, updateCredits]);

  // Check if user has enough credits
  const hasEnoughCredits = useCallback((amount: number): boolean => {
    return getCurrentCredits() >= amount;
  }, [getCurrentCredits]);

  // Get demo mode status
  const isDemoMode = !isAuthenticated;

  // Refresh demo credits (reset to 10)
  const refreshDemoCredits = useCallback(() => {
    if (!isAuthenticated) {
      const currentTime = new Date().toISOString();
      const demoState: DemoCreditState = {
        credits: DEMO_CREDITS_DEFAULT,
        isDemo: true,
        lastRefresh: currentTime
      };
      
      localStorage.setItem(DEMO_CREDITS_KEY, JSON.stringify(demoState));
      setDemoCredits(DEMO_CREDITS_DEFAULT);
      
      console.log('🔄 Demo credits refreshed to 10');
    }
  }, [isAuthenticated]);

  return {
    credits: getCurrentCredits(),
    updateCredits,
    deductCredits,
    hasEnoughCredits,
    isDemoMode,
    isInitialized,
    refreshDemoCredits
  };
};
