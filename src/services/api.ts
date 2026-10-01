import {
  HistoryRecord,
  HomePlanResult,
  PartyPlanResult,
  JewelryPlanResult
} from '../types';

export const API_BASE = '/api';

export async function generateHomePlan(data: {
  total_budget: number;
  currency: string;
  num_lights: number;
  num_fans: number;
  num_furniture: number;
  num_dining_tables: number;
  rooms: string[];
  additional_requirements: string;
}): Promise<HomePlanResult> {
  const res = await fetch(`${API_BASE}/generate-home`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText || 'Failed to generate home budget recommendations');
  }
  return res.json();
}

export async function generatePartyPlan(data: {
  total_budget: number;
  currency: string;
  num_guests: number;
  party_type: string;
  venue_type: string;
  needs_catering: boolean;
  needs_decoration: boolean;
  needs_entertainment: boolean;
  needs_photography: boolean;
  additional_requirements: string;
}): Promise<PartyPlanResult> {
  const res = await fetch(`${API_BASE}/generate-party`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText || 'Failed to generate party budget recommendations');
  }
  return res.json();
}

export async function generateJewelryPlan(data: {
  total_budget: number;
  currency: string;
  occasion: string;
  preferences: string;
  image_base64?: string | null;
  image_mime_type?: string;
}): Promise<JewelryPlanResult> {
  const res = await fetch(`${API_BASE}/generate-jewelry`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText || 'Failed to generate jewelry recommendations');
  }
  return res.json();
}

export async function fetchHistory(): Promise<HistoryRecord[]> {
  try {
    const res = await fetch(`${API_BASE}/history`);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data.history)) {
        return data.history;
      }
    }
  } catch (err) {
    console.warn('Could not fetch server history, falling back to local store', err);
  }
  const local = localStorage.getItem('pocketsmart_history');
  return local ? JSON.parse(local) : [];
}

export async function saveHistory(record: {
  type: 'home' | 'party' | 'jewelry';
  total_budget: number;
  currency: string;
  remaining_budget: number;
  input_summary: string;
  summary: string;
  full_result: any;
}): Promise<HistoryRecord> {
  try {
    const res = await fetch(`${API_BASE}/history`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(record)
    });
    if (res.ok) {
      const data = await res.json();
      return data.record;
    }
  } catch (err) {
    console.warn('Could not save to server history, saving to local store', err);
  }

  // Local storage fallback
  const fallbackRecord: HistoryRecord = {
    id: 'local-' + Date.now(),
    timestamp: new Date().toISOString(),
    username: 'sai',
    ...record
  };
  const current = await fetchHistory();
  const updated = [fallbackRecord, ...current];
  localStorage.setItem('pocketsmart_history', JSON.stringify(updated));
  return fallbackRecord;
}

export async function deleteHistory(id: string): Promise<void> {
  try {
    await fetch(`${API_BASE}/history/${id}`, { method: 'DELETE' });
  } catch (err) {
    console.warn('Server delete failed', err);
  }
  const current = await fetchHistory();
  const filtered = current.filter((item) => item.id !== id);
  localStorage.setItem('pocketsmart_history', JSON.stringify(filtered));
}
