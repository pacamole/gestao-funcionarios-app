import { useEffect, useState } from 'react';
import { apiClient } from '../../api/apiClient';
import { Area } from '../areas/AreasScreen';

export interface Cargo {
    id: string,
    nome: string,
    salario: number,
    idArea: string | null
}



function CargosScreen() {
    const [cargos, setCargos] = useState<Cargo[]>([]);
    const [areas, setAreas] = useState<Area[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    async function fetchCargos() {
        try {
            const [cargosData, areasData] = await Promise.all([
                apiClient.get<Cargo[]>("/cargos"),
                apiClient.get<Area[]>("/areas")
            ]);

            setCargos(cargosData);
            setAreas(areasData);
        } catch (err) {
            setError("Failed to fetch cargos and/or areas data");
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchCargos();
    }, [])

    const getArea = (idArea: string | null): string => {
        if (!idArea) return "N/A";

        const area = areas.find(area => area.id === idArea);

        return area ? area.nome : "N/A";
    }

    return (<div className='container'>
        <header>
            <h2>Gerenciar Cargos</h2>
        </header>
        {isLoading && (<p>Carregando áreas...</p>)}

        {error && (
            <div style={{ backgroundColor: "salmon" }}>
                <h5>Ocorreu um erro na aplicação...</h5>
                <small>{error}</small>
            </div>
        )}

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
                                <td>{getArea(cargo.idArea)}</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </main>

    </div>);
}

export default CargosScreen;