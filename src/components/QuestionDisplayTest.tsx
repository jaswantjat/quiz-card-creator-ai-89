import React, { useState, useEffect } from 'react';
import { MCQQuestion } from '@/lib/api';
import ProgressiveQuestionDisplay from './ProgressiveQuestionDisplay';
import SequentialQuestionDisplay from './SequentialQuestionDisplay';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

/**
 * Test component to isolate and debug question display components
 * This helps identify if the issue is in the display components or state management
 */
const QuestionDisplayTest: React.FC = () => {
  const [testQuestions, setTestQuestions] = useState<MCQQuestion[]>([]);
  const [displayMode, setDisplayMode] = useState<'progressive' | 'sequential'>('progressive');

  // Mock test questions for debugging
  const mockQuestions: MCQQuestion[] = [
    {
      id: 'test-1',
      question: 'What is the primary purpose of React hooks?',
      options: [
        'To replace class components entirely',
        'To manage state and side effects in functional components',
        'To improve performance only',
        'To handle routing'
      ],
      correctAnswer: 1,
      explanation: 'React hooks allow functional components to use state and other React features without writing a class.',
      difficulty: 'easy',
      metadata: {
        questionType: 'MCQ',
        topic: 'React Fundamentals'
      }
    },
    {
      id: 'test-2',
      question: 'Which of the following is NOT a valid React hook?',
      options: [
        'useState',
        'useEffect',
        'useComponent',
        'useCallback'
      ],
      correctAnswer: 2,
      explanation: 'useComponent is not a valid React hook. The others are all built-in React hooks.',
      difficulty: 'medium',
      metadata: {
        questionType: 'MCQ',
        topic: 'React Hooks'
      }
    },
    {
      id: 'test-3',
      question: 'What is the purpose of the dependency array in useEffect?',
      options: [
        'To prevent the effect from running',
        'To control when the effect should re-run',
        'To pass data to the effect',
        'To handle errors in the effect'
      ],
      correctAnswer: 1,
      explanation: 'The dependency array controls when useEffect should re-run by comparing the current values with previous values.',
      difficulty: 'hard',
      metadata: {
        questionType: 'MCQ',
        topic: 'React Hooks'
      }
    }
  ];

  const mockLoadingState = {
    phase: 'complete' as const,
    questionsLoaded: testQuestions.length,
    totalExpected: 3,
    isLoading: false
  };

  const handleAddToQB = (questionId: string) => {
    console.log('🧪 Test: Add to QB clicked for question:', questionId);
  };

  const handleRegenerate = () => {
    console.log('🧪 Test: Regenerate clicked');
    setTestQuestions([]);
    setTimeout(() => setTestQuestions(mockQuestions), 1000);
  };

  const loadTestQuestions = () => {
    console.log('🧪 Loading test questions...');
    setTestQuestions([]);
    
    // Simulate progressive loading
    setTimeout(() => {
      console.log('🧪 Adding first question');
      setTestQuestions([mockQuestions[0]]);
    }, 500);
    
    setTimeout(() => {
      console.log('🧪 Adding second question');
      setTestQuestions(prev => [...prev, mockQuestions[1]]);
    }, 1500);
    
    setTimeout(() => {
      console.log('🧪 Adding third question');
      setTestQuestions(prev => [...prev, mockQuestions[2]]);
    }, 2500);
  };

  const loadAllQuestions = () => {
    console.log('🧪 Loading all questions at once');
    setTestQuestions(mockQuestions);
  };

  const clearQuestions = () => {
    console.log('🧪 Clearing all questions');
    setTestQuestions([]);
  };

  // Debug logging
  useEffect(() => {
    console.log('🧪 QuestionDisplayTest: Questions changed', {
      count: testQuestions.length,
      questions: testQuestions.map(q => ({ id: q.id, question: q.question.substring(0, 50) + '...' }))
    });
  }, [testQuestions]);

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>🧪 Question Display Component Test</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2 flex-wrap">
            <Button onClick={loadTestQuestions} variant="outline">
              Load Progressive (1→2→3)
            </Button>
            <Button onClick={loadAllQuestions} variant="outline">
              Load All At Once
            </Button>
            <Button onClick={clearQuestions} variant="outline">
              Clear Questions
            </Button>
          </div>
          
          <div className="flex gap-2">
            <Button 
              onClick={() => setDisplayMode('progressive')} 
              variant={displayMode === 'progressive' ? 'default' : 'outline'}
            >
              Progressive Display
            </Button>
            <Button 
              onClick={() => setDisplayMode('sequential')} 
              variant={displayMode === 'sequential' ? 'default' : 'outline'}
            >
              Sequential Display
            </Button>
          </div>
          
          <div className="text-sm text-gray-600">
            <strong>Current State:</strong> {testQuestions.length} questions loaded, 
            displaying with {displayMode} component
          </div>
        </CardContent>
      </Card>

      {/* Display Component Test */}
      {testQuestions.length > 0 && (
        <div className="border-2 border-dashed border-blue-300 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">
            Testing {displayMode === 'progressive' ? 'ProgressiveQuestionDisplay' : 'SequentialQuestionDisplay'}
          </h3>
          
          {displayMode === 'progressive' ? (
            <ProgressiveQuestionDisplay
              questions={testQuestions}
              loadingState={mockLoadingState}
              onAddToQB={handleAddToQB}
              onRegenerate={handleRegenerate}
            />
          ) : (
            <SequentialQuestionDisplay
              questions={testQuestions}
              onAddToQB={handleAddToQB}
              onRegenerate={handleRegenerate}
            />
          )}
        </div>
      )}
      
      {testQuestions.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No questions loaded. Click a button above to test the display components.
        </div>
      )}
    </div>
  );
};

export default QuestionDisplayTest;
