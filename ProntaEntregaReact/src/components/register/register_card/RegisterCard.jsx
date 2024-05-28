import React, { useRef, useState } from 'react';
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

// Components
import SendButton from '../../buttons/send_button/send_button.jsx';

const RegisterCard = () => {
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
                  <Form.Group className='mb-2' controlId='title'>
                    <Form.Label className="font-rubik" style={{ fontSize: '1.3rem' }}>Registro:</Form.Label>
                  </Form.Group>

                  <Form.Group className="mb-2" controlId="formBasicUser">
                    <Form.Label className="font-rubik" style={{ fontSize: '0.8rem' }}>Nombre de usuario</Form.Label>
                    <Form.Control type="text" placeholder="Ingrese su nombre de usuario" style={{ borderRadius: '10rem', backgroundColor: '#F5F5F5', boxShadow: '0.10rem 0.3rem 0.20rem rgba(0, 0, 0, 0.3)' }} />
                  </Form.Group>

                  <Form.Group className="mb-2" controlId="formBasicEmail">
                    <Form.Label className="font-rubik" style={{ fontSize: '0.8rem' }}>Email</Form.Label>
                    <Form.Control type="email" placeholder="Ingrese su email" style={{ borderRadius: '10rem', backgroundColor: '#F5F5F5', boxShadow: '0.10rem 0.3rem 0.20rem rgba(0, 0, 0, 0.3)' }} />
                  </Form.Group>

                  <Form.Group className="mb-2" controlId="formBasicDocumento">
                    <Form.Label className="font-rubik" style={{ fontSize: '0.8rem' }}>Documento de identidad</Form.Label>
                    <div className="unified-input">
                      <InputGroup className="mb-2">
                        <Form.Control aria-label="Text input with dropdown button" className="unified-input-left" />
                        <Form.Select aria-label="Default select example" className="unified-input-right">
                          <option>Seleccione un tipo de documento</option>
                          <option value="1">DNI</option>
                          <option value="2">Pasaporte</option>
                          <option value="3">Carnet de extranjeria</option>
                        </Form.Select>
                      </InputGroup>
                    </div>
                  </Form.Group>

                  <Form.Group className="mb-2" controlId="formBasicTelefono">
                    <Form.Label className="font-rubik" style={{ fontSize: '0.8rem' }}>Telefono</Form.Label>
                    <div className="unified-input">
                      <InputGroup className="mb-2">
                        <Form.Control type="text" placeholder="CAI (Codigo de acceso internacional) Ej: +54" className="unified-input-left" />
                        <Form.Control type="text" placeholder="Ingrese su telefono" className="unified-input-right" />
                      </InputGroup>
                    </div>
                  </Form.Group>

                  <Form.Group className="mb-2" controlId="formBasicDireccion">
                    <Form.Label className="font-rubik" style={{ fontSize: '0.8rem' }}>Direccion</Form.Label>
                    <div className="unified-input">
                      <InputGroup className="mb-2">
                        <Form.Control type="text" placeholder="Ingrese su Localidad" className="unified-input-left" />
                        <Form.Control type="text" placeholder="Ingrese su Calle" style={{ backgroundColor: '#F5F5F5', boxShadow: '0.10rem 0.3rem 0.20rem rgba(0, 0, 0, 0.3)' }} />
                        <Form.Control type="text" placeholder="Ingrese su Numero" className="unified-input-right" />
                      </InputGroup>
                    </div>
                  </Form.Group>

                  <Form.Group className="mb-2" controlId="formBasicGenero">
                    <Form.Label className="font-rubik" style={{ fontSize: '0.8rem' }}>Genero</Form.Label>
                    <Form.Select aria-label="Default select example" style={{ borderRadius: '10rem', backgroundColor: '#F5F5F5', boxShadow: '0.10rem 0.3rem 0.20rem rgba(0, 0, 0, 0.3)' }}>
                      <option>Seleccione un genero</option>
                      <option value="1">Masculino</option>
                      <option value="2">Femenino</option>
                      <option value="3">Prefiero no decir</option>
                    </Form.Select>
                  </Form.Group>

                  <Form.Group className="mb-2" controlId="formBasicPassword">
                    <Form.Label className="font-rubik" style={{ fontSize: '0.8rem' }}>Contraseña</Form.Label>
                    <Form.Control type="password" placeholder="Ingrese su contraseña" style={{ borderRadius: '10rem', backgroundColor: '#F5F5F5', boxShadow: '0.10rem 0.3rem 0.20rem rgba(0, 0, 0, 0.3)' }} />
                  </Form.Group>

                  <Form.Group className="mb-2" controlId="formBasicPasswordConfirm">
                    <Form.Label className="font-rubik" style={{ fontSize: '0.8rem' }}>Confirmar contraseña</Form.Label>
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
                  <SendButton onClick="none" text="Registrar" wide="15" />
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
