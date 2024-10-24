import React from "react";
import { Estudiantes } from "./Estudiantes.jsx";
import { HolaMundo } from "./HolaMundo.jsx";
import { BrowserRouter, Route, Routes, NavLink } from "react-router-dom";

function App() {

    return (
        <BrowserRouter>
        <div className="App container">
            <h3 className="d-flex justify-content-center m-3">Crudo de Estudiantes</h3>

            <nav className="navbar navbar-expand-sm bg-light navbar-dark">
                <ul className="navbar-nav">
                    <li className="nav-item m-1">
                        <NavLink className="btn btn-light btn-outline-primary" to="/Estudiantes">
                            Estudiantes
                        </NavLink>
                    </li>
                    <li className="nav-item m-1">
                        <NavLink className="btn btn-light btn-outline-primary" to="/HolaMundo">
                            HolaMundo
                        </NavLink>
                    </li>
                </ul>
            </nav>

            <Routes>
                <Route path="/Estudiantes" Component={Estudiantes} />
                <Route path="/HolaMundo" Component={HolaMundo} />
            </Routes>
        </div>
        </BrowserRouter>
    );
}

export default App;
