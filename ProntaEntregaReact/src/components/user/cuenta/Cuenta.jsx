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
    <div className='micuenta'>
      <h1>{`Bienvenido ${userData.nombreusuario}`}</h1>
      <form>
      <h2>Información personal</h2>
      <div>
      <label for="nombre">Nombre:</label>
      <input type="text" id="nombre" value={`Nombre: ${userData.nombre}`}/>

      <label for="apellido">Apellido:</label>
      <input type="text" id="apellido" value={`Apellido: ${userData.apellido}`}/>

      <label for="email">Correo electrónico:</label>
      <input type="email" id="email" value={`Email: ${userData.email}`}/>

      <label for="telefono">Teléfono:</label>
      <input type="tel" id="telefono" value={`Telefono: ${userData.telefono}`}/>

      <label for="direccion">Dirección:</label>
      <input type="text" id="direccion" value={`Direccion: ${userData.id_direccion.localidad}, ${userData.id_direccion.calle} ${userData.id_direccion.numero}`}/>
        
      <label for="genero">Genero:</label>
      <input type="text" id="genero" value={`Genero: ${GENDER_CHOICES[userData.genero]}`}/>
    
      <label for="fechaNacimiento">Fecha de nacimiento:</label>
      <input type="date" id="fechaNacimiento"/>
      </div>
      </form>
    </div>
    );
};

export default Cuenta;
