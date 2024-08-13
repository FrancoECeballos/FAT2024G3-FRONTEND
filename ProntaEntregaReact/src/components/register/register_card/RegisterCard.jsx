import React, { useEffect, useRef, useState } from 'react';
import { InputGroup, Col, Row, Form, Container, Card} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { PhoneInput } from 'react-international-phone';
import 'react-international-phone/style.css';

// Assets and style
import './RegisterCard.scss';
import defaultImage from '../../../assets/user_default.png';

// Functions
import fetchData from '../../../functions/fetchData';
import postData from '../../../functions/postData.jsx';

// Components
import SendButton from '../../buttons/send_button/send_button.jsx';
import UploadImage from '../../buttons/upload_image/uploadImage.jsx';
import GenericAlert from '../../alerts/generic_alert/GenericAlert.jsx'; 

const RegisterCard = () => {

  const [phone, setPhone] = useState('');

  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('Los campos fueron ingresados incorrectamente');
  
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

  const generatePhone = (phone) => {
    setFormData((prevData) => {
      const updatedData = { ...prevData, telefono: phone };
      console.log(updatedData);
      return updatedData;
    });
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
        return updatedData;
      });
    } else {
      setFormData((prevData) => {
        let updatedValue = value;
        if (name === "genero" || name === "id_direccion" || name === "id_tipodocumento") {
          updatedValue = parseInt(value, 10);
        }

        const updatedData = { ...prevData, [name]: updatedValue };

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
        if (value === "") {
          errorDocumento.innerHTML = "El documento no puede estar vacío";
        } else {
          errorDocumento.innerHTML = !regex.test(value) ? "El documento es inválido" : "&nbsp;";
        }
      } else if (name === "email") {
        const regex = /@/;
        const errorEmail = document.getElementById("errorEmail");
        if (value === "") {
          errorEmail.innerHTML = "El email no puede estar vacío";
        } else {
          errorEmail.innerHTML = !regex.test(value) ? "El email es inválido" : "&nbsp;";
        }
      } else if (name === "nombre" || name === "apellido" || name === "nombreusuario") {
        const regex = /^[a-zA-ZáéíóúÁÉÍÓÚ\s]+$/;
        const errorNombre = document.getElementById("errorNombre");
        const errorApellido = document.getElementById("errorApellido");
        const errorNombreusuario = document.getElementById("errorNombreusuario");
        if (value === "") {
          if (name === "nombre") {
            errorNombre.innerHTML = "El nombre no puede estar vacío";
          } else if (name === "apellido") {
            errorApellido.innerHTML = "El apellido no puede estar vacío";
          } else if (name === "nombreusuario") {
            errorNombreusuario.innerHTML = "El nombre de usuario no puede estar vacío";
          }
        } else if (!regex.test(value) && name !== "nombreusuario") {
          if (name === "nombre") {
            errorNombre.innerHTML = "El nombre no puede contener números ni caracteres especiales";
          } else if (name === "apellido") {
            errorApellido.innerHTML = "El apellido no puede contener números ni caracteres especiales";
          }
        } else {
          if (name === "nombre") {
            errorNombre.innerHTML = "&nbsp;";
          } else if (name === "apellido") {
            errorApellido.innerHTML = "&nbsp;";
          } else if (name === "nombreusuario") {
            errorNombreusuario.innerHTML = "&nbsp;";
          }
        }
      } else if (name === "telnum") {
        const regex = /^[0-9]{10}$/;
        const errorTelefono = document.getElementById("errorTelefono");
        if (value === "") {
          errorTelefono.innerHTML = "El teléfono no puede estar vacío";
        } else {
          errorTelefono.innerHTML = !regex.test(value) ? "El teléfono necesita 10 numeros" : "&nbsp;";
        }
      } else if (name === "password") {
        const errorPassword = document.getElementById("errorContrasenia");
        if (value === "") {
          errorPassword.innerHTML = "La contraseña no puede estar vacía";
        } else {
          errorPassword.innerHTML = value.length < 8 ? "La contraseña debe tener al menos 8 caracteres" : "&nbsp;";
        }
      } else if (name === "password2") {
        const password = formData.password;
        const password2 = document.getElementById("FormConfirmar").value;
        const errorConfirmarContrasenia = document.getElementById("errorConfirmar");

        if (value === "") {
          errorConfirmarContrasenia.innerHTML = "La confirmación de la contraseña no puede estar vacía";
        } else if (password !== password2) {
          errorConfirmarContrasenia.innerHTML = "Las contraseñas no coinciden";
        } else {
          errorConfirmarContrasenia.innerHTML = "&nbsp;";
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
    setAlertMessage('');

    if (!formData.nombre || !formData.apellido || !formData.nombreusuario || !formData.password || !formData.documento || !formData.telefono || !formData.email || !formData.genero || !formData.id_tipodocumento) {
      setAlertMessage('Los campos fueron ingresados incorrectamente: ');
      if (!formData.nombre) {
        setAlertMessage(prevMessage => prevMessage + "\n- Nombre vacio");
      } if (!formData.apellido) {
        setAlertMessage(prevMessage => prevMessage + "\n- Apellido vacio");
      } if (!formData.nombreusuario) {
        setAlertMessage(prevMessage => prevMessage + "\n- Nombre de usuario vacio");
      } if (!formData.password) {
        setAlertMessage(prevMessage => prevMessage + "\n- Contraseña vacia");
      } if (!formData.documento) {
        setAlertMessage(prevMessage => prevMessage + "\n- Documento vacio");
      } if (!formData.telefono) {
        setAlertMessage(prevMessage => prevMessage + "\n- Telefono vacio");
      } if (!formData.email) {
        setAlertMessage(prevMessage => prevMessage + "\n- Email vacio");
      } if (!formData.genero) {
        setAlertMessage(prevMessage => prevMessage + "\n- Genero vacio");
      } if (!formData.id_tipodocumento) {
        setAlertMessage(prevMessage => prevMessage + "\n- Tipo de documento vacio");
      }
      setShowAlert(true);
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
        <Card style={{ width: '80%', borderRadius: '0.3rem', boxShadow: '0.10rem 0.3rem 0.20rem rgba(0, 0, 0, 0.3)' }}>
          <Card.Body>
            <UploadImage wide='13' onFileChange={handleFileChange}/>
            <Form.Label className="font-rubik" style={{ fontSize: '1.3rem' }}>Registro:</Form.Label>
            <GenericAlert ptamaño="0.9" title="Error" description={alertMessage} type="danger" show={showAlert} setShow={setShowAlert} />
            <Form>
            <Row>
              <Col xs={12} sm={12} md={12} lg={6} xl={6} xxl={6}>
                  <Form.Group className="mb-2" style={{maxHeight: '6.2979rem'}}>
                    <Form.Label className="font-rubik" style={{ fontSize: '0.8rem' }}>Nombre (*)</Form.Label>
                      <Form.Control style={{ height: '2.4rem' }} name="nombre" type="text" onBlur={handleInputChange} onChange={handleInputChange} placeholder="Ingrese su nombre"/>
                      <Form.Label id='errorNombre' className="font-rubik" style={{ fontSize: '0.8rem', color: 'red' }}>&nbsp;</Form.Label>
                  </Form.Group>

                  <Form.Group className="mb-2" style={{maxHeight: '6.2979rem'}}>
                    <Form.Label className="font-rubik" style={{ fontSize: '0.8rem' }}>Nombre de Usuario (*)</Form.Label>
                      <Form.Control style={{ height: '2.4rem' }} name="nombreusuario" type="text" onBlur={handleInputChange} onChange={handleInputChange} placeholder="Ingrese su nombre de usuario"  />
                      <Form.Label id='errorNombreusuario' className="font-rubik" style={{ fontSize: '0.8rem', color: 'red' }}>&nbsp;</Form.Label>
                  </Form.Group>

                  <Form.Group className="mb-2" style={{maxHeight: '6.2979rem'}}>
                  <Form.Label className="font-rubik" style={{ fontSize: '0.8rem' }}>Tipo de documento (*)</Form.Label>
                  <Form.Select style={{ height: '2.4rem' }} name="id_tipodocumento" onBlur={handleInputChange} onChange={handleInputChange} aria-label="Default select example">
                    <option autoFocus hidden>Seleccione un tipo de documento</option>
                    {data.map((item) => (
                      <option key={item.id} value={item.id}>{item.nombre}</option>
                    ))}
                  </Form.Select>
                  <Form.Label id='errorTipoDocumento' className="font-rubik" style={{ fontSize: '0.8rem', color: 'red' }}>&nbsp;</Form.Label>
                  </Form.Group>

                  <Form.Group className="mb-2" style={{maxHeight: '6.2979rem'}}>
                  <Form.Label className="font-rubik" style={{ fontSize: '0.8rem' }}>Genero (*)</Form.Label>
                    <Form.Select style={{ height: '2.4rem' }} name="genero" onChange={handleInputChange} aria-label="Default select example" >
                      <option autoFocus hidden>Seleccione un genero</option>
                      <option value="1">Masculino</option>
                      <option value="2">Femenino</option>
                      <option value="3">Prefiero no decir</option>
                    </Form.Select>
                  <Form.Label id='errorGenero' className="font-rubik" style={{ fontSize: '0.8rem', color: 'red' }}>&nbsp;</Form.Label>
                  </Form.Group>

                  <Form.Group className="mb-2" style={{maxHeight: '6.2979rem'}}>
                    <Form.Label className="font-rubik" style={{ fontSize: '0.8rem' }}>Localidad (*)</Form.Label>
                    <Form.Control style={{ height: '2.4rem' }} name="localidad" type="text" onBlur={handleInputChange} onChange={handleInputChange} placeholder="Ingrese su Localidad"/>
                    <Form.Label id='errorLocalidad' className="font-rubik" style={{ fontSize: '0.8rem', color: 'red' }}>&nbsp;</Form.Label>
                  </Form.Group>

                  <Form.Group className="mb-2" style={{maxHeight: '6.2979rem'}}>
                    <Form.Label className="font-rubik" style={{ fontSize: '0.8rem' }}>Calle (*)</Form.Label>
                    <Form.Control style={{ height: '2.4rem' }} name="calle" type="text" onBlur={handleInputChange} onChange={handleInputChange} placeholder="Ingrese su Calle"  />
                    <Form.Label id='errorCalle' className="font-rubik" style={{ fontSize: '0.8rem', color: 'red' }}>&nbsp;</Form.Label>
                  </Form.Group>

                  <Form.Group className="mb-2" style={{maxHeight: '6.2979rem'}}>
                    <Form.Label className="font-rubik" style={{ fontSize: '0.8rem' }}>Numero de Calle (*)</Form.Label>
                    <Form.Control style={{ height: '2.4rem' }} name="numero" type="number" onBlur={handleInputChange} onChange={handleInputChange} placeholder="Ingrese su Numero"/>
                    <Form.Label id='errorNumero' className="font-rubik" style={{ fontSize: '0.8rem', color: 'red' }}>&nbsp;</Form.Label>
                  </Form.Group>
              </Col>   
              <Col  xs={12} sm={12} md={12} lg={6} xl={6} xxl={6}>
                  <Form.Group className="mb-2">
                  <Form.Label className="font-rubik" style={{ fontSize: '0.8rem' }}>Apellido (*)</Form.Label>
                    <Form.Control style={{ height: '2.4rem' }} name="apellido" type="text" onBlur={handleInputChange} onChange={handleInputChange} placeholder="Ingrese su apellido"/>
                    <Form.Label id='errorApellido' className="font-rubik" style={{ fontSize: '0.8rem', color: 'red' }}>&nbsp;</Form.Label>
                  </Form.Group>

                  <Form.Group className="mb-2" style={{maxHeight: '6.2979rem'}}>
                    <Form.Label className="font-rubik" style={{ fontSize: '0.8rem' }}>Email (*)</Form.Label>
                    <Form.Control style={{ height: '2.4rem' }} name="email" type="email" onBlur={handleInputChange} onChange={handleInputChange} placeholder="Ingrese su email"/>
                    <Form.Label id='errorEmail' className="font-rubik" style={{ fontSize: '0.8rem', color: 'red' }}>&nbsp;</Form.Label>
                  </Form.Group>

                  <Form.Group className="mb-2" style={{maxHeight: '6.2979rem'}}>
                    <Form.Label className="font-rubik" style={{ fontSize: '0.8rem' }}>Documento de identidad (*)</Form.Label>
                    <Form.Control style={{ height: '2.4rem' }} name="documento" type="documento" onBlur={handleInputChange} onChange={handleInputChange} placeholder="Ingrese su documento"/>
                    <Form.Label id='errorDocumento' className="font-rubik" style={{ fontSize: '0.8rem', color: 'red' }}>&nbsp;</Form.Label>
                  </Form.Group>


                  <Form.Group className="mb-2" style={{maxHeight: '6.2979rem'}}>
                    <Form.Label className="font-rubik" style={{ fontSize: '0.8rem' }}>Telefono (*)</Form.Label>
                      <InputGroup className="mb-2">
                      <PhoneInput
                        defaultCountry="ar"
                        value={phone}
                        onChange={(phone) => generatePhone(phone)}
                        style={{ width: '100%', display: 'flex', height: '2.4rem' }} 
                        inputStyle={{ width: '95%' }}
                        charAfterDialCode=" "
                        disableFormatting={true}
                      />
                      </InputGroup>
                      <Form.Label id='errorTelefono' className="font-rubik" style={{ fontSize: '0.8rem', color: 'red' }}>&nbsp;</Form.Label>
                  </Form.Group>

                  <Form.Group className="mb-2" style={{maxHeight: '6.2979rem'}}>
                    <Form.Label className="font-rubik" style={{ fontSize: '0.8rem' }}>Contraseña (*)</Form.Label>
                    <Form.Control style={{ height: '2.4rem' }} name="password" type="password" onBlur={handleInputChange} onChange={handleInputChange} placeholder="Ingrese su contraseña" />
                    <Form.Label id='errorContrasenia' className="font-rubik" style={{ fontSize: '0.8rem', color: 'red' }}>&nbsp;</Form.Label>
                  </Form.Group>


                  <Form.Group className="mb-2" style={{maxHeight: '6.2979rem'}}>
                    <Form.Label className="font-rubik" style={{ fontSize: '0.8rem' }}>Confirmar contraseña (*)</Form.Label>
                    <Form.Control style={{ height: '2.4rem' }} name="password2" id='FormConfirmar' type="password" onBlur={handleInputChange} onChange={handleInputChange} placeholder="Ingrese nuevamente su contraseña"/>
                    <Form.Label id='errorConfirmar' className="font-rubik" style={{ fontSize: '0.8rem', color: 'red' }}>&nbsp;</Form.Label>
                  </Form.Group>
              </Col>
              </Row>
            </Form>
              <div style={{ marginTop: '5%',display:'flex', justifyContent:'end'}}>
                <SendButton onClick={handleSendData} text="Registrar" wide="10" backcolor="#02005D" letercolor='white' radius='0.2' shadow='none'/>
              </div>
          </Card.Body>
        </Card>
      </Container>
    </>
  );
}

export default RegisterCard;