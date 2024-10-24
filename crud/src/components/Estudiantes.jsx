import React,{Component} from "react";
import {tsConstructorType} from '@babel/types';
import { apiEndpoint, apiCreatepoint, apiUpdatepoint } from "./Variables"

export class Estudiantes extends Component{

    constructor(props) {
        super(props);

        this.state={
            estudiantesData:[],
            loading:true,
            error:null,
            nombre: "",
            edad: "",
            correo: "",
            idEstudiante:0,
        };
    }

    componentDidMount() {
        fetch(apiEndpoint)
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Error en la respuesta de Api");
                }
                return response.json();
            })
            .then((data) => {
                if (data.succeeded && Array.isArray(data.result)) {
                    this.setState({ estudiantesData: data.result, loading: false });
                } else {
                    throw new Error("La respuesta no contiene resultados válidos");
                }
            })
            .catch((error) => {
                console.error("Error fetching estudiantes:", error);
                this.setState({ error: error.message, loading: false });
            });
    }

    handleInputChange=(e) => {
        const {name, value} = e.target;
        this.setState ({ [name]: value});
    }

    addClick = () => {
        this.state({
            idEstudiante: 0,
            nombre: "",
            edad: "",
            correo: "",
        });
    };

    editClick = (id) => {
        const estudiante = this.state.estudiantesData.find(est => est.id === id);
        if (estudiante) {
            this.setState({
                idEstudiante: estudiante.id,
                nombre: estudiante.nombre,
                edad: estudiante.edad,
                correo: estudiante.correo,
            });
        }
    };

    crearEstudiantes = () =>{
        const {nombre, edad, correo } = this.state;

        const nuevoEstudiante = {
            idEstudiante: 0,
            nombre: nombre,
            edad: edad,
            correo: correo,
        };

        fetch(apiCreatepoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(nuevoEstudiante),
        })
        .then((response) => {
            if(!response.ok) {
                throw new Error("Error al crear al estudiante");
            }
            return response.json();
        })
        .then((data) => {
            if(data.succeeded) {
                alert("Estudiantes Creado Con Éxito");
                this.setState((prevState) => ({
                    estudiantesData: [...prevState.estudiantesData, data.result],
                    nombre: "",
                    edad: "",
                    correo: "",
                }));

                window.location.reload();
            }
        })
        .catch((error) => {
            console.log("Error Creado Estudiante", error);
        });
    };

    UpdateEstudiantes = () => {
        const {idEstudiante, nombre, edad, correo} = this.state;

        const UpdateEstudiantes = {
            idEstudiante: idEstudiante,
            nombre: nombre,
            edad: edad,
            correo: correo,
        }

        fetch(apiUpdatepoint, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(UpdateEstudiantes),
        })
        .then((response) => {
            if(!response.ok) {
                throw new Error("Error al Actualizar al estudiantes");
            }
            return response.json();
        })
        .then((data) => {
            if(data.succeeded) {
                alert("Estudiante Actualizado Correctamente");
                this.setState((prevState) => ({
                    estudiantesData: prevState.estudiantesData.map(est => 
                        est.id === idEstudiante ? data.result : est 
                    ),
                    nombre:"",
                    edad: "",
                    correo: "",
                    idEstudiante: 0,
                }));

                window.location.reload();
            }
        })
        .catch((error) => {
            console.log("Error Al Actualizar al Estudiante", error);
        });
    };

    DeleteEstudiate = (id) => {

        const apiDeletepoint = `https://localhost:7183/api/estudiante/delete/${id}`;

        if (window.confirm("Estas seguro de eliminar este estudiantes")) {
            fetch(apiDeletepoint, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                }
            })
            .then((response) => {
                if(!response.ok) {
                    throw new Error("Error al Eliminar al Estudiante");
                }
                return response.json();
            })
            .then((data) => {
                if(data.succeeded) {
                    alert("Estudiante Eliminado Correctamente");
                    this.setState((prevState) => ({
                        estudiantesData: prevState.estudiantesData.filter(est => est.id !== id),
                    }));

                    window.location.reload()
                }
            })
            .catch((error) => {
                console.log("Error al eliminar al estudiante", error)
            });
        }
    } 

    render(){

        const {estudiantesData, loading, error} = this.state;

        if(loading) {
            return <div>Cargando...</div>;
        }

        if(error) {
            return <div>Error: {error}</div>
        } 

        return(
            <div>
                <button type="button" className="btn btn-primary m-2 float-end" data-bs-toggle="modal" data-bs-target="#exampleModal" onClick={()=>this.addClick}> Crear Estudiantes</button>
                <table className="table table-striped
                ">
                    <thead>
                        <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Edad</th>
                        <th>Correo</th>
                        <th>Opciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {estudiantesData.map((estudiante) =>(
                            <tr key={estudiante.id}>
                                <td>{estudiante.id}</td>
                                <td>{estudiante.nombre}</td>
                                <td>{estudiante.edad}</td>
                                <td>{estudiante.correo}</td>
                                <td>
                                    <button type="button"
                                    data-bs-toggle="modal" data-bs-target="#exampleModal" onClick={() => this.editClick(estudiante.id)}
                                    className="btn btn-light mr-1">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil" viewBox="0 0 16 16">
                                        <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325"/>
                                        </svg>
                                    </button>

                                    <button type="button"
                                    onClick={() => this.DeleteEstudiate(estudiante.id)}
                                    className="btn btn-light mr-1">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                                        <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
                                        <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
                                        </svg>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>


                <div className="modal fade" id="exampleModal" tabIndex="-1" aria-hidden="true">
                    <div className="modal-dialog modal-lg modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Estudiantes</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>

                            <div className="modal-body">
                                <div className="input-group mb-3">
                                    <span className="input-group-text">Nombre</span>
                                    <input type="text" className="form-control"
                                    name="nombre"
                                    value={this.state.nombre}
                                    onChange={this.handleInputChange}/>
                                </div>

                                <div className="input-group mb-3">
                                    <span className="input-group-text">Edad</span>
                                    <input
                                        type="number"
                                        className="form-control"
                                        name="edad"
                                        value={this.state.edad}
                                        onChange={this.handleInputChange}
                                    />
                                </div>

                                <div className="input-group mb-3">
                                    <span className="input-group-text">Correo</span>
                                    <input
                                        type="email"
                                        className="form-control"
                                        name="correo"
                                        value={this.state.correo}
                                        onChange={this.handleInputChange}
                                    />
                                </div>

                                {this.state.idEstudiante === 0 ? (
                                    <button
                                        type="button"
                                        className="btn btn-primary float-start"
                                        onClick={this.crearEstudiantes}
                                    >
                                        Create
                                    </button>
                                ) : (
                                    <button type="button" className="btn btn-primary float-start"
                                    onClick={this.UpdateEstudiantes}>
                                        Update
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}