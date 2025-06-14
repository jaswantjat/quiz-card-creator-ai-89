# Auto-Scroll Feature Implementation

## Overview
The auto-scroll feature automatically scrolls users to the generated questions section when questions are successfully generated and displayed. This improves user experience by eliminating the need for manual scrolling to view the results.

## Implementation Details

### 1. Custom Hook: `useAutoScroll`
**Location**: `src/hooks/useAutoScroll.tsx`

#### Features:
- **Generic scroll functionality** with configurable options
- **Smooth scrolling animation** with customizable behavior
- **Offset support** for fixed headers or spacing
- **Delay support** for timing control
- **Error handling** with console logging
- **Browser compatibility** using `scrollIntoView` API

#### Specialized Hook: `useQuestionAutoScroll`
- Pre-configured for question generation use case
- Default offset of 80px for header clearance
- Default delay of 300ms for rendering completion
- Returns `questionsRef` for easy component integration

### 2. Progressive Question Display Integration
**Location**: `src/components/ProgressiveQuestionDisplay.tsx`

#### Implementation:
- **Trigger Condition**: Scrolls when first batch of questions is rendered
- **Detection Logic**: Uses `newQuestionIds.size === 0` to identify first render
- **Timing**: 800ms delay to ensure complete rendering
- **Ref Attachment**: Questions container has `questionsRef` for scroll targeting

#### Code Changes:
```typescript
// Added auto-scroll hook
const { scrollToQuestions, questionsRef } = useQuestionAutoScroll();

// Auto-scroll logic in useEffect
if (newQuestionIds.size === 0) {
  console.log('🔄 Auto-scroll: First questions rendered, scrolling to questions section');
  scrollToQuestions(undefined, 800);
}

// Ref attachment to container
<div className="space-y-6 animate-in fade-in-50 duration-500" ref={questionsRef}>
```

### 3. Sequential Question Display Integration
**Location**: `src/components/SequentialQuestionDisplay.tsx`

#### Implementation:
- **Trigger Condition**: Scrolls when questions are first loaded
- **Detection Logic**: Uses `hasScrolledToQuestions` state to prevent multiple scrolls
- **Timing**: 600ms delay for sequential display
- **Ref Attachment**: Main container has `questionsRef` for scroll targeting

#### Code Changes:
```typescript
// Added scroll state tracking
const [hasScrolledToQuestions, setHasScrolledToQuestions] = useState(false);
const { scrollToQuestions, questionsRef } = useQuestionAutoScroll();

// Auto-scroll logic
useEffect(() => {
  if (sortedQuestions.length > 0 && !hasScrolledToQuestions) {
    scrollToQuestions(undefined, 600);
    setHasScrolledToQuestions(true);
  }
}, [sortedQuestions.length, hasScrolledToQuestions, scrollToQuestions]);
```

## Configuration Options

### AutoScrollOptions Interface:
```typescript
interface AutoScrollOptions {
  behavior?: ScrollBehavior;     // 'smooth' | 'instant' | 'auto'
  block?: ScrollLogicalPosition; // 'start' | 'center' | 'end' | 'nearest'
  inline?: ScrollLogicalPosition;
  offset?: number;               // Pixels to offset from target
  delay?: number;                // Milliseconds to delay scroll
}
```

### Default Settings:
- **Behavior**: `'smooth'` for animated scrolling
- **Block**: `'start'` to align with top of viewport
- **Offset**: `80px` to account for headers
- **Delay**: `300-800ms` depending on component

## User Experience Benefits

1. **Automatic Navigation**: Users don't need to manually scroll to see results
2. **Smooth Animation**: Provides visual feedback and professional feel
3. **Proper Timing**: Waits for rendering completion to avoid jarring jumps
4. **Accessibility**: Uses standard browser APIs for compatibility
5. **Configurable**: Easy to adjust timing and behavior per use case

## Technical Considerations

