import { useEffect, useState } from 'react';
import { apiClient } from '../../api/apiClient';
import { Area } from '../areas/AreasScreen';

export interface Cargo {
    id: string,
    nome: string,
    salario: number,
    area: Area
}

function CargosScreen() {
    const [cargos, setCargos] = useState<Cargo[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    async function fetchCargos() {
        try {
            const cargosData = await apiClient.get<Cargo[]>("/cargos");
            setCargos(cargosData);
        } catch (err) {
            setError("Failed to fetch cargos data");
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchCargos();
    }, [])

    return (
        <div className='container'>
            <header>
                <h2>Gerenciar Cargos</h2>
            </header>
            {isLoading && (<p>Carregando cargos...</p>)}

            {error && (
                <div style={{ backgroundColor: "salmon" }}>
                    <h5>Ocorreu um erro na aplicação...</h5>
                    <small>{error}</small>
                </div>
            )}

            {!isLoading && !error && (
                <main>
                    <div className='table-container'>
                        <table>
                            <thead>
                                <th>ID</th>
                                <th>Nome</th>
                                <th>Salario</th>
                                <th>Area</th>
                            </thead>
                            <tbody>
                                {cargos.map(cargo =>

                                    <tr key={cargo.id}>
                                        <td>{cargo.id}</td>
                                        <td>{cargo.nome}</td>
                                        <td>R$ {cargo.salario}</td>
                                        <td>{cargo.area.nome}</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </main>
            )}
        </div>);
}

export default CargosScreen;