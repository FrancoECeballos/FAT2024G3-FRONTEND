import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import { Button, Form, InputGroup , Row, Col} from 'react-bootstrap';
import Cookies from 'js-cookie';

import fetchData from '../../../functions/fetchData';
import postData from '../../../functions/postData.jsx';
import putData from '../../../functions/putData.jsx';
import deleteData from '../../../functions/deleteData.jsx';
import './Cuenta.scss';

import SendButton from '../../buttons/send_button/send_button.jsx';


const Cuenta = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const token = Cookies.get('token');
    const [isEditing, setIsEditing] = useState(false);
    const [isStaff, setIsStaff] = useState(location.state);
    const [direc, setDirec] = useState([]);

    const [userObras, setUserObras] = useState([]);
    const [obras, setObras] = useState([]);
    const [obraID, setObraID] = useState([]);
    const [selectedObject, setSelectedObject] = useState('');
    const today = new Date().toISOString().split('T')[0];

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

        if (!isStaff) {
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
        if (!isStaff) {
          navigate('/login');
        } else {
          navigate('/userlisting');
        }
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
      if (!selectedObject) {
        // No hay ninguna obra seleccionada, no hagas nada
        return;
      }
    
      const url = `user/obras/post/`;
      const result = await postData(url, 
        {
          descripcion: `Añadido ${userData.nombre} ${userData.apellido} a la obra ${selectedObject}`, 
          fechaingreso: today,
          id_obra: parseInt(selectedObject),
          id_usuario: userData.id_usuario,
          id_tipousuario: 1
        }, 
        token
      );
      
      // Recargar la página para actualizar la lista de obras
      window.location.reload();
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
            if (field === "genero" || field === "id_direccion" || field === "id_tipodocumento" || field === "numero") {
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
    
        const updatedUserData = { ...userData, imagen: null, id_direccion: id_direc, id_tipodocumento: userData.id_tipodocumento.id_tipodocumento};
        setUserDataDefault(userData);
        setIsEditing(false);
    
        if (isStaff) {
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
          <div className="micuenta">
            <h1>
              <img src={userData.imagen} className="fotoperfil" alt="Perfil" />
              {`Bienvenido ${userDataDefault.nombreusuario}`}
            </h1>
            
            <Row className="filainputs">
              <Col lg={6}>
                <div className="form-container">
                  <Form.Group controlId="nombre">
                    <Form.Label>Nombre:</Form.Label>
                    <Form.Control
                      type="text"
                      name="nombre"
                      value={userData.nombre || ''}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </Form.Group>
                  
                  <Form.Group controlId="apellido">
                    <Form.Label>Apellido:</Form.Label>
                    <Form.Control
                      type="text"
                      name="apellido"
                      value={userData.apellido || ''}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </Form.Group>
                  
                  <Form.Group controlId="email">
                    <Form.Label>Correo electrónico:</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={userData.email || ''}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </Form.Group>
                </div>
              </Col>
              
              <Col lg={6}>
                <div className="form-container">
                  <Form.Group controlId="telefono">
                    <Form.Label>Teléfono:</Form.Label>
                    <InputGroup>
                      <Form.Control
                        type="text"
                        name="cai"
                        value={userData.telefono.split(' ')[0] || ''}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                      />
                      <Form.Control
                        style={{width:"60%"}}
                        type="number"
                        name="telnum"
                        value={userData.telefono.split(' ')[1] || ''}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                      />
                    </InputGroup>
                  </Form.Group>
                  
                  <Form.Group controlId="direccion">
                    <Form.Label>Dirección:</Form.Label>
                    <InputGroup>
                      <Form.Control
                        type="text"
                        name="id_direccion.localidad"
                        value={userData.id_direccion?.localidad || ''}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                      />
                      <Form.Control
                        type="text"
                        name="id_direccion.calle"
                        value={userData.id_direccion?.calle || ''}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                      />
                      <Form.Control
                        type="number"
                        name="id_direccion.numero"
                        value={userData.id_direccion?.numero || ''}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                      />
                    </InputGroup>
                  </Form.Group>
                  
                  <Form.Group controlId="genero">
                    <Form.Label>Género:</Form.Label>
                    <Form.Control
                      as="select"
                      name="genero"
                      value={userData.genero || 2}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    >
                      <option value="1">Masculino</option>
                      <option value="2">Femenino</option>
                      <option value="3">Prefiero no decir</option>
                    </Form.Control>
                  </Form.Group>
                </div>
              </Col>
              
              <Col style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <SendButton
                  onClick={handleEdit}
                  text={isEditing ? "Cancelar" : "Editar"}
                  wide="5"
                  backcolor={isEditing ? "#D10000" : "#D9D9D9"}
                  letercolor={isEditing ? "white" : "black"}
                  style={{ marginRight: '10px' }} // Margen a la derecha
                />
                <SendButton
                  hidden={!isEditing}
                  onClick={handleSendData}
                  text="Guardar"
                  wide="6"
                  backcolor="#D9D9D9"
                  letercolor="black"
                  disabled={!GuardarButtonIsValid}
                  style={{ marginLeft: '10px' }} // Margen a la izquierda (opcional)
                />
              </Col>


            </Row>
            
            <Row className="filaobras">
              <Col>
                <div className="obras-container" style={{marginTop: '1rem'}}>
                  <h3>Obras del Usuario</h3>
                  <ul>
                    {obraID.length === 0 ? (
                      <p>Este usuario no pertenece a ninguna obra</p>
                    ) : (
                      obraID.map(userobra => (
                        <li key={userobra.id_obra}>
                          {userobra.nombre}
                          {isStaff && (
                            <SendButton
                              text="Eliminar"
                              backcolor="#D10000"
                              letercolor="white"
                              onClick={() => handleDeleteObraFromUser(userobra.id_obra)}
                            />
                          )}
                        </li>
                      ))
                    )}
                  </ul>
                  {isStaff && (
                    <div className="add-obra">
                      <Form.Control
                          as="select"
                          aria-label="Select object"
                          value={selectedObject}
                          onChange={e => {
                              setSelectedObject(e.target.value);
                              setGuardarButtonIsValid(e.target.value !== "");  // Habilitar el botón si se selecciona una obra
                          }}
                      >
                          <option disabled hidden value="">
                              Selecciona una obra para añadir
                          </option>
                          {obras.map(obra => (
                              !obraID.some(obraID => obraID.id_obra === obra.id_obra) && (
                                  <option key={obra.id_obra} value={obra.id_obra}>
                                      {obra.nombre}
                                  </option>
                              )
                          ))}
                      </Form.Control>
                      <SendButton
                          onClick={handleAddOObraToUser}
                          text="Añadir"
                          wide="5"
                          letercolor="white"
                          backcolor="blue"
                          disabled={!GuardarButtonIsValid}
                      />
                    </div>
                  )}
                </div>
              </Col>
            </Row>
            
            <Row className="filabuton">
              <Col>
                <SendButton
                  text="Borrar Usuario"
                  backcolor="#D10000"
                  letercolor="white"
                  onClick={handleDeleteUser}
                />
              </Col>
              <Col>
              {!isStaff && (
                  <SendButton
                  text="Cerrar Sesion"
                  backcolor="#D10000"
                  letercolor="white"
                  onClick={handleLogout}
                  />
                )}
              </Col>
            </Row>
          </div>
        );
      };
      
      export default Cuenta;