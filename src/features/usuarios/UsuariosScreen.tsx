import { useEffect, useState } from 'react';
import { apiClient } from '../../api/apiClient';
import './UsuariosScreen.css';

// DTO
export interface Usuario {
    id: string,
    email: string;
    permissoes: string;
}

function UsuariosScreen() {
    const [usuarios, setUsuarios] = useState<Usuario[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    async function fetchUsuarios() {
        try {
            // Chamamos o nosso wrapper passando a interface para garantir a tipagem
            const data = await apiClient.get<Usuario[]>('/usuarios');
            setUsuarios(data);
        } catch (err) {
            setError('Failed to fetch users.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUsuarios()
    }, []);

    return (
        <div className="container">
            <header>
                <h2>Gerenciar Usuários</h2>
            </header>

            <main>
                <div className="table-container">
                    {isLoading && (<p>Carregando usuários...</p>)}

                    {error && (
                        <div style={{ backgroundColor: "salmon" }}>
                            <h5>Ocorreu um erro na aplicação...</h5>
                            <small>{error}</small>
                        </div>
                    )}

                    {!isLoading && !error && (
                        <table>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>E-mail</th>
                                    <th>Permissões</th>
                                </tr>
                            </thead>
                            <tbody>
                                {usuarios.map(user =>
                                    <tr key={user.id}>
                                        <td>{user.id}</td>
                                        <td>{user.email}</td>
                                        <td>{user.permissoes}</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </main>
        </div>
    )
}

export default UsuariosScreen;