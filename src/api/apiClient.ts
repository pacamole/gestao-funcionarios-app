const BASE_URL = "http://localhost:5096/api";

export const apiClient = {
    async get<M>(endpoint: string): Promise<M> {
        const response = await fetch(`${BASE_URL}${endpoint}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.statusText}`);
        return response.json();
    },

    // POST: Para criar novos registos
    async post<T, M>(endpoint: string, body: T): Promise<M> {
        const response = await fetch(`${BASE_URL}${endpoint}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.statusText}`);
        return response.json();
    },

    // PUT: Para atualizar registos existentes
    async put<T, M>(endpoint: string, body: T): Promise<M> {
        const response = await fetch(`${BASE_URL}${endpoint}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });
        // Algumas APIs não retornam corpo no PUT (ex: 204 No Content)
        if (!response.ok) throw new Error(`HTTP error! status: ${response.statusText}`);
        return response.status === 204 ? ({} as M) : response.json();
    },

    // DELETE: Para eliminar registos
    async delete(endpoint: string): Promise<void> {
        const response = await fetch(`${BASE_URL}${endpoint}`, {
            method: "DELETE",
        });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.statusText}`);
    }
}