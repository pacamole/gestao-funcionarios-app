import { useEffect, useState } from 'react';
import { apiClient } from '../../api/apiClient';
import { Cargo } from '../cargos/CargosScreen';
import { Usuario } from '../usuarios/UsuariosScreen';

export interface Funcionario {
    id: string,
    nome: string,
    modalidade: string,
    observacoes: string,
    validadeContrato: Date,
    cargo: Cargo | null,
    usuario: Usuario | null,
}

function FuncionariosScreen() {
    const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    async function fetchFuncionarios() {
        try {
            const data = await apiClient.get<Funcionario[]>("/funcionarios")
            const funcionariosData = data.map(f => ({
                ...f,
                validadeContrato: new Date(f.validadeContrato)
            }));
            setFuncionarios(funcionariosData);
        } catch (error) {
            setError("Failed to fetch funcionarios")
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchFuncionarios();
    }, [])

    return (
        <div className='container' >
            <header>
                <h2>Gerenciar Funcionários</h2>
            </header>
            {isLoading && (<p>Carregando funcionários...</p>)}

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
                                <tr>
                                    <th>Id</th>
                                    <th>Nome</th>
                                    <th>Modalidade</th>
                                    <th>Observacoes</th>
                                    <th>ValidadeContrato</th>
                                    <th>Cargo</th>
                                    <th>Usuario</th>
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
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </main>
            )}
        </div >
    );
}

export default FuncionariosScreen