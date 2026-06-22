import { useEffect, useState } from 'react';
import { apiClient } from '../../api/apiClient';
import { Cargo } from '../cargos/CargosScreen';
import { Usuario } from '../usuarios/UsuariosScreen';

export interface Funcionario {
    id: string;
    nome: string;
    modalidade: string;
    observacoes: string;
    validadeContrato: Date;
    cargo: Cargo | null;
    usuario: Usuario | null;
}

interface FuncionarioFormData {
    id?: string;
    nome: string;
    modalidade: string;
    observacoes: string;
    validadeContrato: string;
    IdCargo: string;
    IdUsuario: string;
}

function FuncionariosScreen() {
    const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
    const [cargos, setCargos] = useState<Cargo[]>([]);
    const [usuarios, setUsuarios] = useState<Usuario[]>([]);
    
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
    const [formData, setFormData] = useState<FuncionarioFormData>({
        nome: '', modalidade: '', observacoes: '', validadeContrato: '', IdCargo: '', IdUsuario: ''
    });

    async function fetchData() {
        setIsLoading(true);
        setError(null);
        try {
            const [funcionariosData, cargosData, usuariosData] = await Promise.all([
                apiClient.get<Funcionario[]>("/funcionarios"),
                apiClient.get<Cargo[]>("/cargos"),
                apiClient.get<Usuario[]>("/usuarios")
            ]);
            
            const formattedFuncionarios = funcionariosData.map(f => ({
                ...f,
                validadeContrato: new Date(f.validadeContrato)
            }));
            
            setFuncionarios(formattedFuncionarios);
            setCargos(cargosData);
            setUsuarios(usuariosData);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchData();
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        
        const payload = {
            ...formData,
            IdCargo: formData.IdCargo || null,
            IdUsuario: formData.IdUsuario || null,
            validadeContrato: new Date(formData.validadeContrato).toISOString()
        };

        try {
            if (formData.id) {
                await apiClient.put(`/funcionarios/${formData.id}`, payload);
            } else {
                const { id, ...newFunc } = payload;
                await apiClient.post('/funcionarios', newFunc);
            }
            setIsFormOpen(false);
            setFormData({ nome: '', modalidade: '', observacoes: '', validadeContrato: '', IdCargo: '', IdUsuario: '' });
            fetchData();
        } catch (err: any) {
            setError(err.message);
        }
    };

    const handleEdit = (funcionario: Funcionario) => {
        const dateString = funcionario.validadeContrato.toISOString().split('T')[0];
        
        setFormData({
            id: funcionario.id,
            nome: funcionario.nome,
            modalidade: funcionario.modalidade,
            observacoes: funcionario.observacoes,
            validadeContrato: dateString,
            IdCargo: funcionario.cargo?.id || '',
            IdUsuario: funcionario.usuario?.id || ''
        });
        setIsFormOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm("Tem a certeza que deseja eliminar este funcionário?")) return;
        setError(null);
        try {
            await apiClient.delete(`/funcionarios/${id}`);
            fetchData();
        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <div className='container' >
            <header>
                <h2>Gerenciar Funcionários</h2>
                <button onClick={() => { setIsFormOpen(!isFormOpen); setFormData({ nome: '', modalidade: '', observacoes: '', validadeContrato: '', IdCargo: '', IdUsuario: '' }); }}>
                    {isFormOpen ? 'Cancelar' : 'Adicionar Novo Funcionário'}
                </button>
            </header>

            {error && (
                <div className="error-message">
                    <h4>⚠️ Atenção:</h4>
                    <pre>{error}</pre>
                </div>
            )}

            {isFormOpen && (
                <div className="form-container">
                    <h3>{formData.id ? 'Editar Funcionário' : 'Novo Funcionário'}</h3>
                    <form onSubmit={handleSave}>
                        <div className="form-group">
                            <label>Nome: </label>
                            <input type="text" name="nome" value={formData.nome} onChange={handleInputChange} required />
                        </div>
                        <div className="form-group">
                            <label>Modalidade: </label>
                            <input type="text" name="modalidade" value={formData.modalidade} onChange={handleInputChange} required />
                        </div>
                        <div className="form-group">
                            <label>Observações: </label>
                            <textarea name="observacoes" value={formData.observacoes} onChange={handleInputChange} rows={3} />
                        </div>
                        <div className="form-group">
                            <label>Validade do Contrato: </label>
                            <input type="date" name="validadeContrato" value={formData.validadeContrato} onChange={handleInputChange} required />
                        </div>
                        <div className="form-group">
                            <label>Cargo: </label>
                            <select name="IdCargo" value={formData.IdCargo} onChange={handleInputChange}>
                                <option value="">Nenhum</option>
                                {cargos.map(c => (
                                    <option key={c.id} value={c.id}>{c.nome}</option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Utilizador Vinculado: </label>
                            <select name="IdUsuario" value={formData.IdUsuario} onChange={handleInputChange}>
                                <option value="">Nenhum</option>
                                {usuarios.map(u => (
                                    <option key={u.id} value={u.id}>{u.email}</option>
                                ))}
                            </select>
                        </div>
                        <div className="form-actions">
                            <button type="submit">Guardar</button>
                        </div>
                    </form>
                </div>
            )}

            <main>
                {isLoading ? (<p className="loading">Carregando dados</p>) : (
                    <div className='table-container'>
                        <table>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Nome</th>
                                    <th>Modalidade</th>
                                    <th>Observações</th>
                                    <th>Validade Contrato</th>
                                    <th>Cargo</th>
                                    <th>Usuário</th>
                                    <th>Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {funcionarios.map(funcionario =>
                                    <tr key={funcionario.id}>
                                        <td>{funcionario.id}</td>
                                        <td>{funcionario.nome}</td>
                                        <td>{funcionario.modalidade}</td>
                                        <td>{funcionario.observacoes}</td>
                                        <td>{funcionario.validadeContrato.toLocaleDateString()}</td>
                                        <td>{funcionario.cargo?.nome ?? "N/A"}</td>
                                        <td>{funcionario.usuario?.email ?? "N/A"}</td>
                                        <td>
                                            <button onClick={() => handleEdit(funcionario)}>Editar</button>
                                            <button onClick={() => handleDelete(funcionario.id)}>Excluir</button>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </main>
        </div >
    );
}

export default FuncionariosScreen;