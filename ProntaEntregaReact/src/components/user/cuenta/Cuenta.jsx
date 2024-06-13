import React, { useEffect, useState } from "react";
import fetchData from '../../../functions/fetchData';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import './cuenta.scss';

const GENDER_CHOICES = {
    0: 'Hombre',
    1: 'Mujer',
    2: 'Prefiero no decirlo'
};

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
<div class="micuenta">
  <h1>{`Bienvenido ${userData.nombreusuario}`}</h1>
  <h2>Información personal</h2>
  <form>
    <div class="contenedor-inputs">
      <div class="columna">
        <label for="nombre">Nombre:</label>
        <input type="text" id="nombre" value={`${userData.nombre}`} disabled />

        <label for="apellido">Apellido:</label>
        <input type="text" id="apellido" value={`${userData.apellido}`} disabled />

        <label for="email">Correo electrónico:</label>
        <input type="email" id="email" value={`${userData.email}`} disabled />
      </div>

      <div class="columna">
        <label for="telefono">Teléfono:</label>
        <input type="tel" id="telefono" value={`${userData.telefono}`} disabled />

        <label for="direccion">Dirección:</label>
        <input type="text" id="direccion" value={`${userData.id_direccion.localidad}, ${userData.id_direccion.calle} ${userData.id_direccion.numero}`} disabled />

        <label for="genero">Genero:</label>
        <input type="text" id="genero" value={`${GENDER_CHOICES[userData.genero]}`} disabled />
      </div>
    </div>
  </form>
</div>

    );
};

export default Cuenta;
