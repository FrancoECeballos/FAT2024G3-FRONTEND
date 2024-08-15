import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import { Row, Col, InputGroup } from 'react-bootstrap';
import Cookies from 'js-cookie';
import fetchData from '../../../functions/fetchData';
import './Datos.scss';
import user from '../../../assets/user_default.png';

const Datos = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const token = Cookies.get('token');
    const [isAdmin, setIsAdmin] = useState(location.state);

    const [userData, setUserData] = useState({
        "id": "",
        "nombre": "",
        "apellido": "",
        "nombre_usuario": "",
        "documento": "",
        "telefono": "",
        "email": "",
        "genero": "",
        "fecha_union": "",
        "last_login": "",
        "is_superuser": false,
        "is_verified": false,
        "id_direccion": "",
        "id_tipo_usuario": "",
        "id_tipo_documento": ""
    });

    useEffect(() => {
        const updateUserState = (result) => {
            console.log("Fetched user data: ", result); // Debug: Check fetched data
            setUserData(result);
        };

        if (!isAdmin) {
            if (!token) {
                navigate('/login');
                return;
            }
            fetchData(`/userToken/${token}`).then(updateUserState).catch(err => console.error("Error fetching user data: ", err)); // Debug: Handle fetch error
        } else {
            fetchData(`/user/${location.state.user_email}`).then(updateUserState).catch(err => console.error("Error fetching user data: ", err)); // Debug: Handle fetch error
        }
    }, [token, navigate, location.state, isAdmin]);

    const handleLogout = () => {
        Cookies.remove('token');
        navigate('/login');
    };

    if (!userData.nombre) {
        return <div>Loading...</div>; // Simple loading state
    }
    return (
        <div className="micuenta">
          <h1>
            <img src={user} className="fotoperfil" alt="User" />
            {`Bienvenido ${userData.nombre + " " + userData.apellido}`}
          </h1>
          <Row className="filainputs">
            <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={6}>
              <div className="form-container">
                <label htmlFor="nombre">Nombre:</label>
                <input type="text" id="nombre" name="nombre" value={userData.nombre} disabled className="form-control" />
    
                <label htmlFor="apellido">Apellido:</label>
                <input type="text" id="apellido" name="apellido" value={userData.apellido} disabled className="form-control" />
    
                <label htmlFor="email">Correo electrónico:</label>
                <input type="email" id="email" name="email" value={userData.email} disabled className="form-control" />
    
                <label htmlFor="fecha_union">Fecha de unión:</label>
                <input type="text" id="fecha_union" name="fecha_union" value={userData.fecha_union} disabled className="form-control" />
              </div>
            </Col>
            <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={6}>
              <div className="form-container">
                <label htmlFor="telefono">Teléfono:</label>
                <input type="text" id="telefono" name="telefono" value={userData.telefono} disabled className="form-control" />
    
                <label htmlFor="direccion">Dirección:</label>
                <InputGroup className="groupderec">
                  <input
                    style={{ width: '10rem' }}
                    type="text"
                    id="id_direccion"
                    name="id_direccion.localidad"
                    value={userData.id_direccion.localidad}
                    disabled
                    className="form-control"
                  />
                  <input
                    style={{ width: '10rem' }}
                    type="text"
                    id="id_direccion"
                    name="id_direccion.calle"
                    value={userData.id_direccion.calle}
                    disabled
                    className="form-control"
                  />
                  <input
                    style={{ width: '5rem' }}
                    type="text"
                    id="id_direccion"
                    name="id_direccion.numero"
                    value={userData.id_direccion.numero}
                    disabled
                    className="form-control"
                  />
                </InputGroup>
    
                <label htmlFor="genero">Género:</label>
                <select className="genero form-control" name="genero" id="genero" value={userData.genero} disabled>
                  <option value="1">Masculino</option>
                  <option value="2">Femenino</option>
                  <option value="3">Prefiero no decir</option>
                </select>
    
                <label htmlFor="tipo_documento">Documento:</label>
                <input type="text" id="id_tipo_documento" name="id_tipo_documento" value={userData.documento} disabled className="form-control" />
              </div>
            </Col>
          </Row>
        </div>
      );
    };
    
    export default Datos;