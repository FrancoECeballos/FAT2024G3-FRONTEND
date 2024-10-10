import React, { useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import { Col, Row, Form, Card, Button } from 'react-bootstrap';
import Cookies from 'js-cookie';
import SelectableCard from '../../cards/selectable_card/SelectableCard.jsx';
import fetchData from '../../../functions/fetchData.jsx';
import './PedidoCard.scss';

import Semaforo from '../../semaforo/Semaforo.jsx';

const PedidoCard = forwardRef(({ productDefault, user, stock, stocksDisponibles }, ref) => {
    const token = Cookies.get('token');
    const [isFormValid, setIsFormValid] = useState(false);

    const [obras, setObras] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [products, setProducts] = useState([]);
    const [urgencia, setUrgencia] = useState(0);
    const [allSelected, setAllSelected] = useState(false);
    
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
        "urgente": "",
        "id_producto": productDefault ? productDefault.id_producto: "",
        "id_estadoPedido": 3,
        "obras": []
    });

    useEffect(() => {
        fetchData('stock/').then((data) => {
            setObras(data);
        });

        fetchData('categoria/', token).then((result) => {
            setCategories(result);
        }).catch(error => {
            console.error('Error fetching categories:', error);
        });
    }, []);        

    const handleCategoryChange = (event) => {
        if (event.target.value === "") {
            setProducts([]);
            setSelectedCategory("");
            document.getElementById('errorCategoria').innerHTML = "Debe seleccionar una categoría";
            return;
        }
        const selectedValue = event.target.value;
        setSelectedCategory(selectedValue);
        setPedidoForm(prevForm => ({ ...prevForm, id_producto: "" }));
        handleFetchProducts(pedidoForm.id_obra, selectedValue);
        document.getElementById('errorCategoria').innerHTML = "&nbsp;";
    };

    const handleFetchProducts = (id_stock, id_categoria) => {
        fetchData(`producto/categoria/${id_categoria}/`, token).then((result) => {
            setProducts(result);
        }).catch(error => {
            console.error('Error fetching products:', error);
        });
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        let transformedValue = value;
    
        switch (name) {
            case 'cantidad':
            case 'id_obra':
            case 'id_producto':
                transformedValue = parseInt(value, 10);
                break;
            default:
                break;
        }
    
        setPedidoForm(prevPedido => {
            let updatedForm = { 
                ...prevPedido, 
                [name]: transformedValue,
                obras: name === 'id_obra' ? [] : prevPedido.obras
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
    
            const { formIsValid, errors } = validateForm(updatedForm);
            setIsFormValid(formIsValid);
    
            const errorElement = document.getElementById('errorObrasRequested');
            if (errorElement) errorElement.innerHTML = errors.obras || "&nbsp;";
    
            return updatedForm;
        });
    
        setObras(prevObras => {
            const selectedObra = prevObras.find(obra => obra.id_obra.id_obra === key);
            const remainingObras = prevObras.filter(obra => obra.id_obra.id_obra !== key);
            return selectedObra ? [selectedObra, ...remainingObras] : remainingObras;
        });
    };

    const handleSelectAllObras = () => {
        const allObrasIds = orderedObras.map(obra => obra.id_obra.id_obra);
        const allSelected = allObrasIds.every(id => pedidoForm.obras.includes(id));
        
        setPedidoForm(prevForm => {
            const updatedForm = {
                ...prevForm,
                obras: allSelected ? [] : allObrasIds
            };
    
            const { formIsValid, errors } = validateForm(updatedForm);
            setIsFormValid(formIsValid);
    
            const errorElement = document.getElementById('errorObrasRequested');
            if (errorElement) errorElement.innerHTML = errors.obras || "&nbsp;";
    
            return updatedForm;
        });

        setAllSelected(!allSelected);
    };

    const validateForm = (form) => {
        const errors = {
            cantidad: "",
            fechainicio: "",
            fechavencimiento: "",
            id_obra: "",
            urgente: "",
            id_producto: "",
            categoria: "",
            obras: ""
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
    
        if (form.urgente === "" || isNaN(form.urgente)) {
            formIsValid = false;
            errors.urgente = "Urgencia es requerida";
        }
    
        if (form.id_producto === "" || isNaN(form.id_producto)) {
            formIsValid = false;
            errors.id_producto = "Producto es requerido";
        }
    
        if (form.obras.length === 0) {
            formIsValid = false;
            errors.obras = "Debe seleccionar al menos una obra";
        }
    
        console.log('Form validation result:', formIsValid, errors);
        return { formIsValid, errors };
    };


    const orderedObras = [...obras].sort((a, b) => {
        const aIsSelected = pedidoForm.obras.includes(a.id_obra.id_obra);
        const bIsSelected = pedidoForm.obras.includes(b.id_obra.id_obra);
        return aIsSelected && !bIsSelected ? -1 : !aIsSelected && bIsSelected ? 1 : 0;
    });

    useImperativeHandle(ref, () => ({
        getPedidoForm: () => pedidoForm,
        isFormValid
    }));

    return (
        <Card className='no-border-card' style={{ width: '100%' }}>
            <Card.Body>
                <Form>
                    <Row className="g-0">
                        <Col xs={12} md={5} style={{marginRight:"2rem"}}>
                            <h2>
                                {productDefault ? `Crear Pedido de ${productDefault.nombre}` : 'Crear Pedido'}
                            </h2>

                            <Form.Group className="mb-2" controlId="formBasicFechaInicio">
                                <Form.Label className="font-rubik" style={{ fontSize: '0.8rem' }}>Fecha Inicio (*)</Form.Label>
                                <Form.Control name="fechainicio" type="date" onBlur={handleInputChange} onChange={handleInputChange} defaultValue={formattedDate} min={formattedDate} />
                                <Form.Label id='errorFechainicio' style={{ marginBottom:"0px", fontSize: '0.8rem', color: 'red' }}>&nbsp;</Form.Label>
                            </Form.Group>

                            <Form.Group className="mb-2" controlId="formBasicFechaFin">
                                <Form.Label className="font-rubik" style={{ fontSize: '0.8rem' }}>Fecha Vencimiento (*)</Form.Label>
                                <Form.Control name="fechavencimiento" type="date" onBlur={handleInputChange} onChange={handleInputChange} value={pedidoForm.fechavencimiento} min={pedidoForm.fechainicio} />
                                <p style={{fontSize: '0.7rem', margin:"0px"}}><strong>Esta fecha está como el mes siguiente por defecto</strong></p>
                                <Form.Label id='errorFechavencimiento' style={{ marginBottom:"0px", fontSize: '0.8rem', color: 'red' }}>&nbsp;</Form.Label>
                            </Form.Group>

                            <Form.Group className="mb-2" controlId="formBasicCantidad">
                                <Form.Label className="font-rubik" style={{ fontSize: '0.8rem' }}>Cantidad Pedida (*)</Form.Label>
                                <Form.Control name="cantidad" type="number" onBlur={handleInputChange} onChange={handleInputChange} placeholder="Ingrese la cantidad" onKeyDown={(event) => {if (!/[0-9.]/.test(event.key) && !['Backspace', 'ArrowLeft', 'ArrowRight', 'Shift'].includes(event.key)) {event.preventDefault();}}}/>
                                <Form.Label id='errorCantidad' style={{ marginBottom:"0px", fontSize: '0.8rem', color: 'red' }}>&nbsp;</Form.Label>
                            </Form.Group>

                            <Form.Group className="mb-2" controlId="formBasicUrgencia">
                                <Form.Label className="font-rubik" style={{ fontSize: '0.8rem' }}>Urgencia (*)</Form.Label>
                                <Form.Control name="urgente" as="select" onBlur={handleInputChange} onChange={handleInputChange}>
                                    <option value='' onClick={() => setUrgencia(0)} hidden>Urgencia</option>
                                    <option value="1" onClick={() => setUrgencia(1)}>Ligera</option>
                                    <option value="2" onClick={() => setUrgencia(2)}>Moderada</option>
                                    <option value="3" onClick={() => setUrgencia(3)}>Extrema</option>
                                </Form.Control>
                                <Form.Label id='errorUrgente' style={{ marginBottom:"0px", fontSize: '0.8rem', color: 'red' }}>&nbsp;</Form.Label>
                                <Semaforo urgencia={urgencia} />
                            </Form.Group>

                            {!stock && (
                                <Form.Group className="mb-2" controlId="formBasicRequestingObra">
                                    <Form.Label className="font-rubik" style={{ fontSize: '0.8rem' }}>Obra que Pide (*)</Form.Label>
                                    <Form.Control name="id_obra" as="select" onBlur={handleInputChange} onChange={handleInputChange} defaultValue="">
                                        <option value='' hidden>Seleccione una Obra</option>
                                        {stocksDisponibles.map(stock => (
                                            stock.stock && stock.stock.length > 0 && (
                                                <option key={stock.stock[0].id_stock} value={stock.stock[0].id_stock}>
                                                    {stock.stock[0].id_obra.nombre}
                                                </option>
                                            )
                                        ))}
                                    </Form.Control>
                                    <Form.Label id='errorId_obra' style={{ marginBottom:"0px", fontSize: '0.8rem', color: 'red' }}>&nbsp;</Form.Label>
                                </Form.Group>
                            )}

                            {!stock && (pedidoForm.id_obra != "") && (pedidoForm.id_obra) && (!isNaN(pedidoForm.id_obra)) && (
                                <Form.Group className="mb-2" controlId="formBasicCategoria">
                                    <Form.Label className="font-rubik" style={{ fontSize: '0.8rem' }}>Categoría (*)</Form.Label>
                                    <Form.Control name="categoria" as="select" value={selectedCategory} onBlur={handleCategoryChange} onChange={handleCategoryChange}>
                                        <option value='' hidden>Categoria</option>
                                        {categories.map(categoria => (
                                            <option key={categoria.id_categoria} value={categoria.id_categoria}>{categoria.nombre}</option>
                                        ))}
                                    </Form.Control>
                                    <Form.Label id='errorCategoria' style={{ marginBottom:"0px", fontSize: '0.8rem', color: 'red' }}>&nbsp;</Form.Label>
                                </Form.Group>
                            )}

                            {!stock && (pedidoForm.id_obra != "") && (pedidoForm.id_obra) && (!isNaN(pedidoForm.id_obra)) && (selectedCategory != "")  && (selectedCategory) && (!isNaN(selectedCategory)) && (products != null) && (
                                <Form.Group className="mb-2" controlId="formBasicProducto">
                                    <Form.Label className="font-rubik" style={{ fontSize: '0.8rem' }}>Producto (*)</Form.Label>
                                    <Form.Control name="id_producto" as="select" defaultValue="" onBlur={handleInputChange} onChange={handleInputChange}>
                                        <option value='' hidden>Producto</option>
                                        {products.map(product => (
                                            <option key={product.id_producto} value={product.id_producto}>{product.nombre}</option>
                                        ))}
                                    </Form.Control>
                                    <Form.Label id='errorId_producto' style={{ marginBottom:"0px", fontSize: '0.8rem', color: 'red' }}>&nbsp;</Form.Label>
                                </Form.Group>
                            )}
                        </Col>
                        <Col xs={12} md={6}>
                            <Form.Group style={{marginTop:"13%"}} className="mb-2" controlId="formBasicObras">
                                <Form.Label className="font-rubik" style={{ fontSize: '0.8rem' }}>Obras Pedidas (*)</Form.Label>
                                <div className='cardscasas'>
                                    {orderedObras
                                        .filter(obra => obra.id_obra.id_obra !== pedidoForm.id_obra)
                                        .map(obra => (
                                            <SelectableCard 
                                                mar={"0.2rem"} 
                                                pad={"0px"} 
                                                height={"5rem"} 
                                                wide={"98%"} 
                                                key={obra.id_obra.id_obra} 
                                                id={obra.id_obra.id_obra} 
                                                titulo={obra.id_obra.nombre} 
                                                foto={obra.id_obra.imagen} 
                                                onCardSelect={handleCardSelection} 
                                                isSelected={pedidoForm.obras.includes(obra.id_obra.id_obra)}
                                            />
                                        ))}
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                                    <Button variant="link" onClick={handleSelectAllObras} style={{ fontSize: '0.8rem', padding: 0 }}>
                                    {allSelected ? 'Deseleccionar todas las obras' : 'Seleccionar todas las obras'}
                                    </Button>
                                    <Form.Label id='errorObrasRequested' style={{ marginBottom: "0px", fontSize: '0.8rem', color: 'red' }}>
                                        &nbsp;
                                    </Form.Label>
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