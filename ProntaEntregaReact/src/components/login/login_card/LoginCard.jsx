import React from "react";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import 'bootstrap/dist/css/bootstrap.min.css';

const LoginCard = () => {
  return (
    <Container className="d-flex justify-content-center align-items-center vh-100">
      <Card style={{ width: '32rem',borderRadius:'1rem', boxShadow: '0 2rem 5rem rgba(0, 0, 0, 0.1)'}}>
        <Card.Body>
          <Form>
            <h1 style={{textAlign:"center",margin:'2.8rem'}}>Log In</h1>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label style={{display: 'block', marginBottom: '0rem', marginLeft:'1.5rem'}}>Email</Form.Label>
              <Form.Control style={{ width: '15rem', height: '4.5vh', borderRadius:'1rem', marginLeft:'1.5rem', }} type="email" placeholder="Ingrese su email" />
              <Form.Text className="text-muted">
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label style={{display: 'block', marginBottom: '0rem', marginLeft:'1.5rem'}}>Contraseña</Form.Label>
              <Form.Control style={{width: '15rem', height: '4.5vh', borderRadius:'1rem', marginLeft:'1.5rem'}} type="password" placeholder="Ingrese su contraseña" />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicCheckbox">
              <Form.Check style={{marginTop: '1.5rem', marginLeft:'1.5rem'}} type="checkbox" label="Mantener sesion" />
            </Form.Group>
            <div style={{justifyContent: 'center', alignItems:'center',display: 'flex'}}>
            <Button style={{borderRadius:'1rem', width:'20rem', height: '5vh', textAlign:'center'}} variant="primary" type="submit">
              Ingresar
            </Button>
            </div>
          </Form>
          <div style={{ justifyContent: 'center', alignItems: 'center', display: 'flex', flexDirection: 'column', marginTop:'1rem' }}>
          <a href="register.html">¿No tienes cuenta?</a>
          <a href="">¿Olvidaste tu contraseña?</a>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default LoginCard;