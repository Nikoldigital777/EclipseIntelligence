import { pgTable, text, serial, integer, boolean, timestamp, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: varchar("username", { length: 100 }).notNull().unique(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  displayName: varchar("display_name", { length: 100 }).notNull(),
  avatarUrl: varchar("avatar_url", { length: 500 }),
  role: varchar("role", { length: 50 }).notNull().default("user"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const agents = pgTable("agents", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  voice: text("voice").notNull(),
  language: text("language").default("en").notNull(),
  prompt: text("prompt"),
  retellAgentId: text("retell_agent_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const leads = pgTable("leads", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email"),
  phone: text("phone"),
  source: text("source"),
  type: text("type").notNull().default("New Lead"),
  description: text("description"),
  sentiment: text("sentiment"),
  qualityScore: integer("quality_score"),
  status: text("status").notNull().default("New"),
  assignedTo: text("assigned_to"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const batchCalls = pgTable("batch_calls", {
  id: serial("id").primaryKey(),
  batchCallId: text("batch_call_id").notNull().unique(),
  name: text("name").notNull(),
  fromNumber: text("from_number").notNull(),
  status: text("status").notNull().default("scheduled"),
  totalTaskCount: integer("total_task_count").notNull(),
  completedCount: integer("completed_count").notNull().default(0),
  successfulCount: integer("successful_count").notNull().default(0),
  scheduledTimestamp: integer("scheduled_timestamp"),
  agentId: integer("agent_id").references(() => agents.id),
  createdBy: integer("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  completedAt: timestamp("completed_at"),
});

export const calls = pgTable("calls", {
  id: serial("id").primaryKey(),
  sessionId: text("session_id").notNull(),
  fromNumber: text("from_number").notNull(),
  toNumber: text("to_number").notNull(),
  duration: integer("duration"),
  cost: text("cost"),
  status: text("status").notNull(),
  endReason: text("end_reason"),
  sentiment: text("sentiment"),
  outcome: text("outcome"),
  latency: integer("latency"),
  leadId: integer("lead_id").references(() => leads.id),
  agentId: integer("agent_id").references(() => agents.id),
  batchCallId: integer("batch_call_id").references(() => batchCalls.id),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertAgentSchema = createInsertSchema(agents).omit({
  id: true,
  createdAt: true,
  editedAt: true,
});

export const insertLeadSchema = createInsertSchema(leads).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertBatchCallSchema = createInsertSchema(batchCalls).omit({
  id: true,
  createdAt: true,
  completedAt: true,
});

export const insertCallSchema = createInsertSchema(calls).omit({
  id: true,
  createdAt: true,
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type LoginUser = Pick<User, 'email' | 'password'>;
export type SafeUser = Omit<User, 'password'>;
export type Agent = typeof agents.$inferSelect;
export type InsertAgent = z.infer<typeof insertAgentSchema>;
export type Lead = typeof leads.$inferSelect;
export type InsertLead = z.infer<typeof insertLeadSchema>;
export type BatchCall = typeof batchCalls.$inferSelect;
export type InsertBatchCall = z.infer<typeof insertBatchCallSchema>;
export type Call = typeof calls.$inferSelect;
export type InsertCall = z.infer<typeof insertCallSchema>;