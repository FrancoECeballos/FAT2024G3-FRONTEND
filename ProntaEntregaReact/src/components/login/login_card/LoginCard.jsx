import React, { useState } from "react";
import { Form, Card, Container } from "react-bootstrap";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import GenericAlert from "../../alerts/generic_alert/GenericAlert.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
import "./LoginCard.scss";
import SendButton from "../../buttons/send_button/send_button.jsx"

import { useNavigate } from "react-router-dom";
import postData from "../../../functions/postData.jsx";
import Cookies from "js-cookie";

const LoginCard = () => {
  const navigate = useNavigate();
  const [keepSession, setKeepSession] = useState(false);
  const [formData, setFormData] = useState({
    user: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const response = await postData("/login/", formData);
    if (response) {
      if (keepSession) {
        Cookies.set("token", response.token, { expires: 7, secure: true });
      } else {
        Cookies.set("token", response.token, { secure: true });
      }
      navigate("/");
    } else {
      setShowAlert(true);
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center login-container">
      <Card
        className="shadow-lg p-4"
        style={{
          width: "25rem",
          borderRadius: "1.5rem",
          backgroundColor: "#ffffff",
          borderColor: "#e0e0e0",
        }}
      >
        <GenericAlert
          title="Error"
          description="Usuario o contraseña incorrectos"
          type="danger"
          show={showAlert}
          setShow={setShowAlert}
        />
        <Card.Body>
          <Form>
            <h1
              className="text-center font-rubik mb-4"
              style={{ color: "#333" }}
            >
              Iniciar Sesión
            </h1>
            <Form.Group className="mb-4" controlId="formBasicEmail">
              <Form.Label className="font-rubik" style={{ color: "#666" }}>
                Nombre de Usuario o Email
              </Form.Label>
              <Form.Control
                style={{ width: "100%", marginLeft: "0" }}
                name="user"
                type="text"
                onChange={handleInputChange}
                placeholder="Ingrese su nombre de usuario"
              />
            </Form.Group>

            <Form.Group className="mb-4" controlId="formBasicPassword">
              <Form.Label className="font-rubik" style={{ color: "#666" }}>
                Contraseña
              </Form.Label>
              <div
                className="password-wrapper"
                style={{ position: "relative" }}
              >
                <Form.Control
                  style={{ width: "100%", marginLeft: "0" }}
                  name="password"
                  type={showPassword ? "text" : "password"}
                  onChange={handleInputChange}
                  placeholder="Ingrese su contraseña"
                />
                <span
                  onClick={togglePasswordVisibility}
                  style={{
                    position: "absolute",
                    right: "5%",
                    top: "45%",
                    transform: "translateY(-50%)",
                    cursor: "pointer",
                  }}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
            </Form.Group>

            <Form.Group className="mb-4" controlId="formBasicCheckbox">
              <Form.Check
                className="font-rubik"
                style={{ marginLeft: "0.5rem" }}
                onChange={(e) => setKeepSession(e.target.checked)}
                type="checkbox"
                label="Mantener sesión"
              />
            </Form.Group>

            <div className="d-flex justify-content-center">
              <SendButton
                className="login-btn"
                type="submit"
                onClick={handleLogin}
                text="Ingresar"
                backcolor="#3e4692"
                letercolor="white"
                wide="17"
              />
            </div>
          </Form>
          <div className="text-center mt-4">
            <a
              href="/register"
              className="text-decoration-none"
              style={{ color: "#007bff" }}
            >
              ¿No tienes cuenta?
            </a>
            <br />
            <a
              href="/forgot_password"
              className="text-decoration-none"
              style={{ color: "#007bff" }}
            >
              ¿Olvidaste tu contraseña?
            </a>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default LoginCard;
