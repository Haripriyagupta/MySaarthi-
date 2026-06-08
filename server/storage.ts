import { 
  type User, 
  type InsertUser, 
  type Assessment, 
  type InsertAssessment,
  type College,
  type InsertCollege,
  type Exam,
  type InsertExam,
  type CareerPath,
  type InsertCareerPath,
  type UserRecommendation,
  type InsertUserRecommendation,
  type ChatMessage,
  type InsertChatMessage
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Assessment operations
  getAssessment(id: string): Promise<Assessment | undefined>;
  getAssessmentsByUserId(userId: string): Promise<Assessment[]>;
  createAssessment(assessment: InsertAssessment): Promise<Assessment>;
  updateAssessment(id: string, assessment: Partial<Assessment>): Promise<Assessment>;
  
  // College operations
  getAllColleges(): Promise<College[]>;
  getCollegeById(id: string): Promise<College | undefined>;
  getCollegesByFilters(filters: { field?: string; location?: string; feeRange?: string }): Promise<College[]>;
  createCollege(college: InsertCollege): Promise<College>;
  
  // Exam operations
  getAllExams(): Promise<Exam[]>;
  getExamById(id: string): Promise<Exam | undefined>;
  getExamsByGradeLevel(gradeLevel: string): Promise<Exam[]>;
  createExam(exam: InsertExam): Promise<Exam>;
  
  // Career path operations
  getAllCareerPaths(): Promise<CareerPath[]>;
  getCareerPathById(id: string): Promise<CareerPath | undefined>;
  getCareerPathsByField(field: string): Promise<CareerPath[]>;
  createCareerPath(careerPath: InsertCareerPath): Promise<CareerPath>;
  
  // User recommendation operations
  getUserRecommendations(userId: string): Promise<UserRecommendation | undefined>;
  createOrUpdateUserRecommendations(recommendation: InsertUserRecommendation): Promise<UserRecommendation>;
  
  // Chat operations
  getChatHistory(userId: string): Promise<ChatMessage[]>;
  createChatMessage(message: InsertChatMessage): Promise<ChatMessage>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private assessments: Map<string, Assessment>;
  private colleges: Map<string, College>;
  private exams: Map<string, Exam>;
  private careerPaths: Map<string, CareerPath>;
  private userRecommendations: Map<string, UserRecommendation>;
  private chatMessages: Map<string, ChatMessage>;

  constructor() {
    this.users = new Map();
    this.assessments = new Map();
    this.colleges = new Map();
    this.exams = new Map();
    this.careerPaths = new Map();
    this.userRecommendations = new Map();
    this.chatMessages = new Map();
    
    // Initialize with sample data
    this.initializeSampleData();
  }

  // User operations
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id, createdAt: new Date() };
    this.users.set(id, user);
    return user;
  }

  // Assessment operations
  async getAssessment(id: string): Promise<Assessment | undefined> {
    return this.assessments.get(id);
  }

  async getAssessmentsByUserId(userId: string): Promise<Assessment[]> {
    return Array.from(this.assessments.values()).filter(assessment => assessment.userId === userId);
  }

  async createAssessment(insertAssessment: InsertAssessment): Promise<Assessment> {
    const id = randomUUID();
    const assessment: Assessment = { ...insertAssessment, id, createdAt: new Date() };
    this.assessments.set(id, assessment);
    return assessment;
  }

  async updateAssessment(id: string, updates: Partial<Assessment>): Promise<Assessment> {
    const existing = this.assessments.get(id);
    if (!existing) throw new Error("Assessment not found");
    
    const updated = { ...existing, ...updates };
    this.assessments.set(id, updated);
    return updated;
  }

  // College operations
  async getAllColleges(): Promise<College[]> {
    return Array.from(this.colleges.values());
  }

  async getCollegeById(id: string): Promise<College | undefined> {
    return this.colleges.get(id);
  }

  async getCollegesByFilters(filters: { field?: string; location?: string; feeRange?: string }): Promise<College[]> {
    let colleges = Array.from(this.colleges.values());
    
    if (filters.field) {
      colleges = colleges.filter(college => 
        (college.courses as any[]).some(course => 
          course.field?.toLowerCase().includes(filters.field!.toLowerCase())
        )
      );
    }
    
    if (filters.location) {
      colleges = colleges.filter(college => 
        college.location.toLowerCase().includes(filters.location!.toLowerCase())
      );
    }
    
    return colleges;
  }

  async createCollege(insertCollege: InsertCollege): Promise<College> {
    const id = randomUUID();
    const college: College = { ...insertCollege, id };
    this.colleges.set(id, college);
    return college;
  }

  // Exam operations
  async getAllExams(): Promise<Exam[]> {
    return Array.from(this.exams.values());
  }

  async getExamById(id: string): Promise<Exam | undefined> {
    return this.exams.get(id);
  }

  async getExamsByGradeLevel(gradeLevel: string): Promise<Exam[]> {
    return Array.from(this.exams.values()).filter(exam => 
      (exam.eligibility as any).gradeLevels?.includes(gradeLevel)
    );
  }

  async createExam(insertExam: InsertExam): Promise<Exam> {
    const id = randomUUID();
    const exam: Exam = { ...insertExam, id };
    this.exams.set(id, exam);
    return exam;
  }

  // Career path operations
  async getAllCareerPaths(): Promise<CareerPath[]> {
    return Array.from(this.careerPaths.values());
  }

  async getCareerPathById(id: string): Promise<CareerPath | undefined> {
    return this.careerPaths.get(id);
  }

  async getCareerPathsByField(field: string): Promise<CareerPath[]> {
    return Array.from(this.careerPaths.values()).filter(path => 
      path.field.toLowerCase().includes(field.toLowerCase())
    );
  }

  async createCareerPath(insertCareerPath: InsertCareerPath): Promise<CareerPath> {
    const id = randomUUID();
    const careerPath: CareerPath = { ...insertCareerPath, id };
    this.careerPaths.set(id, careerPath);
    return careerPath;
  }

  // User recommendation operations
  async getUserRecommendations(userId: string): Promise<UserRecommendation | undefined> {
    return Array.from(this.userRecommendations.values()).find(rec => rec.userId === userId);
  }

  async createOrUpdateUserRecommendations(recommendation: InsertUserRecommendation): Promise<UserRecommendation> {
    const existing = Array.from(this.userRecommendations.values()).find(rec => rec.userId === recommendation.userId);
    
    if (existing) {
      const updated = { ...existing, ...recommendation, updatedAt: new Date() };
      this.userRecommendations.set(existing.id, updated);
      return updated;
    } else {
      const id = randomUUID();
      const newRec: UserRecommendation = { ...recommendation, id, updatedAt: new Date() };
      this.userRecommendations.set(id, newRec);
      return newRec;
    }
  }

  // Chat operations
  async getChatHistory(userId: string): Promise<ChatMessage[]> {
    return Array.from(this.chatMessages.values()).filter(msg => msg.userId === userId);
  }

  async createChatMessage(insertMessage: InsertChatMessage): Promise<ChatMessage> {
    const id = randomUUID();
    const message: ChatMessage = { ...insertMessage, id, timestamp: new Date() };
    this.chatMessages.set(id, message);
    return message;
  }

  private initializeSampleData() {
    // Sample Colleges
    const colleges: InsertCollege[] = [
      {
        name: "IIT Delhi",
        location: "New Delhi",
        type: "government",
        courses: [
          { name: "B.Tech Computer Science", duration: "4 years", field: "Engineering" },
          { name: "B.Tech Mechanical", duration: "4 years", field: "Engineering" }
        ],
        fees: { "B.Tech": 250000 },
        placement: { averagePackage: 1800000, placementRate: 98 },
        rating: 5,
        accreditation: "NAAC A++"
      },
      {
        name: "BITS Pilani",
        location: "Rajasthan",
        type: "private",
        courses: [
          { name: "B.E. Computer Science", duration: "4 years", field: "Engineering" },
          { name: "B.E. Electronics", duration: "4 years", field: "Engineering" }
        ],
        fees: { "B.E.": 520000 },
        placement: { averagePackage: 1600000, placementRate: 95 },
        rating: 5,
        accreditation: "UGC"
      },
      {
        name: "VIT Vellore",
        location: "Tamil Nadu",
        type: "private",
        courses: [
          { name: "B.Tech CSE", duration: "4 years", field: "Engineering" },
          { name: "B.Tech ECE", duration: "4 years", field: "Engineering" }
        ],
        fees: { "B.Tech": 480000 },
        placement: { averagePackage: 1200000, placementRate: 88 },
        rating: 4,
        accreditation: "UGC"
      }
    ];

    colleges.forEach(college => {
      const id = randomUUID();
      this.colleges.set(id, { ...college, id });
    });

    // Sample Exams
    const exams: InsertExam[] = [
      {
        name: "JEE Main & Advanced",
        description: "For admission to IITs, NITs, and other top engineering colleges in India",
        eligibility: { gradeLevels: ["11-12th", "dropper"], subjects: ["Physics", "Chemistry", "Mathematics"] },
        examDate: new Date("2025-01-24"),
        applicationFee: 1000,
        difficulty: 4,
        syllabus: {
          Physics: ["Mechanics", "Thermodynamics", "Waves", "Electricity & Magnetism"],
          Chemistry: ["Physical Chemistry", "Organic Chemistry", "Inorganic Chemistry"],
          Mathematics: ["Algebra", "Calculus", "Geometry", "Statistics"]
        },
        preparationTime: 24
      },
      {
        name: "NEET",
        description: "National Eligibility cum Entrance Test for medical colleges (MBBS, BDS, AYUSH)",
        eligibility: { gradeLevels: ["11-12th", "dropper"], subjects: ["Physics", "Chemistry", "Biology"] },
        examDate: new Date("2025-05-05"),
        applicationFee: 1700,
        difficulty: 5,
        syllabus: {
          Physics: ["Mechanics", "Thermodynamics", "Optics", "Modern Physics"],
          Chemistry: ["Physical Chemistry", "Organic Chemistry", "Inorganic Chemistry"],
          Biology: ["Botany", "Zoology", "Human Physiology", "Genetics"]
        },
        preparationTime: 24
      },
      {
        name: "CAT",
        description: "Common Admission Test for MBA programs in IIMs and top management colleges",
        eligibility: { gradeLevels: ["undergraduate", "postgraduate"], subjects: ["Any Graduate"] },
        examDate: new Date("2024-11-26"),
        applicationFee: 2500,
        difficulty: 4,
        syllabus: {
          "Verbal Ability": ["Reading Comprehension", "Grammar", "Vocabulary"],
          "Data Interpretation": ["Tables", "Charts", "Graphs"],
          "Quantitative Ability": ["Arithmetic", "Algebra", "Geometry"]
        },
        preparationTime: 12
      }
    ];

    exams.forEach(exam => {
      const id = randomUUID();
      this.exams.set(id, { ...exam, id });
    });

    // Sample Career Paths
    const careerPaths: InsertCareerPath[] = [
      {
        title: "Software Engineer",
        field: "STEM",
        description: "Design, develop, and maintain software applications and systems",
        requiredSkills: ["Programming", "Problem Solving", "Data Structures", "Algorithms"],
        averageSalary: {
          "entry": 600000,
          "mid": 1200000,
          "senior": 2500000
        },
        growthProspects: "Very High - Technology is rapidly expanding with excellent career growth opportunities",
        relatedExams: [],
        roadmap: [
          { phase: "Foundation", years: "1-2", milestones: ["Complete 12th", "Clear JEE", "College Admission"] },
          { phase: "Education", years: "3-6", milestones: ["B.Tech Completion", "2-3 Internships", "Final Year Project"] },
          { phase: "Career Launch", years: "7-8", milestones: ["First Job", "₹6-8L Package", "Skill Development"] },
          { phase: "Growth", years: "9-12", milestones: ["Promotion", "₹15-25L Package", "Team Leadership"] }
        ]
      },
      {
        title: "Doctor",
        field: "Medical",
        description: "Diagnose and treat patients, provide medical care and health advice",
        requiredSkills: ["Medical Knowledge", "Communication", "Empathy", "Critical Thinking"],
        averageSalary: {
          "entry": 800000,
          "mid": 1500000,
          "senior": 3000000
        },
        growthProspects: "High - Always in demand with opportunities for specialization",
        relatedExams: [],
        roadmap: [
          { phase: "Foundation", years: "1-2", milestones: ["Complete 12th PCB", "Clear NEET", "Medical College Admission"] },
          { phase: "MBBS", years: "3-8", milestones: ["Complete MBBS", "Internship", "Medical License"] },
          { phase: "Practice", years: "9-10", milestones: ["Start Practice", "Build Patient Base", "Specialization"] },
          { phase: "Expertise", years: "11-15", milestones: ["Established Practice", "Senior Consultant", "Teaching"] }
        ]
      }
    ];

    careerPaths.forEach(path => {
      const id = randomUUID();
      this.careerPaths.set(id, { ...path, id });
    });
  }
}

export const storage = new MemStorage();
