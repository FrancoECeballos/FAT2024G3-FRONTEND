import React, { useEffect, useRef, useState } from 'react';
import { InputGroup, Col, Row, Form, Container, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

// Assets and style
import './CrearPedido.scss';
import defaultImage from '../../../assets/user_default.png';

// Functions
import fetchData from '../../../functions/fetchData.jsx';
import postData from '../../../functions/postData.jsx';

// Components
import SendButton from '../../buttons/send_button/send_button.jsx';

const CrearPedido = () => {
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    useEffect(() => {
        fetchData('/tipo_documento/').then((result) => {
            setData(result);
        });
    }, []);

    const [direc, setDirec] = useState([]);
    useEffect(() => {
        fetchData('/direcciones/').then((result) => {
            setDirec(result);
        });
    }, []);

    const [formData, setFormData] = useState({
        "id_direccion": "",
        "producto": "",
        "cantidad": ""
    });

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleSendData = async (event) => {
        event.preventDefault();

        if (!formData.id_direccion || !formData.producto || !formData.cantidad) {
            alert("Please fill in all required fields.");
            return;
        }

        const url = '/crear_pedido/'; // Update the API endpoint for creating a pedido
        const body = formData; // Update the data for creating a pedido
        const result = await postData(url, body);
        Cookies.set('token', result.token, { expires: 7, secure: true });
        navigate('/');
    };

    return (
        <>
            <Container className="d-flex justify-content-center align-items-center register-container">
                <Card style={{ width: '100%', borderRadius: '1rem', boxShadow: '0.10rem 0.3rem 0.20rem rgba(0, 0, 0, 0.3)' }}>
                    <Card.Body>
                        <Row>
                            <Col xs={12} sm={8} md={8} lg={8} xl={8} xxl={8}>
                                <Form>
                                    <Form.Group className='mb-2' controlId='title'>
                                        <Form.Label className="font-rubik" style={{ fontSize: '1.3rem' }}>Crear Pedido:</Form.Label>
                                    </Form.Group>

                                    <Form.Group className="mb-2" controlId="formBasicDireccion">
                                        <Form.Label className="font-rubik" style={{ fontSize: '0.8rem' }}>Dirección de entrega (*)</Form.Label>
                                        <div className="unified-input">
                                            <InputGroup className="mb-2">
                                                <Form.Control name="id_direccion" type="text" onChange={handleInputChange} placeholder="Ingrese la dirección de entrega" />
                                            </InputGroup>
                                        </div>
                                    </Form.Group>

                                    <Form.Group className="mb-2" controlId="formBasicProducto">
                                        <Form.Label className="font-rubik" style={{ fontSize: '0.8rem' }}>Producto (*)</Form.Label>
                                        <Form.Control name="producto" type="text" onChange={handleInputChange} placeholder="Ingrese el producto" />
                                    </Form.Group>

                                    <Form.Group className="mb-2" controlId="formBasicCantidad">
                                        <Form.Label className="font-rubik" style={{ fontSize: '0.8rem' }}>Cantidad (*)</Form.Label>
                                        <Form.Control name="cantidad" type="number" onChange={handleInputChange} placeholder="Ingrese la cantidad" />
                                    </Form.Group>

                                </Form>
                            </Col>
                        </Row>
                        <div style={{ marginTop: '5%' }}>
                            <SendButton onClick={handleSendData} text="Crear Pedido" wide="15" />
                        </div>
                    </Card.Body>
                </Card>
            </Container>
        </>
    );
}

export default CrearPedido;
