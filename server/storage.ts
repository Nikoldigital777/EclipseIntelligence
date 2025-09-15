import { users, agents, leads, calls, batchCalls, type User, type Agent, type Lead, type Call, type BatchCall, type InsertUser, type InsertAgent, type InsertLead, type InsertCall, type InsertBatchCall } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Agent operations
  getAgents(): Promise<Agent[]>;
  getAgent(id: number): Promise<Agent | undefined>;
  createAgent(agent: InsertAgent): Promise<Agent>;
  updateAgent(id: number, agent: Partial<InsertAgent>): Promise<Agent | undefined>;
  deleteAgent(id: number): Promise<boolean>;
  getAgentByRetellId(retellId: string): Promise<Agent | null>;

  // Lead operations
  getLeads(): Promise<Lead[]>;
  getLead(id: number): Promise<Lead | undefined>;
  createLead(lead: InsertLead): Promise<Lead>;
  updateLead(id: number, lead: Partial<InsertLead>): Promise<Lead | undefined>;
  deleteLead(id: number): Promise<boolean>;

  // Call operations
  getCalls(): Promise<Call[]>;
  getCall(id: number): Promise<Call | undefined>;
  createCall(call: InsertCall): Promise<Call>;
  getCallsByLead(leadId: number): Promise<Call[]>;
  getCallsByAgent(agentId: number): Promise<Call[]>;

  // Batch call operations
  getBatchCalls(): Promise<BatchCall[]>;
  getBatchCall(id: number): Promise<BatchCall | undefined>;
  getBatchCallByBatchId(batchCallId: string): Promise<BatchCall | undefined>;
  createBatchCall(batchCall: InsertBatchCall): Promise<BatchCall>;
  updateBatchCall(id: number, batchCall: Partial<InsertBatchCall>): Promise<BatchCall | undefined>;
  getCallsByBatch(batchCallId: number): Promise<Call[]>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  // Agent operations
  async getAgents(): Promise<Agent[]> {
    const result = await db.select().from(agents).orderBy(agents.id);
    return result;
  }

  async getAgent(id: number): Promise<Agent | undefined> {
    const [agent] = await db.select().from(agents).where(eq(agents.id, id));
    return agent || undefined;
  }

  async createAgent(insertAgent: InsertAgent): Promise<Agent> {
    const agentData = {
      ...insertAgent,
      editedAt: new Date().toISOString()
    };
    const [agent] = await db
      .insert(agents)
      .values(agentData)
      .returning();
    return agent;
  }

  async updateAgent(id: number, updateData: Partial<InsertAgent>): Promise<Agent | undefined> {
    const [agent] = await db
      .update(agents)
      .set({ ...updateData, editedAt: new Date().toISOString() })
      .where(eq(agents.id, id))
      .returning();
    return agent || undefined;
  }

  async deleteAgent(id: number): Promise<boolean> {
    const result = await db.delete(agents).where(eq(agents.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  async getAgentByRetellId(retellId: string): Promise<Agent | null> {
    const result = await db.select().from(agents).where(eq(agents.retellAgentId, retellId)).limit(1);
    return result[0] || null;
  }


  // Lead operations
  async getLeads(): Promise<Lead[]> {
    return await db.select().from(leads);
  }

  async getLead(id: number): Promise<Lead | undefined> {
    const [lead] = await db.select().from(leads).where(eq(leads.id, id));
    return lead || undefined;
  }

  async createLead(insertLead: InsertLead): Promise<Lead> {
    const [lead] = await db
      .insert(leads)
      .values(insertLead)
      .returning();
    return lead;
  }

  async updateLead(id: number, updateData: Partial<InsertLead>): Promise<Lead | undefined> {
    const [lead] = await db
      .update(leads)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(leads.id, id))
      .returning();
    return lead || undefined;
  }

  async deleteLead(id: number): Promise<boolean> {
    const result = await db.delete(leads).where(eq(leads.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Call operations
  async getCalls(): Promise<Call[]> {
    return await db.select().from(calls);
  }

  async getCall(id: number): Promise<Call | undefined> {
    const [call] = await db.select().from(calls).where(eq(calls.id, id));
    return call || undefined;
  }

  async createCall(insertCall: InsertCall): Promise<Call> {
    const [call] = await db
      .insert(calls)
      .values(insertCall)
      .returning();
    return call;
  }

  async getCallsByLead(leadId: number): Promise<Call[]> {
    return await db.select().from(calls).where(eq(calls.leadId, leadId));
  }

  async getCallsByAgent(agentId: number): Promise<Call[]> {
    return await db.select().from(calls).where(eq(calls.agentId, agentId));
  }

  // Batch call operations
  async getBatchCalls(): Promise<BatchCall[]> {
    return await db.select().from(batchCalls).orderBy(batchCalls.createdAt);
  }

  async getBatchCall(id: number): Promise<BatchCall | undefined> {
    const [batchCall] = await db.select().from(batchCalls).where(eq(batchCalls.id, id));
    return batchCall || undefined;
  }

  async getBatchCallByBatchId(batchCallId: string): Promise<BatchCall | undefined> {
    const [batchCall] = await db.select().from(batchCalls).where(eq(batchCalls.batchCallId, batchCallId));
    return batchCall || undefined;
  }

  async createBatchCall(insertBatchCall: InsertBatchCall): Promise<BatchCall> {
    const [batchCall] = await db
      .insert(batchCalls)
      .values(insertBatchCall)
      .returning();
    return batchCall;
  }

  async updateBatchCall(id: number, updates: Partial<InsertBatchCall>): Promise<BatchCall | undefined> {
    const [batchCall] = await db
      .update(batchCalls)
      .set(updates)
      .where(eq(batchCalls.id, id))
      .returning();
    return batchCall || undefined;
  }

  async getCallsByBatch(batchCallId: number): Promise<Call[]> {
    return await db.select().from(calls).where(eq(calls.batchCallId, batchCallId));
  }
}

export const storage = new DatabaseStorage();