import UsuariosScreen from './features/usuarios/UsuariosScreen';
import AreasScreen from './features/areas/AreasScreen';

function App() {
  return (
    <div className="App">
      <h1>Meu segundo projeto em React</h1>
      <UsuariosScreen></UsuariosScreen>
      <hr style={{ margin: '2rem 0' }} />
      <AreasScreen></AreasScreen>
    </div>
  );
}

export default App;