### Timing Strategy:
- **Progressive Display**: 800ms delay to handle incremental rendering
- **Sequential Display**: 600ms delay for simpler single-batch loading
- **Rendering Safety**: Ensures DOM elements are fully rendered before scrolling

### Performance:
- **Minimal Impact**: Uses efficient browser APIs
- **Single Scroll**: Prevents multiple scroll events per session
- **Memory Efficient**: No heavy dependencies or complex state management

### Browser Compatibility:
- **Modern Browsers**: Uses `scrollIntoView` with smooth behavior
- **Fallback Support**: Graceful degradation for older browsers
- **Error Handling**: Console logging for debugging without breaking functionality

## Future Enhancements

1. **User Preference**: Allow users to disable auto-scroll
2. **Smart Detection**: Detect if user has already scrolled manually
3. **Intersection Observer**: Use for more precise scroll timing
4. **Animation Customization**: Allow different easing functions
5. **Mobile Optimization**: Adjust behavior for mobile devices

## Testing Recommendations

1. **Manual Testing**: Generate questions and verify smooth scroll behavior
2. **Timing Tests**: Ensure scroll happens after rendering completion
3. **Multiple Generations**: Verify scroll only happens on first generation
4. **Browser Testing**: Test across different browsers and devices
5. **Accessibility Testing**: Verify with screen readers and keyboard navigation

---

# Individual Question Regeneration Feature

## Overview
The individual question regeneration feature allows users to regenerate specific questions without affecting the entire question set. This is implemented using a dedicated webhook endpoint and provides real-time feedback through loading states.

## Implementation Details

### 1. Regeneration API Function
**Location**: `src/lib/api.ts`

#### Features:
- **Dedicated webhook endpoint** for individual question regeneration
- **Comprehensive payload** including original question context
- **Robust error handling** with timeout and abort controllers
- **Response parsing** with multiple format support
- **Metadata preservation** with regeneration tracking

#### Webhook Configuration:
- **URL**: `https://primary-production-1cd8.up.railway.app/webhook/a14e30ef-99a0-4689-88cc-b8b2fb1a4f19`
- **Service ID**: `a14e30ef-99a0-4689-88cc-b8b2fb1a4f19`
- **Method**: POST
- **Timeout**: 25 seconds (optimized for single question)

### 2. Enhanced Payload Structure with Proper Data Formatting
```json
{
  "serviceId": "a14e30ef-99a0-4689-88cc-b8b2fb1a4f19",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "operation": "regenerate_question",
  "questionId": "original-question-id",
  "formData": {
    "context": "original context",
    "topicName": "topic name",
    "difficulty": "easy|medium|hard",
    "totalQuestions": 1,
    "easyCount": 0|1,
    "mediumCount": 0|1,
    "hardCount": 0|1,
    "originalQuestion": {
      "Question Type": "MCQ",
      "Difficulty Level": "Easy|Medium|Hard",
      "Question Text": "original question text",
      "Option (A)": "first option",
      "Option (B)": "second option",
      "Option (C)": "third option",
      "Option (D)": "fourth option",
      "Correct Option (A/B/C/D)": "C",
      "Answer Explanation": "explanation text",
      "Score": "1",
      "Sub-Topics": "topic details",
      "Author": "author name",
      "Topic": "main topic"
    },
    "originalQuestionMCQ": {
      "id": "original-id",
      "question": "original question text",
      "options": ["option1", "option2", "option3", "option4"],
      "correctAnswer": 2,
      "explanation": "explanation text",
      "difficulty": "easy",
      "metadata": {}
    }
  },
  "metadata": {
    "source": "iQube Question Regeneration",
    "userAgent": "browser info",
    "url": "current page url",
    "regenerationType": "individual"
  }
}
```

### 3. Data Format Conversion
**New Feature**: Automatic conversion between internal MCQQuestion format and webhook APIQuestionResponse format.

