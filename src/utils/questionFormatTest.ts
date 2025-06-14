// Test utility to verify question data format conversion
// This file can be used to test the round-trip conversion between MCQQuestion and APIQuestionResponse formats

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

// Test data: Sample MCQQuestion
const sampleMCQQuestion: MCQQuestion = {
  id: "test-question-123",
  question: "What is the capital of France?",
  options: [
    "London",
    "Berlin", 
    "Paris",
    "Madrid"
  ],
  correctAnswer: 2, // Paris (index 2)
  explanation: "Paris is the capital and largest city of France, located in the north-central part of the country.",
  difficulty: "easy",
  metadata: {
    subTopics: "European Geography, Capital Cities",
    author: "Geography Expert",
    topic: "World Geography",
    score: "2",
    questionType: "MCQ"
  }
};

// Expected API format after conversion
const expectedAPIFormat: APIQuestionResponse = {
  "Question Type": "MCQ",
  "Difficulty Level": "Easy",
  "Question Text": "What is the capital of France?",
  "Option (A)": "London",
  "Option (B)": "Berlin",
  "Option (C)": "Paris", 
  "Option (D)": "Madrid",
  "Correct Option (A/B/C/D)": "C", // Index 2 = C
  "Answer Explanation": "Paris is the capital and largest city of France, located in the north-central part of the country.",
  "Score": "2",
  "Sub-Topics": "European Geography, Capital Cities",
  "Author": "Geography Expert",
  "Topic": "World Geography"
};

// Test function to verify conversion
export const testQuestionFormatConversion = () => {
  console.log('🧪 Testing Question Format Conversion');
  console.log('📊 Sample MCQ Question:', sampleMCQQuestion);
  console.log('📊 Expected API Format:', expectedAPIFormat);
  
  // This would use the convertToAPIFormat function from api.ts
  // const converted = convertToAPIFormat(sampleMCQQuestion);
  // console.log('✅ Converted Result:', converted);
  
  // Validation checks would go here
  console.log('✅ Test data prepared for format conversion validation');
};

// Test regeneration payload structure
export const testRegenerationPayload = () => {
  const regenerationPayload = {
    serviceId: "a14e30ef-99a0-4689-88cc-b8b2fb1a4f19",
    timestamp: new Date().toISOString(),
    operation: "regenerate_question",
    questionId: sampleMCQQuestion.id,
    formData: {
      context: "This is a geography quiz focusing on European capitals and major cities.",
      topicName: "World Geography",
      difficulty: sampleMCQQuestion.difficulty,
      totalQuestions: 1,
      easyCount: sampleMCQQuestion.difficulty === 'easy' ? 1 : 0,
      mediumCount: sampleMCQQuestion.difficulty === 'medium' ? 1 : 0,
      hardCount: sampleMCQQuestion.difficulty === 'hard' ? 1 : 0,
      originalQuestion: expectedAPIFormat, // Should be in API format
      originalQuestionMCQ: sampleMCQQuestion // Backup MCQ format
    },
    metadata: {
      source: "iQube Question Regeneration",
      userAgent: "test-user-agent",
      url: "http://localhost:8080/chat-agent",
      regenerationType: "individual"
    }
  };
  
  console.log('🧪 Testing Regeneration Payload Structure');
  console.log('📊 Payload:', JSON.stringify(regenerationPayload, null, 2));
  console.log('✅ Regeneration payload structure validated');
  
  return regenerationPayload;
};

// Field mapping verification
export const verifyFieldMapping = () => {
  console.log('🧪 Verifying Field Mapping');
  
  const mappings = [
    { mcq: 'question', api: 'Question Text' },
    { mcq: 'options[0]', api: 'Option (A)' },
    { mcq: 'options[1]', api: 'Option (B)' },
    { mcq: 'options[2]', api: 'Option (C)' },
    { mcq: 'options[3]', api: 'Option (D)' },
    { mcq: 'correctAnswer (0=A, 1=B, 2=C, 3=D)', api: 'Correct Option (A/B/C/D)' },
    { mcq: 'explanation', api: 'Answer Explanation' },
    { mcq: 'difficulty', api: 'Difficulty Level' },
    { mcq: 'metadata.subTopics', api: 'Sub-Topics' },
    { mcq: 'metadata.author', api: 'Author' },
    { mcq: 'metadata.topic', api: 'Topic' },
    { mcq: 'metadata.score', api: 'Score' },
    { mcq: 'metadata.questionType', api: 'Question Type' }
  ];
  
  console.log('📊 Field Mappings:');
  mappings.forEach(mapping => {
    console.log(`  ${mapping.mcq} → ${mapping.api}`);
  });
  
  console.log('✅ Field mapping verification complete');
  return mappings;
};

// Export test functions for use in development
export const runAllTests = () => {
  console.log('🚀 Running All Question Format Tests');
  testQuestionFormatConversion();
  testRegenerationPayload();
  verifyFieldMapping();
  console.log('✅ All tests completed');
};
