import { useEffect, useState } from 'react';
import { apiClient } from '../../api/apiClient';

export interface Area {
    id: string,
    nome: string,
    classificacao: string,
    idResponsavel: string | null,
    idAreaPai: string | null
}

function AreasScreen() {
    const [areas, setAreas] = useState<Area[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    async function fetchAreas() {
        try {
            var data = await apiClient.get<Area[]>("/areas");
            setAreas(data);
        } catch (err) {
            setError('Failed to fetch areas.');
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchAreas();
    }, [])

    const getAreaPai = (idAreaPai: string | null): string => {
        if (!idAreaPai) return "N/A";

        const areaPai = areas.find(area => area.id === idAreaPai)

        return areaPai ? areaPai.nome : "N/A";
    }

    return (
        <div className='container'>
            <header>
                <h2>Gerenciar Áreas</h2>
            </header>

            {isLoading && (<p>Carregando áreas...</p>)}

            {error && (<div style={{ backgroundColor: "salmon" }}>
                <h5>Ocorreu um erro na aplicação...</h5>
                <small>{error}</small>
            </div>)}

            {!isLoading && !error && (
                <div className='table-container'>
                    <table>
                        <thead>
                            <th>ID</th>
                            <th>Nome</th>
                            <th>Classificação</th>
                            <th>Area Pai</th>
                            <th>Gerente da Área</th>
                        </thead>
                        <tbody>
                            {areas.map(area =>

                                <tr key={area.id}>
                                    <td>{area.id}</td>
                                    <td>{area.nome}</td>
                                    <td>{area.classificacao}</td>
                                    <td>{getAreaPai(area.idAreaPai)}</td>
                                    <td>{area.idResponsavel || "Nenhum responsável"}</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}

export default AreasScreen;