#### Conversion Function: `convertToAPIFormat`
- **Input**: MCQQuestion object (internal format)
- **Output**: APIQuestionResponse object (webhook format)
- **Field Mappings**:
  - `question` → `"Question Text"`
  - `options[0-4]` → `"Option (A)"` through `"Option (E)"`
  - `correctAnswer` (0-4) → `"Correct Option (A/B/C/D)"` (A-E)
  - `explanation` → `"Answer Explanation"`
  - `difficulty` → `"Difficulty Level"` (capitalized)
  - `metadata.subTopics` → `"Sub-Topics"`
  - `metadata.author` → `"Author"`
  - `metadata.topic` → `"Topic"`
  - `metadata.score` → `"Score"`
  - `metadata.questionType` → `"Question Type"`

### 3. UI Loading States
**Components Updated**:
- `ProgressiveQuestionDisplay.tsx`
- `SequentialQuestionDisplay.tsx`

#### Loading State Features:
- **Individual question tracking** using `regeneratingQuestionIds` Set
- **Button state changes** with spinner animation and disabled state
- **Visual feedback** with color changes and loading text
- **Prevents multiple regenerations** of the same question

#### Button States:
- **Normal**: "Regenerate" with static icon
- **Loading**: "Regenerating..." with spinning icon and disabled state
- **Error**: Returns to normal state with error toast

### 4. Enhanced Response Parsing
**Location**: `src/lib/api.ts`

#### Implementation:
- **Reuses existing transformation functions** (`transformAPIResponse`, `transformGenericResponse`)
- **Multiple response format support** (direct array, nested questions, data.questions)
- **Fallback parsing** with comprehensive error handling
- **Metadata preservation** with regeneration tracking
- **Consistent question structure** regardless of webhook response format

#### Response Processing Flow:
1. **Webhook response received** in various possible formats
2. **Format detection** using existing logic patterns
3. **Transformation applied** using proven conversion functions
4. **Metadata enhancement** with regeneration tracking
5. **Question validation** ensuring proper structure
6. **UI replacement** with seamlessly converted question

### 5. State Management
**Location**: `src/pages/ChatAgent.tsx`

#### Implementation:
- **Regenerating questions tracking** using React state
- **Question replacement logic** maintaining array order
- **Error handling** with user-friendly messages
- **Success feedback** with toast notifications

## User Experience Flow

1. **User clicks "Regenerate"** on any question card
2. **Button shows loading state** immediately with spinner
3. **Webhook request sent** with original question context
4. **Loading state maintained** until response received
5. **Question replaced** in-place with new content
6. **Success notification** shown to user
7. **Button returns to normal** state

## Error Handling

### Network Errors:
- **Timeout handling**: 25-second timeout with clear error message
- **Connection failures**: Network error detection and user notification
- **Invalid responses**: JSON parsing error handling

### Webhook Errors:
- **HTTP error codes**: Status code validation and error extraction
- **Malformed responses**: Response structure validation
- **Missing data**: Fallback error messages for incomplete responses

### UI Error States:
- **Toast notifications**: Clear error messages with descriptions
- **Button state reset**: Returns to normal state after errors
- **Console logging**: Detailed error information for debugging

## Technical Considerations

### Performance:
- **Individual requests**: Only regenerates specific questions
- **State optimization**: Minimal re-renders using React.memo
- **Memory efficiency**: Proper cleanup of loading states

### Rate Limiting:
- **Duplicate prevention**: Blocks multiple regenerations of same question
- **User feedback**: Clear indication when regeneration is in progress
- **Graceful handling**: No error states for duplicate attempts

### Compatibility:
- **Auto-scroll integration**: Doesn't interfere with scroll functionality
- **Progressive loading**: Works with both display modes
- **Responsive design**: Loading states work on all screen sizes

## Future Enhancements

1. **Batch regeneration**: Allow multiple question regeneration
2. **Regeneration history**: Track and display regeneration attempts
3. **Custom prompts**: Allow users to specify regeneration requirements
4. **A/B comparison**: Show original vs regenerated question side-by-side
5. **Regeneration analytics**: Track regeneration success rates and patterns
