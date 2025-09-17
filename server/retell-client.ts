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

  // List calls with filtering options
  async listCalls(filterCriteria?: any, sortOrder?: 'ascending' | 'descending', limit?: number, paginationKey?: string) {
    const body = {
      filter_criteria: filterCriteria || {},
      sort_order: sortOrder || 'descending',
      limit: limit || 50,
      ...(paginationKey && { pagination_key: paginationKey })
    };

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

  async getAgent(agentId: string) {
    return this.makeRequest(`/get-agent/${agentId}`);
  }

  async listAgents() {
    return this.makeRequest('/list-agents');
  }

  async createWebCall(callDetails: any) {
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
      throw new Error(`Retell API error: ${response.status} - ${errorText}`);
    }

    return await response.json();
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