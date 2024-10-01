import React, { useEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react';
import { InputGroup, Col, Row, Form, Container, Card } from 'react-bootstrap';
import Cookies from 'js-cookie';
import fetchData from '../../../functions/fetchData';

import './OfertaCard.scss';

const OfertaCard = forwardRef(({ productDefault, user, stock, stocksDisponibles }, ref) => {
    const token = Cookies.get('token');
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [products, setProducts] = useState([]);
    const [isFormValid, setIsFormValid] = useState(false);

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
        if (event.target.value === "") {
            setProducts([]);
            setSelectedCategory("");
            document.getElementById('errorCategoria').innerHTML = "Debe seleccionar una categoría";
            return;
        }
        const selectedValue = event.target.value;
        setSelectedCategory(selectedValue);
        setOfertaForm((prevOferta) => { return { ...prevOferta, id_producto: "" }; });
        handleFetchProducts(ofertaForm.id_obra, selectedValue);
        document.getElementById('errorCategoria').innerHTML = "&nbsp;";
    };
    
    const handleFetchProducts = (id_stock, id_categoria) => {
        fetchData(`GetDetallestockproducto_Total/${id_stock}/${id_categoria}/`, token).then((result) => {
            setProducts(result);
        }).catch(error => {
            console.error('Error fetching products:', error);
        });
    };
    
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        let transformedValue = value;
    
        console.log('Input change:', name, value);
    
        switch (name) {
            case 'cantidad':
            case 'id_obra':
            case 'id_producto':
                transformedValue = parseInt(value, 10);
                break;
            default:
                break;
        }
    
        setOfertaForm(prevOferta => {
            let updatedForm = { 
                ...prevOferta, 
                [name]: transformedValue
            };
            
            if (updatedForm.fechainicio > updatedForm.fechavencimiento) {
                updatedForm = { 
                    ...updatedForm, 
                    "fechavencimiento": updatedForm.fechainicio
                };
            }
    
            if (name === 'id_obra') {
                updatedForm.id_producto = "";
                setSelectedCategory("");
                setProducts([]);
            }
    
            const { formIsValid, errors } = validateForm(updatedForm);
            setIsFormValid(formIsValid);
    
            const errorElement = document.getElementById(`error${name.charAt(0).toUpperCase() + name.slice(1)}`);
            if (errorElement) errorElement.innerHTML = errors[name] || "&nbsp;";
    
            return updatedForm;
        });
    };

    const validateForm = (form) => {
        const errors = {
            cantidad: "",
            fechainicio: "",
            fechavencimiento: "",
            id_obra: "",
            id_producto: "",
            categoria: ""
        };
    
        let formIsValid = true;
    
        if (form.cantidad === "" || form.cantidad <= 0 || isNaN(form.cantidad)) {
            formIsValid = false;
            errors.cantidad = "Debe ingresar una cantidad mayor que 0";
        }
    
        if (form.fechainicio === "" || isNaN(new Date(form.fechainicio).getTime())) {
            formIsValid = false;
            errors.fechainicio = "Fecha de inicio es requerida";
        } else if (form.fechainicio < formattedDate) {
            formIsValid = false;
            errors.fechainicio = "Fecha de inicio no puede ser menor a la fecha de hoy";
        }
    
        if (form.fechavencimiento === "" || isNaN(new Date(form.fechavencimiento).getTime())) {
            formIsValid = false;
            errors.fechavencimiento = "Fecha de vencimiento es requerida";
        } else if (form.fechavencimiento < formattedDate) {
            formIsValid = false;
            errors.fechavencimiento = "Fecha de vencimiento no puede ser menor a la fecha de hoy";
        }
    
        if (form.id_obra === "" || isNaN(form.id_obra)) {
            formIsValid = false;
            errors.id_obra = "Obra es requerida";
        }
    
        if (form.id_producto === "" || isNaN(form.id_producto)) {
            formIsValid = false;
            errors.id_producto = "Producto es requerido";
        }
    
        console.log('Form validation result:', formIsValid, errors);
        return { formIsValid, errors };
    };

    useImperativeHandle(ref, () => ({
        getOfertaForm: () => ofertaForm,
        isFormValid
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
                        <Form.Label id='errorFechainicio' style={{ marginBottom:"0px", fontSize: '0.8rem', color: 'red' }}>&nbsp;</Form.Label>
                    </Form.Group>

                    <Form.Group className="mb-2" controlId="formBasicFechaFin">
                        <Form.Label className="font-rubik" style={{ fontSize: '0.8rem' }}>Fecha Vencimiento (*)</Form.Label>
                        <Form.Control style={{width:"70%", border:"1px solid grey"}} name="fechavencimiento" type="date" onBlur={handleInputChange} onChange={handleInputChange} value={ofertaForm.fechavencimiento} min={ofertaForm.fechainicio} />
                        <p style={{fontSize:"0.7rem", margin:"0px"}}><strong>Esta fecha está como el mes siguiente por defecto</strong></p>
                        <Form.Label id='errorFechavencimiento' style={{ marginBottom:"0px", fontSize: '0.8rem', color: 'red' }}>&nbsp;</Form.Label>
                    </Form.Group>

                    <Form.Group className="mb-2" controlId="formBasicCantidad">
                        <Form.Label className="font-rubik" style={{ fontSize: '0.8rem' }}>Cantidad Ofrecida (*)</Form.Label>
                        <Form.Control style={{width:"70%", border:"1px solid grey"}} name="cantidad" type="number" onBlur={handleInputChange} onChange={handleInputChange} placeholder="Ingrese la cantidad" onKeyDown={(event) => {if (!/[0-9.]/.test(event.key) && !['Backspace', 'ArrowLeft', 'ArrowRight', 'Shift'].includes(event.key)) {event.preventDefault();}}}/>
                        <Form.Label id='errorCantidad' style={{ marginBottom:"0px", fontSize: '0.8rem', color: 'red' }}>&nbsp;</Form.Label>
                    </Form.Group>

                    {!stock && (
                        <Form.Group className="mb-2" controlId="formRequestingObra">
                            <Form.Label className="font-rubik" style={{ fontSize: '0.8rem' }}>Obra que Ofrece (*)</Form.Label>
                            <Form.Control style={{width:"70%", border:"1px solid grey"}} name="id_obra" as="select" onBlur={handleInputChange} onChange={handleInputChange} defaultValue="">
                                <option value="" hidden>Seleccione una Obra</option>
                                {stocksDisponibles.map(stock => (
                                    <option key={stock.id_stock} value={stock.id_stock}>{stock.id_obra.nombre}</option>
                                ))}
                            </Form.Control>
                            <Form.Label id='errorId_obra' style={{ marginBottom:"0px", fontSize: '0.8rem', color: 'red' }}>&nbsp;</Form.Label>
                        </Form.Group>
                    )}

                    {!stock && (ofertaForm.id_obra != "") && (ofertaForm.id_obra) && (!isNaN(ofertaForm.id_obra)) && (
                        <Form.Group className="mb-2" controlId="formBasicCategoria">
                            <Form.Label className="font-rubik" style={{ fontSize: '0.8rem' }}>Categoría (*)</Form.Label>
                            <Form.Control style={{width:"70%", border:"1px solid grey"}} name="categoria" as="select" value={selectedCategory} onBlur={handleCategoryChange} onChange={handleCategoryChange}>
                                <option value="" hidden>Categoría</option>
                                {categories.map(categoria => (
                                    <option key={categoria.id_categoria} value={categoria.id_categoria}>{categoria.nombre}</option>
                                ))}
                            </Form.Control>
                            <Form.Label id='errorCategoria' style={{ marginBottom:"0px", fontSize: '0.8rem', color: 'red' }}>&nbsp;</Form.Label>
                        </Form.Group>
                    )}

                    {!stock && (ofertaForm.id_obra != "") && (ofertaForm.id_obra) && (!isNaN(ofertaForm.id_obra)) && (selectedCategory != "")  && (selectedCategory) && (!isNaN(selectedCategory)) && (products != null) && (
                        <Form.Group className="mb-2" controlId="formBasicProducto">
                            <Form.Label className="font-rubik" style={{ fontSize: '0.8rem' }}>Producto (*)</Form.Label>
                            <Form.Control style={{width:"70%", border:"1px solid grey"}} name="id_producto" as="select" defaultValue="" onBlur={handleInputChange} onChange={handleInputChange}>
                                <option value="" hidden>Producto</option>
                                {products.map(product => (
                                    <option key={product.id_producto} value={product.id_producto}>{product.nombre}</option>
                                ))}
                            </Form.Control>
                            <Form.Label id='errorId_producto' style={{ marginBottom:"0px", fontSize: '0.8rem', color: 'red' }}>&nbsp;</Form.Label>
                        </Form.Group>
                    )}
                </Form>
            </Card.Body>
        </Card>
    );
});

export default OfertaCard;