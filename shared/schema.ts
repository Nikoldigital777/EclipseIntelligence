import { pgTable, text, serial, integer, boolean, timestamp, varchar, decimal } from "drizzle-orm/pg-core";
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
  avatar: text("avatar").notNull(),
  description: text("description").notNull(),
  editedBy: text("edited_by").notNull(),
  editedAt: text("edited_at").notNull(),
  retellAgentId: text("retell_agent_id"),
  type: text("type"),
  prompt: text("prompt"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
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
  sessionId: varchar("session_id", { length: 255 }).notNull(),
  
  // Retell API Core Fields
  retellCallId: varchar("retell_call_id", { length: 255 }).unique(), // Retell's unique call_id
  callType: varchar("call_type", { length: 20 }), // "web_call" | "phone_call"
  callStatus: varchar("call_status", { length: 50 }), // "registered" | "not_connected" | "ongoing" | "ended" | "error"
  direction: varchar("direction", { length: 20 }), // "inbound" | "outbound"
  accessToken: text("access_token"), // For web calls
  
  // Call Participants
  fromNumber: varchar("from_number", { length: 50 }),
  toNumber: varchar("to_number", { length: 50 }),
  agentId: integer("agent_id").references(() => agents.id),
  retellAgentId: varchar("retell_agent_id", { length: 255 }),
  agentVersion: integer("agent_version"),
  
  // Call Status & Outcomes
  status: varchar("status", { length: 50 }), // Legacy field for backward compatibility
  callSuccessful: boolean("call_successful"),
  disconnectionReason: varchar("disconnection_reason", { length: 100 }),
  endReason: varchar("end_reason", { length: 100 }), // Legacy field
  inVoicemail: boolean("in_voicemail"),
  
  // Sentiment & Analysis
  sentiment: varchar("sentiment", { length: 50 }), // Legacy field
  userSentiment: varchar("user_sentiment", { length: 20 }), // "Negative" | "Positive" | "Neutral" | "Unknown"
  outcome: varchar("outcome", { length: 100 }),
  
  // Timing & Duration
  startTimestamp: integer("start_timestamp"), // Milliseconds since epoch
  endTimestamp: integer("end_timestamp"), // Milliseconds since epoch
  duration: integer("duration"), // Legacy field for backward compatibility
  durationMs: integer("duration_ms"), // Duration in milliseconds from Retell
  
  // Cost & Performance
  cost: decimal("cost", { precision: 10, scale: 4 }),
  latency: integer("latency"),
  
  // Content & Recordings
  transcript: text("transcript"), // Full conversation transcript
  recordingUrl: text("recording_url"),
  recordingMultiChannelUrl: text("recording_multi_channel_url"),
  scrubbedRecordingUrl: text("scrubbed_recording_url"),
  scrubbedRecordingMultiChannelUrl: text("scrubbed_recording_multi_channel_url"),
  publicLogUrl: text("public_log_url"),
  knowledgeBaseRetrievedContentsUrl: text("knowledge_base_retrieved_contents_url"),
  
  // Metadata & Variables (stored as JSON)
  metadata: text("metadata"), // JSON string of arbitrary data
  retellLlmDynamicVariables: text("retell_llm_dynamic_variables"), // JSON string
  collectedDynamicVariables: text("collected_dynamic_variables"), // JSON string
  customSipHeaders: text("custom_sip_headers"), // JSON string
  
  // Settings
  dataStorageSetting: varchar("data_storage_setting", { length: 50 }), // "everything" | "everything_except_pii" | "basic_attributes_only"
  optInSignedUrl: boolean("opt_in_signed_url"),
  
  // Relations
  leadId: integer("lead_id").references(() => leads.id),
  batchCallId: integer("batch_call_id").references(() => batchCalls.id),
  
  // Timestamps
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
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
  updatedAt: true,
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
export type InsertCall = typeof calls.$inferInsert;