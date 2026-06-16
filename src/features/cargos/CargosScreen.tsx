import { useEffect, useState } from 'react';
import { apiClient } from '../../api/apiClient';
import { Area } from '../areas/AreasScreen';

export interface Cargo {
    id: string;
    nome: string;
    salario: number;
    area: Area | null;
}

// Interface auxiliar para os datos do formulario
interface CargoFormData {
    id?: string;
    nome: string;
    salario: number | string;
    idArea: string; // Chave foránea para o backend
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

    // Buscar Cargos e Áreas simultaneamente
    async function fetchData() {
        setIsLoading(true);
        try {
            const [cargosData, areasData] = await Promise.all([
                apiClient.get<Cargo[]>("/cargos"),
                apiClient.get<Area[]>("/areas")
            ]);
            setCargos(cargosData);
            setAreas(areasData);
        } catch (err) {
            setError("Failed to fetch data");
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
        
        // Formatar os datos para o backend
        const payload = {
            ...formData,
            idArea: formData.idArea !== '' ? formData.idArea : null,
            salario: Number(formData.salario) // Asegurar que o salario se envía como número
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
        } catch (err) {
            setError('Falha ao guardar o cargo.');
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
        try {
            await apiClient.delete(`/cargos/${id}`);
            fetchData();
        } catch (err) {
            setError('Falha ao eliminar o cargo.');
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
                <div style={{ backgroundColor: "salmon", padding: '10px', marginBottom: '15px' }}>
                    <h5>Ocorreu um erro na aplicação...</h5>
                    <small>{error}</small>
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