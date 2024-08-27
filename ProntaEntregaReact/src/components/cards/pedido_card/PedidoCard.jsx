import React, { useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import { InputGroup, Col, Row, Form, Card, Button } from 'react-bootstrap';
import SelectableCard from '../../cards/selectable_card/SelectableCard.jsx';
import fetchData from '../../../functions/fetchData.jsx';
import './PedidoCard.scss';

const PedidoCard = forwardRef(({ productDefault, user, stock, productosDisponibles, stocksDisponibles }, ref) => {
    const [obras, setObras] = useState([]);

    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];
    
    const nextMonth = new Date(today);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    const formattedNextMonthDate = nextMonth.toISOString().split('T')[0];

    const [pedidoForm, setPedidoForm] = useState({
        "fechainicio": formattedDate,
        "fechavencimiento": formattedNextMonthDate,
        "id_obra": stock ? stock : "",
        "id_usuario": user ? user.id_usuario : "",
        "cantidad": 0,
        "urgente": 1,
        "id_producto": productDefault ? productDefault.id_producto: "",
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
            case 'cantidad': case 'urgente': case 'id_obra': case 'id_producto':
                transformedValue = parseInt(value, 10); break;
            default: break;
        }
        setPedidoForm((prevPedido) => {
            const updatedForm = { ...prevPedido, [name]: transformedValue };
            console.log('Formulario de Pedido Actualizado:', updatedForm);
            return updatedForm;
        });
    };

    const handleCardSelection = (key) => {
        setPedidoForm(prevForm => {
            const isAlreadySelected = prevForm.obras.includes(key);
            const updatedObras = isAlreadySelected
                ? prevForm.obras.filter(k => k !== key)
                : [key, ...prevForm.obras];

            const updatedForm = {
                ...prevForm,
                obras: updatedObras
            };

            console.log('Formulario de Pedido Actualizado:', updatedForm);
            return updatedForm;
        });

        setObras(prevObras => {
            const selectedObra = prevObras.find(obra => obra.id_obra.id_obra === key);
            const remainingObras = prevObras.filter(obra => obra.id_obra.id_obra !== key);
            return [selectedObra, ...remainingObras];
        });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log('Formulario de Pedido Enviado:', pedidoForm);
        // Aquí puedes añadir la lógica para enviar el formulario al servidor
    };

    useImperativeHandle(ref, () => ({
        getPedidoForm: () => pedidoForm
    }));

    return (
        <Card className='no-border-card' style={{ width: '100%' }}>
            <Card.Body>
                <Form onSubmit={handleSubmit}>
                    <Row className="g-0">
                        <Col xs={12} md={5} style={{marginRight:"2rem"}}>
                            <h2>
                                {productDefault ? `Crear Pedido de ${productDefault.nombre}` : 'Crear Pedido'}
                            </h2>

                            {!productDefault && (
                                <Form.Group className="mb-2" controlId="formBasicProducto">
                                    <Form.Label className="font-rubik" style={{ fontSize: '0.8rem' }}>Producto (*)</Form.Label>
                                    <Form.Control name="producto" type="text" onBlur={handleInputChange} onChange={handleInputChange} placeholder="Ingrese el producto" />
                                </Form.Group>
                            )}

                            <Form.Group className="mb-2" controlId="formBasicFechaInicio">
                                <Form.Label className="font-rubik" style={{ fontSize: '0.8rem' }}>Fecha Inicio (*)</Form.Label>
                                <Form.Control name="fechainicio" type="date" onBlur={handleInputChange} onChange={handleInputChange} defaultValue={formattedDate} min={formattedDate} />
                            </Form.Group>

                            <Form.Group className="mb-2" controlId="formBasicFechaFin">
                                <Form.Label className="font-rubik" style={{ fontSize: '0.8rem' }}>Fecha Vencimiento (*)</Form.Label>
                                <Form.Control name="fechavencimiento" type="date" onBlur={handleInputChange} onChange={handleInputChange} defaultValue={formattedNextMonthDate} min={formattedDate} />
                                <p style={{fontSize: '0.7rem'}}><strong>Esta fecha está como el mes siguiente por defecto</strong></p>
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

                            {!stock && (
                                <Form.Group className="mb-2" controlId="formBasicUrgencia">
                                    <Form.Label className="font-rubik" style={{ fontSize: '0.8rem' }}>Obra que Pide (*)</Form.Label>
                                    <Form.Control name="id_obra" as="select" onChange={handleInputChange} defaultValue="">
                                        <option value="" hidden>Seleccione una Obra</option>
                                        {stocksDisponibles.map(stock => (
                                            <option key={stock.stock[0].id_stock} value={stock.stock[0].id_stock}>{stock.stock[0].id_obra.nombre}</option>
                                        ))}
                                    </Form.Control>
                                </Form.Group>
                            )}

                            {/*!productDefault && (
                                <Form.Group className="mb-2" controlId="formBasicUrgencia">
                                    <Form.Label className="font-rubik" style={{ fontSize: '0.8rem' }}>Urgencia (*)</Form.Label>
                                    <Form.Control name="urgente" as="select" onChange={handleInputChange}>
                                        <option value="" selected hidden>Seleccione un Producto</option>
                                        {productosDisponibles.map(producto => (
                                            <option key={producto.id_producto} value={producto.id_producto}>{producto.nombre}</option>
                                        ))}
                                    </Form.Control>
                                </Form.Group>
                            )*/}


                        </Col>
                        <Col xs={12} md={6}>
                            <Form.Group  className="mb-2" controlId="formBasicObras">
                                <Form.Label className="font-rubik " style={{ fontSize: '0.8rem' }}>Obras Pedidas (*)</Form.Label>
                                <div className='cardscasas'> {/* Ajusta el margen si es necesario */}
                                    {obras.map(obra => (
                                        <SelectableCard mar={"0.2rem"} pad={"0px"} height={"5rem"} wide={"98%"} key={obra.id_obra.id_obra} id={obra.id_obra.id_obra} titulo={obra.id_obra.nombre} foto={obra.id_obra.imagen} onCardSelect={handleCardSelection} isSelected={pedidoForm.obras.includes(obra.id_obra.id_obra)}/>
                                    ))}
                                </div>
                            </Form.Group>
                        </Col>
                    </Row>
                </Form>
            </Card.Body>
        </Card>
    );
});

export default PedidoCard;
