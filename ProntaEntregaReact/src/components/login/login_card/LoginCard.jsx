import React from "react";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import 'bootstrap/dist/css/bootstrap.min.css';
import './LoginCard.scss';


const LoginCard = () => {
  return (
    <Container style={{display: 'flex'}} className="d-flex justify-content-center align-items-center vh-100 login-container">
      <Card style={{position: 'relative', width: '30rem',borderRadius:'1rem', boxShadow: '0.10rem 0.3rem 0.20rem rgba(0, 0, 0, 0.3)'}}>
        <Card.Body>
          <Form>
            <h1 className="font-rubik" style={{textAlign:"center",margin:'2.8rem'}}>Iniciar Sesion</h1>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label className="font-rubik" style={{display: 'block', marginBottom: '0rem', marginLeft:'1.5rem'}}>Email</Form.Label>
              <Form.Control style={{ width: '70%', height: '4.5vh', borderRadius:'10rem', marginLeft:'1.5rem', backgroundColor: '#F5F5F5',boxShadow: '0.10rem 0.3rem 0.20rem rgba(0, 0, 0, 0.3)'}} type="email" placeholder="Ingrese su email" />
              <Form.Text className="text-muted">
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label className="font-rubik" style={{display: 'block', marginBottom: '0rem', marginLeft:'1.5rem'}}>Contraseña</Form.Label>
              <Form.Control style={{width: '70%', height: '4.5vh', borderRadius:'10rem', marginLeft:'1.5rem', backgroundColor: '#F5F5F5', boxShadow: '0.10rem 0.3rem 0.20rem rgba(0, 0, 0, 0.3)'}} type="password" placeholder="Ingrese su contraseña" />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicCheckbox">
              <Form.Check style={{marginTop: '1.5rem', marginLeft:'1.5rem'}} type="checkbox" label="Mantener sesion" />
            </Form.Group>
            <div style={{justifyContent: 'center', alignItems:'center',display: 'flex'}}>
            <Button style={{borderRadius:'1rem', width:'20rem', textAlign:'center', backgroundColor: '#D9D9D9', borderColor:'#D9D9D9', color:'black', boxShadow: '0.10rem 0.3rem 0.20rem rgba(0, 0, 0, 0.3)'}} variant="primary" type="submit">
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