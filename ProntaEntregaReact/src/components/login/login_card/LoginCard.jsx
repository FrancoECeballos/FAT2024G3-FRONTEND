import React, { useEffect, useRef, useState } from "react";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import GenericAlert from "../../alerts/generic_alert/GenericAlert.jsx";
import 'bootstrap/dist/css/bootstrap.min.css';
import './LoginCard.scss';

import { useNavigate } from 'react-router-dom';
import postData from '../../../functions/postData.jsx';
import Cookies from 'js-cookie';

const LoginCard = () => {
  const navigate = useNavigate();
  const [keepSession, setKeepSession] = useState(false);
  const [formData, setFormData] = useState({
    "email": "",
    "password": ""
  });
  const [showAlert, setShowAlert] = useState(false);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) =>  {
      const updatedData = { ...prevData, [name]: value };
      return updatedData;
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const response = await postData('/login/', formData);
    if (response) {
      if (keepSession) {
        Cookies.set('token', response.token, { expires: 7, secure: true });
      } else {
        Cookies.set('token', response.token, { secure: true });
      }
      navigate('/main');
    } else {
      setShowAlert(true);
    }
  };

  return (
    <Container style={{display: 'flex'}} className="d-flex justify-content-center align-items-center vh-100 login-container">
      <Card style={{position: 'relative', width: '30rem',borderRadius:'1rem', boxShadow: '0.10rem 0.3rem 0.20rem rgba(0, 0, 0, 0.3)'}}>
      <GenericAlert title="Error" description="Usuario o contraseña incorrectos" type="danger" show={showAlert} setShow={setShowAlert} />
        <Card.Body>
          <Form>
            <h1 className="font-rubik" style={{textAlign:"center",margin:'2.8rem'}}>Iniciar Sesi&oacute;n</h1>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label className="font-rubik" style={{display: 'block', marginBottom: '0rem', marginLeft:'1.5rem'}}>Email</Form.Label>
              <Form.Control style={{ width: '90%', height: '4.5vh', borderRadius:'10rem', marginLeft:'1.5rem', backgroundColor: '#F5F5F5',boxShadow: '0.10rem 0.3rem 0.20rem rgba(0, 0, 0, 0.3)'}} name="email" type="email" onChange={handleInputChange} placeholder="Ingrese su email" />
              <Form.Text className="text-muted">
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label className="font-rubik" style={{display: 'block', marginBottom: '0rem', marginLeft:'1.5rem'}}>Contraseña</Form.Label>
              <Form.Control style={{width: '90%', height: '4.5vh', borderRadius:'10rem', marginLeft:'1.5rem', backgroundColor: '#F5F5F5', boxShadow: '0.10rem 0.3rem 0.20rem rgba(0, 0, 0, 0.3)'}} name="password" type="password" onChange={handleInputChange} placeholder="Ingrese su contraseña" />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicCheckbox">
              <Form.Check style={{marginTop: '1.5rem', marginLeft:'1.5rem'}} onChange={(e) => setKeepSession(e.target.checked)} type="checkbox" label="Mantener sesi&oacute;n" />
            </Form.Group>
            <div style={{justifyContent: 'center', alignItems:'center',display: 'flex'}}>
            <Button style={{borderRadius:'1rem', width:'20rem', textAlign:'center', backgroundColor: '#D9D9D9', borderColor:'#D9D9D9', color:'black', boxShadow: '0.10rem 0.3rem 0.20rem rgba(0, 0, 0, 0.3)'}} variant="primary" type="submit" onClick={handleLogin}>
              Ingresar
            </Button>
            </div>
          </Form>
          <div style={{ justifyContent: 'center', alignItems: 'center', display: 'flex', flexDirection: 'column', marginTop:'1rem' }}>
          <a href="/register">¿No tienes cuenta?</a>
          <a href="">¿Olvidaste tu contraseña?</a>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default LoginCard;