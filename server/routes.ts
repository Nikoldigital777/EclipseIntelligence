import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertAgentSchema, insertLeadSchema, insertCallSchema } from "@shared/schema";
import { z } from "zod";
import { createRetellClient } from "./retell-client";
import {
  hashPassword,
  comparePassword,
  generateToken,
  authenticateToken,
  createSafeUser,
  type AuthRequest
} from "./auth";
import { Router } from "express";

const router = Router();

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication routes
  router.post('/auth/login', async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
      }

      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const isValidPassword = await comparePassword(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const token = generateToken(user.id);
      const safeUser = createSafeUser(user);

      res.json({
        token,
        user: safeUser,
        message: "Login successful"
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ error: "Login failed" });
    }
  });

  router.post('/auth/register', async (req, res) => {
    try {
      const { username, email, password, displayName } = req.body;

      if (!username || !email || !password || !displayName) {
        return res.status(400).json({
          error: "Username, email, password, and display name are required"
        });
      }

      // Check if user already exists
      const existingUserByEmail = await storage.getUserByEmail(email);
      if (existingUserByEmail) {
        return res.status(409).json({ error: "Email already registered" });
      }

      const existingUserByUsername = await storage.getUserByUsername(username);
      if (existingUserByUsername) {
        return res.status(409).json({ error: "Username already taken" });
      }

      const hashedPassword = await hashPassword(password);
      const userData = {
        username,
        email,
        password: hashedPassword,
        displayName,
        role: "user"
      };

      const user = await storage.createUser(userData);
      const token = generateToken(user.id);
      const safeUser = createSafeUser(user);

      res.status(201).json({
        token,
        user: safeUser,
        message: "Registration successful"
      });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ error: "Registration failed" });
    }
  });

  router.get("/auth/me", authenticateToken, async (req: AuthRequest, res) => {
    res.json({ user: req.user });
  });

  router.post("/auth/logout", (req, res) => {
    // With JWT, logout is handled client-side by removing the token
    res.json({ message: "Logout successful" });
  });

  // Token refresh endpoint
  router.post('/auth/refresh', authenticateToken, async (req: AuthRequest, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'User not found' });
      }

      const newToken = generateToken(req.user.id);
      res.json({ token: newToken });
    } catch (error) {
      console.error('Token refresh error:', error);
      res.status(500).json({ error: 'Failed to refresh token' });
    }
  });

  // Agent routes (protected)
  router.get("/agents", authenticateToken, async (req: AuthRequest, res) => {
    try {
      const retellClient = createRetellClient();
      let agents = [];

      if (retellClient) {
        try {
          // Get agents from Retell API
          const retellAgents = await retellClient.listAgents();
          agents = retellAgents.agents || [];
        } catch (retellError) {
          console.warn("Failed to fetch from Retell API, using local data:", retellError);
          // Fallback to local storage
          agents = await storage.getAgents();
        }
      } else {
        // No API key, use local storage
        agents = await storage.getAgents();
      }

      res.json(agents);
    } catch (error) {
      console.error("Failed to fetch agents:", error);
      res.status(500).json({ error: "Failed to fetch agents" });
    }
  });

  router.get("/agents/:id", authenticateToken, async (req: AuthRequest, res) => {
    try {
      const agentId = req.params.id;
      const retellClient = createRetellClient();
      let agent = null;

      if (retellClient && !isNaN(parseInt(agentId))) {
        try {
          // If it's a numeric ID, try local storage first, then Retell
          const localAgent = await storage.getAgent(parseInt(agentId));
          if (localAgent && localAgent.retellAgentId) {
            // Get detailed info from Retell
            const retellAgent = await retellClient.getAgent(localAgent.retellAgentId);
            agent = { ...localAgent, ...retellAgent };
          } else {
            agent = localAgent;
          }
        } catch (retellError) {
          console.warn("Failed to fetch from Retell API:", retellError);
          agent = await storage.getAgent(parseInt(agentId));
        }
      } else if (retellClient) {
        try {
          // Try to get directly from Retell with the provided ID
          agent = await retellClient.getAgent(agentId);
        } catch (retellError) {
          console.warn("Failed to fetch from Retell API:", retellError);
          return res.status(404).json({ error: "Agent not found" });
        }
      } else {
        // No API key, use local storage
        const id = parseInt(agentId);
        if (isNaN(id)) {
          return res.status(400).json({ error: "Invalid agent ID" });
        }
        agent = await storage.getAgent(id);
      }

      if (!agent) {
        return res.status(404).json({ error: "Agent not found" });
      }
      res.json(agent);
    } catch (error) {
      console.error("Failed to fetch agent:", error);
      res.status(500).json({ error: "Failed to fetch agent" });
    }
  });

  router.post("/agents", authenticateToken, async (req: AuthRequest, res) => {
    try {
      const agentData = insertAgentSchema.parse(req.body);
      const agent = await storage.createAgent(agentData);
      res.status(201).json(agent);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid agent data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create agent" });
    }
  });

  router.put("/agents/:id", authenticateToken, async (req: AuthRequest, res) => {
    try {
      const id = parseInt(req.params.id);
      const updateData = insertAgentSchema.partial().parse(req.body);
      const agent = await storage.updateAgent(id, updateData);
      if (!agent) {
        return res.status(404).json({ error: "Agent not found" });
      }
      res.json(agent);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid agent data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to update agent" });
    }
  });

  router.delete("/agents/:id", authenticateToken, async (req: AuthRequest, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteAgent(id);
      if (!success) {
        return res.status(404).json({ error: "Agent not found" });
      }
      res.json({ message: "Agent deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete agent" });
    }
  });

  // Batch calls routes
  router.get("/batch-calls", authenticateToken, async (req: AuthRequest, res) => {
    try {
      const batchCalls = await storage.getBatchCalls();
      res.json(batchCalls);
    } catch (error) {
      console.error("Failed to get batch calls:", error);
      res.status(500).json({ error: "Failed to retrieve batch calls" });
    }
  });

  // Lead routes (protected)
  router.get("/leads", authenticateToken, async (req: AuthRequest, res) => {
    try {
      const leads = await storage.getLeads();
      res.json(leads);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch leads" });
    }
  });

  router.get("/leads/:id", authenticateToken, async (req: AuthRequest, res) => {
    try {
      const id = parseInt(req.params.id);
      const lead = await storage.getLead(id);
      if (!lead) {
        return res.status(404).json({ error: "Lead not found" });
      }
      res.json(lead);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch lead" });
    }
  });

  router.post("/leads", authenticateToken, async (req: AuthRequest, res) => {
    try {
      const leadData = insertLeadSchema.parse(req.body);
      const lead = await storage.createLead(leadData);
      res.status(201).json(lead);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid lead data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create lead" });
    }
  });

  router.put("/leads/:id", authenticateToken, async (req: AuthRequest, res) => {
    try {
      const id = parseInt(req.params.id);
      const updateData = insertLeadSchema.partial().parse(req.body);
      const lead = await storage.updateLead(id, updateData);
      if (!lead) {
        return res.status(404).json({ error: "Lead not found" });
      }
      res.json(lead);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid lead data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to update lead" });
    }
  });

  router.delete("/leads/:id", authenticateToken, async (req: AuthRequest, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteLead(id);
      if (!success) {
        return res.status(404).json({ error: "Lead not found" });
      }
      res.json({ message: "Lead deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete lead" });
    }
  });

  // Call routes (protected)
  router.get("/calls", authenticateToken, async (req: AuthRequest, res) => {
    try {
      const calls = await storage.getCalls();
      res.json(calls);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch calls" });
    }
  });

  router.get("/calls/:id", authenticateToken, async (req: AuthRequest, res) => {
    try {
      const id = parseInt(req.params.id);
      const call = await storage.getCall(id);
      if (!call) {
        return res.status(404).json({ error: "Call not found" });
      }
      res.json(call);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch call" });
    }
  });

  router.post("/calls", authenticateToken, async (req: AuthRequest, res) => {
    try {
      const callData = insertCallSchema.parse(req.body);
      const call = await storage.createCall(callData);
      res.status(201).json(call);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid call data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create call" });
    }
  });

  // Outbound calls routes (protected)
  router.post("/outbound-calls/single", authenticateToken, async (req: AuthRequest, res) => {
    try {
      const { from_number, to_number, override_agent_id, metadata, retell_llm_dynamic_variables } = req.body;

      if (!from_number || !to_number) {
        return res.status(400).json({ error: "from_number and to_number are required" });
      }

      const retellClient = createRetellClient();
      let retellResponse;

      if (retellClient) {
        // Use actual Retell AI API
        try {
          retellResponse = await retellClient.createPhoneCall({
            from_number,
            to_number,
            override_agent_id,
            metadata,
            retell_llm_dynamic_variables
          });
        } catch (retellError) {
          console.error("Retell API error:", retellError);
          return res.status(500).json({ error: "Failed to create call with Retell AI" });
        }
      } else {
        // Fallback to mock response when API key is not available
        retellResponse = {
          call_type: "phone_call",
          from_number,
          to_number,
          direction: "outbound",
          call_id: `call_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          agent_id: override_agent_id || "default_agent",
          agent_version: 1,
          call_status: "registered",
          metadata: metadata || {},
          retell_llm_dynamic_variables: retell_llm_dynamic_variables || {}
        };
      }

      // Store the call in our database
      const callData = {
        sessionId: retellResponse.call_id,
        fromNumber: from_number,
        toNumber: to_number,
        status: retellResponse.call_status || "registered",
        agentId: override_agent_id ? parseInt(override_agent_id) : null,
        endReason: null,
        sentiment: null,
        outcome: null,
        duration: null,
        cost: null,
        latency: null,
        leadId: null
      };

      const call = await storage.createCall(callData);
      res.status(201).json({ ...retellResponse, db_call_id: call.id });
    } catch (error) {
      console.error("Error creating outbound call:", error);
      res.status(500).json({ error: "Failed to create outbound call" });
    }
  });

  router.post("/outbound-calls/batch", authenticateToken, async (req: AuthRequest, res) => {
    try {
      const { from_number, tasks, name, trigger_timestamp, override_agent_id } = req.body;

      if (!from_number || !tasks || !Array.isArray(tasks) || tasks.length === 0) {
        return res.status(400).json({ error: "from_number and tasks array are required" });
      }

      if (!name || name.trim() === "") {
        return res.status(400).json({ error: "Batch name is required" });
      }

      if (!override_agent_id) {
        return res.status(400).json({ error: "Agent selection is required" });
      }

      // Validate tasks
      for (const task of tasks) {
        if (!task.to_number) {
          return res.status(400).json({ error: "Each task must have a to_number" });
        }
      }

      // Validate agent exists
      const agent = await storage.getAgent(parseInt(override_agent_id));
      if (!agent) {
        return res.status(400).json({ error: "Selected agent not found" });
      }

      const retellClient = createRetellClient();
      let retellResponse;

      if (retellClient) {
        // Use actual Retell AI Batch API
        try {
          retellResponse = await retellClient.createBatchCall({
            from_number,
            tasks,
            name: name.trim(),
            trigger_timestamp,
            override_agent_id
          });
        } catch (retellError) {
          console.error("Retell Batch API error:", retellError);
          return res.status(500).json({ error: "Failed to create batch call with Retell AI" });
        }
      } else {
        // Fallback to mock response when API key is not available
        const batchCallId = `batch_call_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        retellResponse = {
          batch_call_id: batchCallId,
          name: name.trim(),
          from_number,
          scheduled_timestamp: trigger_timestamp || Math.floor(Date.now() / 1000),
          total_task_count: tasks.length,
          agent_id: override_agent_id
        };
      }

      // First create the batch call record
      const batchCallData = {
        batchCallId: retellResponse.batch_call_id,
        name: name.trim(),
        fromNumber: from_number,
        status: trigger_timestamp ? "scheduled" : "registered",
        totalTaskCount: tasks.length,
        completedCount: 0,
        successfulCount: 0,
        scheduledTimestamp: trigger_timestamp,
        agentId: parseInt(override_agent_id),
        createdBy: req.user!.id
      };

      const batchCall = await storage.createBatchCall(batchCallData);

      // Store individual calls for each task
      const createdCalls = [];
      for (let i = 0; i < tasks.length; i++) {
        const task = tasks[i];
        const callData = {
          sessionId: `${retellResponse.batch_call_id}_task_${i + 1}`,
          fromNumber: from_number,
          toNumber: task.to_number,
          status: trigger_timestamp ? "scheduled" : "registered",
          agentId: parseInt(override_agent_id),
          batchCallId: batchCall.id,
          endReason: null,
          sentiment: null,
          outcome: null,
          duration: null,
          cost: null,
          latency: null,
          leadId: null
        };

        const call = await storage.createCall(callData);
        createdCalls.push(call);
      }

      res.status(201).json({
        ...retellResponse,
        batch_id: batchCall.id,
        created_calls: createdCalls.map(call => ({ id: call.id, session_id: call.sessionId })),
        message: `Batch call "${name.trim()}" created successfully with ${tasks.length} tasks`,
        success: true
      });
    } catch (error) {
      console.error("Error creating batch call:", error);
      res.status(500).json({ error: "Failed to create batch call" });
    }
  });

  // Web call creation for testing (protected)
  router.post("/web-calls", authenticateToken, async (req: AuthRequest, res) => {
    try {
      const { agent_id } = req.body;

      if (!agent_id) {
        return res.status(400).json({ error: "agent_id is required" });
      }

      const retellClient = createRetellClient();
      let webCallResponse;

      if (retellClient) {
        try {
          webCallResponse = await retellClient.createWebCall({ agent_id });
        } catch (retellError) {
          console.error("Retell web call API error:", retellError);
          return res.status(500).json({ error: "Failed to create web call with Retell AI" });
        }
      } else {
        // Fallback mock response
        webCallResponse = {
          web_call_id: `web_call_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          agent_id: agent_id,
          call_status: "registered",
          access_token: `mock_token_${Math.random().toString(36).substr(2, 16)}`
        };
      }

      res.status(201).json(webCallResponse);
    } catch (error) {
      console.error("Error creating web call:", error);
      res.status(500).json({ error: "Failed to create web call" });
    }
  });

  // Simple agents endpoint for dropdowns (protected)
  router.get("/agents/simple", authenticateToken, async (req: AuthRequest, res) => {
    try {
      const retellClient = createRetellClient();
      let agents = [];

      if (retellClient) {
        try {
          const retellAgents = await retellClient.listAgents();
          agents = retellAgents.agents || [];
        } catch (retellError) {
          console.warn("Failed to fetch from Retell API, using local data:", retellError);
          agents = await storage.getAgents();
        }
      } else {
        agents = await storage.getAgents();
      }

      const simpleAgents = agents.map((agent: any, index: number) => ({
        id: agent.agent_id || agent.id,
        name: agent.agent_name || agent.name || "Unnamed Agent",
        phone: agent.phone || "+1(555)000-0000",
        voice: agent.voice_id || agent.voice || "Default",
        avatar: (agent.agent_name || agent.name || "AG").split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
      }));

      res.json(simpleAgents);
    } catch (error) {
      console.error("Failed to fetch simple agents:", error);
      res.status(500).json({ error: "Failed to fetch agents" });
    }
  });

  // Get detailed call data (protected)
  router.get("/calls/:callId/details", authenticateToken, async (req: AuthRequest, res) => {
    try {
      const callId = req.params.callId;
      const retellClient = createRetellClient();

      if (retellClient) {
        try {
          const callData = await retellClient.getCall(callId);
          res.json(callData);
        } catch (retellError) {
          console.error("Failed to fetch call from Retell:", retellError);
          res.status(404).json({ error: "Call not found in Retell API" });
        }
      } else {
        // Fallback to local data
        const localCall = await storage.getCall(parseInt(callId));
        if (!localCall) {
          return res.status(404).json({ error: "Call not found" });
        }
        res.json(localCall);
      }
    } catch (error) {
      console.error("Failed to fetch call details:", error);
      res.status(500).json({ error: "Failed to fetch call details" });
    }
  });

  // List calls with filtering (protected)
  router.post("/calls/list", authenticateToken, async (req: AuthRequest, res) => {
    try {
      const { filter_criteria, sort_order, limit, pagination_key } = req.body;
      const retellClient = createRetellClient();

      if (retellClient) {
        try {
          const callsData = await retellClient.listCalls(filter_criteria, sort_order, limit, pagination_key);
          res.json(callsData);
        } catch (retellError) {
          console.error("Failed to fetch calls from Retell:", retellError);
          // Fallback to local data
          const localCalls = await storage.getCalls();
          res.json(localCalls);
        }
      } else {
        // Use local data when no API key
        const localCalls = await storage.getCalls();
        res.json(localCalls);
      }
    } catch (error) {
      console.error("Failed to list calls:", error);
      res.status(500).json({ error: "Failed to list calls" });
    }
  });

  // Analytics routes (protected)
  router.get("/analytics/stats", authenticateToken, async (req: AuthRequest, res) => {
    try {
      const leads = await storage.getLeads();
      const calls = await storage.getCalls();
      const agents = await storage.getAgents();
      const retellClient = createRetellClient();

      let enhancedStats = {
        totalLeads: leads.length,
        hotLeads: leads.filter(lead => lead.type === "Hot Lead").length,
        callbacksDue: leads.filter(lead => lead.status === "Callback Due").length,
        totalCalls: calls.length,
        successfulCalls: calls.filter(call => call.status === "completed").length,
        activeAgents: agents.length,
        conversionRate: leads.length > 0 ? Math.round((leads.filter(lead => lead.status === "Converted").length / leads.length) * 100) : 0,
        averageCallDuration: 0,
        positivesentimentCalls: 0,
        inboundCalls: 0,
        outboundCalls: 0
      };

      // If Retell client is available, get enhanced analytics
      if (retellClient) {
        try {
          const retellCalls = await retellClient.listCalls({}, 'descending', 100);
          if (retellCalls && Array.isArray(retellCalls)) {
            const callsWithDuration = retellCalls.filter(call => call.duration_ms);
            enhancedStats.averageCallDuration = callsWithDuration.length > 0 
              ? Math.round(callsWithDuration.reduce((sum, call) => sum + call.duration_ms, 0) / callsWithDuration.length / 1000)
              : 0;
            
            enhancedStats.positivesentimentCalls = retellCalls.filter(call => 
              call.call_analysis?.user_sentiment === 'Positive'
            ).length;
            
            enhancedStats.inboundCalls = retellCalls.filter(call => call.direction === 'inbound').length;
            enhancedStats.outboundCalls = retellCalls.filter(call => call.direction === 'outbound').length;
          }
        } catch (retellError) {
          console.warn("Failed to get enhanced analytics from Retell:", retellError);
        }
      }

      res.json(enhancedStats);
    } catch (error) {
      console.error("Failed to fetch analytics:", error);
      res.status(500).json({ error: "Failed to fetch analytics" });
    }
  });

  app.use("/api", router);

  const httpServer = createServer(app);
  return httpServer;
}