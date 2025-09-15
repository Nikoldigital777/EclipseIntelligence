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
  // Settings routes
  router.get('/settings/api-key-status', authenticateToken, async (req: AuthRequest, res) => {
    try {
      const apiKey = process.env.RETELL_API_KEY;

      if (apiKey && apiKey.length > 0) {
        // Return first 8 characters + masked remainder + last 2 characters for display
        const preview = `${apiKey.substring(0, 8)}${'*'.repeat(Math.max(0, apiKey.length - 10))}${apiKey.slice(-2)}`;
        res.json({
          hasApiKey: true,
          apiKeyPreview: preview
        });
      } else {
        res.json({
          hasApiKey: false,
          apiKeyPreview: null
        });
      }
    } catch (error) {
      console.error("Failed to check API key status:", error);
      res.status(500).json({ error: "Failed to check API key status" });
    }
  });

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

  // Simple agents endpoint for dropdowns (protected) - must come before /agents/:id
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
      let comprehensiveAgentData = {};

      // Check if it's a Retell agent ID format (starts with 'agent_')
      if (agentId.startsWith('agent_')) {
        // Try to find local agent by Retell ID first
        const localAgent = await storage.getAgentByRetellId(agentId);

        if (retellClient) {
          try {
            // Get comprehensive agent data from Retell API
            const retellAgent = await retellClient.getAgent(agentId);
            agent = localAgent ? { ...localAgent, ...retellAgent } : retellAgent;

            // Get comprehensive LLM details if response_engine contains llm_id
            if (retellAgent.response_engine?.llm_id) {
              try {
                const llmData = await retellClient.getLlm(retellAgent.response_engine.llm_id);
                comprehensiveAgentData.llm_details = {
                  llm_id: llmData.llm_id,
                  version: llmData.version,
                  is_published: llmData.is_published,
                  model: llmData.model,
                  s2s_model: llmData.s2s_model,
                  model_temperature: llmData.model_temperature,
                  model_high_priority: llmData.model_high_priority,
                  tool_call_strict_mode: llmData.tool_call_strict_mode,
                  general_prompt: llmData.general_prompt,
                  general_tools: llmData.general_tools || [],
                  states: llmData.states || [],
                  starting_state: llmData.starting_state,
                  begin_message: llmData.begin_message,
                  default_dynamic_variables: llmData.default_dynamic_variables || {},
                  knowledge_base_ids: llmData.knowledge_base_ids || [],
                  kb_config: llmData.kb_config,
                  last_modification_timestamp: llmData.last_modification_timestamp,
                  // Legacy fields for backward compatibility
                  temperature: llmData.model_temperature,
                  max_tokens: llmData.max_tokens,
                  first_message: llmData.begin_message,
                  system_message: llmData.general_prompt,
                  tools: llmData.general_tools || []
                };
              } catch (llmError) {
                console.warn("Failed to fetch LLM details:", llmError);
              }
            }

            // Structure comprehensive voice data
            comprehensiveAgentData.voice_config = {
              voice_id: retellAgent.voice_id,
              voice_model: retellAgent.voice_model,
              voice_temperature: retellAgent.voice_temperature,
              voice_speed: retellAgent.voice_speed,
              fallback_voice_ids: retellAgent.fallback_voice_ids,
              volume: retellAgent.volume,
              normalize_for_speech: retellAgent.normalize_for_speech,
              pronunciation_dictionary: retellAgent.pronunciation_dictionary
            };

            // Structure conversation settings
            comprehensiveAgentData.conversation_config = {
              language: retellAgent.language,
              responsiveness: retellAgent.responsiveness,
              interruption_sensitivity: retellAgent.interruption_sensitivity,
              enable_backchannel: retellAgent.enable_backchannel,
              backchannel_frequency: retellAgent.backchannel_frequency,
              backchannel_words: retellAgent.backchannel_words,
              reminder_trigger_ms: retellAgent.reminder_trigger_ms,
              reminder_max_count: retellAgent.reminder_max_count,
              end_call_after_silence_ms: retellAgent.end_call_after_silence_ms,
              max_call_duration_ms: retellAgent.max_call_duration_ms
            };

            // Structure call handling settings
            comprehensiveAgentData.call_config = {
              webhook_url: retellAgent.webhook_url,
              webhook_timeout_ms: retellAgent.webhook_timeout_ms,
              begin_message_delay_ms: retellAgent.begin_message_delay_ms,
              ring_duration_ms: retellAgent.ring_duration_ms,
              voicemail_option: retellAgent.voicemail_option,
              ambient_sound: retellAgent.ambient_sound,
              ambient_sound_volume: retellAgent.ambient_sound_volume
            };

            // Structure speech recognition settings
            comprehensiveAgentData.speech_config = {
              stt_mode: retellAgent.stt_mode,
              vocab_specialization: retellAgent.vocab_specialization,
              boosted_keywords: retellAgent.boosted_keywords,
              allow_user_dtmf: retellAgent.allow_user_dtmf,
              user_dtmf_options: retellAgent.user_dtmf_options,
              denoising_mode: retellAgent.denoising_mode
            };

            // Structure analytics and privacy settings
            comprehensiveAgentData.analytics_config = {
              data_storage_setting: retellAgent.data_storage_setting,
              opt_in_signed_url: retellAgent.opt_in_signed_url,
              post_call_analysis_data: retellAgent.post_call_analysis_data,
              post_call_analysis_model: retellAgent.post_call_analysis_model,
              pii_config: retellAgent.pii_config
            };

          } catch (retellError) {
            console.warn("Failed to fetch from Retell API:", retellError);
            agent = localAgent;
          }
        } else {
          agent = localAgent;
        }
      } else if (!isNaN(parseInt(agentId))) {
        // Numeric ID - local database lookup
        const localAgent = await storage.getAgent(parseInt(agentId));

        if (localAgent && localAgent.retellAgentId && retellClient) {
          try {
            // Get comprehensive agent data from Retell API
            const retellAgent = await retellClient.getAgent(localAgent.retellAgentId);
            agent = { ...localAgent, ...retellAgent };

            // Get LLM details if available
            if (retellAgent.response_engine?.llm_id) {
              try {
                const llmData = await retellClient.getLlm(retellAgent.response_engine.llm_id);
                comprehensiveAgentData.llm_details = {
                  general_prompt: llmData.general_prompt,
                  model: llmData.model,
                  temperature: llmData.temperature,
                  max_tokens: llmData.max_tokens,
                  first_message: llmData.first_message,
                  system_message: llmData.system_message,
                  tools: llmData.tools || []
                };
              } catch (llmError) {
                console.warn("Failed to fetch LLM details:", llmError);
              }
            }

            // Add all the comprehensive config data as above
            comprehensiveAgentData.voice_config = {
              voice_id: retellAgent.voice_id,
              voice_model: retellAgent.voice_model,
              voice_temperature: retellAgent.voice_temperature,
              voice_speed: retellAgent.voice_speed,
              fallback_voice_ids: retellAgent.fallback_voice_ids,
              volume: retellAgent.volume,
              normalize_for_speech: retellAgent.normalize_for_speech,
              pronunciation_dictionary: retellAgent.pronunciation_dictionary
            };

            comprehensiveAgentData.conversation_config = {
              language: retellAgent.language,
              responsiveness: retellAgent.responsiveness,
              interruption_sensitivity: retellAgent.interruption_sensitivity,
              enable_backchannel: retellAgent.enable_backchannel,
              backchannel_frequency: retellAgent.backchannel_frequency,
              backchannel_words: retellAgent.backchannel_words,
              reminder_trigger_ms: retellAgent.reminder_trigger_ms,
              reminder_max_count: retellAgent.reminder_max_count,
              end_call_after_silence_ms: retellAgent.end_call_after_silence_ms,
              max_call_duration_ms: retellAgent.max_call_duration_ms
            };

          } catch (retellError) {
            console.warn("Failed to fetch from Retell API:", retellError);
            agent = localAgent;
          }
        } else {
          agent = localAgent;
        }
      }

      if (!agent) {
        // Fallback to mock data with real agent details
        let mockAgent: Agent;

        if (agentId === "agent_aaf7c603e65435169a888c3768") {
          mockAgent = {
            id: 1,
            agent_id: "agent_aaf7c603e65435169a888c3768",
            retellAgentId: "agent_aaf7c603e65435169a888c3768",
            name: "Madison Receptionist Agent",
            type: "Inbound Receptionist",
            voice: "Madison Professional",
            phone: "+1(248)283-4180",
            description: "Professional inbound receptionist",
            editedBy: "System",
            editedAt: "07/03/2025, 19:43",
            avatar: "MR",
            prompt: `### You are Madison, a professional receptionist at RE/MAX Eclipse...

Your role is to:
- Answer incoming calls professionally and courteously
- Schedule appointments and manage calendars
- Route calls to appropriate agents
- Take detailed messages when agents are unavailable
- Provide basic information about services
- Maintain a warm, welcoming tone at all times

Remember to always be helpful, patient, and represent the company professionally.`
          };
        } else if (agentId === "agent_a1d03a295d3c542d90eecc826e") {
          mockAgent = {
            id: 2,
            agent_id: "agent_a1d03a295d3c542d90eecc826e",
            retellAgentId: "agent_a1d03a295d3c542d90eecc826e",
            name: "Levan Outbound Recruiting Agent",
            type: "Outbound Recruiting",
            voice: "Levan RE/MAX",
            phone: "+1(248)283-4181",
            description: "Outbound recruiting specialist",
            editedBy: "System",
            editedAt: "07/03/2025, 19:43",
            avatar: "LR",
            prompt: `### You are Levan, a professional recruiting specialist at RE/MAX Eclipse...

Your role is to:
- Contact potential real estate agents to join our team
- Explain the benefits of working with RE/MAX Eclipse
- Schedule interviews and meetings with qualified candidates
- Follow up on recruiting leads
- Maintain professional and persuasive communication

Remember to be confident, informative, and highlight the unique advantages of our brokerage.`
          };
        } else if (agentId === "agent_c6fd1025f906a4561df5437214") {
          mockAgent = {
            id: 3,
            agent_id: "agent_c6fd1025f906a4561df5437214",
            retellAgentId: "agent_c6fd1025f906a4561df5437214",
            name: "Levan Outbound Listing Agent",
            type: "Outbound Listing",
            voice: "Levan RE/MAX",
            phone: "+1(248)283-4182",
            description: "Outbound listing specialist",
            editedBy: "System",
            editedAt: "07/03/2025, 19:43",
            avatar: "LL",
            prompt: `### You are Levan, a professional listing specialist at RE/MAX Eclipse...

Your role is to:
- Contact homeowners about listing their properties
- Provide market analysis and pricing guidance
- Schedule listing appointments
- Follow up on listing leads
- Explain our marketing strategies and services

Remember to be knowledgeable about the market, professional, and focused on helping sellers achieve their goals.`
          };
        } else {
          mockAgent = {
            id: parseInt(agentId) || 1,
            agent_id: agentId,
            retellAgentId: agentId,
            name: "Unknown Agent",
            type: "General",
            voice: "Default",
            phone: "+1(555)000-0000",
            description: "AI Agent",
            editedBy: "System",
            editedAt: "07/03/2025, 19:43",
            avatar: "AG",
            prompt: "You are a helpful AI assistant."
          };
        }
        agent = mockAgent;
      }

      if (!agent) {
        return res.status(404).json({ error: "Agent not found" });
      }

      // Return agent with comprehensive configuration data
      res.json({
        ...agent,
        ...comprehensiveAgentData
      });
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
        outboundCalls: 0,
        totalCost: 0,
        averageLatency: 0,
        callSuccessRate: 0,
        sentimentBreakdown: {
          positive: 0,
          neutral: 0,
          negative: 0,
          frustrated: 0,
          satisfied: 0
        },
        weeklyTrends: [],
        topPerformingAgents: []
      };

      // If Retell client is available, get comprehensive analytics
      if (retellClient) {
        try {
          const retellCalls = await retellClient.listCalls({}, 'descending', 500); // Get more data for better analytics

          if (retellCalls && retellCalls.calls && Array.isArray(retellCalls.calls)) {
            const validCalls = retellCalls.calls;
            enhancedStats.totalCalls = validCalls.length;

            // Calculate duration metrics
            const callsWithDuration = validCalls.filter(call => call.duration_ms && call.duration_ms > 0);
            enhancedStats.averageCallDuration = callsWithDuration.length > 0
              ? Math.round(callsWithDuration.reduce((sum, call) => sum + call.duration_ms, 0) / callsWithDuration.length / 1000)
              : 0;

            // Calculate cost metrics
            const callsWithCost = validCalls.filter(call => call.call_cost_breakdown?.total_cost);
            enhancedStats.totalCost = callsWithCost.length > 0
              ? callsWithCost.reduce((sum, call) => sum + parseFloat(call.call_cost_breakdown.total_cost), 0)
              : 0;

            // Calculate latency metrics
            const callsWithLatency = validCalls.filter(call => call.latency?.avg_latency_ms);
            enhancedStats.averageLatency = callsWithLatency.length > 0
              ? Math.round(callsWithLatency.reduce((sum, call) => sum + call.latency.avg_latency_ms, 0) / callsWithLatency.length)
              : 0;

            // Calculate success rate based on call analysis
            const callsWithAnalysis = validCalls.filter(call => call.call_analysis?.call_successful !== undefined);
            const successfulCallsCount = validCalls.filter(call => call.call_analysis?.call_successful === true).length;
            enhancedStats.callSuccessRate = callsWithAnalysis.length > 0
              ? Math.round((successfulCallsCount / callsWithAnalysis.length) * 100)
              : 0;
            enhancedStats.successfulCalls = successfulCallsCount;

            // Sentiment analysis
            const sentimentCounts = {
              positive: 0,
              neutral: 0,
              negative: 0,
              frustrated: 0,
              satisfied: 0
            };

            validCalls.forEach(call => {
              const sentiment = call.call_analysis?.user_sentiment?.toLowerCase();
              if (sentiment && sentimentCounts.hasOwnProperty(sentiment)) {
                sentimentCounts[sentiment]++;
              }
            });

            enhancedStats.sentimentBreakdown = sentimentCounts;
            enhancedStats.positivesentimentCalls = sentimentCounts.positive + sentimentCounts.satisfied;

            // Direction analysis
            enhancedStats.inboundCalls = validCalls.filter(call => call.direction === 'inbound').length;
            enhancedStats.outboundCalls = validCalls.filter(call => call.direction === 'outbound').length;

            // Weekly trends (last 7 days)
            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

            const weeklyData = [];
            for (let i = 6; i >= 0; i--) {
              const date = new Date();
              date.setDate(date.getDate() - i);
              const dayStart = new Date(date.setHours(0, 0, 0, 0));
              const dayEnd = new Date(date.setHours(23, 59, 59, 999));

              const dayCalls = validCalls.filter(call => {
                const callDate = new Date(call.start_timestamp);
                return callDate >= dayStart && callDate <= dayEnd;
              });

              weeklyData.push({
                date: dayStart.toISOString().split('T')[0],
                calls: dayCalls.length,
                successful: dayCalls.filter(call => call.call_analysis?.call_successful === true).length,
                duration: dayCalls.reduce((sum, call) => sum + (call.duration_ms || 0), 0) / 1000 / 60, // in minutes
                cost: dayCalls.reduce((sum, call) => sum + parseFloat(call.call_cost_breakdown?.total_cost || 0), 0)
              });
            }
            enhancedStats.weeklyTrends = weeklyData;

            // Top performing agents
            const agentPerformance = {};
            validCalls.forEach(call => {
              const agentId = call.agent_id;
              if (!agentPerformance[agentId]) {
                agentPerformance[agentId] = {
                  agent_id: agentId,
                  total_calls: 0,
                  successful_calls: 0,
                  total_duration: 0,
                  positive_sentiment: 0
                };
              }

              agentPerformance[agentId].total_calls++;
              if (call.call_analysis?.call_successful) agentPerformance[agentId].successful_calls++;
              agentPerformance[agentId].total_duration += call.duration_ms || 0;
              if (['positive', 'satisfied'].includes(call.call_analysis?.user_sentiment?.toLowerCase())) {
                agentPerformance[agentId].positive_sentiment++;
              }
            });

            enhancedStats.topPerformingAgents = Object.values(agentPerformance)
              .map(agent => ({
                ...agent,
                success_rate: agent.total_calls > 0 ? Math.round((agent.successful_calls / agent.total_calls) * 100) : 0,
                avg_duration: agent.total_calls > 0 ? Math.round(agent.total_duration / agent.total_calls / 1000) : 0,
                sentiment_rate: agent.total_calls > 0 ? Math.round((agent.positive_sentiment / agent.total_calls) * 100) : 0
              }))
              .sort((a, b) => b.success_rate - a.success_rate)
              .slice(0, 5);

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

  // Detailed analytics for reports (protected)
  router.get("/analytics/detailed", authenticateToken, async (req: AuthRequest, res) => {
    try {
      const { timeframe = '30d', metrics = 'all' } = req.query;
      const retellClient = createRetellClient();

      if (!retellClient) {
        return res.status(503).json({ error: "Retell AI integration not configured" });
      }

      // Calculate date range
      const endDate = new Date();
      const startDate = new Date();

      switch (timeframe) {
        case '24h':
          startDate.setHours(startDate.getHours() - 24);
          break;
        case '7d':
          startDate.setDate(startDate.getDate() - 7);
          break;
        case '30d':
          startDate.setDate(startDate.getDate() - 30);
          break;
        case '90d':
          startDate.setDate(startDate.getDate() - 90);
          break;
        default:
          startDate.setDate(startDate.getDate() - 30);
      }

      const filterCriteria = {
        start_timestamp: Math.floor(startDate.getTime() / 1000),
        end_timestamp: Math.floor(endDate.getTime() / 1000)
      };

      const callsData = await retellClient.listCalls(filterCriteria, 'descending', 1000);
      const calls = callsData.calls || [];

      const analytics = {
        summary: {
          total_calls: calls.length,
          total_duration_hours: calls.reduce((sum, call) => sum + (call.duration_ms || 0), 0) / 1000 / 3600,
          total_cost: calls.reduce((sum, call) => sum + parseFloat(call.call_cost_breakdown?.total_cost || 0), 0),
          success_rate: calls.length > 0 ? (calls.filter(call => call.call_analysis?.call_successful).length / calls.length * 100) : 0,
          avg_call_duration: calls.length > 0 ? calls.reduce((sum, call) => sum + (call.duration_ms || 0), 0) / calls.length / 1000 : 0
        },
        call_volume: {
          by_hour: {},
          by_day: {},
          by_direction: {
            inbound: calls.filter(call => call.direction === 'inbound').length,
            outbound: calls.filter(call => call.direction === 'outbound').length
          }
        },
        performance: {
          sentiment_distribution: {},
          success_by_agent: {},
          latency_stats: {
            avg_latency: 0,
            p95_latency: 0,
            p99_latency: 0
          },
          cost_analysis: {
            cost_per_call: 0,
            cost_per_minute: 0,
            cost_by_direction: {}
          }
        },
        quality_metrics: {
          call_completion_rate: 0,
          average_rating: 0,
          escalation_rate: 0,
          resolution_rate: 0
        }
      };

      // Process sentiment distribution
      const sentimentCounts = {};
      calls.forEach(call => {
        const sentiment = call.call_analysis?.user_sentiment || 'unknown';
        sentimentCounts[sentiment] = (sentimentCounts[sentiment] || 0) + 1;
      });
      analytics.performance.sentiment_distribution = sentimentCounts;

      // Process agent performance
      const agentStats = {};
      calls.forEach(call => {
        const agentId = call.agent_id || 'unknown';
        if (!agentStats[agentId]) {
          agentStats[agentId] = { total: 0, successful: 0, duration: 0, cost: 0 };
        }
        agentStats[agentId].total++;
        if (call.call_analysis?.call_successful) agentStats[agentId].successful++;
        agentStats[agentId].duration += call.duration_ms || 0;
        agentStats[agentId].cost += parseFloat(call.call_cost_breakdown?.total_cost || 0);
      });

      Object.keys(agentStats).forEach(agentId => {
        const stats = agentStats[agentId];
        analytics.performance.success_by_agent[agentId] = {
          success_rate: (stats.successful / stats.total * 100),
          avg_duration: stats.duration / stats.total / 1000,
          total_calls: stats.total,
          total_cost: stats.cost
        };
      });

      // Calculate latency statistics
      const latencies = calls
        .filter(call => call.latency?.avg_latency_ms)
        .map(call => call.latency.avg_latency_ms)
        .sort((a, b) => a - b);

      if (latencies.length > 0) {
        analytics.performance.latency_stats.avg_latency = latencies.reduce((sum, lat) => sum + lat, 0) / latencies.length;
        analytics.performance.latency_stats.p95_latency = latencies[Math.floor(latencies.length * 0.95)];
        analytics.performance.latency_stats.p99_latency = latencies[Math.floor(latencies.length * 0.99)];
      }

      // Cost analysis
      const totalMinutes = calls.reduce((sum, call) => sum + (call.duration_ms || 0), 0) / 1000 / 60;
      const totalCost = analytics.summary.total_cost;

      analytics.performance.cost_analysis.cost_per_call = calls.length > 0 ? totalCost / calls.length : 0;
      analytics.performance.cost_analysis.cost_per_minute = totalMinutes > 0 ? totalCost / totalMinutes : 0;

      // Cost by direction
      const inboundCost = calls
        .filter(call => call.direction === 'inbound')
        .reduce((sum, call) => sum + parseFloat(call.call_cost_breakdown?.total_cost || 0), 0);
      const outboundCost = calls
        .filter(call => call.direction === 'outbound')
        .reduce((sum, call) => sum + parseFloat(call.call_cost_breakdown?.total_cost || 0), 0);

      analytics.performance.cost_analysis.cost_by_direction = {
        inbound: inboundCost,
        outbound: outboundCost
      };

      // Call volume by time
      calls.forEach(call => {
        const date = new Date(call.start_timestamp);
        const hour = date.getHours();
        const day = date.toISOString().split('T')[0];

        analytics.call_volume.by_hour[hour] = (analytics.call_volume.by_hour[hour] || 0) + 1;
        analytics.call_volume.by_day[day] = (analytics.call_volume.by_day[day] || 0) + 1;
      });

      // Quality metrics
      const completedCalls = calls.filter(call => call.call_status === 'completed');
      analytics.quality_metrics.call_completion_rate = calls.length > 0 ? (completedCalls.length / calls.length * 100) : 0;

      const successfulCalls = calls.filter(call => call.call_analysis?.call_successful);
      analytics.quality_metrics.resolution_rate = calls.length > 0 ? (successfulCalls.length / calls.length * 100) : 0;

      res.json({
        timeframe,
        start_date: startDate.toISOString(),
        end_date: endDate.toISOString(),
        ...analytics
      });

    } catch (error) {
      console.error("Failed to fetch detailed analytics:", error);
      res.status(500).json({ error: "Failed to fetch detailed analytics" });
    }
  });

  app.use("/api", router);

  const httpServer = createServer(app);
  return httpServer;
}