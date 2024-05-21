import React from 'react';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import InputGroup from 'react-bootstrap/InputGroup';

const RegisterCard = () => {
  return (
    <>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Rubik:wght@400;500;700&display=swap');

          .font-rubik {
            font-family: 'Rubik', sans-serif;
          }
        `}
      </style>

      <Container className="d-flex justify-content-center align-items-center" style={{width: '50rem', borderRadius:'1rem', boxShadow:'0rem 2rem 5rem'}}>
        <Card style={{width: '50rem' }}>
          <Card.Body>
            <Row>
              <Col style={{ width: '35rem' }}>
                <Form>
                  <Form.Group className='mb-2' controlId='title'>
                    <Form.Label className="font-rubik" style={{fontSize: '1.3rem'}}>Register:</Form.Label>
                  </Form.Group>

                  <Form.Group className="mb-2" controlId="formBasicUser">
                    <Form.Label className="font-rubik" style={{fontSize: '0.8rem'}}>Nombre de usuario</Form.Label>
                    <Form.Control type="text" placeholder="Ingrese su nombre de usuario"/>
                  </Form.Group>

                  <Form.Group className="mb-2" controlId="formBasicEmail">
                    <Form.Label className="font-rubik" style={{fontSize: '0.8rem'}}>Email</Form.Label>
                    <Form.Control type="email" placeholder="Ingrese su email"/>
                  </Form.Group>

                  <Form.Group className="mb-2" controlId="formBasicDocumento">
                    <Form.Label className="font-rubik" style={{fontSize: '0.8rem'}}>Documento de identidad</Form.Label>
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
                    <Form.Label className="font-rubik" style={{fontSize: '0.8rem'}}>Genero</Form.Label>
                    <Form.Select aria-label="Default select example">
                        <option>Seleccione un genero</option>
                        <option value="1">Masculino</option>
                        <option value="2">Femenino</option>
                        <option value="3">Prefiero no decir</option>
                    </Form.Select>
                  </Form.Group>

                  <Form.Group className="mb-2" controlId="formBasicPassword">
                    <Form.Label className="font-rubik" style={{fontSize: '0.8rem'}}>Contraseña</Form.Label>
                    <Form.Control type="password" placeholder="Ingrese su contraseña"/>
                  </Form.Group>

                  <Form.Group className="mb-2" controlId="formBasicPassword">
                    <Form.Label className="font-rubik" style={{fontSize: '0.8rem'}}>Confirmar contraseña</Form.Label>
                    <Form.Control type="password" placeholder="Ingrese nuevamente su contraseña"/>
                  </Form.Group>
                </Form>
              </Col>
              <Col className="d-flex flex-column justify-content-end align-items-end" style={{ width: '15rem' }}>
                <Button variant="primary" type="submit">
                  Ingresar
                </Button>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Container>
    </>
  );
}

export default RegisterCard;
