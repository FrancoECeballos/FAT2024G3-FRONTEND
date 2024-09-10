import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from 'react-router-dom';
import { Form, InputGroup , Row, Col} from 'react-bootstrap';
import Cookies from 'js-cookie';

import fetchData from '../../../functions/fetchData';
import postData from '../../../functions/postData.jsx';
import putData from '../../../functions/putData.jsx';
import deleteData from '../../../functions/deleteData.jsx';
import './Cuenta.scss';

import SendButton from '../../buttons/send_button/send_button.jsx';
import ConfirmationModal from "../../modals/confirmation_modal/ConfirmationModal.jsx";


const Cuenta = ({ user }) => {
    const navigate = useNavigate();
    const token = Cookies.get('token');
    const [isEditing, setIsEditing] = useState(false);
    const [direc, setDirec] = useState([]);

    const [userObras, setUserObras] = useState([]);
    const [obras, setObras] = useState([]);
    const [obraID, setObraID] = useState([]);
    const [selectedObject, setSelectedObject] = useState('');
    const today = new Date().toISOString().split('T')[0];

    const [GuardarButtonIsValid, setGuardarButtonIsValid] = useState(false);
    const [AñadirButtonIsValid, setAñadirButtonIsValid] = useState(false);

    const [deleteUserConfirmation, setDeleteUserConfirmation] = useState(false);

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

      const fetchObras = (url) => {
          fetchData(url, token).then((obrasResult) => {
              setUserObras(obrasResult);
              setObraID([]);
      
              const fetchPromises = obrasResult.map(obra =>
                  fetchData(`/obra/${obra.id_obra}`, token).then(obraData => {
                      return { ...obraData, id_tipousuario: obra.id_tipousuario };
                  })
              );
      
              Promise.all(fetchPromises).then((results) => {
                  const flattenedResults = results.map(result => {
                      if (result[0]) {
                          return {
                              ...result[0],
                              id_tipousuario: result.id_tipousuario
                          };
                      }
                      return result;
                  });
                  setObraID(flattenedResults);
              });
          });
      };

      if (!token) {
          navigate('/login');
          return;
      }

      updateUserState(user.viewedUser);
      fetchData('/direcciones/').then((result) => {
          setDirec(result);
      });

      if (user.viewingOtherUser) {
          fetchObras(`/user/obrasEmail/${user.viewedUser.email}`);
          const obrasUrl = user.viewingUser.is_superuser ? `/obra/` : `/obra/user/${token}/`;
          fetchData(obrasUrl, token).then((result) => {
              setObras(result);
          });
      } else {
          fetchObras(`/user/obrasToken/${token}`);
      }

    }, [token, navigate, user]);

    const handleLogout = () => {
        Cookies.remove('token');
        navigate('/login');
    };

    const handleDeleteUser = async(event) => {
        event.preventDefault();
        const url = (`/user/delete/${userData.email}/`);
        const result = await deleteData(url, token);
        if (user.viewingOtherUser == false) {
          navigate('/login');
        } else {
          navigate('/userlisting');
        }
    };

    const handleUpdateUserObra = async (event, obra) => {
      const { value } = event.target;
      const result = await putData(`/user/obras/update/${obra.id_obra}/${userData.id_usuario}/`, { id_tipousuario: value }, token);
      fetchData(`/user/obrasEmail/${userData.email}`, token).then((result) => {
        setUserObras(result);
      });
    };

    const handleDeleteObraFromUser = async(id) => {
      const result = await deleteData(`/user/obras/delete/${id}/${user.viewedUser.id_usuario}/`, token);
      fetchData(`/user/obrasEmail/${userData.email}`, token).then((result) => {
        setUserObras(result);
        window.location.reload();
      });
    };

    const handleAddOObraToUser = async() => {
      if (!selectedObject) {
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
      
      window.location.reload();
    };
    

    const handleEdit = () => {
        if (isEditing) { 
            setIsEditing(false);
            setUserData(userDataDefault);
            setGuardarButtonIsValid(false);
        } else {
            setIsEditing(true);
        }
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
        let valid = true;
      
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

            if (field === "cai" || field === "telnum") {
                const { cai, telnum } = updatedData;
                updatedData.telefono = generatePhone(cai, telnum);
            }
            console.log(updatedData);
            return updatedData;
          }
        });
        
        if (field === "nombre" || field === "apellido" || field === "telefono" || field === "id_direccion" || field === "genero") {
            valid = value !== "";
        }
        setGuardarButtonIsValid(valid);
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
    
        const updatedUserData = { ...userData, imagen: self.imagen, id_direccion: id_direc, id_tipodocumento: userData.id_tipodocumento.id_tipodocumento};
        setUserDataDefault(userData);
        setIsEditing(false);
    
        if (user.viewingOtherUser == true) {
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
                      disabled={true}
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
                <div style={{ display: 'flex', gap: '2rem' }}>
                  <SendButton
                    onClick={handleEdit}
                    text={isEditing ? "Cancelar" : "Editar"}
                    wide="7"
                    backcolor={isEditing ? "#D10000" : "#D9D9D9"}
                    letercolor={isEditing ? "white" : "black"}
                  />
                  {isEditing && (
                    <SendButton
                      onClick={handleSendData}
                      text="Guardar"
                      wide="7"
                      backcolor="green"
                      letercolor="white"
                      disabled={!GuardarButtonIsValid}
                    />
                  )}
                </div>
              </Col>
            </Row>
            
            <Row className="filaobras">
              <Col>
                <div className="obras-container" style={{marginTop: '1rem'}}>
                  <h3>Obras del Usuario</h3>
                  <ul>
                  {userData.is_superuser ? (
                    <p>Este usuario es un administrador, por lo que tiene acceso a todas las obras</p>
                  ) : (
                    obraID.length === 0 ? (
                      <p>Este usuario no pertenece a ninguna obra</p>
                    ) : (
                      obraID.map(userobra => (
                        <li key={userobra.id_obra}>
                          {userobra.nombre}
                          {user.viewingOtherUser == true && (
                            <>
                              <div>
                                <label style={{paddingRight:"1rem"}}>
                                  <input type="radio" name={`role_${userobra.id_obra}`} value="1" defaultChecked={userobra.id_tipousuario === 1} onChange={(event) => handleUpdateUserObra(event, userobra)}/>
                                    Voluntario
                                </label>
                                <label>
                                  <input type="radio" name={`role_${userobra.id_obra}`} value="2" defaultChecked={userobra.id_tipousuario === 2} onChange={(event) => handleUpdateUserObra(event, userobra)}/>
                                    Moderador
                                </label>
                              </div>
                              <SendButton
                                text="Eliminar"
                                backcolor="#D10000"
                                letercolor="white"
                                onClick={() => handleDeleteObraFromUser(userobra.id_obra)}
                              />
                            </>
                          )}
                        </li>
                      ))
                    )
                  )}
                  </ul>
                  {user.viewingOtherUser == true && (
                    <div className="add-obra">
                      <Form.Control
                          as="select"
                          aria-label="Select object"
                          value={selectedObject}
                          onChange={e => {
                              setSelectedObject(e.target.value);
                              setAñadirButtonIsValid(e.target.value !== "");
                          }}
                      >
                          <option disabled hidden value="">
                            Selecciona una obra para añadir
                          </option>
                          {obras.filter(obra => !obraID.some(obraID => obraID.id_obra === obra.id_obra)).length === 0 ? (
                            <option disabled value="">
                              No puede añadir este usuario a ninguna obra
                            </option>
                          ) : (
                            obras.filter(obra => !obraID.some(obraID => obraID.id_obra === obra.id_obra)).map(obra => (
                              <option key={obra.id_obra} value={obra.id_obra}>
                                {obra.nombre}
                              </option>
                            ))
                          )}
                      </Form.Control>
                      <SendButton
                          onClick={handleAddOObraToUser}
                          text="Añadir"
                          wide="5"
                          letercolor="white"
                          backcolor="#02005E"
                          disabled={!AñadirButtonIsValid}
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
                  onClick={() => setDeleteUserConfirmation(true)}
                />
                <ConfirmationModal Open={deleteUserConfirmation} BodyText="¿Está seguro que desea eliminar este usuario?" onClickConfirm={handleDeleteUser} onClose={() => setDeleteUserConfirmation(false)} />
              </Col>
              <Col className="text-right">
                {user.viewingOtherUser == false && (
                  <SendButton
                    text="Cerrar Sesión"
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