import React, { useEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react';
import { InputGroup, Col, Row, Form, Container, Card } from 'react-bootstrap';
import GenericAccordion from '../../accordions/generic_accordion/GenericAccordion.jsx';
import SelectableCard from '../selectable_card/SelectableCard.jsx';
import fetchData from '../../../functions/fetchData.jsx';
import postData from '../../../functions/postData.jsx';

import './OfertaCard.scss';

const OfertaCard = forwardRef(({ productDefault, user, stock }, ref) => {
    const [obras, setObras] = useState([]);

    const today = new Date();
    const formattedDate = today.toLocaleDateString('en-GB').split('/').reverse().join('-');
    
    const nextMonth = new Date(today.setMonth(today.getMonth() + 1));
    const formattedNextMonthDate = nextMonth.toLocaleDateString('en-GB').split('/').reverse().join('-');

    const [ofertaForm, setOfertaForm] = useState({
        "fechainicio": formattedDate,
        "fechavencimiento": formattedNextMonthDate,
        "id_obra": stock ? stock : "",
        "id_usuario": user ? user.id_usuario : "",
        "cantidad": 0,
        "id_producto": productDefault.id_producto,
        "id_estadoOferta": 3
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
            default: break;
        }
        setOfertaForm((prevOferta) => ({ ...prevOferta, [name]: transformedValue }));
        console.log(ofertaForm);
    };

    useImperativeHandle(ref, () => ({
        getOfertaForm: () => ofertaForm
    }));

    return (
        <Card className="no-border-card">
            <Card.Body>
                <Form style={{marginLeft:"1rem"}}>
                    <h2 className='centered'>
                        {productDefault ? `Crear Oferta de ${productDefault.nombre}` : 'Crear Oferta'}
                    </h2>

                    { !productDefault && <Form.Group className="mb-2" controlId="formBasicProducto">
                        <Form.Label className="font-rubik" style={{ fontSize: '0.8rem' }}>Producto (*)</Form.Label>
                        <Form.Control name="producto" type="text" onBlur={handleInputChange} onChange={handleInputChange} placeholder="Ingrese el producto" />
                    </Form.Group>}

                    <Form.Group className="mb-2" controlId="formBasicFechaInicio">
                        <Form.Label className="font-rubik" style={{ fontSize: '0.8rem' }}>Fecha Inicio (*)</Form.Label>
                        <Form.Control style={{width:"70%", border:"1px solid grey"}} name="fechainicio" type="date" onBlur={handleInputChange} onChange={handleInputChange} defaultValue={formattedDate} min={formattedDate} />
                    </Form.Group>

                    <Form.Group className="mb-2" controlId="formBasicFechaFin">
                        <Form.Label className="font-rubik" style={{ fontSize: '0.8rem' }}>Fecha Vencimiento (*)</Form.Label>
                        <Form.Control style={{width:"70%", border:"1px solid grey"}} name="fechavencimiento" type="date" onBlur={handleInputChange} onChange={handleInputChange} defaultValue={formattedNextMonthDate} min={formattedDate} />
                        <p style={{fontSize:"0.7rem"}}><strong>Esta fecha está como el mes siguiente por defecto</strong></p>
                    </Form.Group>

                    <Form.Group className="mb-2" controlId="formBasicCantidad">
                        <Form.Label className="font-rubik" style={{ fontSize: '0.8rem' }}>Cantidad Pedida (*)</Form.Label>
                        <Form.Control style={{width:"70%", border:"1px solid grey"}} name="cantidad" type="number" onBlur={handleInputChange} onChange={handleInputChange} placeholder="Ingrese la cantidad" onKeyDown={(event) => {if (!/[0-9.]/.test(event.key) && !['Backspace', 'ArrowLeft', 'ArrowRight', 'Shift'].includes(event.key)) {event.preventDefault();}}}/>
                    </Form.Group>
                </Form>
            </Card.Body>
        </Card>
    );
});

export default OfertaCard;