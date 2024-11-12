import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, Tab, Breadcrumb, OverlayTrigger, Tooltip, Button } from 'react-bootstrap';
import { Icon } from '@iconify/react';
import Cookies from 'js-cookie';

import FullNavbar from '../../components/navbar/full_navbar/FullNavbar.jsx';
import SearchBar from '../../components/searchbar/searchbar.jsx';
import fetchData from '../../functions/fetchData';
import fetchUser from '../../functions/fetchUser';
import PedidoListing from '../../components/cards/pedido_card/pedido_listing/PedidoListing.jsx';
import PedidoCard from '../../components/cards/pedido_card/PedidoCard.jsx';
import postData from '../../functions/postData.jsx';
import Loading from '../../components/loading/loading.jsx';
import Semaforo from '../../components/semaforo/Semaforo.jsx';
import crearNotificacion from '../../functions/createNofiticacion.jsx';
import GenericCard from '../../components/cards/generic_card/GenericCard.jsx';
import deleteData from '../../functions/deleteData.jsx';
import Modal from '../../components/modals/Modal.jsx';
import SendButton from '../../components/buttons/send_button/send_button.jsx';
import Popup from '../../components/alerts/popup/Popup.jsx'
import LittleCard from '../../components/cards/little_card/LittleCard.jsx';

import './Pedidos.scss';

