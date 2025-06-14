import { useCallback, useRef } from 'react';

interface AutoScrollOptions {
  behavior?: ScrollBehavior;
  block?: ScrollLogicalPosition;
  inline?: ScrollLogicalPosition;
  offset?: number;
  delay?: number;
}

interface UseAutoScrollReturn {
  scrollToElement: (element: HTMLElement | null, options?: AutoScrollOptions) => void;
  scrollToRef: (ref: React.RefObject<HTMLElement>, options?: AutoScrollOptions) => void;
  elementRef: React.RefObject<HTMLDivElement>;
}

/**
 * Custom hook for smooth auto-scrolling functionality
 * Provides utilities for scrolling to elements with configurable options
 */
export const useAutoScroll = (): UseAutoScrollReturn => {
  const elementRef = useRef<HTMLDivElement>(null);

  const scrollToElement = useCallback((
    element: HTMLElement | null, 
    options: AutoScrollOptions = {}
  ) => {
    if (!element) {
      console.warn('🔄 AutoScroll: No element provided for scrolling');
      return;
    }

    const {
      behavior = 'smooth',
      block = 'start',
      inline = 'nearest',
      offset = 0,
      delay = 0
    } = options;

    const performScroll = () => {
      try {
        // Calculate scroll position with offset
        const elementRect = element.getBoundingClientRect();
        const scrollTop = window.pageYOffset + elementRect.top - offset;

        // Use scrollIntoView for better browser compatibility
        element.scrollIntoView({
          behavior,
          block,
          inline
        });

        // Apply offset if specified
        if (offset > 0) {
          setTimeout(() => {
            window.scrollTo({
              top: scrollTop,
              behavior
            });
          }, 100); // Small delay to ensure scrollIntoView completes
        }

        console.log('✅ AutoScroll: Successfully scrolled to element', {
          elementTag: element.tagName,
          elementClass: element.className,
          behavior,
          block,
          offset
        });
      } catch (error) {
        console.error('❌ AutoScroll: Error during scroll operation:', error);
      }
    };

    if (delay > 0) {
      setTimeout(performScroll, delay);
    } else {
      performScroll();
    }
  }, []);

  const scrollToRef = useCallback((
    ref: React.RefObject<HTMLElement>, 
    options: AutoScrollOptions = {}
  ) => {
    scrollToElement(ref.current, options);
  }, [scrollToElement]);

  return {
    scrollToElement,
    scrollToRef,
    elementRef
  };
};

/**
 * Hook specifically for question generation auto-scroll
 * Pre-configured with optimal settings for the question display
 */
export const useQuestionAutoScroll = () => {
  const { scrollToElement, scrollToRef, elementRef } = useAutoScroll();

  const scrollToQuestions = useCallback((
    element?: HTMLElement | null,
    customDelay?: number
  ) => {
    const targetElement = element || elementRef.current;
    
    scrollToElement(targetElement, {
      behavior: 'smooth',
      block: 'start',
      offset: 80, // Account for any fixed headers
      delay: customDelay ?? 300 // Default delay to ensure rendering is complete
    });
  }, [scrollToElement, elementRef]);

  return {
    scrollToQuestions,
    questionsRef: elementRef,
    scrollToElement,
    scrollToRef
  };
};
