import { getToken } from './storage';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export interface ChatSession {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: string;
}

function getAuthHeaders(): Record<string, string> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

export async function createSession(): Promise<{ sessionId: string; title: string; createdAt: string }> {
  const res = await fetch(`${API_BASE}/api/chat/session`, {
    method: 'POST',
    headers: getAuthHeaders(),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: 'Network error' }));
    throw new Error(error.error || `HTTP ${res.status}`);
  }

  return res.json();
}

export async function getSessions(): Promise<ChatSession[]> {
  const res = await fetch(`${API_BASE}/api/chat/sessions`, {
    headers: getAuthHeaders(),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: 'Network error' }));
    throw new Error(error.error || `HTTP ${res.status}`);
  }

  return res.json();
}

export async function getSessionMessages(sessionId: string): Promise<ChatMessage[]> {
  const res = await fetch(`${API_BASE}/api/chat/session/${sessionId}/messages`, {
    headers: getAuthHeaders(),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: 'Network error' }));
    throw new Error(error.error || `HTTP ${res.status}`);
  }

  return res.json();
}

export async function saveMessage(
  sessionId: string,
  role: string,
  content: string
): Promise<ChatMessage> {
  const res = await fetch(`${API_BASE}/api/chat/session/${sessionId}/message`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ role, content }),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: 'Network error' }));
    throw new Error(error.error || `HTTP ${res.status}`);
  }

  return res.json();
}

export async function renameSession(sessionId: string, title: string): Promise<ChatSession> {
  const res = await fetch(`${API_BASE}/api/chat/session/${sessionId}/title`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify({ title }),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: 'Network error' }));
    throw new Error(error.error || `HTTP ${res.status}`);
  }

  return res.json();
}

export async function deleteSession(sessionId: string): Promise<{ success: boolean }> {
  const res = await fetch(`${API_BASE}/api/chat/session/${sessionId}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: 'Network error' }));
    throw new Error(error.error || `HTTP ${res.status}`);
  }

  return res.json();
}
