import React, { useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import { Col, Row, Form, Card } from 'react-bootstrap';
import Cookies from 'js-cookie';
import SelectableCard from '../../cards/selectable_card/SelectableCard.jsx';
import fetchData from '../../../functions/fetchData.jsx';
import './PedidoCard.scss';

const PedidoCard = forwardRef(({ productDefault, user, stock, stocksDisponibles }, ref) => {
    const token = Cookies.get('token');
    const [isFormValid, setIsFormValid] = useState(false);

    const [obras, setObras] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [products, setProducts] = useState([]);
    
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
        const selectedValue = event.target.value;
        setSelectedCategory(selectedValue);
        setPedidoForm(prevForm => ({ ...prevForm, id_producto: "" }));
        handleFetchProducts(pedidoForm.id_obra, selectedValue);
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
    
        const errorFechaInicio = document.getElementById("errorFechaInicio");
        const errorFechaFin = document.getElementById("errorFechaFin");
        const errorCantidad = document.getElementById("errorCantidad");
        const errorUrgencia = document.getElementById("errorUrgencia");
        const errorRequestingObra = document.getElementById("errorRequestingObra");
        const errorProducto = document.getElementById("errorProducto");
    
        switch (name) {
            case 'cantidad':
            case 'urgente':
            case 'id_obra':
            case 'id_producto':
                transformedValue = parseInt(value, 10);
                break;
            default:
                break;
        }
    
        setPedidoForm(prevPedido => ({
            ...prevPedido,
            [name]: transformedValue,
            obras: name === 'id_obra' ? [] : prevPedido.obras // Deselecciona todas las obras si se cambia la obra
        }));

        setPedidoForm((prevPedido) => {
            const updatedForm = { ...prevPedido, [name]: transformedValue };
    
            if (name === 'id_obra') {
                updatedForm.obras = [];
            }
    
            console.log('Formulario de Pedido Actualizado:', updatedForm);
            return updatedForm;
        });
    
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
    
        if (name === "urgente") {
            if (value === "") {
                errorUrgencia.innerHTML = "Urgencia es requerida";
                formIsValid = false;
            } else {
                errorUrgencia.innerHTML = "&nbsp;";
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
    
    

    const handleCardSelection = (key) => {
        const errorObrasRequested = document.getElementById("errorObrasRequested");

        setPedidoForm(prevForm => {
            const isAlreadySelected = prevForm.obras.includes(key);
            const updatedObras = isAlreadySelected
                ? prevForm.obras.filter(k => k !== key)
                : [key, ...prevForm.obras];
            
            return {
                ...prevForm,
                obras: updatedObras
            };

            if (updatedObras.length === 0) {
                errorObrasRequested.innerHTML = "Debe seleccionar al menos una obra";
                setIsFormValid(false);
            } else {
                errorObrasRequested.innerHTML = "&nbsp;";
            }

            console.log('Formulario de Pedido Actualizado:', updatedForm);
            return updatedForm;
        });

        setObras(prevObras => {
            const selectedObra = prevObras.find(obra => obra.id_obra.id_obra === key);
            const remainingObras = prevObras.filter(obra => obra.id_obra.id_obra !== key);
            return [selectedObra, ...remainingObras];
        });
    };

    // Reordenar las obras: las seleccionadas al principio
    const orderedObras = [...obras].sort((a, b) => {
        const aIsSelected = pedidoForm.obras.includes(a.id_obra.id_obra);
        const bIsSelected = pedidoForm.obras.includes(b.id_obra.id_obra);
        return aIsSelected && !bIsSelected ? -1 : !aIsSelected && bIsSelected ? 1 : 0;
    });

    useImperativeHandle(ref, () => ({
        getPedidoForm: () => pedidoForm
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
                                <Form.Label id='errorFechaInicio' style={{ marginBottom:"0px", fontSize: '0.8rem', color: 'red' }}>&nbsp;</Form.Label>
                            </Form.Group>

                            <Form.Group className="mb-2" controlId="formBasicFechaFin">
                                <Form.Label className="font-rubik" style={{ fontSize: '0.8rem' }}>Fecha Vencimiento (*)</Form.Label>
                                <Form.Control name="fechavencimiento" type="date" onBlur={handleInputChange} onChange={handleInputChange} defaultValue={formattedNextMonthDate} min={formattedDate} />
                                <p style={{fontSize: '0.7rem', margin:"0px"}}><strong>Esta fecha está como el mes siguiente por defecto</strong></p>
                                <Form.Label id='errorFechaFin' style={{ marginBottom:"0px", fontSize: '0.8rem', color: 'red' }}>&nbsp;</Form.Label>
                            </Form.Group>

                            <Form.Group className="mb-2" controlId="formBasicCantidad">
                                <Form.Label className="font-rubik" style={{ fontSize: '0.8rem' }}>Cantidad Pedida (*)</Form.Label>
                                <Form.Control name="cantidad" type="number" onBlur={handleInputChange} onChange={handleInputChange} placeholder="Ingrese la cantidad" onKeyDown={(event) => {if (!/[0-9.]/.test(event.key) && !['Backspace', 'ArrowLeft', 'ArrowRight', 'Shift'].includes(event.key)) {event.preventDefault();}}}/>
                                <Form.Label id='errorCantidad' style={{ marginBottom:"0px", fontSize: '0.8rem', color: 'red' }}>&nbsp;</Form.Label>
                            </Form.Group>

                            <Form.Group className="mb-2" controlId="formBasicUrgencia">
                                <Form.Label className="font-rubik" style={{ fontSize: '0.8rem' }}>Urgencia (*)</Form.Label>
                                <Form.Control name="urgente" as="select" onBlur={handleInputChange} onChange={handleInputChange}>
                                    <option value='' hidden>Urgencia</option>
                                    <option value="1">No es urgente</option>
                                    <option value="2">Ligeramente Urgente</option>
                                    <option value="3">Muy Urgente</option>
                                    <option value="4">Inmediato</option>
                                </Form.Control>
                                <Form.Label id='errorUrgencia' style={{ marginBottom:"0px", fontSize: '0.8rem', color: 'red' }}>&nbsp;</Form.Label>
                            </Form.Group>

                            {!stock && (
                                <Form.Group className="mb-2" controlId="formBasicRequestingObra">
                                    <Form.Label className="font-rubik" style={{ fontSize: '0.8rem' }}>Obra que Pide (*)</Form.Label>
                                    <Form.Control name="id_obra" as="select" onBlur={handleInputChange} onChange={handleInputChange} defaultValue="">
                                        <option value='' hidden>Seleccione una Obra</option>
                                        {stocksDisponibles.map(stock => (
                                            <option key={stock.stock[0].id_stock} value={stock.stock[0].id_stock}>{stock.stock[0].id_obra.nombre}</option>
                                        ))}
                                    </Form.Control>
                                    <Form.Label id='errorRequestingObra' style={{ marginBottom:"0px", fontSize: '0.8rem', color: 'red' }}>&nbsp;</Form.Label>
                                </Form.Group>
                            )}

                            {!stock && (pedidoForm.id_obra != "") && (pedidoForm.id_obra) && (
                                <Form.Group className="mb-2" controlId="formBasicCategoria">
                                    <Form.Label className="font-rubik" style={{ fontSize: '0.8rem' }}>Categoría (*)</Form.Label>
                                    <Form.Control name="categoria" as="select" value={selectedCategory} onBlur={handleInputChange} onChange={handleCategoryChange}>
                                        <option value='' hidden>Categoria</option>
                                        {categories.map(categoria => (
                                            <option key={categoria.id_categoria} value={categoria.id_categoria}>{categoria.nombre}</option>
                                        ))}
                                    </Form.Control>
                                    <Form.Label id='errorCategoria' style={{ marginBottom:"0px", fontSize: '0.8rem', color: 'red' }}>&nbsp;</Form.Label>
                                </Form.Group>
                            )}

                            {!stock && (pedidoForm.id_obra != "") && (pedidoForm.id_obra) && (selectedCategory != "")  && (selectedCategory) && (products != null) && (
                                <Form.Group className="mb-2" controlId="formBasicProducto">
                                    <Form.Label className="font-rubik" style={{ fontSize: '0.8rem' }}>Producto (*)</Form.Label>
                                    <Form.Control name="id_producto" as="select" defaultValue="" onBlur={handleInputChange} onChange={handleInputChange}>
                                        <option value='' hidden>Producto</option>
                                        {products.map(product => (
                                            <option key={product.id_producto} value={product.id_producto}>{product.nombre}</option>
                                        ))}
                                    </Form.Control>
                                    <Form.Label id='errorProducto' style={{ marginBottom:"0px", fontSize: '0.8rem', color: 'red' }}>&nbsp;</Form.Label>
                                </Form.Group>
                            )}
                        </Col>
                        <Col xs={12} md={6}>
                            <Form.Group style={{marginTop:"13%"}} className="mb-2" controlId="formBasicObras">
                                <Form.Label className="font-rubik" style={{ fontSize: '0.8rem' }}>Obras Pedidas (*)</Form.Label>
                                <div className='cardscasas'>
                                    {orderedObras
                                        .filter(obra => obra.id_obra.id_obra !== pedidoForm.id_obra) // Filtra la obra seleccionada
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
                                <Form.Label id='errorObrasRequested' style={{ marginBottom:"0px", fontSize: '0.8rem', color: 'red' }}>&nbsp;</Form.Label>
                            </Form.Group>
                        </Col>
                    </Row>
                </Form>
            </Card.Body>
        </Card>
    );
});

export default PedidoCard;
