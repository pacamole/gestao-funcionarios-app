const BASE_URL = "http://localhost:5096/api";

async function handleResponseError(response: Response) {
    let errorMessage = `Erro de comunicação: ${response.statusText}`;
    
    try {
        const textData = await response.text();
        
        if (textData) {
            try {
                const errorData = JSON.parse(textData);
                
                if (response.status === 400 && errorData.errors) {
                    const mensagensValidacao = Object.entries(errorData.errors)
                        .map(([campo, mensagens]: [string, any]) => {
                            
                            const campoLimpo = campo.toLowerCase().replace('$.', '');

                            if (campoLimpo === "idcargo") return "O cargo deve ser preenchido!";
                            if (campoLimpo === "idarea") return "A area deve ser preenchida!";
                            if (campoLimpo === "idusuario") return "O usuário deve ser preenchido!";
                            
                            const erroOriginal = mensagens.join(', ');
                            if (erroOriginal.includes("is required")) {
                                return `O campo ${campo} é obrigatório!`;
                            }
                            return erroOriginal;
                        })
                        .join('\n');
                        
                    errorMessage = mensagensValidacao;
                } 
                else if (response.status === 400 && errorData.title) {
                    errorMessage = errorData.title;
                }
                else if (errorData.erroResumido) {
                    errorMessage = errorData.erroResumido;
                } 
                else if (errorData.message) {
                    errorMessage = errorData.message;
                } 
                else {
                    errorMessage = "Ocorreu um problema no servidor. Tente novamente.";
                }
            } catch {
                errorMessage = textData;
            }
        }
    } catch (e) {
        errorMessage = "Falha ao processar a resposta do servidor.";
    }
   if (errorMessage.includes("$.idArea") || errorMessage.includes("$.IdArea")) {
        errorMessage = "A area deve ser preenchida!";
    } else if (errorMessage.includes("$.idCargo") || errorMessage.includes("$.IdCargo")) {
        errorMessage = "O cargo deve ser preenchido!";
    } else if (errorMessage.includes("$.idUsuario") || errorMessage.includes("$.IdUsuario")) {
        errorMessage = "O usuário deve ser preenchido!";
    }

    throw new Error(errorMessage);
}

export const apiClient = {
    async get<M>(endpoint: string): Promise<M> {
        const response = await fetch(`${BASE_URL}${endpoint}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        });
        if (!response.ok) await handleResponseError(response);
        return response.json();
    },

    async post<T, M>(endpoint: string, body: T): Promise<M> {
        const response = await fetch(`${BASE_URL}${endpoint}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });
        if (!response.ok) await handleResponseError(response);
        return response.json();
    },

    async put<T, M>(endpoint: string, body: T): Promise<M> {
        const response = await fetch(`${BASE_URL}${endpoint}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });
        if (!response.ok) await handleResponseError(response);
        return response.status === 204 ? ({} as M) : response.json();
    },

    async delete(endpoint: string): Promise<void> {
        const response = await fetch(`${BASE_URL}${endpoint}`, {
            method: "DELETE",
        });
        if (!response.ok) await handleResponseError(response);
    }
}