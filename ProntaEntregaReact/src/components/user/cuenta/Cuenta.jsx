import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import { Button, Form, InputGroup , Row, Col} from 'react-bootstrap';
import Cookies from 'js-cookie';

import fetchData from '../../../functions/fetchData';
import postData from '../../../functions/postData.jsx';
import putData from '../../../functions/putData.jsx';
import deleteData from '../../../functions/deleteData.jsx';
import './Cuenta.scss';

import user from '../../../assets/user_default.png';

import SendButton from '../../buttons/send_button/send_button.jsx';


const Cuenta = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const token = Cookies.get('token');
    const [isEditing, setIsEditing] = useState(false);
    const [isAdmin, setIsAdmin] = useState(location.state);
    const [direc, setDirec] = useState([]);

    const [userObras, setUserObras] = useState([]);
    const [obras, setObras] = useState([]);
    const [obraID, setObraID] = useState([]);
    const [selectedObject, setSelectedObject] = useState('');
    const today = new Date().toISOString().split('T')[0];

    const editButtonRef = useRef(null);

    const [GuardarButtonIsValid, setGuardarButtonIsValid] = useState(false);

    const NullToEmpty = (data) => {
        if (data === null || data === undefined) return "";
        if (typeof data === 'object') {
            const transformedData = {};
            for (const key in data) {
                transformedData[key] = NullToEmpty(data[key]);
            }
            return transformedData;
        }
        return data;
    };

    const [userData, setUserData] = useState({
        "id_usuario": "",
        "nombre": "",
        "apellido": "",
        "nombreusuario": "",
        "password": "",
        "documento": "",
        "telefono": "",
        "email": "",
        "genero": "",
        "id_direccion": {
            "id_direccion": "",
            "localidad": "",
            "calle": "",
            "numero": "",
        },
        "id_tipodocumento": ""
    }); useEffect(() => {
        const { cai, telnum, ...finalData } = userData;
    }, [userData]);

    const [userDataDefault, setUserDataDefault] = useState({
        "id_usuario": "",
        "nombre": "",
        "apellido": "",
        "nombreusuario": "",
        "password": "",
        "documento": "",
        "telefono": "",
        "email": "",
        "genero": "",
        "id_direccion": {
            "id_direccion": "",
            "localidad": "",
            "calle": "",
            "numero": "",
        },
        "id_tipodocumento": ""
    }); useEffect(() => {
        const { cai, telnum, ...finalData } = userDataDefault;
    }, [userDataDefault]);

    useEffect(() => {
        const updateUserState = (result) => {
            const transformedData = NullToEmpty(result);
            setUserData(transformedData);
            setUserDataDefault(transformedData);
        };

        if (!isAdmin) {
            if (!token) {
                navigate('/login');
                return;
            }
            fetchData(`/userToken/${token}`).then(updateUserState)
            fetchData('/direcciones/').then((result) => {
                setDirec(result);
            });
            fetchData(`/user/obrasToken/${token}`, token).then((obrasResult) => {
                setUserObras(obrasResult);
                setObraID([]);
            
                const fetchPromises = obrasResult.map(obra =>
                    fetchData(`/obra/${obra.id_obra}`, token)
                );
            
                Promise.all(fetchPromises).then((results) => {
                    const flattenedResults = results.flat();
                    const uniqueResults = Array.from(new Set(flattenedResults.map(JSON.stringify))).map(JSON.parse);
                    setObraID(uniqueResults);
                });
            });
        } else {
            fetchData(`/user/${location.state.user_email}`).then(updateUserState)
            fetchData('/direcciones/').then((result) => {
                setDirec(result);
            });
            fetchData(`/user/obrasEmail/${location.state.user_email}`, token).then((obrasResult) => {
                setUserObras(obrasResult);
                setObraID([]);
            
                const fetchPromises = obrasResult.map(obra =>
                    fetchData(`/obra/${obra.id_obra}`, token)
                );
            
                Promise.all(fetchPromises).then((results) => {
                    const flattenedResults = results.flat();
                    const uniqueResults = Array.from(new Set(flattenedResults.map(JSON.stringify))).map(JSON.parse);
                    setObraID(uniqueResults);
                });
            });
            fetchData(`/obra/`, token).then((result) => {
                setObras(result);
            });
        }

    }, [token, navigate, location.state]);

    const handleLogout = () => {
        Cookies.remove('token');
        navigate('/login');
    };

    const handleDeleteUser = async(event) => {
        event.preventDefault();
        const url = (`/user/delete/${userData.email}/`);
        const result = await deleteData(url, token);
        navigate('/selectuser');
    };

    const handleDeleteObraFromUser = async(id) => {
        const aux = userObras.find(obra => obra.id_obra === id);
        const url = (`/user/obras/delete/${aux.id_detalleobrausuario}/`);
        const result = await deleteData(url, token);
        fetchData(`/user/obrasEmail/${userData.email}`, token).then((result) => {
            setUserObras(result);
            window.location.reload();
        });
    };

    const handleAddOObraToUser = async() => {
        const url = (`user/obras/post/`);
        const result = await postData(url, 
            {descripcion: `Añadido ${userData.nombre} ${userData.apellido} a la obra ${selectedObject}`, 
            fechaingreso: today,
            id_obra: parseInt(selectedObject),
            id_usuario: userData.id_usuario}, token);
        fetchData(`/user/obrasEmail/${userData.email}`, token).then((result) => {
            setUserObras(result);
            window.location.reload();
        });
    };

    const handleEdit = () => {
        if (isEditing) { 
            setIsEditing(false);
            setUserData(userDataDefault);
        } else {
            setIsEditing(true);
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

            if (field === "cai" || field === "telnum") {
                const { cai, telnum } = updatedData;
                updatedData.telefono = generatePhone(cai, telnum);
            }
            console.log(updatedData);
            return updatedData;
          }
        });
        
        if (name === "nombre" || name === "apellido") {
            const regex = /^[a-zA-Z\s]+$/;
            const errorNombre = document.getElementById("errorNombre");
            const errorApellido = document.getElementById("errorApellido");
            if (!regex.test(value) && value !== "") {
            if (name === "nombre") {
                errorNombre.innerHTML = "El nombre no puede contener números ni caracteres especiales";
            } else {
                errorApellido.innerHTML = "El apellido no puede contener números ni caracteres especiales";
            }
            } else {
            if (name === "nombre") {
                errorNombre.innerHTML = "";
            } else {
                errorApellido.innerHTML = "";
            }
            }
        } else if (name === "telnum") {
            const regex = /^[0-9]{10}$/;
            const errorTelefono = document.getElementById("errorTelefono");
            errorTelefono.innerHTML = !regex.test(value) && value !== "" ? "El teléfono necesita 10 numeros" : "";
        }
        
    };

    const handleSendData = async(event) => {
        event.preventDefault();
        let id_direc = null;
    
        const existingDireccion = direc.find(
            (d) =>
            d.calle === userData.id_direccion.calle &&
            d.numero === userData.id_direccion.numero &&
            d.localidad === userData.id_direccion.localidad
        );
    
        if (!existingDireccion) {
            const url = '/crear_direccion/';
            const body = userData.id_direccion;
            const result = await postData(url, body);
            id_direc = result.id_direccion;
        } else {
            id_direc = existingDireccion.id_direccion;
        };
    
        const updatedUserData = { ...userData, imagen: null, id_direccion: id_direc, id_tipodocumento: userData.id_tipodocumento.id_tipodocumento, id_tipousuario: userData.id_tipousuario.id_tipousuario };
        setUserDataDefault(userData);
        setIsEditing(false);
    
        if (isAdmin) {
            const url = (`/user/updateEmail/${userData.email}/`);
            const body = updatedUserData;
            const result = await putData(url, body, token);
        } else {
            const url = (`/user/update/${token}/`);
            const body = updatedUserData;
            const result = await putData(url, body, token);
        }
        fetchData('/direcciones/').then((result) => {
            setDirec(result);
        });
    };



    return (
        <div class="micuenta">
            <h1> <img src={user} className="fotoperfil" />{`Bienvenido ${userDataDefault.nombreusuario}`}</h1>
            <Row className="filainputs">
                <Col>
                    <label for="nombre">Nombre:</label>
                    <input type="text" id="nombre" name="nombre" value={`${userData.nombre}` || ''} onChange={handleInputChange} disabled ={!isEditing}/>
                    
                    <Form.Label id='errorNombre' className="font-rubik" style={{ fontSize: '0.8rem', color: '#02005E' }}></Form.Label>

                    <label for="apellido">Apellido:</label>
                    <input type="text" id="apellido" name="apellido" value={`${userData.apellido}` || ''} onChange={handleInputChange} disabled ={!isEditing}/>

                    <Form.Label id='errorApellido' className="font-rubik" style={{ fontSize: '0.8rem', color: '#D10000' }}> </Form.Label>

                    <label for="email">Correo electrónico:</label>
                    <input type="email" id="email" name="email" value={`${userData.email}` || ''} onChange={handleInputChange} disabled ={!isEditing}/>
                    
                    <Form.Label id='errorEmail' className="font-rubik" style={{ fontSize: '0.8rem', color: '#D10000' }}> </Form.Label>

                    {!isAdmin && <Button style={{marginTop:'1rem', borderRadius:'10rem', width:'10rem', textAlign:'center', backgroundColor: '#D10000', borderColor:'#D10000', color:'white', boxShadow: '0.10rem 0.3rem 0.20rem rgba(0, 0, 0, 0.3)'}} onClick={handleLogout}>Cerrar sesión</Button>}
                </Col>
                <Col>
                    <label for="telefono">Teléfono:</label>
                    <InputGroup className="groupderec">
                        <input disabled={!isEditing} style={{width:'3rem'}} name="cai" type="text" value={`${userData.telefono.split(' ')[0]}` || ''} onChange={handleInputChange} className="inputiz"/>
                        <input disabled={!isEditing} style={{width:'18.5rem'}} name="telnum" type="number" value={`${userData.telefono.split(' ')[1]}` || ''} onChange={handleInputChange}className="inputde" />
                    </InputGroup>  

                    <Form.Label id='errorTelefono' className="font-rubik" style={{ fontSize: '0.8rem', color: '#D10000' }}> </Form.Label>

                    <label for="direccion">Dirección:</label>
                    <InputGroup className="groupderec">
                        <input disabled={!isEditing} style={{width:'8rem'}} name="id_direccion.localidad" type="text"  value={userData.id_direccion?.localidad || ''} onChange={handleInputChange}/>
                        <input disabled={!isEditing} style={{width:'8rem'}} name="id_direccion.calle" type="text" value={userData.id_direccion?.calle || ''} onChange={handleInputChange}/>
                        <input disabled={!isEditing} style={{width:'5rem'}} name="id_direccion.numero" type="number"  value={userData.id_direccion?.numero || ''} onChange={handleInputChange}/>
                    </InputGroup>  

                    <label for="genero">Genero:</label>
                    <Form.Select className="genero" name="genero" id="genero" value={`${userData.genero}` || 2} onChange={handleInputChange} aria-label="Default select example" disabled={!isEditing}>
                        <option value="1">Masculino</option>
                        <option value="2">Femenino</option>
                        <option value="3">Prefiero no decir</option>
                    </Form.Select>
                </Col>
            </Row>
            <Row className="filaobras">
                <Col>
                    <h3>Obras del Usuario</h3>
                    <ul>
                        {obraID.length === 0 ? (
                            <p> Este usuario no pertenece<br/>a ninguna obra </p>
                        ) : (
                            obraID.map(userobra => (
                                <li key={userobra.id_obra}>
                                    {userobra.nombre}
                                    {isAdmin && <SendButton text="Delete" backcolor="#D10000" letercolor="white" wide="5" onClick={() => handleDeleteObraFromUser(userobra.id_obra)}></SendButton>}
                                </li>
                            ))
                        )}
                    </ul>
                    {isAdmin && <Form.Select style={{width:'200px'}} aria-label="Select object" value={selectedObject} onChange={e => setSelectedObject(e.target.value)}>
                        <option disabled hidden value="">Select an object to add</option>
                        {obras.map(obra => (
                            !obraID.some(obraID => obraID.id_obra === obra.id_obra) ? <option key={obra.id_obra} value={obra.id_obra}>{obra.nombre}</option> : null
                        ))}
                    </Form.Select>}
                    {isAdmin && <SendButton onClick={handleAddOObraToUser} text="Añadir" wide="5" letercolor="white" backcolor="blue" disabled={!selectedObject}></SendButton>}
                </Col>
            </Row>
            <Row className="filabuton">
                <Col>
                    <SendButton text="Borrar Usuario" backcolor="#D10000" letercolor="white" onClick={handleDeleteUser}></SendButton>
                </Col>
                <Col>
                    <SendButton onClick={handleEdit} text={isEditing ? "Cancelar" : "Editar"}  wide="6" backcolor={isEditing ? "#D10000" : "#D9D9D9"} letercolor={isEditing ? "white" : "black"}/>
                    <SendButton hid ={!isEditing} onClick={handleSendData} text="Guardar" wide="6" backcolor="#D9D9D9" letercolor="black" disabled={!GuardarButtonIsValid}/>
                </Col>
            </Row>
        </div>
    );
};

export default Cuenta;
