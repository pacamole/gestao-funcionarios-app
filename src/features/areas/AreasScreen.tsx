import { useEffect, useState } from 'react';
import { apiClient } from '../../api/apiClient';
import { Funcionario } from '../funcionarios/FuncionariosScreen';

export interface Area {
    id: string;
    nome: string;
    classificacao: string;
    funcionarioResponsavel: Funcionario | null;
    idAreaPai: string | null;
}

interface AreaFormData {
    id?: string;
    nome: string;
    classificacao: string;
    funcionarioResponsavelId: string;
    idAreaPai: string;
}

function AreasScreen() {
    const [areas, setAreas] = useState<Area[]>([]);
    const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
    
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
    const [formData, setFormData] = useState<AreaFormData>({
        nome: '',
        classificacao: '',
        funcionarioResponsavelId: '',
        idAreaPai: ''
    });

    async function fetchData() {
        setIsLoading(true);
        setError(null);
        try {
            const [areasData, funcionariosData] = await Promise.all([
                apiClient.get<Area[]>("/areas"),
                apiClient.get<Funcionario[]>("/funcionarios")
            ]);
            setAreas(areasData);
            setFuncionarios(funcionariosData);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchData();
    }, []);

    const getAreaPai = (idAreaPai: string | null): string => {
        if (!idAreaPai) return "N/A";
        const areaPai = areas.find(area => area.id === idAreaPai);
        return areaPai ? areaPai.nome : "N/A";
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        
        const payload = {
            ...formData,
            funcionarioResponsavelId: formData.funcionarioResponsavelId || null,
            idAreaPai: formData.idAreaPai || null
        };

        try {
            if (formData.id) {
                await apiClient.put(`/areas/${formData.id}`, payload);
            } else {
                const { id, ...newArea } = payload;
                await apiClient.post('/areas', newArea);
            }
            setIsFormOpen(false);
            setFormData({ nome: '', classificacao: '', funcionarioResponsavelId: '', idAreaPai: '' });
            fetchData();
        } catch (err: any) {
            setError(err.message);
        }
    };

    const handleEdit = (area: Area) => {
        setFormData({
            id: area.id,
            nome: area.nome,
            classificacao: area.classificacao,
            funcionarioResponsavelId: area.funcionarioResponsavel?.id || '',
            idAreaPai: area.idAreaPai || ''
        });
        setIsFormOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm("Tem a certeza que deseja eliminar esta área?")) return;
        setError(null);
        try {
            await apiClient.delete(`/areas/${id}`);
            fetchData();
        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <div className='container'>
            <header>
                <h2>Gerenciar Áreas</h2>
                <button onClick={() => { setIsFormOpen(!isFormOpen); setFormData({ nome: '', classificacao: '', funcionarioResponsavelId: '', idAreaPai: '' }); }}>
                    {isFormOpen ? 'Cancelar' : 'Adicionar Nova Área'}
                </button>
            </header>

            {error && (
                <div style={{ 
                    backgroundColor: "#ffcccc", 
                    border: "1px solid red", 
                    padding: '15px', 
                    color: '#900', 
                    borderRadius: '5px', 
                    marginBottom: '20px',
                    overflowX: 'auto' 
                }}>
                    <h4 style={{ margin: '0 0 10px 0' }}>⚠️ Atenção:</h4>
                    <pre style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word', fontFamily: 'monospace', fontSize: '13px', margin: 0 }}>
                        {error}
                    </pre>
                </div>
            )}

            {isFormOpen && (
                <div style={{ marginBottom: '20px', padding: '15px', border: '1px solid #ccc' }}>
                    <h3>{formData.id ? 'Editar Área' : 'Nova Área'}</h3>
                    <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <div>
                            <label>Nome: </label>
                            <input type="text" name="nome" value={formData.nome} onChange={handleInputChange} required />
                        </div>
                        <div>
                            <label>Classificação: </label>
                            <input type="text" name="classificacao" value={formData.classificacao} onChange={handleInputChange} required />
                        </div>
                        <div>
                            <label>Área Pai: </label>
                            <select name="idAreaPai" value={formData.idAreaPai} onChange={handleInputChange}>
                                <option value="">Nenhuma</option>
                                {areas.filter(a => a.id !== formData.id).map(area => (
                                    <option key={area.id} value={area.id}>{area.nome}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label>Gerente da Área: </label>
                            <select name="funcionarioResponsavelId" value={formData.funcionarioResponsavelId} onChange={handleInputChange}>
                                <option value="">Nenhum</option>
                                {funcionarios.map(func => (
                                    <option key={func.id} value={func.id}>{func.nome}</option>
                                ))}
                            </select>
                        </div>
                        <button type="submit" style={{ alignSelf: 'flex-start' }}>Guardar</button>
                    </form>
                </div>
            )}

            <main>
                {isLoading ? (<p>Carregando dados...</p>) : (
                    <div className='table-container'>
                        <table>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Nome</th>
                                    <th>Classificação</th>
                                    <th>Area Pai</th>
                                    <th>Gerente da Área</th>
                                    <th>Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {areas.map(area =>
                                    <tr key={area.id}>
                                        <td>{area.id}</td>
                                        <td>{area.nome}</td>
                                        <td>{area.classificacao}</td>
                                        <td>{getAreaPai(area.idAreaPai)}</td>
                                        <td>{area.funcionarioResponsavel?.nome || "Nenhum responsável"}</td>
                                        <td>
                                            <button onClick={() => handleEdit(area)} style={{ marginRight: '5px' }}>Editar</button>
                                            <button onClick={() => handleDelete(area.id)}>Excluir</button>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </main>
        </div>
    )
}

export default AreasScreen;