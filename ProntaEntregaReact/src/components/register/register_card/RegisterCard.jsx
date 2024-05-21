import React, { useRef } from 'react';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import InputGroup from 'react-bootstrap/InputGroup';

const RegisterCard = () => {
  const fileInputRef = useRef(null);

  const handleFileButtonClick = () => {
    fileInputRef.current.click();
  };

  return (
    <>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Rubik:wght@400;500;700&display=swap');

          .font-rubik {
            font-family: 'Rubik', sans-serif;
          }
          
          .hidden-file-input {
            display: none;
          }
        `}
      </style>

      <Container className="d-flex justify-content-center align-items-center" style={{ marginTop: '7rem', width: '100%', maxWidth: '60rem', borderRadius: '1rem', boxShadow: '0 2rem 5rem rgba(0, 0, 0, 0.1)' }}>
        <Card style={{ width: '100%' }}>
          <Card.Body>
            <Row>
              <Col md={8}>
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
              <Col md={4} className="d-flex flex-column justify-content-end align-items-end">
                <div className="flex-grow-1">
                  <Form.Group className="mb-2" controlId="formFile">
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      className="hidden-file-input"
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
