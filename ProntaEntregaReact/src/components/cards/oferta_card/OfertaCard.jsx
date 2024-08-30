import React, { useEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react';
import { InputGroup, Col, Row, Form, Container, Card } from 'react-bootstrap';
import Cookies from 'js-cookie';
import fetchData from '../../../functions/fetchData';

import './OfertaCard.scss';

const OfertaCard = forwardRef(({ productDefault, user, stock,  stocksDisponibles}, ref) => {
    const token = Cookies.get('token');
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [products, setProducts] = useState([]);

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
        "id_producto": productDefault ? productDefault.id_producto : "",
        "id_estadoOferta": 1
    });

    useEffect(() => {
        fetchData('categoria/', token).then((result) => {
            setCategories(result);
        }).catch(error => {
            console.error('Error fetching categories:', error);
        });
    }, [token]);

    const handleCategoryChange = (event) => {
        const selectedValue = event.target.value;
        setSelectedCategory(selectedValue);
        setOfertaForm((prevOferta) => { return { ...prevOferta, id_producto: "" }; });
        handleFetchProducts(ofertaForm.id_obra, selectedValue);
    };
    
    const handleFetchProducts = (id_stock, id_categoria) => {
        fetchData(`GetDetallestockproducto_Total/${id_stock}/${id_categoria}/`, token).then((result) => {
            setProducts(result);
        }).catch(error => {
            console.error('Error fetching products:', error);
        });
    };
    
    const resetCategoryAndProducts = () => {
        setSelectedCategory("");
        setProducts([]);
    };
    
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        let transformedValue = value;
        let formIsValid = true;
    
        switch (name) {
            case 'cantidad': case 'urgente': case 'id_obra': case 'id_producto':
                transformedValue = parseInt(value, 10); break;
            default: break;
        }
    
        setOfertaForm((prevOferta) => ({ ...prevOferta, [name]: transformedValue }));
        console.log(ofertaForm);

        if (name === "cantidad") {
            const regex = /^[0-9]+$/;
            if (value === "") {
                errorCantidad.innerHTML = "La cantidad no puede estar vacía";
                formIsValid = false;
            } else {
                errorCantidad.innerHTML = !regex.test(value) ? "La cantidad es inválida" : "&nbsp;";
            }
        }
    
        if (name === "fechainicio") {
            if (value === "") {
                errorFechaInicio.innerHTML = "Fecha de inicio es requerida";
                formIsValid = false;
            } else if (value < formattedDate) {
                errorFechaInicio.innerHTML = "La fecha de inicio no puede ser menor a la fecha de hoy";
                formIsValid = false;
            } else {
                errorFechaInicio.innerHTML = "&nbsp;";
            }
        }
    
        if (name === "fechavencimiento") {
            if (value === "") {
                errorFechaFin.innerHTML = "Fecha de vencimiento es requerida";
                formIsValid = false;
            } else if (value < formattedDate) {
                errorFechaFin.innerHTML = "La fecha de vencimiento no puede ser menor a la fecha de hoy";
                formIsValid = false;
            } else {
                errorFechaFin.innerHTML = "&nbsp;";
            }
        }
    
        if (name === "id_obra") {
            resetCategoryAndProducts();
            if (value === "") {
                errorRequestingObra.innerHTML = "Obra es requerida";
                formIsValid = false;
            } else {
                errorRequestingObra.innerHTML = "&nbsp;";
            }
        }
    
        if (name === "cantidad") {
            if (value <= 0 || value === "") {
                errorCantidad.innerHTML = "Debe ingresar una cantidad mayor que 0";
                formIsValid = false;
            } else {
                errorCantidad.innerHTML = "&nbsp;";
            }
        }
    
        if (name === "id_producto") {
            if (value === "") {
                errorProducto.innerHTML = "Producto es requerido";
                formIsValid = false;
            } else {
                errorProducto.innerHTML = "&nbsp;";
            }
        }

        setIsFormValid(formIsValid);
        console.log(formIsValid);
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

                    <Form.Group className="mb-2" controlId="formBasicFechaInicio">
                        <Form.Label className="font-rubik" style={{ fontSize: '0.8rem' }}>Fecha Inicio (*)</Form.Label>
                        <Form.Control style={{width:"70%", border:"1px solid grey"}} name="fechainicio" type="date" onBlur={handleInputChange} onChange={handleInputChange} defaultValue={formattedDate} min={formattedDate} />
                        <Form.Label id='errorFechaInicio' style={{ marginBottom:"0px", fontSize: '0.8rem', color: 'red' }}>&nbsp;</Form.Label>
                    </Form.Group>

                    <Form.Group className="mb-2" controlId="formBasicFechaFin">
                        <Form.Label className="font-rubik" style={{ fontSize: '0.8rem' }}>Fecha Vencimiento (*)</Form.Label>
                        <Form.Control style={{width:"70%", border:"1px solid grey"}} name="fechavencimiento" type="date" onBlur={handleInputChange} onChange={handleInputChange} defaultValue={formattedNextMonthDate} min={formattedDate} />
                        <p style={{fontSize:"0.7rem"}}><strong>Esta fecha está como el mes siguiente por defecto</strong></p>
                        <Form.Label id='errorFechaFin' style={{ marginBottom:"0px", fontSize: '0.8rem', color: 'red' }}>&nbsp;</Form.Label>
                    </Form.Group>

                    <Form.Group className="mb-2" controlId="formBasicCantidad">
                        <Form.Label className="font-rubik" style={{ fontSize: '0.8rem' }}>Cantidad Ofrecida (*)</Form.Label>
                        <Form.Control style={{width:"70%", border:"1px solid grey"}} name="cantidad" type="number" onBlur={handleInputChange} onChange={handleInputChange} placeholder="Ingrese la cantidad" onKeyDown={(event) => {if (!/[0-9.]/.test(event.key) && !['Backspace', 'ArrowLeft', 'ArrowRight', 'Shift'].includes(event.key)) {event.preventDefault();}}}/>
                        <Form.Label id='errorCantidad' style={{ marginBottom:"0px", fontSize: '0.8rem', color: 'red' }}>&nbsp;</Form.Label>
                    </Form.Group>

                    {!stock && (
                        <Form.Group className="mb-2" controlId="formBasicUrgencia">
                            <Form.Label className="font-rubik" style={{ fontSize: '0.8rem' }}>Obra que Ofrece (*)</Form.Label>
                            <Form.Control style={{width:"70%", border:"1px solid grey"}} name="id_obra" as="select" onChange={handleInputChange} defaultValue="">
                                <option value="" hidden>Seleccione una Obra</option>
                                {stocksDisponibles.map(stock => (
                                    <option key={stock.id_stock} value={stock.id_stock}>{stock.id_obra.nombre}</option>
                                ))}
                            </Form.Control>
                            <Form.Label id='errorRequestingObra' style={{ marginBottom:"0px", fontSize: '0.8rem', color: 'red' }}>&nbsp;</Form.Label>
                        </Form.Group>
                    )}

                    {!stock && (ofertaForm.id_obra != "") && (
                        <Form.Group className="mb-2" controlId="formBasicCategoria">
                            <Form.Label className="font-rubik" style={{ fontSize: '0.8rem' }}>Categoría (*)</Form.Label>
                            <Form.Control style={{width:"70%", border:"1px solid grey"}} name="categoria" as="select" value={selectedCategory} onChange={handleCategoryChange}>
                                <option value="" hidden>Categoría</option>
                                {categories.map(categoria => (
                                    <option key={categoria.id_categoria} value={categoria.id_categoria}>{categoria.nombre}</option>
                                ))}
                            </Form.Control>
                            <Form.Label id='errorCategoria' style={{ marginBottom:"0px", fontSize: '0.8rem', color: 'red' }}>&nbsp;</Form.Label>
                        </Form.Group>
                    )}

                    {!stock && (ofertaForm.id_obra != "") && (selectedCategory != "") && (products != null) && (
                        <Form.Group className="mb-2" controlId="formBasicProducto">
                            <Form.Label className="font-rubik" style={{ fontSize: '0.8rem' }}>Producto (*)</Form.Label>
                            <Form.Control style={{width:"70%", border:"1px solid grey"}} name="id_producto" as="select" defaultValue="" onChange={handleInputChange}>
                                <option value="" hidden>Producto</option>
                                {products.map(product => (
                                    <option key={product.id_producto} value={product.id_producto}>{product.nombre}</option>
                                ))}
                            </Form.Control>
                            <Form.Label id='errorProducto' style={{ marginBottom:"0px", fontSize: '0.8rem', color: 'red' }}>&nbsp;</Form.Label>
                        </Form.Group>
                    )}
                </Form>
            </Card.Body>
        </Card>
    );
});

export default OfertaCard;