import { useEffect, useState } from 'react';
import { apiClient } from '../../api/apiClient';
import { Area } from '../areas/AreasScreen';

export interface Cargo {
    id: string;
    nome: string;
    salario: number;
    area: Area | null;
}

interface CargoFormData {
    id?: string;
    nome: string;
    salario: number | string;
    idArea: string;
}

function CargosScreen() {
    const [cargos, setCargos] = useState<Cargo[]>([]);
    const [areas, setAreas] = useState<Area[]>([]);
    
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
    const [formData, setFormData] = useState<CargoFormData>({
        nome: '',
        salario: '',
        idArea: ''
    });

    async function fetchData() {
        setIsLoading(true);
        setError(null);
        try {
            const [cargosData, areasData] = await Promise.all([
                apiClient.get<Cargo[]>("/cargos"),
                apiClient.get<Area[]>("/areas")
            ]);
            setCargos(cargosData);
            setAreas(areasData);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchData();
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        
        const payload = {
            ...formData,
            idArea: formData.idArea !== '' ? formData.idArea : null,
            salario: Number(formData.salario)
        };

        try {
            if (formData.id) {
                await apiClient.put(`/cargos/${formData.id}`, payload);
            } else {
                const { id, ...newCargo } = payload;
                await apiClient.post('/cargos', newCargo);
            }
            setIsFormOpen(false);
            setFormData({ nome: '', salario: '', idArea: '' });
            fetchData();
        } catch (err: any) {
            setError(err.message);
        }
    };

    const handleEdit = (cargo: Cargo) => {
        setFormData({
            id: cargo.id,
            nome: cargo.nome,
            salario: cargo.salario,
            idArea: cargo.area?.id || ''
        });
        setIsFormOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm("Tem a certeza que deseja eliminar este cargo?")) return;
        setError(null);
        try {
            await apiClient.delete(`/cargos/${id}`);
            fetchData();
        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <div className='container'>
            <header>
                <h2>Gerenciar Cargos</h2>
                <button onClick={() => { setIsFormOpen(!isFormOpen); setFormData({ nome: '', salario: '', idArea: '' }); }}>
                    {isFormOpen ? 'Cancelar' : 'Adicionar Novo Cargo'}
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
                    <h3>{formData.id ? 'Editar Cargo' : 'Novo Cargo'}</h3>
                    <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <div>
                            <label>Nome: </label>
                            <input type="text" name="nome" value={formData.nome} onChange={handleInputChange} required />
                        </div>
                        <div>
                            <label>Salário: </label>
                            <input 
                                type="number" 
                                step="0.01" 
                                min="0"
                                name="salario" 
                                value={formData.salario} 
                                onChange={handleInputChange} 
                                required 
                            />
                        </div>
                        <div>
                            <label>Área: </label>
                            <select name="idArea" value={formData.idArea} onChange={handleInputChange}>
                                <option value="">Nenhuma</option>
                                {areas.map(a => (
                                    <option key={a.id} value={a.id}>{a.nome}</option>
                                ))}
                            </select>
                        </div>
                        <button type="submit" style={{ alignSelf: 'flex-start' }}>Guardar</button>
                    </form>
                </div>
            )}

            <main>
                {isLoading ? (<p>Carregando cargos...</p>) : (
                    <div className='table-container'>
                        <table>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Nome</th>
                                    <th>Salario</th>
                                    <th>Area</th>
                                    <th>Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {cargos.map(cargo =>
                                    <tr key={cargo.id}>
                                        <td>{cargo.id}</td>
                                        <td>{cargo.nome}</td>
                                        <td>R$ {cargo.salario}</td>
                                        <td>{cargo.area?.nome || "N/A"}</td>
                                        <td>
                                            <button onClick={() => handleEdit(cargo)} style={{ marginRight: '5px' }}>Editar</button>
                                            <button onClick={() => handleDelete(cargo.id)}>Excluir</button>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </main>
        </div>
    );
}

export default CargosScreen;