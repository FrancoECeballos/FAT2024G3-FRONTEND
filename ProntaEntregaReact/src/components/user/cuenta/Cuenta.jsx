import React, { useEffect, useState } from "react";
import fetchData from '../../../functions/fetchData';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import './cuenta.scss';
import { Button, Form } from 'react-bootstrap';
import { InputGroup } from "react-bootstrap";

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
        "id_direccion": {
            "localidad": "",
            "calle": "",
            "numero": "",
        },
        "id_tipodocumento": ""
    }); useEffect(() => {
        const { cai, telnum, ...finalData } = userData;
    }, [userData]);

    const [userDataDefault, setUserDataDefault] = useState({
        "nombre": "",
        "apellido": "",
        "nombreusuario": "",
        "password": "",
        "documento": "",
        "telefono": "",
        "email": "",
        "genero": "",
        "id_direccion": {
            "localidad": "",
            "calle": "",
            "numero": "",
        },
        "id_tipodocumento": ""
    }); useEffect(() => {
        const { cai, telnum, ...finalData } = userDataDefault;
    }, [userDataDefault]);

    useEffect(() => {
        if (!token) {
            navigate('/login');
            return;
        }
        fetchData(`/userToken/${token}`).then((result) => {
            setUserData(result)
            setUserDataDefault(result);
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
            setUserData(userDataDefault);
        } else {
            setIsEditing(true);
            document.getElementById("editButton").innerText = "Cancelar";
            editButton.style.backgroundColor = 'yellow';
            editButton.style.borderColor = 'yellow';
            editButton.style.color = 'black';
        }
    };

    const generateUsername = (nombre, apellido, documento) => {
        if (nombre && apellido && documento) {
          return `${nombre.toLowerCase()}.${apellido.toLowerCase()}${documento.slice(5, 8)}`;
        }
        return '';
    };
      const generatePhone = (cai, telnum) => {
        if (cai && telnum) {
          return `${cai} ${telnum}`;
        }
        return '';
    };
    
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        const [field, subfield] = name.split('.');
        console.log(name);
        console.log(field);
        console.log(subfield);
      
        setUserData((prevData) => {
          let updatedValue = value;
          if (subfield){
            if (subfield === "numero") {
                updatedValue = parseInt(value, 10);
            }
            const updatedData = { ...prevData, [field]: { ...prevData[field], [subfield]: updatedValue } };
            console.log(updatedData);
            return updatedData;
          } 
          else {
            if (field === "genero" || field === "id_direccion" || field === "id_tipousuario" || field === "id_tipodocumento" || field === "numero") {
                updatedValue = parseInt(value, 10);
            }
        
            const updatedData = { ...prevData, [field]: updatedValue };
        
            if (field === "nombre" || field === "apellido" || field === "documento") {
                const { nombre, apellido, documento } = updatedData;
                updatedData.nombreusuario = generateUsername(nombre, apellido, documento);
            }
        
            console.log(updatedData);
            return updatedData;
          }
        });
    };

    return (
    <div class="micuenta">
    <h1>{`Bienvenido ${userDataDefault.nombreusuario}`}</h1>
    <h2>Información personal</h2>
    <form>
        <div class="contenedor-inputs">
        <div class="columna">
            <label for="nombre">Nombre:</label>
            <input type="text" id="nombre" name="nombre" value={`${userData.nombre}`} onChange={handleInputChange} disabled ={!isEditing}/>

            <label for="apellido">Apellido:</label>
            <input type="text" id="apellido" name="apellido" value={`${userData.apellido}`} onChange={handleInputChange} disabled ={!isEditing}/>

            <label for="email">Correo electrónico:</label>
            <input type="email" id="email" name="email" value={`${userData.email}`} onChange={handleInputChange} disabled ={!isEditing}/>
            <Button style={{marginTop:'1rem', borderRadius:'10rem', width:'10rem', textAlign:'center', backgroundColor: 'red', borderColor:'red', color:'white', boxShadow: '0.10rem 0.3rem 0.20rem rgba(0, 0, 0, 0.3)'}} onClick={handleLogout}>Cerrar sesión</Button>
        </div>

        <div class="columna">
            <label for="telefono">Teléfono:</label>
            <input type="tel" id="telefono" name="telefono" value={`${userData.telefono}`} onChange={handleInputChange} disabled ={!isEditing}/>

                <label for="direccion">Dirección:</label>
                <InputGroup className="mb-2">
                        <input disabled={!isEditing} name="id_direccion.localidad" type="text" className="unified-input-left" value={`${userData.id_direccion.localidad}`} onChange={handleInputChange}/>
                        <input disabled={!isEditing} name="id_direccion.calle" type="text" value={`${userData.id_direccion.calle}`} onChange={handleInputChange}/>
                        <input disabled={!isEditing} name="id_direccion.numero" type="number" className="unified-input-right" value={`${userData.id_direccion.numero}`} onChange={handleInputChange}/>
                </InputGroup>  

                <label for="genero">Genero:</label>
                <Form.Select className="genero" name="genero" id="genero" value={`${userData.genero}`} onChange={handleInputChange} aria-label="Default select example" disabled={!isEditing}>
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
