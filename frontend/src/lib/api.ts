const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export async function apiClient<T = unknown>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_URL}${endpoint}`;

    const config: RequestInit = {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
    };

    try {
        const response = await fetch(url, config);

        if (!response.ok) {
            throw new Error(`API Error: ${response.statusText}`);
        }

        return (await response.json()) as T;
    } catch (error) {
        console.error('API request failed:', error);
        throw error;
    }
}

export const api = {
    get: (endpoint: string) => apiClient(endpoint, { method: 'GET' }),
    post: (endpoint: string, data: unknown) =>
        apiClient(endpoint, { method: 'POST', body: JSON.stringify(data) }),
    put: (endpoint: string, data: unknown) =>
        apiClient(endpoint, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (endpoint: string) => apiClient(endpoint, { method: 'DELETE' }),
};
