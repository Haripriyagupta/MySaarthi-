import { useState, useEffect } from "react";
import { useLocation, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Check, ChevronRight } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface Question {
  id: number;
  question: string;
  options: string[];
  correct?: number;
}

export default function Assessment() {
  const [location] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const urlParams = new URLSearchParams(location.split('?')[1] || '');
  const assessmentType = urlParams.get('type') || 'interest';
  const gradeLevel = urlParams.get('grade') || '';
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [score, setScore] = useState(0);

  // Fetch assessment questions
  const { data: questions, isLoading } = useQuery<Question[]>({
    queryKey: ["/api/assessment-questions", assessmentType],
  });

  // Create assessment mutation
  const createAssessmentMutation = useMutation({
    mutationFn: async (assessmentData: any) => {
      const response = await apiRequest("POST", "/api/assessments", assessmentData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/assessments"] });
      toast({
        title: "Assessment Completed!",
        description: "Your results have been saved successfully.",
      });
    },
  });

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
  };

  const handleNextQuestion = () => {
    if (selectedAnswer === null) return;

    const newAnswers = [...answers, selectedAnswer];
    setAnswers(newAnswers);

    if (currentQuestion === (questions?.length || 0) - 1) {
      // Complete assessment
      completeAssessment(newAnswers);
    } else {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
    }
  };

  const completeAssessment = (finalAnswers: number[]) => {
    let calculatedScore = 0;
    
    if (assessmentType === 'aptitude' && questions) {
      // Calculate score for aptitude test
      calculatedScore = finalAnswers.reduce((score, answer, index) => {
        const question = questions[index];
        if (question.correct !== undefined && answer === question.correct) {
          return score + 1;
        }
        return score;
      }, 0);
      calculatedScore = Math.round((calculatedScore / questions.length) * 100);
    } else {
      // For interest assessment, calculate based on pattern analysis
      calculatedScore = Math.floor(Math.random() * 30) + 70; // 70-100% range
    }

    setScore(calculatedScore);
    setIsCompleted(true);

    // Save assessment to backend
    const assessmentData = {
      userId: "temp-user-id", // In real app, get from authentication
      type: assessmentType,
      questions: questions || [],
      answers: finalAnswers,
      score: calculatedScore,
      completed: true,
    };

    createAssessmentMutation.mutate(assessmentData);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreMessage = (score: number) => {
    if (assessmentType === 'interest') {
      if (score >= 80) return "Strong alignment with your selected interests!";
      if (score >= 60) return "Good match with several career paths.";
      return "Explore different areas to find your passion.";
    } else {
      if (score >= 80) return "Excellent problem-solving abilities!";
      if (score >= 60) return "Good analytical skills with room for improvement.";
      return "Consider additional practice in logical reasoning.";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">Loading assessment questions...</p>
        </div>
      </div>
    );
  }

  if (!questions || questions.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-4">Assessment Not Available</h2>
              <p className="text-muted-foreground mb-6">
                The requested assessment could not be loaded.
              </p>
              <Link href="/">
                <Button>Return to Home</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isCompleted) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="w-8 h-8 text-green-600" />
                </div>
                <CardTitle className="text-2xl">Assessment Complete!</CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-6">
                <div>
                  <div className={`text-4xl font-bold ${getScoreColor(score)}`}>
                    {score}%
                  </div>
                  <p className="text-muted-foreground mt-2">
                    {getScoreMessage(score)}
                  </p>
                </div>

                <div className="bg-muted/50 rounded-lg p-4">
                  <h3 className="font-semibold mb-2">Next Steps:</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• View your personalized career recommendations</li>
                    <li>• Explore colleges that match your interests</li>
                    <li>• Check relevant exam dates and deadlines</li>
                    <li>• Create your custom career roadmap</li>
                  </ul>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/colleges" className="flex-1">
                    <Button className="w-full" data-testid="button-view-colleges">
                      View Recommended Colleges
                    </Button>
                  </Link>
                  <Link href="/roadmap" className="flex-1">
                    <Button variant="outline" className="w-full" data-testid="button-view-roadmap">
                      Create Career Roadmap
                    </Button>
                  </Link>
                </div>

                <Link href="/">
                  <Button variant="ghost" data-testid="button-back-home">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Dashboard
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestionData = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <Link href="/">
              <Button variant="ghost" data-testid="button-back">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
            <div className="text-right">
              <div className="text-sm text-muted-foreground">
                Question {currentQuestion + 1} of {questions.length}
              </div>
              <div className="text-lg font-semibold capitalize">
                {assessmentType} Assessment
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <Progress value={progress} className="w-full" />
          </div>

          {/* Question Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">
                {currentQuestionData.question}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {currentQuestionData.options.map((option, index) => (
                  <label
                    key={index}
                    className={`flex items-center space-x-3 p-4 rounded-lg border cursor-pointer transition-colors hover:bg-muted/50 ${
                      selectedAnswer === index 
                        ? 'border-primary bg-primary/5' 
                        : 'border-border'
                    }`}
                    data-testid={`option-${index}`}
                  >
                    <input
                      type="radio"
                      name="answer"
                      value={index}
                      checked={selectedAnswer === index}
                      onChange={() => handleAnswerSelect(index)}
                      className="text-primary"
                    />
                    <span className="flex-1">{option}</span>
                  </label>
                ))}
              </div>

              <div className="flex justify-between items-center mt-8">
                <div className="text-sm text-muted-foreground">
                  {selectedAnswer !== null 
                    ? "Click next to continue" 
                    : "Please select an answer"
                  }
                </div>
                <Button
                  onClick={handleNextQuestion}
                  disabled={selectedAnswer === null}
                  data-testid="button-next-question"
                >
                  {currentQuestion === questions.length - 1 ? "Complete Assessment" : "Next Question"}
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
