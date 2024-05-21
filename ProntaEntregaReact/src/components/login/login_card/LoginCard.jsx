import React from "react";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import 'bootstrap/dist/css/bootstrap.min.css';

const LoginCard = () => {
  return (
    <Container className="d-flex justify-content-center align-items-center vh-100">
      <Card style={{ width: '35rem', height: '60vh' , borderRadius:'20px', boxShadow:'0px 5px 10px',}}>
        <Card.Body>
          <Form>
            <h1 style={{textAlign:"center", padding: ''}}>Log In</h1>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label style={{display: 'block', marginBottom: ''}}>Email</Form.Label>
              <Form.Control type="email" placeholder="Ingrese su email" />
              <Form.Text className="text-muted">
              </Form.Text>
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
  );
}

export default LoginCard;