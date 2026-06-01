const BASE_URL = "http://localhost:5096/api";

// exportar diretamente um objeto, transforma a instância num Singleton
export const apiClient = {
    // Generics para implementar um DTO da requisição
    async get<M>(endpoint: string): Promise<M> {
        const response = await fetch(`${BASE_URL}${endpoint}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.statusText}`)
        }

        return response.json()
    }
}