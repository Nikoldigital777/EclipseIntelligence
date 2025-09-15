import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertAgentSchema, insertLeadSchema, insertCallSchema } from "@shared/schema";
import { z } from "zod";
import { createRetellClient } from "./retell-client";

export async function registerRoutes(app: Express): Promise<Server> {
  // Agent routes
  app.get("/api/agents", async (req, res) => {
    try {
      const agents = await storage.getAgents();
      res.json(agents);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch agents" });
    }
  });

  app.get("/api/agents/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const agent = await storage.getAgent(id);
      if (!agent) {
        return res.status(404).json({ error: "Agent not found" });
      }
      res.json(agent);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch agent" });
    }
  });

  app.post("/api/agents", async (req, res) => {
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

  app.put("/api/agents/:id", async (req, res) => {
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

  app.delete("/api/agents/:id", async (req, res) => {
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

  // Lead routes
  app.get("/api/leads", async (req, res) => {
    try {
      const leads = await storage.getLeads();
      res.json(leads);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch leads" });
    }
  });

  app.get("/api/leads/:id", async (req, res) => {
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

  app.post("/api/leads", async (req, res) => {
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

  app.put("/api/leads/:id", async (req, res) => {
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

  app.delete("/api/leads/:id", async (req, res) => {
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

  // Call routes
  app.get("/api/calls", async (req, res) => {
    try {
      const calls = await storage.getCalls();
      res.json(calls);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch calls" });
    }
  });

  app.get("/api/calls/:id", async (req, res) => {
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

  app.post("/api/calls", async (req, res) => {
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

  // Outbound calls routes
  app.post("/api/outbound-calls/single", async (req, res) => {
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

  app.post("/api/outbound-calls/batch", async (req, res) => {
    try {
      const { from_number, tasks, name, trigger_timestamp, override_agent_id } = req.body;
      
      if (!from_number || !tasks || !Array.isArray(tasks) || tasks.length === 0) {
        return res.status(400).json({ error: "from_number and tasks array are required" });
      }

      // Validate tasks
      for (const task of tasks) {
        if (!task.to_number) {
          return res.status(400).json({ error: "Each task must have a to_number" });
        }
      }

      const retellClient = createRetellClient();
      let retellResponse;

      if (retellClient) {
        // Use actual Retell AI Batch API
        try {
          retellResponse = await retellClient.createBatchCall({
            from_number,
            tasks,
            name,
            trigger_timestamp
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
          name: name || `Batch call ${new Date().toISOString()}`,
          from_number,
          scheduled_timestamp: trigger_timestamp || Math.floor(Date.now() / 1000),
          total_task_count: tasks.length
        };
      }

      // Store individual calls for each task
      const createdCalls = [];
      for (const task of tasks) {
        const callData = {
          sessionId: `${retellResponse.batch_call_id}_task_${createdCalls.length}`,
          fromNumber: from_number,
          toNumber: task.to_number,
          status: trigger_timestamp ? "scheduled" : "registered",
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
        createdCalls.push(call);
      }

      res.status(201).json({ 
        ...retellResponse, 
        created_calls: createdCalls.map(call => call.id),
        message: `Batch call created with ${tasks.length} tasks`
      });
    } catch (error) {
      console.error("Error creating batch call:", error);
      res.status(500).json({ error: "Failed to create batch call" });
    }
  });

  // Analytics routes
  app.get("/api/analytics/stats", async (req, res) => {
    try {
      const leads = await storage.getLeads();
      const calls = await storage.getCalls();
      const agents = await storage.getAgents();

      const stats = {
        totalLeads: leads.length,
        hotLeads: leads.filter(lead => lead.type === "Hot Lead").length,
        callbacksDue: leads.filter(lead => lead.status === "Callback Due").length,
        totalCalls: calls.length,
        successfulCalls: calls.filter(call => call.status === "completed").length,
        activeAgents: agents.length,
        conversionRate: leads.length > 0 ? Math.round((leads.filter(lead => lead.status === "Converted").length / leads.length) * 100) : 0,
      };

      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch analytics" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
