const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// Get auth token from localStorage
function getAuthToken(): string | null {
    if (typeof window === 'undefined') return null;
        return localStorage.getItem('token') || null;
}

export async function apiClient<T = unknown>(
    endpoint: string,
    options: RequestInit = {},
    requireAuth: boolean = true
): Promise<T> {
    const url = `${API_URL}${endpoint}`;
    const token = getAuthToken();

    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(options.headers as Record<string, string>),
    };

    // Add auth header if token exists and auth is required
    if (requireAuth && token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const config: RequestInit = {
        ...options,
        headers,
    };

    try {
        const response = await fetch(url, config);

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `API Error: ${response.statusText}`);
        }

        return (await response.json()) as T;
    } catch (error) {
        console.error('API request failed:', error);
        throw error;
    }
}

// API helper with authentication
export const api = {
    get: <T = unknown>(endpoint: string) => apiClient<T>(endpoint, { method: 'GET' }),
    post: <T = unknown>(endpoint: string, data: unknown) =>
        apiClient<T>(endpoint, { method: 'POST', body: JSON.stringify(data) }),
    put: <T = unknown>(endpoint: string, data: unknown) =>
        apiClient<T>(endpoint, { method: 'PUT', body: JSON.stringify(data) }),
    patch: <T = unknown>(endpoint: string, data: unknown) =>
        apiClient<T>(endpoint, { method: 'PATCH', body: JSON.stringify(data) }),
    delete: <T = unknown>(endpoint: string) => apiClient<T>(endpoint, { method: 'DELETE' }),
};

// Typed API endpoints
export const authApi = {
    login: (email: string, password: string) =>
        apiClient('/api/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }, false),
    register: (data: { name: string; email: string; password: string; role: string }) =>
        apiClient('/api/auth/register', { method: 'POST', body: JSON.stringify(data) }, false),
    me: () => api.get('/api/auth/me'),
};

export const userApi = {
    getProfile: () => api.get('/api/users/profile'),
    updateProfile: (data: unknown) => api.put('/api/users/profile', data),
    updateBasicInfo: (data: { name: string }) => api.patch('/api/users/basic-info', data),
    uploadAvatar: (data: { avatarUrl: string }) => api.patch('/api/users/avatar', data),
};

export const skillsApi = {
    list: (params?: { sector?: string; category?: string; search?: string }) => {
        const queryString = params ? '?' + new URLSearchParams(params as Record<string, string>).toString() : '';
        return api.get(`/api/skills${queryString}`);
    },
    add: (data: unknown) => api.post('/api/skills', data),
    update: (id: string, data: unknown) => api.put(`/api/skills/${id}`, data),
    delete: (id: string) => api.delete(`/api/skills/${id}`),
    getCategories: (sector?: string) => {
        const queryString = sector ? `?sector=${sector}` : '';
        return apiClient(`/api/skills/categories${queryString}`, { method: 'GET' }, false);
    },
    getById: (id: string) => api.get(`/api/skills/${id}`),
};

export const mentorApi = {
    listApproved: (sector?: string) => {
        const queryString = sector ? `?sector=${encodeURIComponent(sector)}` : '';
        return api.get(`/api/mentor/approved${queryString}`);
    },
    getMyProfile: () => api.get('/api/mentor/me'),
    saveMyProfile: (data: unknown) => api.put('/api/mentor/me', data),
};

export const verificationApi = {
    createRequest: (skillId: string, data: { reviewerId: string; message?: string; evidenceUrl?: string }) =>
        api.post(`/api/verification/skills/${skillId}/requests`, data),
    listSent: () => api.get('/api/verification/requests/sent'),
    listReceived: (status?: string) => {
        const queryString = status ? `?status=${encodeURIComponent(status)}` : '';
        return api.get(`/api/verification/requests/received${queryString}`);
    },
    cancel: (requestId: string) => api.post(`/api/verification/requests/${requestId}/cancel`, {}),
    decide: (requestId: string, data: { decision: 'APPROVED' | 'REJECTED'; decisionNote?: string }) =>
        api.post(`/api/verification/requests/${requestId}/decision`, data),
};

// Healthcare API
export const healthcareApi = {
    getSkills: () => api.get('/api/healthcare/skills'),
    getCertifications: () => api.get('/api/healthcare/certifications'),
    addCertification: (data: unknown) => api.post('/api/healthcare/certifications', data),
    updateCertification: (id: string, data: unknown) => api.put(`/api/healthcare/certifications/${id}`, data),
    deleteCertification: (id: string) => api.delete(`/api/healthcare/certifications/${id}`),
    getProjects: () => api.get('/api/healthcare/projects'),
    addProject: (data: unknown) => api.post('/api/healthcare/projects', data),
    updateProject: (id: string, data: unknown) => api.put(`/api/healthcare/projects/${id}`, data),
    deleteProject: (id: string) => api.delete(`/api/healthcare/projects/${id}`),
    getAssessment: () => api.get('/api/healthcare/assessment'),
    getCareerPathways: () => api.get('/api/healthcare/career-pathways'),
};

// Agriculture API
export const agricultureApi = {
    getSkills: () => api.get('/api/agriculture/skills'),
    getCertifications: () => api.get('/api/agriculture/certifications'),
    addCertification: (data: unknown) => api.post('/api/agriculture/certifications', data),
    updateCertification: (id: string, data: unknown) => api.put(`/api/agriculture/certifications/${id}`, data),
    deleteCertification: (id: string) => api.delete(`/api/agriculture/certifications/${id}`),
    getProjects: () => api.get('/api/agriculture/projects'),
    addProject: (data: unknown) => api.post('/api/agriculture/projects', data),
    updateProject: (id: string, data: unknown) => api.put(`/api/agriculture/projects/${id}`, data),
    deleteProject: (id: string) => api.delete(`/api/agriculture/projects/${id}`),
    getAssessment: () => api.get('/api/agriculture/assessment'),
    getCareerPathways: () => api.get('/api/agriculture/career-pathways'),
};

// Urban API
export const urbanApi = {
    getSkills: () => api.get('/api/urban/skills'),
    getCertifications: () => api.get('/api/urban/certifications'),
    addCertification: (data: unknown) => api.post('/api/urban/certifications', data),
    updateCertification: (id: string, data: unknown) => api.put(`/api/urban/certifications/${id}`, data),
    deleteCertification: (id: string) => api.delete(`/api/urban/certifications/${id}`),
    getProjects: () => api.get('/api/urban/projects'),
    addProject: (data: unknown) => api.post('/api/urban/projects', data),
    updateProject: (id: string, data: unknown) => api.put(`/api/urban/projects/${id}`, data),
    deleteProject: (id: string) => api.delete(`/api/urban/projects/${id}`),
    getAssessment: () => api.get('/api/urban/assessment'),
    getCareerPathways: () => api.get('/api/urban/career-pathways'),
};

// Analytics API
export const analyticsApi = {
    generate: (sector: string) => api.post(`/api/analytics/generate/${sector}`, {}),
    get: (sector: string) => api.get(`/api/analytics/${sector}`),
    getCrossSector: () => api.get('/api/analytics/cross-sector/overview'),
    getRecommendations: (sector: string, score: number) =>
        api.get(`/api/analytics/${encodeURIComponent(sector)}/recommendations?score=${encodeURIComponent(String(score))}`),
};
