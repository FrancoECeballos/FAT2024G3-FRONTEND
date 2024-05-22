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

const RegisterCard = () => {
  const [imageSrc, setImageSrc] = useState(defaultImage);
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
        <Card style={{ width: '100%' }}>
          <Card.Body>
            <Row>
              <Col xs={8} sm={8} md={8} lg={8} xl={8} xxl={8}>
                <Form>
                  <Form.Group className='mb-2' controlId='title'>
                    <Form.Label className="font-rubik" style={{ fontSize: '1.3rem' }}>Register:</Form.Label>
                  </Form.Group>

                  <Form.Group className="mb-2" controlId="formBasicUser">
                    <Form.Label className="font-rubik" style={{ fontSize: '0.8rem' }}>Nombre de usuario</Form.Label>
                    <Form.Control type="text" placeholder="Ingrese su nombre de usuario" />
                  </Form.Group>

                  <Form.Group className="mb-2" controlId="formBasicEmail">
                    <Form.Label className="font-rubik" style={{ fontSize: '0.8rem' }}>Email</Form.Label>
                    <Form.Control type="email" placeholder="Ingrese su email" />
                  </Form.Group>

                  <Form.Group className="mb-2" controlId="formBasicDocumento">
                    <Form.Label className="font-rubik" style={{ fontSize: '0.8rem' }}>Documento de identidad</Form.Label>
                    <InputGroup className="mb-2">
                      <Form.Control aria-label="Text input with dropdown button" />
                      <Form.Select aria-label="Default select example">
                        <option>Seleccione un tipo de documento</option>
                        <option value="1">DNI</option>
                        <option value="2">Pasaporte</option>
                        <option value="3">Carnet de extranjeria</option>
                      </Form.Select>
                    </InputGroup>
                  </Form.Group>

                  <Form.Group className="mb-2" controlId="formBasicGenero">
                    <Form.Label className="font-rubik" style={{ fontSize: '0.8rem' }}>Genero</Form.Label>
                    <Form.Select aria-label="Default select example">
                      <option>Seleccione un genero</option>
                      <option value="1">Masculino</option>
                      <option value="2">Femenino</option>
                      <option value="3">Prefiero no decir</option>
                    </Form.Select>
                  </Form.Group>

                  <Form.Group className="mb-2" controlId="formBasicPassword">
                    <Form.Label className="font-rubik" style={{ fontSize: '0.8rem' }}>Contraseña</Form.Label>
                    <Form.Control type="password" placeholder="Ingrese su contraseña" />
                  </Form.Group>

                  <Form.Group className="mb-2" controlId="formBasicPasswordConfirm">
                    <Form.Label className="font-rubik" style={{ fontSize: '0.8rem' }}>Confirmar contraseña</Form.Label>
                    <Form.Control type="password" placeholder="Ingrese nuevamente su contraseña" />
                  </Form.Group>
                </Form>
              </Col>
              <Col xs={4} sm={4} md={4} lg={4} xl={4} xxl={4} className="d-flex flex-column justify-content-end align-items-end">
                <div className="flex-grow-1">
                  <img src={imageSrc} alt="Uploaded file" style={{ width: '15rem', marginBottom: '2%' }} />
                  <Form.Group className="mb-2" controlId="formFile">
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      className="hidden-file-input"
                      onChange={handleFileChange}
                    />
                    <Button variant="secondary" onClick={handleFileButtonClick}>
                      Upload File
                    </Button>
                  </Form.Group>
                </div>
                <div className="d-flex justify-content-end w-100">
                  <Button variant="primary" type="submit">
                    Ingresar
                  </Button>
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