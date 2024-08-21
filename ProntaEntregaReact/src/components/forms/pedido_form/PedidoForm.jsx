import React, { useEffect, useRef, useState } from 'react';
import { InputGroup, Col, Row, Form, Container, Card } from 'react-bootstrap';

// Assets and style
import './CrearPedido.scss';

// Functions
import fetchData from '../../../functions/fetchData.jsx';
import postData from '../../../functions/postData.jsx';

// Components
import SendButton from '../../buttons/send_button/send_button.jsx';

const CrearPedido = ({productDefault, user, stock}) => {
    const today = new Date();
    const formattedDate = today.toLocaleDateString('en-GB').split('/').reverse().join('-');
    const formattedTime = today.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit'});    
    const [pedidoForm, setPedidoForm] = useState({
        "producto": "",
        "cantidad": ""
    });

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setPedidoForm((prevPedido) => ({ ...prevPedido, [name]: value }));
    };

    const handleSendData = async (event) => {
        event.preventDefault();

        if (!formData.id_direccion || !formData.producto || !formData.cantidad) {
            alert("Please fill in all required fields.");
            return;
        }
    };

    return (
        <Card style={{ width: '100%'}}>
            <Card.Body>
                <Row>
                    <Col xs={12} sm={8} md={8} lg={8} xl={8} xxl={8}>
                        <Form>
                            <h2 className='centered'>
                                {productDefault ? `Crear Pedido de ${productDefault.nombre}` : 'Crear Pedido'}
                            </h2>

                            { !productDefault && <Form.Group className="mb-2" controlId="formBasicProducto">
                                <Form.Label className="font-rubik" style={{ fontSize: '0.8rem' }}>Producto (*)</Form.Label>
                                <Form.Control name="producto" type="text" onChange={handleInputChange} placeholder="Ingrese el producto" />
                            </Form.Group>}

                            <Form.Group className="mb-2" controlId="formBasicFechaInicio">
                                <Form.Label className="font-rubik" style={{ fontSize: '0.8rem' }}>Fecha/Hora Inicio (*)</Form.Label>
                                <Form.Control name="fechaInicio" type="date" onChange={handleInputChange} defaultValue={formattedDate} min={formattedDate} />
                                <Form.Control name="horaInicio" type="time" onChange={handleInputChange} defaultValue={formattedTime} min={formattedTime} />
                            </Form.Group>

                            <Form.Group className="mb-2" controlId="formBasicCantidad">
                                <Form.Label className="font-rubik" style={{ fontSize: '0.8rem' }}>Cantidad (*)</Form.Label>
                                <Form.Control name="cantidad" type="number" onChange={handleInputChange} placeholder="Ingrese la cantidad" />
                            </Form.Group>

                        </Form>
                    </Col>
                </Row>
            </Card.Body>
        </Card>
    );
}

export default CrearPedido;
