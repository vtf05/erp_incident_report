const API_BASE = '/api/v1';

export const incidentService = {
  getIncidents: async (filters = {}) => {
    const params = new URLSearchParams(filters);
    const response = await fetch(`${API_BASE}/incidents/?${params}`);
    if (!response.ok) throw new Error('Failed to fetch incidents');
    return response.json();
  },

  getIncident: async (id) => {
    const response = await fetch(`${API_BASE}/incidents/${id}`);
    if (!response.ok) throw new Error('Failed to fetch incident');
    return response.json();
  },

  createIncident: async (incidentData) => {
    const response = await fetch(`${API_BASE}/incidents/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(incidentData),
    });
    if (!response.ok) throw new Error('Failed to create incident');
    return response.json();
  },

  updateIncident: async (id, incidentData) => {
    const response = await fetch(`${API_BASE}/incidents/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(incidentData),
    });
    if (!response.ok) throw new Error('Failed to update incident');
    return response.json();
  },

  listS3Payloads: async (prefix = "") => {
    const response = await fetch(`${API_BASE}/aws/payloads?prefix=${prefix}`);
    if (!response.ok) throw new Error('Failed to fetch S3 payloads');
    return response.json();
  },

  getS3Payload: async (key) => {
    const response = await fetch(`${API_BASE}/aws/payloads/${key}`);
    if (!response.ok) throw new Error('Failed to fetch S3 payload content');
    return response.json();
  }
};

export const enrichmentService = {
  getRules: async () => {
    const response = await fetch(`${API_BASE}/enrichment/rules/`);
    if (!response.ok) throw new Error('Failed to fetch rules');
    return response.json();
  },

  createRule: async (ruleData) => {
    const response = await fetch(`${API_BASE}/enrichment/rules/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(ruleData),
    });
    if (!response.ok) throw new Error('Failed to create rule');
    return response.json();
  },

  deleteRule: async (id) => {
    const response = await fetch(`${API_BASE}/enrichment/rules/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete rule');
    return response.json();
  },

  updateRule: async (id, ruleData) => {
    const response = await fetch(`${API_BASE}/enrichment/rules/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(ruleData),
    });
    if (!response.ok) throw new Error('Failed to update rule');
    return response.json();
  }
};