function Pedidos() {
    const navigate = useNavigate();
    const token = Cookies.get('token');
    const pedidoCardRef = useRef(null);
    const [isFormValid, setIsFormValid] = useState(false);

    const [obras, setObras] = useState([]);
    const [pedidos, setPedidos] = useState([]);
    const [userPedidos, setUserPedidos] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [orderCriteria, setOrderCriteria] = useState(null);
    const [user, setUser] = useState({});
    const [isLoading, setIsLoading] = useState(true);

    const [showModal, setShowModal] = useState(false);
    const [selectedPedido, setSelectedPedido] = useState(null);
    const [showAporteModal, setShowAporteModal] = useState(false);
    const [selectedAporte, setSelectedAporte] = useState({});

    const [showPopup, setShowPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState(null);
    const [popupTitle, setPopupTitle] = useState(null);

    useEffect(() => {
        const fetchDataAsync = async () => {
            try {
                const userData = await fetchUser(navigate);
                setUser(userData);

                const userTokenData = await fetchData(`/userToken/${token}`, token);
                if (userTokenData.is_superuser) {
                    const pedidosRecibidos = await fetchData(`get_pedidos_recibidos_for_admin/`, token);
                    setPedidos(pedidosRecibidos);

                    const pedidosData = await fetchData(`GetPedidoCreadoPorUsuario/${userData.id_usuario}/`, token);
                    setUserPedidos(pedidosData);
                    console.log(pedidosData);

                    const obrasData = await fetchData(`obra/`, token);
                    setObras(obrasData);
                } else {
                    const pedidosRecibidos = await fetchData(`get_pedidos_recibidos_for_user/${token}/`, token);
                    setPedidos(pedidosRecibidos);

                    const pedidosData = await fetchData(`GetPedidoCreadoPorUsuario/${userData.id_usuario}/`, token);
                    setUserPedidos(pedidosData);
                    console.log(pedidosData);

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

            postData('crear_pedido/', pedidoFormWithoutObras, token).then((result) => {
                const obrasPromises = obras.map(async (obra) => {
                    const fechaCreacion = new Date().toISOString().split('T')[0];
                    const producto = await fetchData(`producto/${pedidoForm.id_producto}/`, token);
                    const pendingObra = await fetchData(`obra/${pedidoForm.id_obra}/`, token);
                    const urgenciaLabel = pedidoForm.urgente === 1 ? 'Ligera' : pedidoForm.urgente === 2 ? 'Moderada' : 'Extrema';

                    const dataNotificacion = {
                        titulo: 'Nuevo Pedido',
                        descripcion: `Pedido creado por ${user.nombre} ${user.apellido} de la obra ${pendingObra[0].nombre}.  
                        Se piden ${pedidoForm.cantidad} ${producto[0].unidadmedida} de ${producto[0].nombre} con ${urgenciaLabel} urgencia.`,
                        id_usuario: user.id_usuario,
                        id_obra: obra,
                        fecha_creacion: fechaCreacion
                    };

                    crearNotificacion(dataNotificacion, token, 'Obra', obra);
                    return postData('crear_detalle_pedido/', { id_stock: obra, id_pedido: result.id_pedido }, token);
                });

                return Promise.all(obrasPromises).then(() => {
                    setPopupTitle('Pedido Creado');
                    setPopupMessage('El pedido ha sido creado exitosamente.');
                    setShowPopup(true);
                    window.location.reload();
                });
            }).catch((error) => {
                console.error('Error al crear el pedido, los detalles del pedido o la notificación:', error);
                setPopupTitle('Error');
                setPopupMessage('Hubo un error al crear el pedido.');
                setShowPopup(true);
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

    const filteredUserPedidos = userPedidos.filter(pedido => {
        return filters.some(filter => {
            const filterPath = filter.type.split('.').slice(1).join('.');
            const value = getNestedValue(pedido, filterPath);
            return value?.toString().toLowerCase().includes(searchQuery.toLowerCase());
        });
    });

    const sortedUserPedidos = [...filteredUserPedidos].sort((a, b) => {
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

    const handleSearchChange = (value) => {
        setSearchQuery(value);
    };

    const handleCardClick = (pedido) => {
        setSelectedPedido(pedido);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setSelectedPedido(null);
        setShowModal(false);
    };

    const handleDeletePedido = (pedidoId) => {
        deleteData(`CancelPedido/${pedidoId}/`, token).then(() => {
            window.location.reload();
        }).catch(error => {
            console.error('Error deleting pedido:', error);
        });
    };

    const handleEndPedido = (pedidoId) => {
        deleteData(`EndPedido/${pedidoId}/`, token).then(() => {
            window.location.reload();
        }).catch(error => {
            console.error('Error ending pedido:', error);
        });
    };

    if (obras.length === 0 && !user.is_superuser) {
        return (
            <>
                <FullNavbar selectedPage='Pedidos' />
                <div className='margen-arriba'>
                    <Breadcrumb style={{ marginLeft: "8%", fontSize: "1.2rem" }}>
                        <Breadcrumb.Item active>Pedidos</Breadcrumb.Item>
                    </Breadcrumb>
                    <SearchBar onSearchChange={handleSearchChange} onOrderChange={setOrderCriteria} filters={filters} />
                    <br />
                    <p style={{ marginLeft: '7rem', marginTop: '1rem' }}>No hay obras disponibles.</p>
                </div>
            </>
        );
    }

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
                                openButtonText='Crear un Pedido'
                                openButtonWidth='10'
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

                        <Tabs defaultActiveKey={obras.length > 0 ? obras[0].id_obra : 'obras'} id="uncontrolled-tab-example" style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem', marginLeft: '1rem', marginRight: '1rem' }}>
                            <Tab key='user_pedidos' eventKey='user_pedidos' title={<strong className="custom-tab-title">Mis Pedidos</strong>} style={{ backgroundColor: "transparent" }}>
                                <>
                                    <h1>Viendo pedidos creados por usted</h1>
                                    {Array.isArray(sortedUserPedidos) && sortedUserPedidos.length > 0 ? (
                                        sortedUserPedidos.map((pedido) => (
                                            <div key={pedido.id_pedido} onClick={() => handleCardClick(pedido)}>
                                                <GenericCard hoverable={true}
                                                    foto={pedido.id_producto.imagen}
                                                    titulo={pedido.id_producto.nombre}
                                                    descrip1={<><strong>Cantidad:</strong> {pedido.progreso} / {pedido.cantidad} {pedido.id_producto.unidadmedida}</>}
                                                    descrip2={<><strong>Urgencia:</strong> {pedido.urgente_label} <Semaforo urgencia={pedido.urgente} /></>}
                                                    descrip3={<><strong>Obra:</strong> {pedido.id_obra.nombre}</>}
                                                    descrip4={<><strong>Fecha Vencimiento:</strong> {pedido.fechavencimiento}</>}
                                                    children={
                                                        <>
                                                            <OverlayTrigger
                                                                placement="top"
                                                                overlay={<Tooltip style={{ fontSize: '100%' }}>Editar mi pedido</Tooltip>}
                                                            >
                                                                <Icon className="hoverable-icon" style={{ width: "2.5rem", height: "2.5rem", position: "absolute", top: "1.1rem", right: "0.5rem", color: "#858585", transition: "transform 0.3s" }} icon="line-md:edit-twotone" />
                                                            </OverlayTrigger>
                                                            {pedido.aportes.map((aporte) => (
                                                                <LittleCard
                                                                    key={aporte.id_aportePedido}
                                                                    titulo={`${aporte.cantidad} ${aporte.id_producto.unidadmedida} de ${aporte.id_producto.nombre}`}
                                                                    descrip1={aporte.id_obra.nombre}
                                                                    descrip2={`${aporte.id_usuario.nombre} ${aporte.id_usuario.apellido}`}
                                                                    foto={aporte.id_obra.imagen}
                                                                    onClick={() => handleCardClick(pedido)}
                                                                />
                                                            ))}
                                                        </>
                                                    }
                                                />
                                            </div>
                                        ))
                                    ) : (
                                        <p style={{ marginLeft: '7rem', marginTop: '1rem' }}>No hay pedidos disponibles.</p>
                                    )}
                                </>
                            </Tab>
                            {obras.map((obra) => {
                                const obraPedidos = sortedPedidos.find((pedido) => pedido.obra.id_obra === obra.id_obra);
                                return (
                                    <Tab key={obra.id_obra} eventKey={obra.id_obra} title={<span className="custom-tab-title">{obra.nombre}</span>} style={{ backgroundColor: "transparent" }}>
                                        <PedidoListing sortedPedidos={obraPedidos ? obraPedidos.pedidos : []} obraSelected={obra} user={user} />
                                    </Tab>
                                );
                            })}
                        </Tabs>
                        {user.is_superuser && (
                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '2rem', marginTop: '2rem' }}>
                                <SendButton onClick={() => navigate(`/informe_pedidos`)} text='Ver Informe de Pedidos' wide='14' />
                            </div>
                        )}
                    </>
                )}
            </div>
            <Modal
                showButton={false}
                showModal={showModal}
                title='Detalles del Pedido'
                showDeleteButton={true}
                saveButtonText='Terminar Pedido'
                deleteButtonText='Cancelar Pedido'
                handleCloseModal={handleCloseModal}
                deleteFunction={() => handleDeletePedido(selectedPedido.id_pedido)}
                handleSave={() => handleEndPedido(selectedPedido.id_pedido)}
                content={
                    <div>
                        {selectedPedido && selectedPedido.id_producto && (
                            <GenericCard
                                borde={'none'}
                                shadow={'none'}
                                hoverable={false}
                                foto={selectedPedido.id_producto.imagen}
                                titulo={selectedPedido.id_producto.nombre}
                                descrip1={<><strong>Cantidad:</strong> {selectedPedido.progreso} / {selectedPedido.cantidad} {selectedPedido.id_producto.unidadmedida}</>}
                                descrip2={<><strong>Urgencia:</strong> {selectedPedido.urgente_label} <Semaforo urgencia={selectedPedido.urgente} /></>}
                                descrip3={<><strong>Obra:</strong> {selectedPedido.id_obra.nombre}</>}
                                descrip4={<><strong>Fecha Vencimiento:</strong> {selectedPedido.fechavencimiento}</>}
                                descrip5={<><strong>Estado:</strong> {selectedPedido.id_estadoPedido.nombre}</>}
                            />
                        )}
                    </div>
                }
            />
            <Popup show={showPopup} setShow={setShowPopup} message={popupMessage} title={popupTitle} />
        </>
    );
}

export default Pedidos;