import { NavLink } from "react-router-dom";
import "./Sidebar.css"

export const Sidebar = () => {
    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <h2>Sistema de RH</h2>
            </div>
            <nav className="sidebar-nav">
                <NavLink to="/usuarios" className="nav-item">
                    Usuários
                </NavLink>
                <NavLink to="/areas" className="nav-item">
                    Áreas
                </NavLink>
                <NavLink to="/cargos" className="nav-item">
                    Cargos
                </NavLink>
                <NavLink to="/funcionarios" className="nav-item">
                    Funcionários
                </NavLink>
            </nav>
        </aside>
    );
};