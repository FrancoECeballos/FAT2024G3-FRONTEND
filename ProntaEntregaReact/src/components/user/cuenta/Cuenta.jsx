import React, { useEffect, useState } from "react";
import fetchData from '../../../functions/fetchData';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import './cuenta.scss';
import Button from 'react-bootstrap/Button';
import { InputGroup } from "react-bootstrap";

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
            document.getElementById("editButton").innerText = "Editar";
            editButton.style.backgroundColor = 'blue';
            editButton.style.borderColor = 'blue';
            editButton.style.color = 'white';
        } else {
            setIsEditing(true);
            document.getElementById("editButton").innerText = "Cancelar";
            editButton.style.backgroundColor = 'yellow';
            editButton.style.borderColor = 'yellow';
            editButton.style.color = 'black';
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
            <Button style={{marginTop:'1rem', borderRadius:'10rem', width:'10rem', textAlign:'center', backgroundColor: 'red', borderColor:'red', color:'white', boxShadow: '0.10rem 0.3rem 0.20rem rgba(0, 0, 0, 0.3)'}} onClick={handleLogout}>Cerrar sesión</Button>
        </div>

        <div class="columna">
            <label for="telefono">Teléfono:</label>
            <input type="tel" id="telefono" defaultValue={`${userData.telefono}`} disabled ={!isEditing}/>

                <label for="direccion">Dirección:</label>
                <InputGroup className="mb-2">
                        <input disabled={!isEditing} name="localidad" type="text"  className="unified-input-left" />
                        <input disabled={!isEditing} name="calle" type="text" />
                        <input disabled={!isEditing} name="numero" type="number" className="unified-input-right" />
                </InputGroup>  

                <label for="genero">Genero:</label>
                <input type="text" id="genero" defaultValue={userData.genero in GENDER_CHOICES ? GENDER_CHOICES[userData.genero] : ''} disabled={!isEditing}/>
                
                <Button id="editButton" style={{marginTop:'1rem', borderRadius:'10rem', width:'6rem', textAlign:'center', backgroundColor: 'blue', borderColor:'blue', color:'white', boxShadow: '0.10rem 0.3rem 0.20rem rgba(0, 0, 0, 0.3)'}} onClick={handleEdit}>Editar</Button>
                <Button id="editButton" style={{marginTop:'1rem', borderRadius:'10rem', width:'6rem', textAlign:'center', backgroundColor: 'green', borderColor:'green', color:'white', boxShadow: '0.10rem 0.3rem 0.20rem rgba(0, 0, 0, 0.3)'}} hidden ={!isEditing} onClick={handleEdit}>Guardar</Button>
            </div>
        </div>
        </form>
    </div>
    );
};

export default Cuenta;
