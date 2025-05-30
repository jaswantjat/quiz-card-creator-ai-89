import { useState } from "react";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import QuestionGenerator from "./QuestionGenerator";
import { useToast } from "@/hooks/use-toast";
const AICard = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [questions, setQuestions] = useState<string[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<string>("");
  const {
    toast
  } = useToast();
  const topics = ["Business & AI", "Technology & Innovation", "Education & Learning", "Health & Wellness", "Science & Research", "Marketing & Sales", "Leadership & Management", "Creative Writing", "Philosophy & Ethics", "Environment & Sustainability"];
  const generateQuestionsForTopic = (topic: string) => {
    const questionSets = {
      "Business & AI": ["What are the key factors to consider when implementing AI in business?", "How can machine learning improve customer experience?", "What ethical considerations should guide AI development in business?", "How do you measure the ROI of AI implementations?", "What are the emerging trends in artificial intelligence for business?"],
      "Technology & Innovation": ["How is emerging technology reshaping traditional industries?", "What role does innovation play in competitive advantage?", "How can organizations foster a culture of technological innovation?", "What are the challenges of digital transformation?", "How do you balance innovation with security concerns?"],
      "Education & Learning": ["How can technology enhance personalized learning experiences?", "What are the most effective methods for skill development?", "How do you create engaging educational content?", "What role does feedback play in the learning process?", "How can we measure learning effectiveness?"],
      "Health & Wellness": ["What are the key components of a holistic wellness approach?", "How can technology improve healthcare accessibility?", "What role does mental health play in overall wellness?", "How can we promote preventive healthcare practices?", "What are the challenges in healthcare innovation?"],
      "Science & Research": ["What methodologies ensure research reliability and validity?", "How do you approach interdisciplinary research collaboration?", "What are the ethical considerations in scientific research?", "How can research findings be effectively communicated to the public?", "What role does peer review play in scientific advancement?"],
      "Marketing & Sales": ["How has digital marketing transformed customer engagement?", "What are the key metrics for measuring marketing success?", "How do you build authentic brand relationships?", "What role does data analytics play in sales strategies?", "How can businesses adapt to changing consumer behaviors?"],
      "Leadership & Management": ["What qualities define effective leadership in the modern workplace?", "How do you manage and motivate remote teams?", "What are the challenges of organizational change management?", "How can leaders foster innovation within their teams?", "What role does emotional intelligence play in leadership?"],
      "Creative Writing": ["What techniques help develop compelling characters?", "How do you maintain consistency in world-building?", "What are effective methods for overcoming writer's block?", "How do you balance plot development with character growth?", "What role does research play in creative writing?"],
      "Philosophy & Ethics": ["How do ethical frameworks guide decision-making?", "What is the relationship between individual rights and collective good?", "How do cultural perspectives influence ethical reasoning?", "What are the philosophical implications of artificial intelligence?", "How do we navigate moral dilemmas in complex situations?"],
      "Environment & Sustainability": ["What are the most effective strategies for environmental conservation?", "How can businesses integrate sustainability into their operations?", "What role does individual action play in environmental protection?", "How do we balance economic growth with environmental responsibility?", "What are the challenges of implementing renewable energy solutions?"]
    };
    const topicQuestions = questionSets[topic as keyof typeof questionSets] || questionSets["Business & AI"];
    return topicQuestions.sort(() => 0.5 - Math.random()).slice(0, 3);
  };
  const handleGenerateQuestions = async () => {
    if (!selectedTopic) {
      toast({
        title: "Please select a topic",
        description: "Choose a topic to generate relevant questions.",
        variant: "destructive"
      });
      return;
    }
    setIsGenerating(true);
    try {
      // Simulate AI generation with realistic delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      const randomQuestions = generateQuestionsForTopic(selectedTopic);
      setQuestions(randomQuestions);
      toast({
        title: "Questions Generated! ✨",
        description: `AI has generated thoughtful questions about ${selectedTopic}.`
      });
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "Please try again in a moment.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };
  return <div className="relative w-full font-inter">
      {/* Main Card */}
      <div className="relative bg-gradient-to-br from-orange-500 via-orange-600 to-red-600 rounded-3xl p-10 shadow-2xl overflow-hidden border border-orange-200/20">
        
        {/* Dark overlay for better text contrast */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/10 via-black/5 to-black/20"></div>
        
        {/* Floating Decorative Elements with Elegant Animations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Floating Stars with Smooth Movement */}
          <div className="absolute top-8 right-12 w-3 h-3 bg-white/30 rounded-full animate-[float_6s_ease-in-out_infinite]" />
          <div className="absolute top-16 right-24 w-2 h-2 bg-white/20 rounded-full animate-[float_8s_ease-in-out_infinite_1s]" />
          <div className="absolute top-12 right-8 w-1.5 h-1.5 bg-white/25 rounded-full animate-[float_7s_ease-in-out_infinite_2s]" />
          
          {/* Star Shapes with Elegant Rotation */}
          <div className="absolute top-10 right-16 text-white/25 animate-[rotate_20s_linear_infinite]">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="transform-gpu">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          </div>
          
          <div className="absolute top-20 right-32 text-white/20 animate-[rotate_25s_linear_infinite_reverse]">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="transform-gpu">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          </div>

          {/* Large Star with Subtle Scale Animation */}
          <div className="absolute top-16 right-20 text-white/15 animate-[breathe_4s_ease-in-out_infinite]">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" className="transform-gpu">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          </div>

          {/* Additional floating dots with gentle drift */}
          <div className="absolute top-24 right-14 w-2 h-2 bg-white/20 rounded-full animate-[drift_10s_ease-in-out_infinite]" />
          <div className="absolute top-28 right-28 w-1.5 h-1.5 bg-white/25 rounded-full animate-[drift_12s_ease-in-out_infinite_3s]" />
        </div>
        
        {/* Content */}
        <div className="relative z-10">
          {/* Main Title */}
          <h1 className="font-space text-5xl font-bold text-white mb-4 leading-tight tracking-tight">
            iQube
          </h1>
          
          {/* Subtitle */}
          <p className="text-white/90 text-lg mb-8 leading-relaxed font-inter font-medium">
            Generates intelligent questions for various topics.
          </p>

          {/* Topic Selection */}
          <div className="mb-6">
            
            <Select value={selectedTopic} onValueChange={setSelectedTopic}>
              <SelectTrigger className="bg-white/20 backdrop-blur-sm border-white/30 text-white placeholder:text-white/70 focus:bg-white/30">
                <SelectValue placeholder="Choose a topic..." />
              </SelectTrigger>
              <SelectContent>
                {topics.map(topic => <SelectItem key={topic} value={topic}>
                    {topic}
                  </SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          {/* Generate Button */}
          <Button onClick={handleGenerateQuestions} disabled={isGenerating} className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white font-semibold py-4 px-8 rounded-2xl shadow-lg transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed border border-white/30 font-inter">
            {isGenerating ? <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Generating Questions...
              </div> : <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                Generate AI Questions
              </div>}
          </Button>
        </div>
      </div>

      {/* Question Generator Results */}
      {questions.length > 0 && <div className="mt-6">
          <QuestionGenerator questions={questions} />
        </div>}
    </div>;
};
export default AICard;