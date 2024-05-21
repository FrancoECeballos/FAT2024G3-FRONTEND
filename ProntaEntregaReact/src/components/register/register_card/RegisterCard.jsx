import React from 'react';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

const LoginCard = () => {
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

    <Container className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
      <Card style={{ width: '25rem' }}>
        <Card.Body>
          <Form>
            <Form.Group className='mb-3' controlId='title'>
                <Form.Label className="font-rubik" style={{fontSize: '1.3rem'}}>Register:</Form.Label>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label className="font-rubik">Nombre de usuario</Form.Label>
              <Form.Control type="text" />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Contraseña</Form.Label>
              <Form.Control type="password" placeholder="Ingrese su contraseña" />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicCheckbox">
              <Form.Check type="checkbox" label="Mantener sesion" />
            </Form.Group>

            <Button variant="primary" type="submit">
              Ingresar
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
    </>
  );
}

export default LoginCard;
