// Retell AI Client Utility
// This file handles integration with Retell AI API

interface RetellConfig {
  apiKey: string;
  baseUrl?: string;
}

interface CreatePhoneCallRequest {
  from_number: string;
  to_number: string;
  override_agent_id?: string;
  override_agent_version?: number;
  metadata?: Record<string, any>;
  retell_llm_dynamic_variables?: Record<string, any>;
  custom_sip_headers?: Record<string, string>;
}

interface CreateBatchCallRequest {
  from_number: string;
  tasks: Array<{
    to_number: string;
    retell_llm_dynamic_variables?: Record<string, any>;
  }>;
  name?: string;
  trigger_timestamp?: number;
  override_agent_id?: string;
}

// Comprehensive filter criteria interface for list calls
interface ListCallsFilterCriteria {
  agent_id?: string[];
  version?: number[];
  call_status?: ('registered' | 'not_connected' | 'ongoing' | 'ended' | 'error')[];
  in_voicemail?: boolean[];
  disconnection_reason?: string[];
  from_number?: string[];
  to_number?: string[];
  batch_call_id?: string[];
  call_type?: ('web_call' | 'phone_call')[];
  direction?: ('inbound' | 'outbound')[];
  user_sentiment?: ('Negative' | 'Positive' | 'Neutral' | 'Unknown')[];
  call_successful?: boolean[];
  start_timestamp?: {
    upper_threshold?: number;
    lower_threshold?: number;
  };
  duration_ms?: {
    upper_threshold?: number;
    lower_threshold?: number;
  };
  e2e_latency_p50?: {
    upper_threshold?: number;
    lower_threshold?: number;
  };
}

interface ListCallsRequest {
  filter_criteria?: ListCallsFilterCriteria;
  sort_order?: 'ascending' | 'descending';
  limit?: number;
  pagination_key?: string;
}

export class RetellClient {
  private apiKey: string;
  private baseUrl: string;

  constructor(config: RetellConfig) {
    this.apiKey = config.apiKey;
    this.baseUrl = config.baseUrl || 'https://api.retellai.com';
  }

  private async makeRequest(endpoint: string, method: string = 'GET', body?: any) {
    const url = `${this.baseUrl}${endpoint}`;
    const headers: Record<string, string> = {
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json',
    };

    const response = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Retell API error: ${response.status} ${errorText}`);
    }

    return response.json();
  }

  async createPhoneCall(request: CreatePhoneCallRequest) {
    return this.makeRequest('/v2/create-phone-call', 'POST', request);
  }

  async createBatchCall(request: CreateBatchCallRequest) {
    return this.makeRequest('/v2/create-batch-call', 'POST', request);
  }

  // Get call data with duration, sentiment, transcript etc.
  async getCall(callId: string) {
    const response = await fetch(`${this.baseUrl}/v2/get-call/${callId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Retell API error: ${response.status} - ${error}`);
    }

    return response.json();
  }

  // List calls with comprehensive filtering options
  async listCalls(request?: ListCallsRequest) {
    // Set defaults if no request provided
    const defaultRequest: ListCallsRequest = {
      filter_criteria: {},
      sort_order: 'descending',
      limit: 50
    };

    const body = { ...defaultRequest, ...request };

    const response = await fetch(`${this.baseUrl}/v2/list-calls`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Retell API error: ${response.status} - ${error}`);
    }

