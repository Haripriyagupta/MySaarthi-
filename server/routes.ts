import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertAssessmentSchema, insertChatMessageSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // User routes
  app.post("/api/users", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(userData);
      res.json(user);
    } catch (error) {
      res.status(400).json({ error: "Invalid user data", details: error });
    }
  });

  app.get("/api/users/:id", async (req, res) => {
    try {
      const user = await storage.getUser(req.params.id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch user" });
    }
  });

  app.get("/api/users/email/:email", async (req, res) => {
    try {
      const user = await storage.getUserByEmail(req.params.email);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch user" });
    }
  });

  // Assessment routes
  app.get("/api/assessments/user/:userId", async (req, res) => {
    try {
      const assessments = await storage.getAssessmentsByUserId(req.params.userId);
      res.json(assessments);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch assessments" });
    }
  });

  app.post("/api/assessments", async (req, res) => {
    try {
      const assessmentData = insertAssessmentSchema.parse(req.body);
      const assessment = await storage.createAssessment(assessmentData);
      res.json(assessment);
    } catch (error) {
      res.status(400).json({ error: "Invalid assessment data", details: error });
    }
  });

  app.put("/api/assessments/:id", async (req, res) => {
    try {
      const updates = req.body;
      const assessment = await storage.updateAssessment(req.params.id, updates);
      res.json(assessment);
    } catch (error) {
      res.status(400).json({ error: "Failed to update assessment", details: error });
    }
  });

  // College routes
  app.get("/api/colleges", async (req, res) => {
    try {
      const { field, location, feeRange } = req.query;
      const filters = {
        field: field as string,
        location: location as string,
        feeRange: feeRange as string
      };
      
      const colleges = Object.keys(filters).some(key => filters[key as keyof typeof filters])
        ? await storage.getCollegesByFilters(filters)
        : await storage.getAllColleges();
      
      res.json(colleges);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch colleges" });
    }
  });

  app.get("/api/colleges/:id", async (req, res) => {
    try {
      const college = await storage.getCollegeById(req.params.id);
      if (!college) {
        return res.status(404).json({ error: "College not found" });
      }
      res.json(college);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch college" });
    }
  });

  // Exam routes
  app.get("/api/exams", async (req, res) => {
    try {
      const { gradeLevel } = req.query;
      const exams = gradeLevel 
        ? await storage.getExamsByGradeLevel(gradeLevel as string)
        : await storage.getAllExams();
      res.json(exams);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch exams" });
    }
  });

  app.get("/api/exams/:id", async (req, res) => {
    try {
      const exam = await storage.getExamById(req.params.id);
      if (!exam) {
        return res.status(404).json({ error: "Exam not found" });
      }
      res.json(exam);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch exam" });
    }
  });

  // Career path routes
  app.get("/api/career-paths", async (req, res) => {
    try {
      const { field } = req.query;
      const careerPaths = field 
        ? await storage.getCareerPathsByField(field as string)
        : await storage.getAllCareerPaths();
      res.json(careerPaths);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch career paths" });
    }
  });

  app.get("/api/career-paths/:id", async (req, res) => {
    try {
      const careerPath = await storage.getCareerPathById(req.params.id);
      if (!careerPath) {
        return res.status(404).json({ error: "Career path not found" });
      }
      res.json(careerPath);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch career path" });
    }
  });

  // User recommendations routes
  app.get("/api/recommendations/:userId", async (req, res) => {
    try {
      const recommendations = await storage.getUserRecommendations(req.params.userId);
      if (!recommendations) {
        return res.status(404).json({ error: "No recommendations found" });
      }
      res.json(recommendations);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch recommendations" });
    }
  });

  app.post("/api/recommendations", async (req, res) => {
    try {
      const recommendation = await storage.createOrUpdateUserRecommendations(req.body);
      res.json(recommendation);
    } catch (error) {
      res.status(400).json({ error: "Failed to create recommendations", details: error });
    }
  });

  // Chat routes
  app.get("/api/chat/:userId", async (req, res) => {
    try {
      const chatHistory = await storage.getChatHistory(req.params.userId);
      res.json(chatHistory);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch chat history" });
    }
  });

  app.post("/api/chat", async (req, res) => {
    try {
      const messageData = insertChatMessageSchema.parse(req.body);
      
      // Simple chatbot responses
      let response = "I'm here to help you with your career questions. Could you please be more specific?";
      
      const message = messageData.message.toLowerCase();
      if (message.includes("jee") || message.includes("engineering")) {
        response = "For JEE preparation, I recommend: 1) Create a structured study plan covering Physics, Chemistry, and Math. 2) Practice previous year papers regularly. 3) Take mock tests to improve timing. 4) Focus on NCERT books first, then reference materials. Would you like specific study resources?";
      } else if (message.includes("neet") || message.includes("medical")) {
        response = "For NEET preparation: 1) Master NCERT thoroughly for all three subjects. 2) Practice MCQs daily. 3) Take regular mock tests. 4) Focus on Biology as it carries the most weightage. 5) Maintain a strong foundation in Physics and Chemistry. Need specific guidance on any subject?";
      } else if (message.includes("college") || message.includes("admission")) {
        response = "For college selection, consider: 1) Your field of interest and career goals. 2) College rankings and accreditation. 3) Placement records and average packages. 4) Fee structure and your budget. 5) Location preferences. Would you like me to recommend colleges based on your preferences?";
      } else if (message.includes("career") || message.includes("job")) {
        response = "Career planning involves: 1) Taking our interest and aptitude assessments. 2) Exploring different career paths in your field. 3) Understanding skill requirements. 4) Planning your education roadmap. 5) Building relevant experience through projects and internships. Which aspect would you like to explore first?";
      }
      
      const chatMessage = await storage.createChatMessage({
        ...messageData,
        response
      });
      
      res.json(chatMessage);
    } catch (error) {
      res.status(400).json({ error: "Invalid message data", details: error });
    }
  });

  // Assessment question generator
  app.get("/api/assessment-questions/:type", async (req, res) => {
    try {
      const type = req.params.type;
      let questions = [];
      
      if (type === "interest") {
        questions = [
          {
            id: 1,
            question: "Which activity would you find most engaging?",
            options: [
              "Building websites and apps",
              "Analyzing business data",
              "Teaching others",
              "Conducting scientific experiments"
            ]
          },
          {
            id: 2,
            question: "What type of work environment do you prefer?",
            options: [
              "Fast-paced tech startup",
              "Structured corporate office",
              "Collaborative team settings",
              "Independent research lab"
            ]
          },
          {
            id: 3,
            question: "Which subject did you enjoy most in school?",
            options: [
              "Mathematics",
              "Science",
              "Languages",
              "Social Studies"
            ]
          },
          {
            id: 4,
            question: "What motivates you most in your work?",
            options: [
              "Solving complex problems",
              "Helping others",
              "Creating something new",
              "Leading a team"
            ]
          },
          {
            id: 5,
            question: "How do you prefer to spend your free time?",
            options: [
              "Reading and learning new things",
              "Playing sports or exercising",
              "Socializing with friends",
              "Working on personal projects"
            ]
          }
        ];
      } else if (type === "aptitude") {
        questions = [
          {
            id: 1,
            question: "If 2x + 5 = 13, what is the value of x?",
            options: ["x = 4", "x = 6", "x = 8", "x = 9"],
            correct: 0
          },
          {
            id: 2,
            question: "What comes next in the sequence: 2, 6, 12, 20, ?",
            options: ["28", "30", "32", "36"],
            correct: 1
          },
          {
            id: 3,
            question: "If all roses are flowers and some flowers are red, which statement is definitely true?",
            options: [
              "All roses are red",
              "Some roses are red",
              "No roses are red",
              "Cannot be determined"
            ],
            correct: 3
          },
          {
            id: 4,
            question: "A train travels 60 km in 45 minutes. What is its speed in km/hr?",
            options: ["75", "80", "85", "90"],
            correct: 1
          },
          {
            id: 5,
            question: "Choose the odd one out:",
            options: ["Square", "Rectangle", "Triangle", "Circle"],
            correct: 3
          }
        ];
      }
      
      res.json(questions);
    } catch (error) {
      res.status(500).json({ error: "Failed to generate questions" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
