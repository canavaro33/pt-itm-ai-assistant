const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export interface ChatResponse {
  reply: string;
}

export async function sendChatMessage(
  message: string,
  employeeId?: string
): Promise<ChatResponse> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (employeeId) {
    headers['x-employee-id'] = employeeId;
  }

  const response = await fetch(`${API_BASE}/api/chat`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ message, employee_id: employeeId }),
  });

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ error: 'Network error' }));
    throw new Error(error.error || `HTTP ${response.status}`);
  }

  return response.json();
}
