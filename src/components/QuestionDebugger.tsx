import React from 'react';
import { MCQQuestion } from '@/lib/api';

interface QuestionDebuggerProps {
  questions: MCQQuestion[];
  isVisible?: boolean;
}

/**
 * Debug component to help verify sequential question display
 * Shows question count and IDs for troubleshooting
 */
const QuestionDebugger: React.FC<QuestionDebuggerProps> = ({ 
  questions, 
  isVisible = process.env.NODE_ENV === 'development' 
}) => {
  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-black/80 text-white p-4 rounded-lg text-xs font-mono z-50 max-w-sm">
      <div className="font-bold text-green-400 mb-2">🐛 Question Debugger</div>
      <div className="space-y-1">
        <div>
          <span className="text-blue-400">Count:</span> {questions.length}
        </div>
        <div>
          <span className="text-blue-400">IDs:</span>
        </div>
        <div className="max-h-32 overflow-y-auto">
          {questions.length === 0 ? (
            <div className="text-red-400">No questions</div>
          ) : (
            questions.map((q, index) => (
              <div key={q.id} className="text-gray-300">
                {index + 1}. {q.id}
              </div>
            ))
          )}
        </div>
        <div className="pt-2 border-t border-gray-600">
          <span className="text-yellow-400">Status:</span>{' '}
          {questions.length === 0 ? (
            <span className="text-red-400">Empty</span>
          ) : questions.length === 1 ? (
            <span className="text-yellow-400">Single</span>
          ) : (
            <span className="text-green-400">Multiple ✓</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuestionDebugger;
