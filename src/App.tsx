import UsuariosScreen from './features/usuarios/UsuariosScreen';
import AreasScreen from './features/areas/AreasScreen';
import CargosScreen from './features/cargos/CargosScreen';
import FuncionariosScreen from './features/funcionarios/FuncionariosScreen';

function App() {
  return (
    <div className="App">
      <h1>Meu segundo projeto em React</h1>
      <UsuariosScreen />
      <hr style={{ margin: '2rem 0' }} />
      <AreasScreen />
      <CargosScreen />
      <FuncionariosScreen />
    </div>
  );
}

export default App;