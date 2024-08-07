import React, { useEffect, useRef, useState } from 'react';
import { InputGroup, Col, Row, Form, Container, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

// Assets and style
import './RegisterCard.scss';
import defaultImage from '../../../assets/user_default.png';

// Functions
import fetchData from '../../../functions/fetchData';
import postData from '../../../functions/postData.jsx';

// Components
import SendButton from '../../buttons/send_button/send_button.jsx';
import UploadImage from '../../buttons/upload_image/uploadImage.jsx';

const RegisterCard = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  
  useEffect(() => {
    fetchData('/tipo_documento/').then((result) => {
      setData(result);
    });
  }, []);

  const [direc, setDirec] = useState([]);
  
  useEffect(() => {
    fetchData('/direcciones/').then((result) => {
      setDirec(result);
    });
  }, []);

  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    nombreusuario: "",
    password: "",
    documento: "",
    telefono: "",
    email: "",
    genero: "",
    imagen: null,
    id_direccion: "",
    id_tipodocumento: ""
  });
  
  useEffect(() => {
    const { cai, telnum, ...finalData } = formData;
  }, [formData]);

  const [direcFormData, setDirecFormData] = useState({
    calle: "",
    numero: "",
    localidad: ""
  });

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

    if (name === "calle" || name === "numero" || name === "localidad") {
      setDirecFormData((prevData) => {
        let updatedValue = value;
        if (name === "numero") {
          updatedValue = parseInt(value, 10);
        }

        const updatedData = { ...prevData, [name]: updatedValue };
        console.log(updatedData);
        return updatedData;
      });
    } else {
      setFormData((prevData) => {
        let updatedValue = value;
        if (name === "genero" || name === "id_direccion" || name === "id_tipodocumento") {
          updatedValue = parseInt(value, 10);
        }

        const updatedData = { ...prevData, [name]: updatedValue };

        if (name === "nombre" || name === "apellido" || name === "documento") {
          const { nombre, apellido, documento } = updatedData;
          updatedData.nombreusuario = generateUsername(nombre, apellido, documento);
        }

        if (name === "cai" || name === "telnum") {
          const { cai, telnum } = updatedData;
          updatedData.telefono = generatePhone(cai, telnum);
        }

        console.log(updatedData);
        return updatedData;
      });

      if (name === "documento") {
        const regex = /^[0-9]+$/;
        const errorDocumento = document.getElementById("errorDocumento");
        errorDocumento.innerHTML = !regex.test(value) && value !== "" ? "El documento es inválido" : "";
      } else if (name === "email") {
        const regex = /@/;
        const errorEmail = document.getElementById("errorEmail");
        errorEmail.innerHTML = !regex.test(value) && value !== "" ? "El email es inválido" : "";
      } else if (name === "nombre" || name === "apellido") {
        const regex = /^[a-zA-ZáéíóúÁÉÍÓÚ\s]+$/;
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
      } else if (name === "password") {
        const errorPassword = document.getElementById("errorContrasenia");
        errorPassword.innerHTML = value.length < 8 && value !== "" ? "La contraseña debe tener al menos 8 caracteres" : "";
      } else if (name === "password2") {
        const password = formData.password;
        const password2 = document.getElementById("FormConfirmar").value;

        if (password !== password2) {
          const errorConfirmarContrasenia = document.getElementById("errorConfirmar");
          errorConfirmarContrasenia.innerHTML = "Las contraseñas no coinciden";
        } else {
          const errorConfirmarContrasenia = document.getElementById("errorConfirmar");
          errorConfirmarContrasenia.innerHTML = "";
        }
      }
    }
  };

  const handleSendData = async (event) => {
    event.preventDefault();
  
    // Validación de campos requeridos
    if (!formData.nombre || !formData.apellido || !formData.nombreusuario || !formData.password || !formData.documento || !formData.telefono || !formData.email || !formData.genero || !formData.id_tipodocumento) {
      alert("Please fill in all required fields.");
      // Muestra en la consola los campos vacíos
      if (!formData.nombre) {
        console.log("Nombre vacio");
      } else if (!formData.apellido) {
        console.log("Apellido vacio");
      } else if (!formData.nombreusuario) {
        console.log("Nombre de usuario vacio");
      } else if (!formData.password) {
        console.log("Contraseña vacia");
      } else if (!formData.documento) {
        console.log("Documento vacio");
      } else if (!formData.telefono) {
        console.log("Telefono vacio");
      } else if (!formData.email) {
        console.log("Email vacio");
      } else if (!formData.genero) {
        console.log("Genero vacio");
      } else if (!formData.id_tipodocumento) {
        console.log("Tipo de documento vacio");
      }
      return;
    }
  
    let id_direccion = null;
  
    const existingDireccion = direc.find(
      (d) =>
        d.calle === direcFormData.calle &&
        d.numero === direcFormData.numero &&
        d.localidad === direcFormData.localidad
    );
  
    if (!existingDireccion) {
      const url = '/crear_direccion/';
      const body = direcFormData;
      const result = await postData(url, body);
      id_direccion = result.id_direccion;
    } else {
      id_direccion = existingDireccion.id_direccion;
    };
  
    fetchData('/direcciones/').then((result) => {
      setDirec(result);
    });
  
    const updatedFormData = { ...formData, id_direccion };
    setFormData(updatedFormData);
  
    // Crea un FormData para enviar con Axios
    const formDataToSend = new FormData();
    Object.entries(updatedFormData).forEach(([key, value]) => {
      formDataToSend.append(key, value);
    });
  
    const url = '/register/';
    try {
      const result = await postData(url, formDataToSend);
      if (result && result.token) {
        Cookies.set('token', result.token, { expires: 7, secure: true });
        navigate('/');
      } else {
        alert("Error en el registro. Por favor, revisa los datos ingresados.");
      }
    } catch (error) {
      console.error('Error al registrar:', error.response ? error.response.data : error.message);
      alert('Error en el registro. Por favor, intenta de nuevo.');
    }
  };
  

  return (
    <>
      <Container className="d-flex justify-content-center align-items-center register-container">
        <Card style={{ width: '100%', borderRadius: '1rem', boxShadow: '0.10rem 0.3rem 0.20rem rgba(0, 0, 0, 0.3)' }}>
          <Card.Body>
            <Row>
              <Col xs={12} sm={8} md={8} lg={8} xl={8} xxl={8}>
                <Form>
                  <Form.Group className='mb-2'>
                    <Form.Label className="font-rubik" style={{ fontSize: '1.3rem' }}>Registro:</Form.Label>
                  </Form.Group>

                  <Form.Group className="mb-2">
                    <Form.Label className="font-rubik" style={{ fontSize: '0.8rem' }}>Nombre y Apellido (*)</Form.Label>
                    <div className="unified-input">
                      <InputGroup className="mb-2">
                        <Form.Control name="nombre" type="text" onChange={handleInputChange} placeholder="Ingrese su nombre" className="unified-input-left" />
                        <Form.Control name="apellido" type="text" onChange={handleInputChange} placeholder="Ingrese su apellido" className="unified-input-right" />
                      </InputGroup>
                    </div>
                  </Form.Group>

                  <Form.Label id='errorNombre' className="font-rubik" style={{ fontSize: '0.8rem', color: 'red' }}> </Form.Label>
                  <Form.Label id='errorApellido' className="font-rubik" style={{ fontSize: '0.8rem', color: 'red' }}> </Form.Label>

                  <Form.Group className="mb-2">
                    <Form.Label className="font-rubik" style={{ fontSize: '0.8rem' }}>Email (*)</Form.Label>
                    <Form.Control name="email" type="email" onChange={handleInputChange} placeholder="Ingrese su email" style={{ borderRadius: '8px', backgroundColor: '#EEEEEE', }} />
                  </Form.Group>
                  <Form.Label id='errorEmail' className="font-rubik" style={{ fontSize: '0.8rem', color: 'red' }}> </Form.Label>

                  <Form.Group className="mb-2">
                    <Form.Label className="font-rubik" style={{ fontSize: '0.8rem' }}>Documento de identidad (*)</Form.Label>
                    <div className="unified-input">
                      <InputGroup className="mb-2">
                        <Form.Control name="documento" onChange={handleInputChange} aria-label="Text input with dropdown button" className="unified-input-left" />
                        <Form.Select name="id_tipodocumento" onChange={handleInputChange} aria-label="Default select example" className="unified-input-right">
                          <option autoFocus hidden>Seleccione un tipo de documento</option>
                          {data.map((item) => (
                            <option key={item.id} value={item.id}>{item.nombre}</option>
                          ))}
                        </Form.Select>
                      </InputGroup>
                    </div>
                    <Form.Label id='errorDocumento' className="font-rubik" style={{ fontSize: '0.8rem', color: 'red' }}> </Form.Label>
                  </Form.Group>

                  <Form.Group className="mb-2">
                    <Form.Label className="font-rubik" style={{ fontSize: '0.8rem' }}>Telefono (*)</Form.Label>
                    <div className="unified-input">
                      <InputGroup className="mb-2">
                        <Form.Control name="cai" type="number" onChange={handleInputChange} placeholder="CAI (Codigo de acceso internacional) Ej: +54" className="unified-input-left" />
                        <Form.Control name="telnum" type="number" onChange={handleInputChange} placeholder="Ingrese su telefono" className="unified-input-right" />
                      </InputGroup>
                    </div>
                  </Form.Group>

                  <Form.Label id='errorTelefono' className="font-rubik" style={{ fontSize: '0.8rem', color: 'red' }}> </Form.Label>

                  <Form.Group className="mb-2">
                    <Form.Label className="font-rubik" style={{ fontSize: '0.8rem' }}>Direccion (*)</Form.Label>
                    <div className="unified-input">
                      <InputGroup className="mb-2">
                        <Form.Control name="localidad" type="text" onChange={handleInputChange} placeholder="Ingrese su Localidad" className="unified-input-left" />
                        <Form.Control name="calle" type="text" onChange={handleInputChange} placeholder="Ingrese su Calle" style={{ borderRadius: '8px', backgroundColor: '#EEEEEE', }} />
                        <Form.Control name="numero" type="number" onChange={handleInputChange} placeholder="Ingrese su Numero" className="unified-input-right" />
                      </InputGroup>
                    </div>
                  </Form.Group>

                  <Form.Group className="mb-2">
                    <Form.Label className="font-rubik" style={{ fontSize: '0.8rem' }}>Genero (*)</Form.Label>
                    <Form.Select name="genero" onChange={handleInputChange} aria-label="Default select example" style={{ borderRadius: '8px', backgroundColor: '#EEEEEE', }}>
                      <option autoFocus hidden>Seleccione un genero</option>
                      <option value="1">Masculino</option>
                      <option value="2">Femenino</option>
                      <option value="3">Prefiero no decir</option>
                    </Form.Select>
                  </Form.Group>

                  <Form.Group className="mb-2">
                    <Form.Label className="font-rubik" style={{ fontSize: '0.8rem' }}>Contraseña (*)</Form.Label>
                    <Form.Control name="password" type="password" onChange={handleInputChange} placeholder="Ingrese su contraseña" style={{ borderRadius: '8px', backgroundColor: '#EEEEEE', }} />
                  </Form.Group>

                  <Form.Label id='errorContrasenia' className="font-rubik" style={{ fontSize: '0.8rem', color: 'red' }}> </Form.Label>

                  <Form.Group className="mb-2">
                    <Form.Label className="font-rubik" style={{ fontSize: '0.8rem' }}>Confirmar contraseña (*)</Form.Label>
                    <Form.Control name="password2" id='FormConfirmar' type="password" onChange={handleInputChange} placeholder="Ingrese nuevamente su contraseña" style={{ borderRadius: '8px', backgroundColor: '#EEEEEE', }} />
                  </Form.Group>

                  <Form.Label id='errorConfirmar' className="font-rubik" style={{ fontSize: '0.8rem', color: 'red' }}> </Form.Label>

                </Form>
              </Col>
              <Col xs={12} sm={4} md={4} lg={4} xl={4} xxl={4} className="d-flex flex-column align-items-center move-to-top">
                <UploadImage/>
              </Col>
              <Col xs={12} className="d-flex justify-content-end w-100 move-to-bottom">
                <div style={{ marginTop: '5%' }}>
                  <SendButton onClick={handleSendData} text="Registrar" wide="15" />
                </div>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Container>
    </>
  );
}

export default RegisterCard;