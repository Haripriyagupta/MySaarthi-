import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, jsonb, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  gradeLevel: text("grade_level").notNull(), // 10th, 11-12th, dropper, undergraduate, postgraduate
  createdAt: timestamp("created_at").default(sql`now()`),
});

// Assessments table
export const assessments = pgTable("assessments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  type: text("type").notNull(), // interest, aptitude
  questions: jsonb("questions").notNull(),
  answers: jsonb("answers"),
  score: integer("score"),
  completed: boolean("completed").default(false),
  createdAt: timestamp("created_at").default(sql`now()`),
});

// Colleges table
export const colleges = pgTable("colleges", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  location: text("location").notNull(),
  type: text("type").notNull(), // government, private
  courses: jsonb("courses").notNull(), // array of course objects
  fees: jsonb("fees").notNull(), // fee structure by course
  placement: jsonb("placement").notNull(), // placement statistics
  rating: integer("rating").notNull(),
  accreditation: text("accreditation"),
});

// Exams table
export const exams = pgTable("exams", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description").notNull(),
  eligibility: jsonb("eligibility").notNull(), // grade levels, subjects
  examDate: timestamp("exam_date").notNull(),
  applicationFee: integer("application_fee").notNull(),
  difficulty: integer("difficulty").notNull(), // 1-5 scale
  syllabus: jsonb("syllabus").notNull(),
  preparationTime: integer("preparation_time"), // in months
});

// Career paths table
export const careerPaths = pgTable("career_paths", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  field: text("field").notNull(), // STEM, Commerce, Arts, etc.
  description: text("description").notNull(),
  requiredSkills: jsonb("required_skills").notNull(),
  averageSalary: jsonb("average_salary").notNull(), // salary by experience level
  growthProspects: text("growth_prospects").notNull(),
  relatedExams: jsonb("related_exams").notNull(), // array of exam IDs
  roadmap: jsonb("roadmap").notNull(), // timeline with milestones
});

// User recommendations table
export const userRecommendations = pgTable("user_recommendations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  careerPaths: jsonb("career_paths").notNull(), // recommended career paths with scores
  colleges: jsonb("colleges").notNull(), // recommended colleges with scores
  exams: jsonb("exams").notNull(), // recommended exams with scores
  updatedAt: timestamp("updated_at").default(sql`now()`),
});

// Chat messages table for chatbot
export const chatMessages = pgTable("chat_messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  message: text("message").notNull(),
  response: text("response").notNull(),
  timestamp: timestamp("timestamp").default(sql`now()`),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertAssessmentSchema = createInsertSchema(assessments).omit({
  id: true,
  createdAt: true,
});

export const insertCollegeSchema = createInsertSchema(colleges).omit({
  id: true,
});

export const insertExamSchema = createInsertSchema(exams).omit({
  id: true,
});

export const insertCareerPathSchema = createInsertSchema(careerPaths).omit({
  id: true,
});

export const insertUserRecommendationSchema = createInsertSchema(userRecommendations).omit({
  id: true,
  updatedAt: true,
});

export const insertChatMessageSchema = createInsertSchema(chatMessages).omit({
  id: true,
  timestamp: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Assessment = typeof assessments.$inferSelect;
export type InsertAssessment = z.infer<typeof insertAssessmentSchema>;

export type College = typeof colleges.$inferSelect;
export type InsertCollege = z.infer<typeof insertCollegeSchema>;

export type Exam = typeof exams.$inferSelect;
export type InsertExam = z.infer<typeof insertExamSchema>;

export type CareerPath = typeof careerPaths.$inferSelect;
export type InsertCareerPath = z.infer<typeof insertCareerPathSchema>;

export type UserRecommendation = typeof userRecommendations.$inferSelect;
export type InsertUserRecommendation = z.infer<typeof insertUserRecommendationSchema>;

export type ChatMessage = typeof chatMessages.$inferSelect;
export type InsertChatMessage = z.infer<typeof insertChatMessageSchema>;
