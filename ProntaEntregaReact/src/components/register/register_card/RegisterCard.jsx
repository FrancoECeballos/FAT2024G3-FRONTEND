import React, { useEffect, useRef, useState } from 'react';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import InputGroup from 'react-bootstrap/InputGroup';
import './RegisterCard.scss';
import defaultImage from '../../../assets/user_default.png';
import uploadImage from '../../../assets/upload.png';

import { useNavigate } from 'react-router-dom';
import fetchData from '../../../functions/fetchData';
import postData from '../../../functions/postData.jsx';

import Cookies from 'js-cookie';

// Components
import SendButton from '../../buttons/send_button/send_button.jsx';

const RegisterCard = () => {
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
  
  const navigate = useNavigate();

  const [imageSrc, setImageSrc] = useState(defaultImage);
  const [imageSrc2, setImageSrc2] = useState(uploadImage);
  const fileInputRef = useRef(null);

  const handleFileButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageSrc(reader.result);
      };
      reader.readAsDataURL(file);
      const { name, value } = event.target;
      setFormData((prevData) =>  {
        const updatedData = { ...prevData, [name]: value };
        console.log(updatedData);
        return updatedData;
      });
    }
  };

  const [formData, setFormData] = useState({
    "nombre": "",
    "apellido": "",
    "nombreusuario": "",
    "password": "",
    "documento": "",
    "telefono": "",
    "email": "",
    "genero": "",
    "id_direccion": "",
    "id_tipousuario": 2,
    "id_tipodocumento": ""
  }); useEffect(() => {
    const { cai, telnum, ...finalData } = formData;
  }, [formData]);

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
    setFormData((prevData) =>  {
      let updatedValue = value;
      if (name === "genero" || name === "id_direccion" || name === "id_tipousuario" || name === "id_tipodocumento") {
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
      return updatedData;
    });
  };

  const handleSendData = async(event) => {
    event.preventDefault();
    
    if (!formData.nombre || !formData.apellido || !formData.nombreusuario || !formData.password || !formData.documento || !formData.telefono || !formData.email || !formData.genero || !formData.id_tipodocumento) {
      alert("Please fill in all required fields.");
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

    const updatedFormData = { ...formData, id_direccion };
    setFormData(updatedFormData);

    const url = '/register/';
    const body = updatedFormData;
    const result = await postData(url, body);
    console.log(result);
    fetchData('/direcciones/').then((result) => {
      setDirec(result);
    });
  };
  
  return (
    <>
      <Container className="d-flex justify-content-center align-items-center register-container">
        <Card style={{ width: '100%', borderRadius: '1rem', boxShadow: '0.10rem 0.3rem 0.20rem rgba(0, 0, 0, 0.3)' }}>
          <Card.Body>
            <Row>
              <Col xs={12} sm={8} md={8} lg={8} xl={8} xxl={8}>
                <Form>
                  <Form.Group className='mb-2' controlId='title'>
                    <Form.Label className="font-rubik" style={{ fontSize: '1.3rem' }}>Registro:</Form.Label>
                  </Form.Group>

                  <Form.Group className="mb-2" controlId="formBasicUser">
                    <Form.Label className="font-rubik" style={{ fontSize: '0.8rem' }}>Nombre y Apellido (*)</Form.Label>
                    <div className="unified-input">
                      <InputGroup className="mb-2">
                        <Form.Control name="nombre" type="text" onChange={handleInputChange} placeholder="Ingrese su nombre" className="unified-input-left"/>
                        <Form.Control name="apellido" type="text" onChange={handleInputChange} placeholder="Ingrese su apellido" className="unified-input-right"/>
                      </InputGroup>
                    </div>
                  </Form.Group>

                  <Form.Group className="mb-2" controlId="formBasicEmail">
                    <Form.Label className="font-rubik" style={{ fontSize: '0.8rem' }}>Email (*)</Form.Label>
                    <Form.Control name="email" type="email" onChange={handleInputChange} placeholder="Ingrese su email" style={{ borderRadius: '10rem', backgroundColor: '#F5F5F5', boxShadow: '0.10rem 0.3rem 0.20rem rgba(0, 0, 0, 0.3)' }} />
                  </Form.Group>

                  <Form.Group className="mb-2" controlId="formBasicDocumento">
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
                  </Form.Group>

                  <Form.Group className="mb-2" controlId="formBasicTelefono">
                    <Form.Label className="font-rubik" style={{ fontSize: '0.8rem' }}>Telefono (*)</Form.Label>
                    <div className="unified-input">
                      <InputGroup className="mb-2">
                        <Form.Control name="cai" type="text" onChange={handleInputChange} placeholder="CAI (Codigo de acceso internacional) Ej: +54" className="unified-input-left" />
                        <Form.Control name="telnum" type="text" onChange={handleInputChange} placeholder="Ingrese su telefono" className="unified-input-right" />
                      </InputGroup>
                    </div>
                  </Form.Group>

                  <Form.Group className="mb-2" controlId="formBasicDireccion">
                    <Form.Label className="font-rubik" style={{ fontSize: '0.8rem' }}>Direccion (*)</Form.Label>
                    <div className="unified-input">
                      <InputGroup className="mb-2">
                        <Form.Control name="localidad" type="text" onChange={handleDirecChange} placeholder="Ingrese su Localidad" className="unified-input-left" />
                        <Form.Control name="calle" type="text" onChange={handleDirecChange} placeholder="Ingrese su Calle" style={{ backgroundColor: '#F5F5F5', boxShadow: '0.10rem 0.3rem 0.20rem rgba(0, 0, 0, 0.3)' }} />
                        <Form.Control name="numero" type="number" onChange={handleDirecChange} placeholder="Ingrese su Numero" className="unified-input-right" />
                      </InputGroup>
                    </div>
                  </Form.Group>

                  <Form.Group className="mb-2" controlId="formBasicGenero">
                    <Form.Label className="font-rubik" style={{ fontSize: '0.8rem' }}>Genero (*)</Form.Label>
                    <Form.Select name="genero" onChange={handleInputChange} aria-label="Default select example" style={{ borderRadius: '10rem', backgroundColor: '#F5F5F5', boxShadow: '0.10rem 0.3rem 0.20rem rgba(0, 0, 0, 0.3)' }}>
                      <option autoFocus hidden>Seleccione un genero</option>
                      <option value="1">Masculino</option>
                      <option value="2">Femenino</option>
                      <option value="3">Prefiero no decir</option>
                    </Form.Select>
                  </Form.Group>

                  <Form.Group className="mb-2" controlId="formBasicPassword">
                    <Form.Label className="font-rubik" style={{ fontSize: '0.8rem' }}>Contraseña (*)</Form.Label>
                    <Form.Control name="password" type="password" onChange={handleInputChange} placeholder="Ingrese su contraseña" style={{ borderRadius: '10rem', backgroundColor: '#F5F5F5', boxShadow: '0.10rem 0.3rem 0.20rem rgba(0, 0, 0, 0.3)' }} />
                  </Form.Group>

                  <Form.Group className="mb-2" controlId="formBasicPasswordConfirm">
                    <Form.Label className="font-rubik" style={{ fontSize: '0.8rem' }}>Confirmar contraseña (*)</Form.Label>
                    <Form.Control type="password" placeholder="Ingrese nuevamente su contraseña" style={{ borderRadius: '10rem', backgroundColor: '#F5F5F5', boxShadow: '0.10rem 0.3rem 0.20rem rgba(0, 0, 0, 0.3)' }} />
                  </Form.Group>
                </Form>
              </Col>
              <Col xs={12} sm={4} md={4} lg={4} xl={4} xxl={4} className="d-flex flex-column align-items-center move-to-top">
                <div className="flex-grow-1 d-flex flex-column align-items-center">
                  <Form.Label className="font-rubik" style={{ fontSize: '0.8rem' }}>Imagen de perfil</Form.Label>
                  <img src={imageSrc} alt="Imagen de perfil" className="user-image" style={{marginBottom: '4%'}}/>
                  <Form.Group className="mb-2" controlId="formFile">
                    <input
                      type="file"
                      name="imagen"
                      ref={fileInputRef}
                      className="hidden-file-input"
                      onChange={handleFileChange}
                    />
                    <SendButton onClick={handleFileButtonClick} text="Seleccionar Archivoㅤ" wide="8">
                      <img src={uploadImage} alt="upload" style={{ width: '1.5rem' }} className='upload'/>
                    </SendButton>
                  </Form.Group>
                </div>
              </Col>
              <Col xs={12} className="d-flex justify-content-end w-100 move-to-bottom">
                <div style={{marginTop: '5%'}}>
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