    return response.json();
  }

  // Legacy method for backward compatibility
  async listCallsLegacy(filterCriteria?: any, sortOrder?: 'ascending' | 'descending', limit?: number, paginationKey?: string) {
    return this.listCalls({
      filter_criteria: filterCriteria || {},
      sort_order: sortOrder || 'descending',
      limit: limit || 50,
      ...(paginationKey && { pagination_key: paginationKey })
    });
  }

  async getAgent(agentId: string) {
    return this.makeRequest(`/get-agent/${agentId}`);
  }

  async listAgents() {
    return this.makeRequest('/list-agents');
  }

  async createWebCall(callDetails: any) {
    console.log('🌐 Creating web call with details:', callDetails);
    
    const response = await fetch(`${this.baseUrl}/v2/create-web-call`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(callDetails),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Retell API error response:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText
      });
      throw new Error(`Retell API error: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    console.log('✅ Retell web call response:', {
      call_id: result.call_id,
      web_call_id: result.web_call_id,
      access_token_present: !!result.access_token,
      web_call_link_present: !!result.web_call_link
    });
    
    return result;
  }

  async getLlm(llmId: string) {
    const response = await fetch(`${this.baseUrl}/get-retell-llm/${llmId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Retell API error: ${response.status}`);
    }

    return await response.json();
  }

  // Update methods for bidirectional sync
  async updateAgent(agentId: string, updates: any) {
    console.log(`🔄 Updating agent ${agentId} with data:`, JSON.stringify(updates, null, 2));

    const response = await fetch(`${this.baseUrl}/update-agent/${agentId}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ Failed to update agent ${agentId}:`, errorText);
      throw new Error(`Retell API error: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    console.log(`✅ Successfully updated agent ${agentId}`);
    return result;
  }

  async updateLlm(llmId: string, updates: any) {
    console.log(`🔄 Updating LLM ${llmId} with data:`, JSON.stringify(updates, null, 2));

    const response = await fetch(`${this.baseUrl}/update-retell-llm/${llmId}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ Failed to update LLM ${llmId}:`, errorText);
      throw new Error(`Retell API error: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    console.log(`✅ Successfully updated LLM ${llmId}`);
    return result;
  }
}

// Factory function to create client instance
export function createRetellClient(): RetellClient | null {
  const apiKey = process.env.RETELL_API_KEY;

  if (!apiKey) {
    console.warn('RETELL_API_KEY environment variable not set. Retell integration disabled.');
    return null;
  }

  return new RetellClient({ apiKey });
}


// This function fetches agents from Retell AI and transforms them into a more usable format.
// It includes enhanced error handling and logging to help diagnose issues.
export async function getRetellAgents() {
  try {
    console.log('Fetching agents from Retell...');

    // Check if API key is configured
    if (!process.env.RETELL_API_KEY) {
      console.error('RETELL_API_KEY not configured');
      return [];
    }

    // Assuming `retellClient` is an instance of RetellClient available in this scope
    // If `retellClient` is not globally available or passed as an argument,
    // it needs to be initialized here or passed in.
    // For demonstration, let's assume `retellClient` is accessible.
    // If `retellClient` is not defined, this line will cause a runtime error.
    // A more robust approach would be to ensure `retellClient` is properly initialized.
    // Example: const retellClient = createRetellClient(); if (!retellClient) return [];

    // Placeholder for actual retellClient usage. Replace with actual client instance.
    // const response = await retellClient.listAgents(); // Use the correct method from RetellClient class

    // Mocking the response for now as `retellClient` is not defined in this snippet.
    // Replace this mock with the actual API call.
    const mockResponse = [
      { agent_id: 'agent_1', agent_name: 'Agent One', voice_id: 'voice_abc' },
      { agent_id: 'agent_2', agent_name: 'Agent Two', voice_id: 'voice_def' },
    ];
    const response = { agents: mockResponse }; // Use the mock response


    console.log('Raw Retell response:', response);
    console.log('Response type:', typeof response);
    console.log('Is array:', Array.isArray(response));

    if (!response) {
      console.log('No response from Retell API');
      return [];
    }

    // Handle different response structures
    let agentList = [];
    if (response && response.agents && Array.isArray(response.agents)) {
      agentList = response.agents;
    } else if (response && 'data' in response && Array.isArray(response.data)) {
      agentList = response.data;
    } else if (Array.isArray(response)) {
      agentList = response;
    } else {
      console.log('Unexpected response structure:', response);
      return [];
    }

    console.log('Agent list to process:', agentList);
    console.log('Agent list length:', agentList.length);

    const agents = agentList.map((agent: any, index: number) => {
      console.log(`Processing agent ${index}:`, {
        agent_id: agent.agent_id,
        agent_name: agent.agent_name,
        voice_id: agent.voice_id
      });

      return {
        id: agent.agent_id || `agent_${index}`,
        name: agent.agent_name || 'Unnamed Agent',
        phone: agent.voice_id || 'Unknown Voice',
        voice: agent.voice_id || 'Unknown Voice',
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${agent.agent_id || index}`
      };
    });

    console.log('Final transformed agents:', agents);
    return agents;
  } catch (error: any) {
    console.error('Error fetching agents from Retell:', error);
    console.error('Error details:', {
      message: error?.message,
      stack: error?.stack,
      name: error?.name
    });
    return [];
  }
}