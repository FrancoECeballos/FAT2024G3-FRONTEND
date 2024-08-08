import React, { useEffect, useRef, useState } from 'react';
import { InputGroup, Col, Row, Form, Container, Card} from 'react-bootstrap';
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

  const handleFileChange = (file) => {
    setFormData((prevData) => {
      return { ...prevData, imagen: file };
    });
    console.log(formData);
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
            <UploadImage wide='13'/>
            <Form.Label className="font-rubik" style={{ fontSize: '1.3rem' }}>Registro:</Form.Label>
            <Form>
            <Row>
              <Col style={{maxWidth:"50%"}} xs={12} sm={6} md={6} lg={6} xl={6} xxl={6}>

                  <Form.Group className="mb-2" >
                    <Form.Label className="font-rubik" style={{ fontSize: '0.8rem' }}>Nombre (*)</Form.Label>
                      <Form.Control name="nombre" type="text" onChange={handleInputChange} placeholder="Ingrese su nombre"/>
                      <Form.Label id='errorNombre' className="font-rubik" style={{ fontSize: '0.8rem', color: 'red' }}> </Form.Label>
                  </Form.Group>

                  <Form.Group className="mb-2 SinError">
                    <Form.Label className="font-rubik" style={{ fontSize: '0.8rem' }}>Nombre de Usuario (*)</Form.Label>
                      <Form.Control name="nombre" type="text" onChange={handleInputChange} placeholder="Ingrese su nombre de usuario"  />
                  </Form.Group>

                  <Form.Group className="mb-2 SinError">
                  <Form.Label className="font-rubik" style={{ fontSize: '0.8rem' }}>Tipo de documento (*)</Form.Label>
                  <Form.Select name="id_tipodocumento" onChange={handleInputChange} aria-label="Default select example">
                          <option autoFocus hidden>Seleccione un tipo de documento</option>
                          {data.map((item) => (
                            <option key={item.id} value={item.id}>{item.nombre}</option>
                          ))}
                  </Form.Select>
                  </Form.Group>

                  <Form.Group className="mb-2 SinError">
                    <Form.Label className="font-rubik" style={{ fontSize: '0.8rem' }}>Genero (*)</Form.Label>
                    <div>
                      <Form.Check
                        inline
                        label="Hombre"
                        name="genero"
                        type="radio"
                        value="Hombre"
                        onChange={handleInputChange}
                      />
                      <Form.Check
                        inline
                        label="Mujer"
                        name="genero"
                        type="radio"
                        value="Mujer"
                        onChange={handleInputChange}
                      />
                      <Form.Check
                        inline
                        label="Prefiero no decir"
                        name="genero"
                        type="radio"
                        value="Prefiero no decir"
                        onChange={handleInputChange}
                      />
                    </div>   
                  </Form.Group>

                  <Form.Group className="mb-2 SinError">
                  <Form.Label className="font-rubik" style={{ fontSize: '0.8rem' }}>Localidad (*)</Form.Label>
                  <Form.Control name="localidad" type="text" onChange={handleInputChange} placeholder="Ingrese su Localidad"/>
                  </Form.Group>

                  <Form.Group className="mb-2 SinError">
                  <Form.Label className="font-rubik" style={{ fontSize: '0.8rem' }}>Calle (*)</Form.Label>
                  <Form.Control name="calle" type="text" onChange={handleInputChange} placeholder="Ingrese su Calle"  />
                  </Form.Group>

                  <Form.Group className="mb-2 SinError">
                  <Form.Label className="font-rubik" style={{ fontSize: '0.8rem' }}>Numero de Calle (*)</Form.Label>
                  <Form.Control name="numero" type="number" onChange={handleInputChange} placeholder="Ingrese su Numero"/>
                  </Form.Group>
              </Col>
              
              <Col style={{maxWidth:"50%"}} xs={12} sm={6} md={6} lg={6} xl={6} xxl={6}>
                  <Form.Group className="mb-2">
                  <Form.Label className="font-rubik" style={{ fontSize: '0.8rem' }}>Apellido(*)</Form.Label>
                    <Form.Control name="apellido" type="text" onChange={handleInputChange} placeholder="Ingrese su apellido"/>
                    <Form.Label id='errorApellido' className="font-rubik" style={{ fontSize: '0.8rem', color: 'red' }}> </Form.Label>
                  </Form.Group>

                  <Form.Group className="mb-2">
                    <Form.Label className="font-rubik" style={{ fontSize: '0.8rem' }}>Email (*)</Form.Label>
                    <Form.Control name="email" type="email" onChange={handleInputChange} placeholder="Ingrese su email"/>
                    <Form.Label id='errorEmail' className="font-rubik" style={{ fontSize: '0.8rem', color: 'red' }}> </Form.Label>
                  </Form.Group>

                  <Form.Group className="mb-2">
                    <Form.Label className="font-rubik" style={{ fontSize: '0.8rem' }}>Documento de identidad (*)</Form.Label>
                    <Form.Control name="documento" type="documento" onChange={handleInputChange} placeholder="Ingrese su documento"/>
                    <Form.Label id='errorDocumento' className="font-rubik" style={{ fontSize: '0.8rem', color: 'red' }}> </Form.Label>
                  </Form.Group>


                  <Form.Group className="mb-2">
                    <Form.Label className="font-rubik" style={{ fontSize: '0.8rem' }}>Telefono (*)</Form.Label>
                      <InputGroup className="mb-2">
                        <Form.Control name="cai" className="CAI" type="number" onChange={handleInputChange} placeholder="CAI (Codigo de acceso internacional) Ej: +54" />
                        <Form.Control name="telnum" type="number" onChange={handleInputChange} placeholder="Ingrese su telefono"/>
                      </InputGroup>
                      <Form.Label id='errorTelefono' className="font-rubik" style={{ fontSize: '0.8rem', color: 'red' }}> </Form.Label>
                  </Form.Group>

                  <Form.Group className="mb-2">
                    <Form.Label className="font-rubik" style={{ fontSize: '0.8rem' }}>Contraseña (*)</Form.Label>
                    <Form.Control name="password" type="password" onChange={handleInputChange} placeholder="Ingrese su contraseña" />
                    <Form.Label id='errorContrasenia' className="font-rubik" style={{ fontSize: '0.8rem', color: 'red' }}> </Form.Label>
                  </Form.Group>


                  <Form.Group className="mb-2">
                    <Form.Label className="font-rubik" style={{ fontSize: '0.8rem' }}>Confirmar contraseña (*)</Form.Label>
                    <Form.Control name="password2" id='FormConfirmar' type="password" onChange={handleInputChange} placeholder="Ingrese nuevamente su contraseña"/>
                    <Form.Label id='errorConfirmar' className="font-rubik" style={{ fontSize: '0.8rem', color: 'red' }}> </Form.Label>
                  </Form.Group>
              </Col>
              </Row>
            </Form>
                <div style={{ marginTop: '5%'}}>
                  <SendButton onClick={handleSendData} text="Registrar" wide="15" />
                </div>
          </Card.Body>
        </Card>
      </Container>
    </>
  );
}

export default RegisterCard;