import React, { useEffect, useState } from "react";
import fetchData from '../../../functions/fetchData';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import './cuenta.scss';
import Button from 'react-bootstrap/Button';

const GENDER_CHOICES = {
    0: 'Hombre',
    1: 'Mujer',
    2: 'Prefiero no decirlo'
};

const Cuenta = () => {
    const navigate = useNavigate();
    const token = Cookies.get('token');
    const [isEditing, setIsEditing] = useState(false);

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

    const handleEdit = () => {
        if (isEditing) {  
            setIsEditing(false);
        } else {
            setIsEditing(true);
        }
    };

    return (
    <div class="micuenta">
    <h1>{`Bienvenido ${userData.nombreusuario}`}</h1>
    <h2>Información personal</h2>
    <form>
        <div class="contenedor-inputs">
        <div class="columna">
            <label for="nombre">Nombre:</label>
            <input type="text" id="nombre" defaultValue={`${userData.nombre}`} disabled ={!isEditing}/>

            <label for="apellido">Apellido:</label>
            <input type="text" id="apellido" defaultValue={`${userData.apellido}`} disabled ={!isEditing}/>

            <label for="email">Correo electrónico:</label>
            <input type="email" id="email" defaultValue={`${userData.email}`} disabled ={!isEditing}/>
        </div>

        <div class="columna">
            <label for="telefono">Teléfono:</label>
            <input type="tel" id="telefono" defaultValue={`${userData.telefono}`} disabled ={!isEditing}/>

                <label for="direccion">Dirección:</label>
                <input type="text" id="direccion" defaultValue={`${userData.id_direccion.localidad}, ${userData.id_direccion.calle} ${userData.id_direccion.numero}`} disabled={!isEditing}/>
                    
                <label for="genero">Genero:</label>
                <input type="text" id="genero" defaultValue={`${GENDER_CHOICES[userData.genero]}`} disabled={!isEditing}/>
                
            </div>
        </div>
        </form>
        <Button style={{borderRadius:'10rem', width:'6rem', textAlign:'center', backgroundColor: 'blue', borderColor:'blue', color:'white', boxShadow: '0.10rem 0.3rem 0.20rem rgba(0, 0, 0, 0.3)'}} onClick={handleEdit}>Editar</Button>
        <Button onClick={handleLogout}>Cerrar sesión</Button>
    </div>
    );
};

export default Cuenta;
