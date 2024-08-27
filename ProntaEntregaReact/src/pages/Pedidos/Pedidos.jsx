import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form } from 'react-bootstrap';
import Cookies from 'js-cookie';
import FullNavbar from '../../components/navbar/full_navbar/FullNavbar.jsx';
import GenericCard from '../../components/cards/generic_card/GenericCard.jsx';
import SearchBar from '../../components/searchbar/searchbar.jsx';
import fetchData from '../../functions/fetchData';
import fetchUser from '../../functions/fetchUser';
import deleteData from '../../functions/deleteData.jsx';
import Modal from '../../components/modals/Modal.jsx';
import PedidoCard from '../../components/cards/pedido_card/PedidoCard.jsx';
import GenericAccordion from '../../components/accordions/generic_accordion/GenericAccordion.jsx';
import postData from '../../functions/postData.jsx';
import { Icon } from '@iconify/react';

function Pedidos() {
    const navigate = useNavigate();
    const token = Cookies.get('token');
    const [pedidos, setPedidos] = useState([]);
    const [selectedPedidoId, setSelectedPedidoId] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [orderCriteria, setOrderCriteria] = useState(null);
    const [user, setUser] = useState(fetchUser());

    const [formData, setFormData] = useState({
        producto: "",
        obra: "",
        usuario: "",
        urgencia: 1,
        cantidad: ""
    });

    useEffect(() => {
        if (!token) {
            navigate('/login');
            return;
        }

        fetchData(`/userToken/${token}`, token).then((result) => {
            if (result.is_superuser) {
                fetchData(`get_pedido_for_admin/`, token).then((result) => {
                    setPedidos(result);
                }).catch(error => {
                    console.error('Error fetching pedidos:', error);
                });
            } else {
                fetchData(`get_pedido_by_user/${token}/`, token).then((result) => {
                    setPedidos(result);
                }).catch(error => {
                    console.error('Error fetching pedidos:', error);
                });
            }
        }).catch(error => {
            console.error('Error fetching user data:', error);
        });
    }, [token]);

    const handleSearchChange = (value) => {
        setSearchQuery(value);
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevData) => {
            const updatedData = { ...prevData, [name]: value };
            console.log(updatedData);
            return updatedData;
        });
    };

    const handleUrgenciaChange = (nivel) => {
        setFormData((prevData) => ({
            ...prevData,
            urgencia: nivel
        }));
    };

    const handleCreatePedido = () => {
        const fechaInicio = new Date();
        const fechaVencimiento = new Date();
        fechaVencimiento.setMonth(fechaVencimiento.getMonth() + 1);

        const pedidoData = {
            ...formData,
            fechainicio: fechaInicio.toISOString().split('T')[0],
            fechavencimiento: fechaVencimiento.toISOString().split('T')[0]
        };

        postData('crear_pedido/', pedidoData, token).then((nuevoPedido) => {
            setPedidos([...pedidos, nuevoPedido]);
        });
    };

    const deletePedido = (pedidoId) => {
        deleteData(`delete_detalle_pedido/${pedidoId}/`, token).then(() => {
            setPedidos((prevPedidos) => prevPedidos.filter(pedido => pedido.id_pedido !== pedidoId));
            window.location.reload();
        }).catch(error => {
            console.error('Error deleting pedido:', error);
        });
    };

    const createAportePedido = (pedidoId) => {
        postData('crear_aporte_pedido/', { id_pedido: pedidoId }, token).then(() => {
            window.location.reload();
        });
    };

    const filters = [
        { type: 'pedido.fechainicio', label: 'Fecha Inicio' },
        { type: 'pedido.fechavencimiento', label: 'Fecha Vencimiento' },
        { type: 'pedido.id_producto.nombre', label: 'Nombre del Producto' },
        { type: 'pedido.id_obra.nombre', label: 'Nombre de la Obra' },
        { type: 'pedido.id_usuario.nombre', label: 'Nombre del Usuario' }
    ];
    
    const filteredPedidos = pedidos.map(obra => {
        const filteredPedidosInObra = obra.pedidos.filter(pedido => {
            return (
                pedido?.fechainicio?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                pedido?.fechavencimiento?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                pedido?.id_producto?.nombre?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                pedido?.id_obra?.nombre?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                pedido?.id_usuario?.nombre?.toLowerCase().includes(searchQuery.toLowerCase())
            );
        });
        return { ...obra, pedidos: filteredPedidosInObra };
    }).filter(obra => obra.pedidos.length > 0);
    
    const sortedPedidos = [...filteredPedidos].sort((a, b) => {
        if (!orderCriteria) return 0;
        const [entity, field] = orderCriteria.split('.');
        const aValue = entity === 'pedido' ? a.pedidos[0][field] : a[entity][field];
        const bValue = entity === 'pedido' ? b.pedidos[0][field] : b[entity][field];
    
        if (typeof aValue === 'string' && typeof bValue === 'string') {
            return aValue.toLowerCase().localeCompare(bValue.toLowerCase());
        }
    
        if (typeof aValue === 'number' && typeof bValue === 'number') {
            return bValue - aValue;
        }
    
        return 0;
    });

    return (
        <div>
            <FullNavbar selectedPage='Pedidos' />
            <div className='margen-arriba'>
                <h2 style={{ marginLeft: '7rem' }}>Pedidos</h2>
                <SearchBar onSearchChange={handleSearchChange} onOrderChange={setOrderCriteria} filters={filters} />
                <div className='pedido-list'>
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '2rem', marginTop: '2rem' }}>
                        <Modal
                            tamaño={'lg'}
                            openButtonText='¿No encuentra su pedido? Añadalo'
                            openButtonWidth='20'
                            title='Nuevo Pedido'
                            saveButtonText='Crear'
                            handleSave={handleCreatePedido}
                            content={
                                <div>
                                    <PedidoCard user={user} stocksDisponibles={pedidos}/>
                                </div>
                            }
                        />
                    </div>
                    <div className='cardCategori'>
                        {Array.isArray(sortedPedidos) && sortedPedidos.length > 0 ? (
                            sortedPedidos.map(obra => (
                                <GenericAccordion titulo={obra.obra.nombre} wide='80%' key={obra.obra.id_obra}
                                    children={obra.pedidos.map(pedido => (
                                        <GenericCard hoverable={false}
                                            key={pedido.id_pedido}
                                            foto={pedido.id_producto.imagen}
                                            titulo={pedido.id_producto.nombre}
                                            descrip1={`Cantidad: ${pedido.cantidad} ${pedido.id_producto.unidadmedida}`}
                                            descrip2={`Urgencia: ${pedido.urgente}`}
                                            descrip3={`Fecha Vencimiento: ${pedido.fechavencimiento}`}
                                            descrip4={`Obra: ${pedido.id_obra.nombre}`}
                                            descrip5={`Usuario: ${pedido.id_usuario.nombre}`}
                                            children={
                                                <>
                                                <Icon 
                                                    icon="line-md:edit-twotone" 
                                                    className="hoverable-icon"
                                                    style={{ width: "2.5rem", height: "2.5rem", position: "absolute", top: "1rem", right: "1rem", color: "#02005E", transition: "transform 1s" }} 
                                                    onClick={() => setSelectedPedidoId(`${pedido.id_pedido} ${obra.obra.id_obra}`)}
                                                />
                                                    <Modal showButton={false} showDeleteButton={true} showModal={selectedPedidoId === `${pedido.id_pedido} ${obra.obra.id_obra}`} saveButtonText={'Tomar'}
                                                        handleCloseModal={() => setSelectedPedidoId(null)} deleteFunction={() => deletePedido(pedido.id_detalleobrapedido)} deleteButtonText={'Rechazar'}
                                                        title={'Tomar Pedido'} handleSave={() => createAportePedido()} content={
                                                            <div>
                                                                <GenericCard
                                                                    key={pedido.id_pedido}
                                                                    foto={pedido.id_producto.imagen}
                                                                    titulo={pedido.id_producto.nombre}
                                                                    descrip1={`Cantidad: ${"hola"} / ${pedido.cantidad} ${pedido.id_producto.unidadmedida}`}
                                                                    descrip2={`Urgencia: ${pedido.urgente}`}
                                                                    descrip3={`Fecha Inicio: ${pedido.fechainicio}`}
                                                                    descrip4={`Fecha Vencimiento: ${pedido.fechavencimiento}`}
                                                                    descrip5={`Obra: ${pedido.id_obra.nombre}`}
                                                                    descrip6={`Usuario: ${pedido.id_usuario.nombre}`}
                                                                />
                                                                <Form.Group className="mb-2" controlId="formBasicCantidad">
                                                                    <Form.Label className="font-rubik" style={{ fontSize: '0.8rem' }}>Ingrese la cantidad que quiere aportar</Form.Label>
                                                                    <Form.Control name="cantidad" type="number" placeholder="Ingrese la cantidad" onKeyDown={(event) => {if (!/[0-9.]/.test(event.key) && !['Backspace', 'ArrowLeft', 'ArrowRight', 'Shift'].includes(event.key)) {event.preventDefault();}}}/>
                                                                </Form.Group>
                                                            </div>
                                                        }
                                                    />
                                                </>
                                            }
                                        />
                                    ))}
                                />
                            ))
                        ) : (
                            <p style={{ marginLeft: '7rem', marginTop: '1rem' }}> No hay pedidos disponibles.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Pedidos;