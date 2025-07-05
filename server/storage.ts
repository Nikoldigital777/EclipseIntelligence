import { users, agents, leads, calls, type User, type Agent, type Lead, type Call, type InsertUser, type InsertAgent, type InsertLead, type InsertCall } from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Agent operations
  getAgents(): Promise<Agent[]>;
  getAgent(id: number): Promise<Agent | undefined>;
  createAgent(agent: InsertAgent): Promise<Agent>;
  updateAgent(id: number, agent: Partial<InsertAgent>): Promise<Agent | undefined>;
  deleteAgent(id: number): Promise<boolean>;
  
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
}

export class MemStorage implements IStorage {
  private users: Map<number, User> = new Map();
  private agents: Map<number, Agent> = new Map();
  private leads: Map<number, Lead> = new Map();
  private calls: Map<number, Call> = new Map();
  private currentUserId = 1;
  private currentAgentId = 1;
  private currentLeadId = 1;
  private currentCallId = 1;

  constructor() {
    // Initialize with sample data
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Sample agents
    const sampleAgents: Agent[] = [
      {
        id: 1,
        name: "Levan Wood Eclipse Recruiting",
        type: "Single Prompt",
        voice: "Levan RE/MAX",
        phone: "+1(248)283-4183",
        description: "Cosmic Recruiter",
        editedBy: "Levan Wood",
        editedAt: new Date("2025-07-03T19:43:00"),
        createdAt: new Date("2025-07-03T19:43:00"),
      },
      {
        id: 2,
        name: "Madison RE/MAX Office",
        type: "Single Prompt",
        voice: "Emily",
        phone: "+1(586)500-6801",
        description: "Office Manager",
        editedBy: "Emily",
        editedAt: new Date("2025-07-01T02:37:00"),
        createdAt: new Date("2025-07-01T02:37:00"),
      },
      {
        id: 3,
        name: "Levan Wood Listing Agent",
        type: "Single Prompt",
        voice: "Levan RE/MAX",
        phone: "+1(248)599-0019",
        description: "Listing Specialist",
        editedBy: "Levan Wood",
        editedAt: new Date("2025-05-29T02:02:00"),
        createdAt: new Date("2025-05-29T02:02:00"),
      },
    ];

    sampleAgents.forEach(agent => {
      this.agents.set(agent.id, agent);
    });
    this.currentAgentId = 4;

    // Sample leads
    const sampleLeads: Lead[] = [
      {
        id: 1,
        name: "Amy Smith",
        email: "amy.smith@email.com",
        phone: "+1(555)123-4567",
        source: "Zillow",
        type: "Hot Lead",
        description: "Wants to list a 3BR condo in Waikiki. Ready to move fast!",
        sentiment: "😊",
        qualityScore: 85,
        status: "New",
        assignedTo: "Levan Wood",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 2,
        name: "John Doe",
        email: "john.doe@email.com",
        phone: "+1(555)234-5678",
        source: "Website",
        type: "New Lead",
        description: "Looking for investment properties in downtown area. First time buyer.",
        sentiment: "🤔",
        qualityScore: 70,
        status: "New",
        assignedTo: "Levan Wood",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 3,
        name: "Maria Johnson",
        email: "maria.johnson@email.com",
        phone: "+1(555)345-6789",
        source: "Referral",
        type: "Appointment Set",
        description: "Scheduled for viewing tomorrow at 2 PM. High budget range.",
        sentiment: "✨",
        qualityScore: 95,
        status: "Scheduled",
        assignedTo: "Levan Wood",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    sampleLeads.forEach(lead => {
      this.leads.set(lead.id, lead);
    });
    this.currentLeadId = 4;
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const user: User = {
      ...insertUser,
      id: this.currentUserId++,
      createdAt: new Date(),
    };
    this.users.set(user.id, user);
    return user;
  }

  // Agent operations
  async getAgents(): Promise<Agent[]> {
    return Array.from(this.agents.values());
  }

  async getAgent(id: number): Promise<Agent | undefined> {
    return this.agents.get(id);
  }

  async createAgent(insertAgent: InsertAgent): Promise<Agent> {
    const agent: Agent = {
      ...insertAgent,
      id: this.currentAgentId++,
      createdAt: new Date(),
      editedAt: new Date(),
    };
    this.agents.set(agent.id, agent);
    return agent;
  }

  async updateAgent(id: number, updateData: Partial<InsertAgent>): Promise<Agent | undefined> {
    const agent = this.agents.get(id);
    if (!agent) return undefined;
    
    const updatedAgent = { ...agent, ...updateData, editedAt: new Date() };
    this.agents.set(id, updatedAgent);
    return updatedAgent;
  }

  async deleteAgent(id: number): Promise<boolean> {
    return this.agents.delete(id);
  }

  // Lead operations
  async getLeads(): Promise<Lead[]> {
    return Array.from(this.leads.values());
  }

  async getLead(id: number): Promise<Lead | undefined> {
    return this.leads.get(id);
  }

  async createLead(insertLead: InsertLead): Promise<Lead> {
    const lead: Lead = {
      ...insertLead,
      id: this.currentLeadId++,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.leads.set(lead.id, lead);
    return lead;
  }

  async updateLead(id: number, updateData: Partial<InsertLead>): Promise<Lead | undefined> {
    const lead = this.leads.get(id);
    if (!lead) return undefined;
    
    const updatedLead = { ...lead, ...updateData, updatedAt: new Date() };
    this.leads.set(id, updatedLead);
    return updatedLead;
  }

  async deleteLead(id: number): Promise<boolean> {
    return this.leads.delete(id);
  }

  // Call operations
  async getCalls(): Promise<Call[]> {
    return Array.from(this.calls.values());
  }

  async getCall(id: number): Promise<Call | undefined> {
    return this.calls.get(id);
  }

  async createCall(insertCall: InsertCall): Promise<Call> {
    const call: Call = {
      ...insertCall,
      id: this.currentCallId++,
      createdAt: new Date(),
    };
    this.calls.set(call.id, call);
    return call;
  }

  async getCallsByLead(leadId: number): Promise<Call[]> {
    return Array.from(this.calls.values()).filter(call => call.leadId === leadId);
  }

  async getCallsByAgent(agentId: number): Promise<Call[]> {
    return Array.from(this.calls.values()).filter(call => call.agentId === agentId);
  }
}

export const storage = new MemStorage();
