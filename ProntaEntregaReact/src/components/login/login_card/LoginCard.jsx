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
    "user": "",
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
      navigate('');
    } else {
      setShowAlert(true);
    }
  };

    return (
      <Container fluid className="login-container">
        <Card className="login-card p-4">
          <GenericAlert title="Error" description="Usuario o contraseña incorrectos" type="danger" show={showAlert} setShow={setShowAlert} />
          <Card.Body>
            <Form>
              <h2 className="text-center mb-4">Iniciar Sesión</h2>
              
              <Form.Group controlId="formBasicEmail" className="mb-3">
                <Form.Label>Usuario o Email</Form.Label>
                <Form.Control 
                  className="login-input" 
                  type="text" 
                  name="user" 
                  placeholder="Ingrese su usuario o email" 
                  onChange={handleInputChange} 
                />
              </Form.Group>
  
              <Form.Group controlId="formBasicPassword" className="mb-3">
                <Form.Label>Contraseña</Form.Label>
                <Form.Control 
                  className="login-input" 
                  type="password" 
                  name="password" 
                  placeholder="Ingrese su contraseña" 
                  onChange={handleInputChange} 
                />
              </Form.Group>
  
              <Form.Group controlId="formBasicCheckbox" className="mb-4">
                <Form.Check 
                  type="checkbox" 
                  label="Mantener sesión" 
                  onChange={(e) => setKeepSession(e.target.checked)} 
                />
              </Form.Group>
  
              <Button 
                className="login-button w-100" 
                variant="primary" 
                type="submit" 
                onClick={handleLogin}
              >
                Ingresar
              </Button>
  
              <div className="text-center mt-3">
                <a href="/register" className="link-primary">¿No tienes cuenta?</a>
                <br />
                <a href="/forgot_password" className="link-primary">¿Olvidaste tu contraseña?</a>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    );
  };
  
  export default LoginCard;
  