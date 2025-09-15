
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
    return this.makeRequest('/create-batch-call', 'POST', request);
  }

  async getCall(callId: string) {
    return this.makeRequest(`/v2/get-call/${callId}`);
  }

  async listCalls() {
    return this.makeRequest('/v2/list-calls');
  }

  async getAgent(agentId: string) {
    return this.makeRequest(`/get-agent/${agentId}`);
  }

  async listAgents() {
    return this.makeRequest('/list-agents');
  }

  async createWebCall(request: { agent_id: string }) {
    return this.makeRequest('/v2/create-web-call', 'POST', request);
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
