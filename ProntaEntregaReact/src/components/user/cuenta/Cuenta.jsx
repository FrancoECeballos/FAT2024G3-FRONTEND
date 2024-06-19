import React, { useEffect, useRef, useState } from "react";
import fetchData from '../../../functions/fetchData';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import './cuenta.scss';
import { Button, Form } from 'react-bootstrap';
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
        "nombre": "",
        "apellido": "",
        "nombreusuario": "",
        "password": "",
        "documento": "",
        "telefono": "",
        "email": "",
        "genero": "",
        "id_direccion": "",
        "id_tipodocumento": ""
    });

    const nombreRef = useRef();
    const apellidoRef = useRef();
    const emailRef = useRef();
    const telefonoRef = useRef();
    const direccionRef = useRef();
    const generoRef = useRef();

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
            if (nombreRef.current) nombreRef.current.value = nombreRef.current.defaultValue;
            if (apellidoRef.current) apellidoRef.current.value = apellidoRef.current.defaultValue;
            if (emailRef.current) emailRef.current.value = emailRef.current.defaultValue;
            if (telefonoRef.current) telefonoRef.current.value = telefonoRef.current.defaultValue;
            if (direccionRef.current) direccionRef.current.value = direccionRef.current.defaultValue;
            if (generoRef.current) generoRef.current.value = generoRef.current.defaultValue;
        } else {
            setIsEditing(true);
            document.getElementById("editButton").innerText = "Cancelar";
            editButton.style.backgroundColor = 'yellow';
            editButton.style.borderColor = 'yellow';
            editButton.style.color = 'black';
        }
    };
    
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setUserData((prevData) =>  {
            const updatedData = { ...prevData, [name]: value };
            return updatedData;
        });
    };

    const [direcFormData, setDirecFormData] = useState({
        "calle": "",
        "numero": "",
        "localidad": ""
    });

    const handleDirecChange = (event) => {
        const { name, value } = event.target;
        setDirecFormData((prevData) =>  {
            let updatedValue = value;
            if (name === "numero") {
                updatedValue = parseInt(value, 10);
            }
            const updatedData = { ...prevData, [name]: updatedValue };
            return updatedData;
        })
    };

    return (
    <div class="micuenta">
    <h1>{`Bienvenido ${userData.nombreusuario}`}</h1>
    <h2>Información personal</h2>
    <form>
        <div class="contenedor-inputs">
        <div class="columna">
            <label for="nombre">Nombre:</label>
            <input type="text" id="nombre" defaultValue={`${userData.nombre}`} ref={nombreRef} disabled ={!isEditing}/>

            <label for="apellido">Apellido:</label>
            <input type="text" id="apellido" defaultValue={`${userData.apellido}`} ref={apellidoRef} disabled ={!isEditing}/>

            <label for="email">Correo electrónico:</label>
            <input type="email" id="email" defaultValue={`${userData.email}`} ref={emailRef} disabled ={!isEditing}/>
            <Button style={{marginTop:'1rem', borderRadius:'10rem', width:'10rem', textAlign:'center', backgroundColor: 'red', borderColor:'red', color:'white', boxShadow: '0.10rem 0.3rem 0.20rem rgba(0, 0, 0, 0.3)'}} onClick={handleLogout}>Cerrar sesión</Button>
        </div>

        <div class="columna">
            <label for="telefono">Teléfono:</label>
            <InputGroup className="grouptel">
                        <input disabled={!isEditing} name="cai" type="text"  className="unified-input-left" />
                        <input disabled={!isEditing} name="telnum" type="text" className="unified-input-right" />
                </InputGroup>  

                <label for="direccion">Dirección:</label>
                <InputGroup className="groupderec">
                        <input disabled={!isEditing} name="localidad" type="text"  className="unified-input-left" />
                        <input disabled={!isEditing} name="calle" type="text" />
                        <input disabled={!isEditing} name="numero" type="text" className="unified-input-right" />
                </InputGroup>  

                <label for="genero">Genero:</label>
                <Form.Select className="genero" name="genero" id="genero" value={`${userData.genero}`} onChange={handleInputChange} aria-label="Default select example" ref={generoRef} disabled={!isEditing}>
                    <option value="0">Masculino</option>
                    <option value="1">Femenino</option>
                    <option value="2">Prefiero no decir</option>
                </Form.Select>

                <Button id="editButton" style={{marginTop:'1rem', borderRadius:'10rem', width:'6rem', textAlign:'center', backgroundColor: 'blue', borderColor:'blue', color:'white', boxShadow: '0.10rem 0.3rem 0.20rem rgba(0, 0, 0, 0.3)'}} onClick={handleEdit}>Editar</Button>
                <Button id="editButton" style={{marginTop:'1rem', borderRadius:'10rem', width:'6rem', textAlign:'center', backgroundColor: 'green', borderColor:'green', color:'white', boxShadow: '0.10rem 0.3rem 0.20rem rgba(0, 0, 0, 0.3)'}} hidden ={!isEditing} onClick={handleEdit}>Guardar</Button>
            </div>
        </div>
        </form>
    </div>
    );
};

export default Cuenta;
