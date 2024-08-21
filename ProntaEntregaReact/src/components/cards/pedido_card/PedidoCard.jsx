import React, { useEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react';
import { InputGroup, Col, Row, Form, Container, Card } from 'react-bootstrap';
import GenericAccordion from '../../accordions/generic_accordion/GenericAccordion.jsx';
import SelectableCard from '../../cards/selectable_card/SelectableCard.jsx';
import fetchData from '../../../functions/fetchData.jsx';
import postData from '../../../functions/postData.jsx';

const PedidoCard = forwardRef(({ productDefault, user, stock }, ref) => {
    const [obras, setObras] = useState([]);

    const today = new Date();
    const formattedDate = today.toLocaleDateString('en-GB').split('/').reverse().join('-');
    
    const nextMonth = new Date(today.setMonth(today.getMonth() + 1));
    const formattedNextMonthDate = nextMonth.toLocaleDateString('en-GB').split('/').reverse().join('-');

    const [pedidoForm, setPedidoForm] = useState({
        "fechaInicio": formattedDate,
        "fechaVencimiento": formattedNextMonthDate,
        "id_obra": stock ? stock : "",
        "id_usuario": user ? user.id_usuario : "",
        "cantidad": 0,
        "urgente": 1,
        "id_producto": productDefault.id_producto,
        "id_estadoPedido": 3,
        "obras": []
    });

    useEffect(() => {
        fetchData('stock/').then((data) => {
            setObras(data);
        });
    }, []);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        let transformedValue = value;

        switch (name) {
            case 'cantidad': case 'urgente':
                transformedValue = parseInt(value, 10); break;
            case 'fechaInicio': case 'fechaVencimiento':
                transformedValue = new Date(value).toISOString().split('T')[0]; break;
            default: break;
        }
        setPedidoForm((prevPedido) => ({ ...prevPedido, [name]: transformedValue }));
        console.log(pedidoForm);
    };

    const handleCardSelection = (key) => {
        setPedidoForm(prevForm => ({
            ...prevForm,
            obras: prevForm.obras.includes(key)
                ? prevForm.obras.filter(k => k !== key)
                : [...prevForm.obras, key]
        }));
        console.log(pedidoForm);
    };

    useImperativeHandle(ref, () => ({
        getPedidoForm: () => pedidoForm
    }));

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
                                <Form.Control name="producto" type="text" onBlur={handleInputChange} onChange={handleInputChange} placeholder="Ingrese el producto" />
                            </Form.Group>}

                            <Form.Group className="mb-2" controlId="formBasicFechaInicio">
                                <Form.Label className="font-rubik" style={{ fontSize: '0.8rem' }}>Fecha Inicio (*)</Form.Label>
                                <Form.Control name="fechaInicio" type="date" onBlur={handleInputChange} onChange={handleInputChange} defaultValue={formattedDate} min={formattedDate} />
                            </Form.Group>

                            <Form.Group className="mb-2" controlId="formBasicFechaFin">
                                <Form.Label className="font-rubik" style={{ fontSize: '0.8rem' }}>Fecha Vencimiento (*) <br/><strong>Esta fecha esta como el mes siguiente por defecto</strong></Form.Label>
                                <Form.Control name="fechaVencimiento" type="date" onBlur={handleInputChange} onChange={handleInputChange} defaultValue={formattedNextMonthDate} min={formattedDate} />
                            </Form.Group>

                            <Form.Group className="mb-2" controlId="formBasicCantidad">
                                <Form.Label className="font-rubik" style={{ fontSize: '0.8rem' }}>Cantidad Pedida (*)</Form.Label>
                                <Form.Control name="cantidad" type="number" onBlur={handleInputChange} onChange={handleInputChange} placeholder="Ingrese la cantidad" onKeyDown={(event) => {if (!/[0-9.]/.test(event.key) && !['Backspace', 'ArrowLeft', 'ArrowRight', 'Shift'].includes(event.key)) {event.preventDefault();}}}/>
                            </Form.Group>

                            <Form.Group className="mb-2" controlId="formBasicUrgencia">
                                <Form.Label className="font-rubik" style={{ fontSize: '0.8rem' }}>Urgencia (*)</Form.Label>
                                <Form.Control name="urgente" as="select" onChange={handleInputChange}>
                                    <option value="1">No es urgente</option>
                                    <option value="2">Ligeramente Urgente</option>
                                    <option value="3">Muy Urgente</option>
                                    <option value="4">Inmediato</option>
                                </Form.Control>
                            </Form.Group>

                            <Form.Group className="mb-2" controlId="formBasicObras">
                                <Form.Label className="font-rubik" style={{ fontSize: '0.8rem' }}>Obras (*)</Form.Label>
                                <div style={{marginLeft: "4rem"}}>
                                    <GenericAccordion wide={"20rem"} 
                                        children={obras.map(obra => (
                                            <SelectableCard key={obra.id_obra.id_obra} id={obra.id_obra.id_obra} titulo={obra.id_obra.nombre} foto={obra.id_obra.imagen} onCardSelect={handleCardSelection} isSelected={pedidoForm.obras.includes(obra.id_obra.id_obra)}/>
                                        ))}
                                    />
                                </div>
                            </Form.Group>

                        </Form>
                    </Col>
                </Row>
            </Card.Body>
        </Card>
    );
});

export default PedidoCard;