import React, { useEffect, useState } from "react";
import fetchData from '../../../functions/fetchData';
import Cookies from 'js-cookie';
import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom';
import './cuenta.scss';

const Cuenta = () => {
    const navigate = useNavigate();
    const token = Cookies.get('token');

    const [userData, setUserData] = useState({
        nombre: "",
        apellido: "",
        nombreusuario: "",
        password: "",
        documento: "",
        telefono: "",
        email: "",
        genero: "",
        id_direccion: "",
        id_tipousuario: "",
        id_tipodocumento: ""
    });

    useEffect(() => {
        if (!token) {
            navigate('/login');
            return;
        }
        fetchData(`/userToken/${token}`).then((result) => {
            setUserData(result);
        });
    }, [token]);

    const handleLogout = () => {
        Cookies.remove('token');
        navigate('/login');
    };

    return (

    <div className='micuenta'>
      <h1>Pedrito Me Electrocutaste</h1>
      <form>
      <label for="nombre">Nombre:</label>
      <input type="text" id="nombre"/>

      <label for="apellido">Apellido:</label>
      <input type="text" id="apellido"/>

      <label for="email">Correo electrónico:</label>
      <input type="email" id="email"/>

      <label for="telefono">Teléfono:</label>
      <input type="tel" id="telefono"/>

      <label for="direccion">Dirección:</label>
      <input type="text" id="direccion"/>

      <label for="fechaNacimiento">Fecha de nacimiento:</label>
      <input type="date" id="fechaNacimiento"/>
      </form>
    </div>
    );
};

export default Cuenta;
