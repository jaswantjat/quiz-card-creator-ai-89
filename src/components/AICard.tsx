
import { useState } from "react";
import { Sparkles, User, Cloud, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import QuestionGenerator from "./QuestionGenerator";
import { useToast } from "@/hooks/use-toast";

const AICard = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [questions, setQuestions] = useState<string[]>([]);
  const { toast } = useToast();

  const topics = [
    "Business & AI", "Technology & Innovation", "Education & Learning", 
    "Health & Wellness", "Science & Research", "Marketing & Sales", 
    "Leadership & Management", "Creative Writing", "Philosophy & Ethics", 
    "Environment & Sustainability"
  ];

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
    setIsGenerating(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const randomTopic = topics[Math.floor(Math.random() * topics.length)];
      const randomQuestions = generateQuestionsForTopic(randomTopic);
      setQuestions(randomQuestions);
      
      toast({
        title: "Questions Generated! ✨",
        description: `AI has generated thoughtful questions about ${randomTopic}.`
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

  return (
    <div className="relative w-full max-w-md mx-auto font-inter">
      {/* Main Card */}
      <div className="relative bg-gradient-to-br from-orange-500 via-orange-600 to-red-600 rounded-3xl p-8 shadow-2xl overflow-hidden">
        
        {/* Dark overlay for better contrast */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/20 via-black/10 to-black/30"></div>
        
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Geometric shapes similar to the reference */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-black/10 transform rotate-45 translate-x-16 -translate-y-16"></div>
          <div className="absolute top-8 right-8 w-24 h-24 bg-black/5 transform rotate-12"></div>
          
          {/* Floating decorative elements */}
          <div className="absolute top-6 right-12 w-2 h-2 bg-white/30 rounded-full"></div>
          <div className="absolute top-12 right-20 w-1.5 h-1.5 bg-white/40 rounded-full"></div>
          <div className="absolute top-16 right-16 w-1 h-1 bg-white/50 rounded-full"></div>
          <div className="absolute top-20 right-24 w-1.5 h-1.5 bg-white/30 rounded-full"></div>
        </div>

        {/* Most Popular Badge */}
        <div className="relative z-10 flex justify-end mb-6">
          <Badge className="bg-black/30 text-white border-white/20 px-3 py-1 text-sm font-medium">
            Most popular
          </Badge>
        </div>
        
        {/* Content */}
        <div className="relative z-10">
          {/* Logo/Icon */}
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mb-6">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          
          {/* Title */}
          <h1 className="font-space text-3xl font-bold text-white mb-4 leading-tight tracking-tight">
            iQube
          </h1>
          
          {/* Description */}
          <p className="text-white/90 text-base mb-8 leading-relaxed font-medium">
            Generates intelligent questions for various topics. Personalized guidance. Market insights.
          </p>

          {/* Price */}
          <div className="mb-8">
            <span className="text-white text-4xl font-bold">Free</span>
            <span className="text-white/70 text-lg ml-2">/forever</span>
          </div>

          {/* CTA Button */}
          <Button 
            onClick={handleGenerateQuestions} 
            disabled={isGenerating}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-4 px-6 rounded-2xl shadow-lg transition-all duration-300 border-0 text-lg mb-8"
          >
            {isGenerating ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Generating Questions...
              </div>
            ) : (
              "Generate AI Questions"
            )}
          </Button>

          {/* Features List */}
          <div className="space-y-4 mb-6">
            <div className="flex items-center gap-3 text-white/80">
              <User className="w-4 h-4" />
              <span className="text-sm">Unlimited question generation</span>
            </div>
            <div className="flex items-center gap-3 text-white/80">
              <Cloud className="w-4 h-4" />
              <span className="text-sm">AI-powered insights</span>
            </div>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-white/20"></div>
            <span className="text-white/50 text-xs uppercase tracking-wider">AI Features</span>
            <div className="flex-1 h-px bg-white/20"></div>
          </div>

          {/* Feature Tags */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Check className="w-4 h-4 text-white" />
              <span className="text-white text-sm">Intelligent questions</span>
              <Badge className="bg-black/20 text-white/80 border-white/10 text-xs px-2 py-0.5 ml-auto">
                AI-based
              </Badge>
            </div>
            <div className="flex items-center gap-3">
              <Check className="w-4 h-4 text-white" />
              <span className="text-white text-sm">Personalized guidance</span>
            </div>
            <div className="flex items-center gap-3">
              <Check className="w-4 h-4 text-white" />
              <span className="text-white text-sm">Topic insights</span>
            </div>
          </div>
        </div>
      </div>

      {/* Question Generator Results */}
      {questions.length > 0 && (
        <div className="mt-6">
          <QuestionGenerator questions={questions} />
        </div>
      )}
    </div>
  );
};

export default AICard;
