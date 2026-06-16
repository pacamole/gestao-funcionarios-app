import { useEffect, useState } from 'react';
import { apiClient } from '../../api/apiClient';
import './UsuariosScreen.css';

export interface Usuario {
    id: string;
    email: string;
    permissoes: string;
}

function UsuariosScreen() {
    const [usuarios, setUsuarios] = useState<Usuario[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Estados do Formulário
    const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
    const [formData, setFormData] = useState<Partial<Usuario>>({ email: '', permissoes: '' });

    async function fetchUsuarios() {
        setIsLoading(true);
        try {
            const data = await apiClient.get<Usuario[]>('/usuarios');
            setUsuarios(data);
        } catch (err) {
            setError('Failed to fetch users.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUsuarios();
    }, []);

    // Função para lidar com inputs do formulário
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Função para Guardar (Criar ou Atualizar)
    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (formData.id) {
                // Atualizar (PUT)
                await apiClient.put<Partial<Usuario>, Usuario>(`/usuarios/${formData.id}`, formData);
            } else {
                // Criar (POST) - Removemos o ID caso exista para a API gerar um novo
                const { id, ...newUsuario } = formData;
                await apiClient.post<Omit<Partial<Usuario>, 'id'>, Usuario>('/usuarios', newUsuario);
            }
            setIsFormOpen(false);
            setFormData({ email: '', permissoes: '' }); // Limpa o form
            fetchUsuarios(); // Atualiza a lista
        } catch (err) {
            setError('Falha ao guardar o utilizador.');
        }
    };

    // Função para Editar (Preenche o formulário)
    const handleEdit = (usuario: Usuario) => {
        setFormData(usuario);
        setIsFormOpen(true);
    };

    // Função para Eliminar (DELETE)
    const handleDelete = async (id: string) => {
        if (!window.confirm("Tem a certeza que deseja eliminar este utilizador?")) return;
        
        try {
            await apiClient.delete(`/usuarios/${id}`);
            fetchUsuarios(); // Atualiza a lista após apagar
        } catch (err) {
            setError('Falha ao eliminar o utilizador.');
        }
    };

    return (
        <div className="container">
            <header>
                <h2>Gerenciar Usuários</h2>
                <button onClick={() => { setIsFormOpen(!isFormOpen); setFormData({ email: '', permissoes: '' }); }}>
                    {isFormOpen ? 'Cancelar' : 'Adicionar Novo Usuário'}
                </button>
            </header>

            <main>
                {/* Formulário de Criação / Edição */}
                {isFormOpen && (
                    <div style={{ marginBottom: '20px', padding: '15px', border: '1px solid #ccc' }}>
                        <h3>{formData.id ? 'Editar Usuário' : 'Novo Usuário'}</h3>
                        <form onSubmit={handleSave}>
                            <div style={{ marginBottom: '10px' }}>
                                <label>E-mail: </label>
                                <input 
                                    type="email" 
                                    name="email" 
                                    value={formData.email || ''} 
                                    onChange={handleInputChange} 
                                    required 
                                />
                            </div>
                            <div style={{ marginBottom: '10px' }}>
                                <label>Permissões: </label>
                                <input 
                                    type="text" 
                                    name="permissoes" 
                                    value={formData.permissoes || ''} 
                                    onChange={handleInputChange} 
                                    required 
                                />
                            </div>
                            <button type="submit">Guardar</button>
                        </form>
                    </div>
                )}

                <div className="table-container">
                    {isLoading && (<p>Carregando usuários...</p>)}

                    {error && (
                        <div style={{ backgroundColor: "salmon", padding: '10px' }}>
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
                                    <th>Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {usuarios.map(user =>
                                    <tr key={user.id}>
                                        <td>{user.id}</td>
                                        <td>{user.email}</td>
                                        <td>{user.permissoes}</td>
                                        <td>
                                            <button onClick={() => handleEdit(user)} style={{ marginRight: '5px' }}>Editar</button>
                                            <button onClick={() => handleDelete(user.id)}>Excluir</button>
                                        </td>
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