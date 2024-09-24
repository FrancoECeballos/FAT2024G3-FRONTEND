import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, Tab, Breadcrumb } from 'react-bootstrap';
import Cookies from 'js-cookie';
import FullNavbar from '../../components/navbar/full_navbar/FullNavbar.jsx';
import SearchBar from '../../components/searchbar/searchbar.jsx';
import fetchData from '../../functions/fetchData';
import fetchUser from '../../functions/fetchUser';
import Modal from '../../components/modals/Modal.jsx';
import PedidoListing from '../../components/cards/pedido_card/pedido_listing/PedidoListing.jsx';
import PedidoCard from '../../components/cards/pedido_card/PedidoCard.jsx';
import postData from '../../functions/postData.jsx';
import Loading from '../../components/loading/loading.jsx';
import crearNotificacion from '../../functions/createNofiticacion.jsx';

function Pedidos() {
    const navigate = useNavigate();
    const token = Cookies.get('token');
    const pedidoCardRef = useRef(null);
    const [isFormValid, setIsFormValid] = useState(false);

    const [obras, setObras] = useState([]);

    const [pedidos, setPedidos] = useState([]);
    const [pedidosDados, setPedidosDados] = useState([]);

    const [searchQuery, setSearchQuery] = useState('');
    const [orderCriteria, setOrderCriteria] = useState(null);
    const [user, setUser] = useState({});
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchDataAsync = async () => {
            try {
                const userData = await fetchUser(navigate);
                setUser(userData);

                const userTokenData = await fetchData(`/userToken/${token}`, token);
                if (userTokenData.is_superuser) {
                    const pedidosRecibidos = await fetchData(`get_pedidos_recibidos_for_admin/`, token);
                    setPedidos(pedidosRecibidos);
                    const pedidosDadosData = await fetchData(`get_pedidos_dados/`, token);
                    setPedidosDados(pedidosDadosData);

                    const obrasData = await fetchData(`obra/`, token);
                    setObras(obrasData);
                } else {
                    const pedidosRecibidos = await fetchData(`get_pedidos_recibidos_for_user/${token}/`, token);
                    setPedidos(pedidosRecibidos);

                    const pedidosDadosData = await fetchData(`get_pedidos_dados/`, token);
                    setPedidosDados(pedidosDadosData);

                    const obrasData = await fetchData(`obra/user/${token}/`, token);
                    setObras(obrasData);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDataAsync();
    }, [token]);

    useEffect(() => {
        const interval = setInterval(() => {
            if (pedidoCardRef.current) {
                setIsFormValid(pedidoCardRef.current.isFormValid);
            }
        }, 100);

        return () => clearInterval(interval);
    }, [pedidoCardRef]);

    const handleCreatePedido = () => {
        if (pedidoCardRef.current) {
            const pedidoForm = pedidoCardRef.current.getPedidoForm();
            const { obras, ...pedidoFormWithoutObras } = pedidoForm;
            console.log('Pedido form:', pedidoForm);

            postData('crear_pedido/', pedidoFormWithoutObras, token).then((result) => {
                console.log('Pedido creado:', result);
                const obrasPromises = obras.map((obra) =>
                    postData('crear_detalle_pedido/', { id_stock: obra, id_pedido: result.id_pedido }, token)
                );
                return Promise.all(obrasPromises).then(() => result);
            }).then((result) => {
                console.log('Detalles de pedido creados:', result);

                const tituloNotificacion = ` "Notificacion Creada" - ${user.nombre} ${user.apellido}`;
                const fechaCreacion = new Date().toISOString().split('T')[0];
                const dataNotificacion = {
                    titulo: tituloNotificacion,
                    descripcion: 'Nuevo pedido creado',
                    id_usuario: user.id_usuario,
                    fecha_creacion: fechaCreacion
                };
                console.log('Datos de la notificación:', dataNotificacion);
                return crearNotificacion(dataNotificacion, token).then(() => {
                    window.location.reload();
                });
            }).then((notificacionResult) => {
                console.log('Notificación creada:', notificacionResult);
            }).catch((error) => {
                console.error('Error al crear el pedido, los detalles del pedido o la notificación:', error);
            });
        }
    };

    const filters = [
        { type: 'pedido.id_obra.nombre', label: 'Nombre de la Obra' },
        { type: 'pedido.fechainicio', label: 'Fecha Inicio' },
        { type: 'pedido.fechavencimiento', label: 'Fecha Vencimiento' },
        { type: 'pedido.id_producto.nombre', label: 'Nombre del Producto' },
        { type: 'pedido.id_usuario.nombre', label: 'Nombre del Usuario' }
    ];
    
    const getNestedValue = (obj, path) => {
        return path.split('.').reduce((acc, part) => acc && acc[part], obj);
    };
    
    const filteredPedidos = pedidos.map(obra => { 
        const filteredPedidosInObra = obra.pedidos.map(pedido => { 
            const filteredInnerPedidos = pedido.pedidos.filter(innerPedido => { 
                return filters.some(filter => { 
                    const filterPath = filter.type.split('.').slice(1).join('.'); 
                    const value = getNestedValue(innerPedido, filterPath); 
                    return value?.toString().toLowerCase().includes(searchQuery.toLowerCase()); 
                }); 
            }); 
            return { ...pedido, pedidos: filteredInnerPedidos }; 
        }).filter(pedido => pedido.pedidos.length > 0); 
        return { ...obra, pedidos: filteredPedidosInObra }; 
    }).filter(obra => obra.pedidos.length > 0);

    const sortedPedidos = filteredPedidos.map(obra => {
        if (orderCriteria === 'pedido.id_obra.nombre') {
            const sortedPedidosInObra = [...obra.pedidos].sort((a, b) => {
                if (!orderCriteria) return 0;
                const getValue = (obj, path) => {
                    return path.split('.').reduce((acc, part) => acc && acc[part], obj);
                };
        
                const aValue = getValue(a, orderCriteria.replace('obra.pedido.', ''));
                const bValue = getValue(b, orderCriteria.replace('obra.pedido.', ''));
        
                if (orderCriteria.includes('fechainicio') || orderCriteria.includes('fechavencimiento')) {
                    const aDate = new Date(aValue);
                    const bDate = new Date(bValue);
                    return aDate - bDate;
                }
        
                if (typeof aValue === 'string' && typeof bValue === 'string') {
                    return aValue.toLowerCase().localeCompare(bValue.toLowerCase());
                }
        
                if (typeof aValue === 'number' && typeof bValue === 'number') {
                    return bValue - aValue;
                }
        
                return 0;
            });
        
            return { ...obra, pedidos: sortedPedidosInObra };
        } else {
            const sortedPedidosInObra = [...obra.pedidos].map(pedido => {
                const sortedInnerPedidos = [...pedido.pedidos].sort((a, b) => {
                    if (!orderCriteria) return 0;
                    const getValue = (obj, path) => {
                        return path.split('.').reduce((acc, part) => acc && acc[part], obj);
                    };

                    const aValue = getValue(a, orderCriteria.replace('pedido.', ''));
                    const bValue = getValue(b, orderCriteria.replace('pedido.', ''));

                    if (orderCriteria.includes('fechainicio') || orderCriteria.includes('fechavencimiento')) {
                        const aDate = new Date(aValue);
                        const bDate = new Date(bValue);
                        return aDate - bDate;
                    }

                    if (typeof aValue === 'string' && typeof bValue === 'string') {
                        return aValue.toLowerCase().localeCompare(bValue.toLowerCase());
                    }

                    if (typeof aValue === 'number' && typeof bValue === 'number') {
                        return bValue - aValue;
                    }

                    return 0;
                });

                return { ...pedido, pedidos: sortedInnerPedidos };
            });

            return { ...obra, pedidos: sortedPedidosInObra };
        }
    });

    const filteredPedidosDados = pedidosDados.map(pedidoDado => {
        const filteredInnerPedidos = pedidoDado.pedidos.filter(pedido => {
            return filters.some(filter => {
                const filterPath = filter.type.split('.').slice(1).join('.');
                const value = getNestedValue(pedido, filterPath);
                return value?.toString().toLowerCase().includes(searchQuery.toLowerCase());
            });
        });
        return { ...pedidoDado, pedidos: filteredInnerPedidos };
    }).filter(pedidoDado => pedidoDado.pedidos.length > 0);
    
    const sortedPedidosDados = filteredPedidosDados.sort((a, b) => {
        if (orderCriteria === 'pedido.id_obra.nombre') {
            const getValue = (obj, path) => {
                return path.split('.').reduce((acc, part) => acc && acc[part], obj);
            };
    
            const aValue = getValue(a.obra, 'nombre');
            const bValue = getValue(b.obra, 'nombre');
    
            if (typeof aValue === 'string' && typeof bValue === 'string') {
                return aValue.toLowerCase().localeCompare(bValue.toLowerCase());
            }
    
            return 0;
        } else {
            return 0;
        }
    }).map(pedidoDado => {
        const sortedPedidos = [...pedidoDado.pedidos].sort((a, b) => {
            if (!orderCriteria) return 0;
            const getValue = (obj, path) => {
                return path.split('.').reduce((acc, part) => acc && acc[part], obj);
            };
    
            const aValue = getValue(a, orderCriteria.replace('pedido.', ''));
            const bValue = getValue(b, orderCriteria.replace('pedido.', ''));
    
            if (orderCriteria.includes('fechainicio') || orderCriteria.includes('fechavencimiento')) {
                const aDate = new Date(aValue);
                const bDate = new Date(bValue);
                return aDate - bDate;
            }
    
            if (typeof aValue === 'string' && typeof bValue === 'string') {
                return aValue.toLowerCase().localeCompare(bValue.toLowerCase());
            }
    
            if (typeof aValue === 'number' && typeof bValue === 'number') {
                return bValue - aValue;
            }
    
            return 0;
        });
    
        return { ...pedidoDado, pedidos: sortedPedidos };
    });

    const handleSearchChange = (value) => {
        setSearchQuery(value);
    };

    return (
        <>
            <FullNavbar selectedPage='Pedidos' />
            <div className='margen-arriba'>
                {isLoading ? (
                    <Loading />
                ) : (
                    <>
                        <Breadcrumb style={{ marginLeft: "8%", fontSize: "1.2rem" }}>
                            <Breadcrumb.Item active>Pedidos</Breadcrumb.Item>
                        </Breadcrumb>
                        <SearchBar onSearchChange={handleSearchChange} onOrderChange={setOrderCriteria} filters={filters} />

                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '2rem', marginTop: '2rem' }}>
                            <Modal
                                tamaño={'lg'}
                                openButtonText='¿No encuentra su Pedido? Añadalo'
                                openButtonWidth='20'
                                title='Nuevo Pedido'
                                saveButtonText='Crear'
                                handleSave={handleCreatePedido}
                                showModal={false}
                                showButton={true}
                                saveButtonEnabled={isFormValid}
                                content={
                                    <PedidoCard user={user} stocksDisponibles={pedidos} ref={pedidoCardRef} />
                                }
                            />
                        </div>

                        <Tabs defaultActiveKey="obras" id="uncontrolled-tab-example" style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
                            <Tab eventKey="obras" title="Todas" style={{ backgroundColor: "transparent" }}>
                                <PedidoListing sortedPedidos={sortedPedidosDados} obrasDisponibles={obras} user={user} />
                            </Tab>
                            {obras.map((obra) => {
                                const obraPedidos = sortedPedidos.find((pedido) => pedido.obra.id_obra === obra.id_obra);
                                return (
                                    <Tab key={obra.id_obra} eventKey={obra.id_obra} title={obra.nombre} style={{ backgroundColor: "transparent" }}>
                                        <PedidoListing sortedPedidos={obraPedidos ? obraPedidos.pedidos : []} selectedObra={obra} user={user} />
                                    </Tab>
                                );
                            })}
                        </Tabs>

                    </>
                )}
            </div>
        </>
    );

}

export default Pedidos;