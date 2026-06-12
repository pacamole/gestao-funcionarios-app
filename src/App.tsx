import UsuariosScreen from './features/usuarios/UsuariosScreen';
import AreasScreen from './features/areas/AreasScreen';
import CargosScreen from './features/cargos/CargosScreen';
import FuncionariosScreen from './features/funcionarios/FuncionariosScreen';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import "./index.css";

function App() {
  return (
    <BrowserRouter>
      <div className='app-layout'>
        <Sidebar />
        <div className='main-content'>
          <Routes>
            <Route path='/' element={<Navigate to="/usuarios" replace />} />
            <Route path='/usuarios' element={<UsuariosScreen />} />
            <Route path='/areas' element={<AreasScreen />} />
            <Route path='/cargos' element={<CargosScreen />} />
            <Route path='/funcionarios' element={<FuncionariosScreen />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;