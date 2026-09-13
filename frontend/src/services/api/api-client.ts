/**
 * HTTP API Client configured for DeliveryControl
 */

class ApiClient {
  public async request<T = any>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string> || {}),
    };

    // Ensure endpoint has leading slash
    const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    // Prefix with /api if not already present
    const url = path.startsWith('/api') ? path : `/api${path}`;

    try {
      const response = await fetch(url, {
        ...options,
        credentials: 'include',
        headers,
      });

      if (response.status === 401) {
        // Token expired or invalid
        if (typeof window !== 'undefined' && !endpoint.includes('/auth/login') && !endpoint.includes('/auth/register')) {
          // Disparar evento para auth store
          window.dispatchEvent(new CustomEvent('auth:unauthorized'));
        }
      }

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        const errorMessage = data?.error || data?.message || `Erro na requisição (${response.status})`;
        const error: any = new Error(errorMessage);
        error.status = response.status;
        error.details = data?.details;
        throw error;
      }

      return data as T;
    } catch (error: any) {
      throw error;
    }
  }

  public get<T = any>(endpoint: string, options: RequestInit = {}): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  public post<T = any>(endpoint: string, body?: any, options: RequestInit = {}): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  public put<T = any>(endpoint: string, body?: any, options: RequestInit = {}): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  public delete<T = any>(endpoint: string, options: RequestInit = {}): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }
}

export const apiClient = new ApiClient();
