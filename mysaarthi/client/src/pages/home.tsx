import { useState } from "react";
import { Link } from "wouter";
import { GraduationCap, Menu, X, BarChart3, Heart, Brain, Building2, ClipboardList, Route, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import Chatbot from "@/components/chatbot";
import { useQuery } from "@tanstack/react-query";

const gradeOptions = [
  { value: "10th", label: "Class 10th" },
  { value: "11-12th", label: "11th - 12th" },
  { value: "dropper", label: "Dropper" },
  { value: "undergraduate", label: "Undergraduate" },
  { value: "postgraduate", label: "Post Graduate" }
];

export default function Home() {
  const [selectedGrade, setSelectedGrade] = useState<string>("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Fetch colleges data for dashboard
  const { data: colleges } = useQuery({
    queryKey: ["/api/colleges"],
    enabled: false // Only fetch when needed
  });

  // Fetch exams data for dashboard
  const { data: exams } = useQuery({
    queryKey: ["/api/exams"],
    enabled: false
  });

  const handleGradeSelection = (grade: string) => {
    setSelectedGrade(grade);
  };

  const handleStartAssessment = () => {
    if (!selectedGrade) {
      alert("Please select your grade level first");
      return;
    }
    // Navigate to assessment page with grade level
    window.location.href = `/assessment?grade=${selectedGrade}`;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <GraduationCap className="text-primary-foreground text-xl" />
              </div>
              <span className="text-2xl font-bold text-primary">MySaarthi</span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/" className="text-muted-foreground hover:text-primary transition-colors">
                Dashboard
              </Link>
              <Link href="/assessment" className="text-muted-foreground hover:text-primary transition-colors">
                Assessment
              </Link>
              <Link href="/colleges" className="text-muted-foreground hover:text-primary transition-colors">
                Colleges
              </Link>
              <Link href="/exams" className="text-muted-foreground hover:text-primary transition-colors">
                Exams
              </Link>
              <Link href="/roadmap" className="text-muted-foreground hover:text-primary transition-colors">
                Roadmap
              </Link>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button data-testid="button-login">Login</Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="md:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                data-testid="button-mobile-menu"
              >
                {mobileMenuOpen ? <X /> : <Menu />}
              </Button>
            </div>
          </nav>
          
          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-4 pb-4 border-t border-border">
              <div className="flex flex-col space-y-2 mt-4">
                <Link href="/" className="text-muted-foreground hover:text-primary transition-colors py-2">
                  Dashboard
                </Link>
                <Link href="/assessment" className="text-muted-foreground hover:text-primary transition-colors py-2">
                  Assessment
                </Link>
                <Link href="/colleges" className="text-muted-foreground hover:text-primary transition-colors py-2">
                  Colleges
                </Link>
                <Link href="/exams" className="text-muted-foreground hover:text-primary transition-colors py-2">
                  Exams
                </Link>
                <Link href="/roadmap" className="text-muted-foreground hover:text-primary transition-colors py-2">
                  Roadmap
                </Link>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="gradient-hero py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Find Your Perfect <br />Career Path
          </h1>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Get personalized career guidance, college recommendations, and exam strategies 
            tailored to your grade level and interests.
          </p>
          
          {/* Grade Level Selection */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 max-w-4xl mx-auto mb-8">
            <h3 className="text-white text-lg font-semibold mb-4">Select Your Current Grade Level</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {gradeOptions.map((grade) => (
                <button
                  key={grade.value}
                  className={`bg-white/20 hover:bg-white/30 text-white border border-white/30 rounded-lg py-3 px-4 transition-all hover:scale-105 ${
                    selectedGrade === grade.value ? 'bg-white/40 ring-2 ring-white' : ''
                  }`}
                  onClick={() => handleGradeSelection(grade.value)}
                  data-testid={`button-grade-${grade.value}`}
                >
                  <div className="text-sm font-medium">{grade.label}</div>
                </button>
              ))}
            </div>
          </div>
          
          <Button 
            size="lg" 
            className="bg-accent hover:bg-accent/90 text-accent-foreground px-8 py-4 text-lg font-semibold shadow-lg"
            onClick={handleStartAssessment}
            data-testid="button-start-assessment"
          >
            Start Your Career Assessment
            <BarChart3 className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Dashboard Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Your Progress Dashboard</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Track your career exploration journey and see your achievements</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {/* Assessment Progress */}
            <Card data-testid="card-assessment-progress">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-card-foreground">Assessment Progress</h3>
                  <BarChart3 className="text-primary text-xl" />
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Interest Assessment</span>
                    <span className="text-secondary font-medium">0%</span>
                  </div>
                  <Progress value={0} className="w-full" />
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Aptitude Test</span>
                    <span className="text-secondary font-medium">0%</span>
                  </div>
                  <Progress value={0} className="w-full" />
                </div>
              </CardContent>
            </Card>
            
            {/* Recommended Paths */}
            <Card data-testid="card-recommended-paths">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-card-foreground">Recommended Paths</h3>
                  <Route className="text-accent text-xl" />
                </div>
                <div className="space-y-3">
                  <div className="text-center text-muted-foreground text-sm">
                    Complete your assessment to get personalized recommendations
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Upcoming Deadlines */}
            <Card data-testid="card-upcoming-deadlines">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-card-foreground">Upcoming Deadlines</h3>
                  <ClipboardList className="text-accent text-xl" />
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium text-sm">JEE Main Registration</div>
                      <div className="text-xs text-muted-foreground">Dec 15, 2024</div>
                    </div>
                    <Badge variant="secondary" className="text-xs">5 days</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium text-sm">NEET Application</div>
                      <div className="text-xs text-muted-foreground">Jan 20, 2025</div>
                    </div>
                    <Badge variant="outline" className="text-xs">40 days</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Assessment Preview Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Career Assessment</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Discover your interests and aptitudes through our comprehensive assessment
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Interest Assessment */}
            <Card className="assessment-card" data-testid="card-interest-assessment">
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Heart className="text-primary text-2xl" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Interest Assessment</h3>
                  <p className="text-muted-foreground text-sm">
                    Explore what subjects and activities excite you most
                  </p>
                </div>
                
                <div className="space-y-4 mb-6">
                  <div className="text-sm text-muted-foreground">Sample Question:</div>
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <p className="font-medium mb-4">
                      Which activity would you find most engaging?
                    </p>
                    <div className="space-y-2">
                      <label className="flex items-center space-x-3 cursor-pointer hover:bg-muted/30 p-2 rounded">
                        <input type="radio" name="interest-q1" className="text-primary" />
                        <span className="text-sm">Building websites and apps</span>
                      </label>
                      <label className="flex items-center space-x-3 cursor-pointer hover:bg-muted/30 p-2 rounded">
                        <input type="radio" name="interest-q1" className="text-primary" />
                        <span className="text-sm">Analyzing business data</span>
                      </label>
                      <label className="flex items-center space-x-3 cursor-pointer hover:bg-muted/30 p-2 rounded">
                        <input type="radio" name="interest-q1" className="text-primary" />
                        <span className="text-sm">Teaching others</span>
                      </label>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="text-sm text-muted-foreground">
                    Progress: <span className="font-medium text-primary">0 of 5</span>
                  </div>
                  <Link href="/assessment?type=interest">
                    <Button data-testid="button-start-interest-assessment">
                      Start Assessment
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
            
            {/* Aptitude Assessment */}
            <Card className="assessment-card" data-testid="card-aptitude-assessment">
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Brain className="text-secondary text-2xl" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Aptitude Assessment</h3>
                  <p className="text-muted-foreground text-sm">
                    Test your logical reasoning and problem-solving abilities
                  </p>
                </div>
                
                <div className="space-y-4 mb-6">
                  <div className="text-sm text-muted-foreground">Sample Question:</div>
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <p className="font-medium mb-4">
                      If 2x + 5 = 13, what is the value of x?
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      <label className="flex items-center space-x-3 cursor-pointer hover:bg-muted/30 p-2 rounded">
                        <input type="radio" name="aptitude-q1" className="text-secondary" />
                        <span className="text-sm">x = 4</span>
                      </label>
                      <label className="flex items-center space-x-3 cursor-pointer hover:bg-muted/30 p-2 rounded">
                        <input type="radio" name="aptitude-q1" className="text-secondary" />
                        <span className="text-sm">x = 6</span>
                      </label>
                      <label className="flex items-center space-x-3 cursor-pointer hover:bg-muted/30 p-2 rounded">
                        <input type="radio" name="aptitude-q1" className="text-secondary" />
                        <span className="text-sm">x = 8</span>
                      </label>
                      <label className="flex items-center space-x-3 cursor-pointer hover:bg-muted/30 p-2 rounded">
                        <input type="radio" name="aptitude-q1" className="text-secondary" />
                        <span className="text-sm">x = 9</span>
                      </label>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="text-sm text-muted-foreground">
                    Progress: <span className="font-medium text-secondary">0 of 5</span>
                  </div>
                  <Link href="/assessment?type=aptitude">
                    <Button variant="secondary" data-testid="button-start-aptitude-assessment">
                      Start Assessment
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <GraduationCap className="text-primary-foreground" />
                </div>
                <span className="text-xl font-bold text-primary">MySaarthi</span>
              </div>
              <p className="text-muted-foreground text-sm">
                Your trusted partner in career guidance and educational planning for Indian students.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Services</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/assessment" className="hover:text-primary transition-colors">Career Assessment</Link></li>
                <li><Link href="/colleges" className="hover:text-primary transition-colors">College Search</Link></li>
                <li><Link href="/exams" className="hover:text-primary transition-colors">Exam Guidance</Link></li>
                <li><Link href="/roadmap" className="hover:text-primary transition-colors">Career Roadmap</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Resources</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">Study Materials</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Scholarship Info</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Success Stories</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Blog</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Contact</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center"><span className="mr-2">📧</span>support@mysaarthi.com</li>
                <li className="flex items-center"><span className="mr-2">📞</span>+91 8839XXXXXX</li>
                <li className="flex items-center"><span className="mr-2">📍</span>Indore, India</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-border pt-8 mt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 MySaarthi. All rights reserved. | Privacy Policy | Terms of Service</p>
          </div>
        </div>
      </footer>

      {/* Chatbot */}
      <Chatbot />
    </div>
  );
}
