import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Download, Edit, CheckCircle, Clock, Target, TrendingUp } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { CareerPath } from "@shared/schema";

interface RoadmapPhase {
  phase: string;
  years: string;
  milestones: string[];
  status?: 'completed' | 'current' | 'upcoming';
}

export default function Roadmap() {
  const [selectedField, setSelectedField] = useState<string>("STEM");
  const [selectedCareerPath, setSelectedCareerPath] = useState<string>("");

  // Fetch career paths
  const { data: careerPaths, isLoading } = useQuery<CareerPath[]>({
    queryKey: ["/api/career-paths", selectedField],
  });

  // Get selected career path data
  const selectedPath = careerPaths?.find(path => path.id === selectedCareerPath) || careerPaths?.[0];

  // Default roadmap phases if no career path selected
  const defaultRoadmapPhases: RoadmapPhase[] = [
    {
      phase: "Foundation Phase",
      years: "Year 1-2",
      milestones: ["Complete 12th Grade", "Clear Entrance Exams", "College Admission"],
      status: 'completed'
    },
    {
      phase: "Education Phase",
      years: "Year 3-6",
      milestones: ["Bachelor's Degree", "Internships", "Project Work"],
      status: 'current'
    },
    {
      phase: "Career Launch",
      years: "Year 7-8",
      milestones: ["First Job", "Skill Development", "Professional Network"],
      status: 'upcoming'
    },
    {
      phase: "Growth & Leadership",
      years: "Year 9-12",
      milestones: ["Promotion", "Team Leadership", "Specialization"],
      status: 'upcoming'
    }
  ];

  const roadmapPhases = selectedPath?.roadmap as RoadmapPhase[] || defaultRoadmapPhases;

  const getPhaseIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'current':
        return <Clock className="w-4 h-4 text-blue-600" />;
      default:
        return <Target className="w-4 h-4 text-gray-400" />;
    }
  };

  const getPhaseColor = (status: string) => {
    switch (status) {
      case 'completed':
        return "bg-green-600";
      case 'current':
        return "bg-blue-600";
      default:
        return "bg-gray-300";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-1/3"></div>
            <div className="h-12 bg-muted rounded w-1/4"></div>
            <div className="space-y-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-muted rounded"></div>
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
            <h1 className="text-3xl font-bold mt-4">Your Career Roadmap</h1>
            <p className="text-muted-foreground">
              Visualize your 5-10 year career journey with personalized milestones and goals
            </p>
          </div>
        </div>

        {/* Career Path Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div>
            <label className="block text-sm font-medium mb-2">Select Field</label>
            <Select value={selectedField} onValueChange={setSelectedField}>
              <SelectTrigger data-testid="select-field">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="STEM">STEM</SelectItem>
                <SelectItem value="Medical">Medical</SelectItem>
                <SelectItem value="Commerce">Commerce</SelectItem>
                <SelectItem value="Arts">Arts</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Select Career Path</label>
            <Select value={selectedCareerPath} onValueChange={setSelectedCareerPath}>
              <SelectTrigger data-testid="select-career-path">
                <SelectValue placeholder="Choose a career path" />
              </SelectTrigger>
              <SelectContent>
                {careerPaths?.map((path) => (
                  <SelectItem key={path.id} value={path.id}>
                    {path.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Career Overview Card */}
        {selectedPath && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="w-5 h-5 mr-2" />
                {selectedPath.title} - Career Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h4 className="font-semibold mb-2">Field</h4>
                  <p className="text-muted-foreground">{selectedPath.field}</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Average Salary Range</h4>
                  <div className="space-y-1 text-sm">
                    <div>Entry: ₹{((selectedPath.averageSalary as any).entry / 100000).toFixed(1)}L</div>
                    <div>Mid: ₹{((selectedPath.averageSalary as any).mid / 100000).toFixed(1)}L</div>
                    <div>Senior: ₹{((selectedPath.averageSalary as any).senior / 100000).toFixed(1)}L</div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Growth Prospects</h4>
                  <p className="text-muted-foreground text-sm">{selectedPath.growthProspects}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Timeline Roadmap */}
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-8 md:left-1/2 transform md:-translate-x-1/2 w-1 h-full bg-border rounded"></div>
            
            {/* Timeline Items */}
            <div className="space-y-8">
              {roadmapPhases.map((phase, index) => (
                <div key={index} className="relative flex items-center" data-testid={`roadmap-phase-${index}`}>
                  {/* Timeline Node */}
                  <div className={`absolute left-8 md:left-1/2 transform -translate-x-1/2 w-4 h-4 ${getPhaseColor(phase.status || 'upcoming')} rounded-full border-4 border-background z-10`}></div>
                  
                  {/* Content Card */}
                  <div className={`ml-20 md:ml-0 ${index % 2 === 0 ? 'md:w-1/2 md:pr-8 md:text-right' : 'md:w-1/2 md:pl-8 md:ml-auto'}`}>
                    <Card className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-2">
                            {getPhaseIcon(phase.status || 'upcoming')}
                            <h3 className="text-lg font-semibold">{phase.phase}</h3>
                          </div>
                          <Badge variant={phase.status === 'completed' ? 'default' : phase.status === 'current' ? 'secondary' : 'outline'}>
                            {phase.years}
                          </Badge>
                        </div>
                        
                        <div className="space-y-2">
                          <p className="text-sm text-muted-foreground mb-3">Key Milestones:</p>
                          <div className="flex flex-wrap gap-2">
                            {phase.milestones.map((milestone, milestoneIndex) => (
                              <Badge 
                                key={milestoneIndex} 
                                variant="outline" 
                                className="text-xs"
                                data-testid={`milestone-${index}-${milestoneIndex}`}
                              >
                                {milestone}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        
                        {phase.status === 'current' && (
                          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                            <p className="text-sm text-blue-700 dark:text-blue-300 font-medium">
                              🎯 You are currently in this phase
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Roadmap Customization */}
        <Card className="mt-12">
          <CardHeader>
            <CardTitle>Customize Your Roadmap</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <p className="text-muted-foreground">
              This roadmap is based on your assessment results and selected career path. 
              You can modify it based on your changing interests and goals.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button data-testid="button-customize-roadmap">
                <Edit className="w-4 h-4 mr-2" />
                Customize Roadmap
              </Button>
              <Button variant="outline" data-testid="button-download-roadmap">
                <Download className="w-4 h-4 mr-2" />
                Download PDF
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Roadmap Tips */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Career Planning Tips</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
              <div>
                <h4 className="font-semibold mb-2 flex items-center">
                  <Target className="w-4 h-4 mr-2 text-primary" />
                  Set Clear Goals
                </h4>
                <p className="text-muted-foreground">
                  Define specific, measurable, achievable, relevant, and time-bound (SMART) career goals.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2 flex items-center">
                  <TrendingUp className="w-4 h-4 mr-2 text-secondary" />
                  Continuous Learning
                </h4>
                <p className="text-muted-foreground">
                  Stay updated with industry trends and continuously develop new skills relevant to your field.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2 flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2 text-accent" />
                  Regular Review
                </h4>
                <p className="text-muted-foreground">
                  Review and adjust your roadmap periodically based on changing circumstances and opportunities.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
