import React from "react";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';


const LoginCard = () => {
return (
    <card>
    <Form>
    <Form.Group className="mb-3" controlId="formBasicEmail">
      <Form.Label>Email</Form.Label>
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
  </card>
)
}
export default LoginCard