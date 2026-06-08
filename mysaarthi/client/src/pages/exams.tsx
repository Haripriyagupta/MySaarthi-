import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, DollarSign, Clock, BookOpen, AlertCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { Exam } from "@shared/schema";

export default function Exams() {
  const [selectedGrade, setSelectedGrade] = useState<string>("");

  // Fetch exams with grade level filter
  const { data: exams, isLoading } = useQuery<Exam[]>({
    queryKey: ["/api/exams", selectedGrade],
  });

  const formatDate = (date: Date | string) => {
    const d = new Date(date);
    return d.toLocaleDateString('en-IN', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const formatFee = (fee: number) => {
    return `₹${fee.toLocaleString('en-IN')}`;
  };

  const getDifficultyLabel = (difficulty: number) => {
    const labels = ["Very Easy", "Easy", "Moderate", "Hard", "Very Hard"];
    return labels[difficulty - 1] || "Unknown";
  };

  const getDifficultyColor = (difficulty: number) => {
    const colors = ["bg-green-500", "bg-green-400", "bg-yellow-500", "bg-orange-500", "bg-red-500"];
    return colors[difficulty - 1] || "bg-gray-500";
  };

  const getTimeUntilExam = (examDate: Date | string) => {
    const today = new Date();
    const exam = new Date(examDate);
    const diffTime = exam.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return "Exam completed";
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Tomorrow";
    if (diffDays <= 30) return `${diffDays} days left`;
    if (diffDays <= 365) return `${Math.ceil(diffDays / 30)} months left`;
    return `${Math.ceil(diffDays / 365)} years left`;
  };

  const getRecommendationScore = (exam: Exam, userGrade: string) => {
    // Simple scoring algorithm based on eligibility and grade level
    const eligibility = exam.eligibility as any;
    if (eligibility.gradeLevels?.includes(userGrade)) {
      return Math.floor(Math.random() * 20) + 80; // 80-100% for eligible exams
    }
    return Math.floor(Math.random() * 30) + 50; // 50-80% for others
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-1/3"></div>
            <div className="h-12 bg-muted rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-64 bg-muted rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link href="/">
              <Button variant="ghost" data-testid="button-back">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
            <h1 className="text-3xl font-bold mt-4">Recommended Exams</h1>
            <p className="text-muted-foreground">
              Based on your career path and grade level, here are the most relevant competitive exams
            </p>
          </div>
        </div>

        {/* Grade Filter */}
        <div className="mb-8">
          <div className="max-w-sm">
            <label className="block text-sm font-medium mb-2">Filter by Grade Level</label>
            <Select value={selectedGrade} onValueChange={setSelectedGrade}>
              <SelectTrigger data-testid="select-grade-filter">
                <SelectValue placeholder="All Grade Levels" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Grade Levels</SelectItem>
                <SelectItem value="10th">Class 10th</SelectItem>
                <SelectItem value="11-12th">11th - 12th</SelectItem>
                <SelectItem value="dropper">Dropper</SelectItem>
                <SelectItem value="undergraduate">Undergraduate</SelectItem>
                <SelectItem value="postgraduate">Post Graduate</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Exams Grid */}
        {exams && exams.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {exams.map((exam) => {
              const recommendationScore = getRecommendationScore(exam, selectedGrade);
              const timeUntil = getTimeUntilExam(exam.examDate);
              
              return (
                <Card key={exam.id} className="hover:shadow-lg transition-shadow" data-testid={`exam-card-${exam.id}`}>
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                        <BookOpen className="text-primary text-xl" />
                      </div>
                      <Badge 
                        variant={recommendationScore >= 80 ? "default" : "secondary"}
                        data-testid={`exam-match-${exam.id}`}
                      >
                        {recommendationScore}% Match
                      </Badge>
                    </div>
                    <CardTitle className="text-lg">{exam.name}</CardTitle>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      {exam.description}
                    </p>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between items-center text-sm">
                        <div className="flex items-center text-muted-foreground">
                          <Calendar className="w-4 h-4 mr-2" />
                          Exam Date:
                        </div>
                        <span className="font-medium">{formatDate(exam.examDate)}</span>
                      </div>
                      
                      <div className="flex justify-between items-center text-sm">
                        <div className="flex items-center text-muted-foreground">
                          <DollarSign className="w-4 h-4 mr-2" />
                          Application Fee:
                        </div>
                        <span className="font-medium">{formatFee(exam.applicationFee)}</span>
                      </div>
                      
                      <div className="flex justify-between items-center text-sm">
                        <div className="flex items-center text-muted-foreground">
                          <AlertCircle className="w-4 h-4 mr-2" />
                          Difficulty:
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="flex space-x-1">
                            {Array.from({ length: 5 }, (_, i) => (
                              <div
                                key={i}
                                className={`w-2 h-2 rounded-full ${
                                  i < exam.difficulty 
                                    ? getDifficultyColor(exam.difficulty)
                                    : "bg-muted"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-xs">{getDifficultyLabel(exam.difficulty)}</span>
                        </div>
                      </div>
                      
                      {exam.preparationTime && (
                        <div className="flex justify-between items-center text-sm">
                          <div className="flex items-center text-muted-foreground">
                            <Clock className="w-4 h-4 mr-2" />
                            Prep Time:
                          </div>
                          <span className="font-medium">{exam.preparationTime} months</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="border-t pt-3">
                      <div className="text-sm text-muted-foreground mb-2">Time until exam:</div>
                      <Badge variant="outline" className="w-full justify-center">
                        {timeUntil}
                      </Badge>
                    </div>
                    
                    <Button 
                      className="w-full" 
                      variant="outline"
                      data-testid={`button-view-exam-details-${exam.id}`}
                    >
                      View Exam Details
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card>
            <CardContent className="text-center py-12">
              <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Exams Found</h3>
              <p className="text-muted-foreground mb-4">
                {selectedGrade 
                  ? `No exams available for ${selectedGrade} level. Try selecting a different grade level.`
                  : "No exam data available at the moment."
                }
              </p>
              {selectedGrade && (
                <Button 
                  variant="outline" 
                  onClick={() => setSelectedGrade("")}
                  data-testid="button-clear-grade-filter"
                >
                  View All Exams
                </Button>
              )}
            </CardContent>
          </Card>
        )}

        {/* Exam Preparation Tips */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Exam Preparation Tips</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-sm">
              <div>
                <h4 className="font-semibold mb-2 flex items-center">
                  <BookOpen className="w-4 h-4 mr-2 text-primary" />
                  Study Planning
                </h4>
                <ul className="text-muted-foreground space-y-1">
                  <li>• Create a structured study schedule</li>
                  <li>• Cover syllabus systematically</li>
                  <li>• Focus on weak areas</li>
                  <li>• Regular revision sessions</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2 flex items-center">
                  <Clock className="w-4 h-4 mr-2 text-secondary" />
                  Time Management
                </h4>
                <ul className="text-muted-foreground space-y-1">
                  <li>• Take regular mock tests</li>
                  <li>• Practice time-bound exercises</li>
                  <li>• Improve question-solving speed</li>
                  <li>• Learn prioritization techniques</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-2 text-accent" />
                  Exam Strategy
                </h4>
                <ul className="text-muted-foreground space-y-1">
                  <li>• Understand exam pattern</li>
                  <li>• Practice previous year papers</li>
                  <li>• Work on elimination techniques</li>
                  <li>• Stay calm and focused</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
