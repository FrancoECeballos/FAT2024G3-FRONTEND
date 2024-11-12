import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { Form, Breadcrumb, OverlayTrigger, Tooltip, Tab, Tabs } from 'react-bootstrap';
import { Icon } from '@iconify/react';

import FullNavbar from '../../components/navbar/full_navbar/FullNavbar.jsx';
import GenericCard from '../../components/cards/generic_card/GenericCard.jsx';
import SearchBar from '../../components/searchbar/searchbar.jsx';

import fetchData from '../../functions/fetchData';
import fetchUser from '../../functions/fetchUser';
import postData from '../../functions/postData.jsx';
import deleteData from '../../functions/deleteData.jsx';

import Modal from '../../components/modals/Modal.jsx';
import OfertaCard from '../../components/cards/oferta_card/OfertaCard.jsx';
import Loading from '../../components/loading/loading.jsx';
import crearNotificacion from '../../functions/createNofiticacion.jsx';
import SendButton from '../../components/buttons/send_button/send_button.jsx';
import LittleCard from '../../components/cards/little_card/LittleCard.jsx';

import './Ofertas.scss';

import ConfirmationModal from "../../components/modals/confirmation_modal/ConfirmationModal.jsx";

function Ofertas() {
    const navigate = useNavigate();
    const token = Cookies.get('token');
    const [ofertas, setOfertas] = useState([]);
    const [userOfertas, setUserOfertas] = useState([]);
    const ofertaCardRef = useRef(null);
    const [isFormValid, setIsFormValid] = useState(false);

    const [isLoading, setIsLoading] = useState(true);
    const [cantidad, setCantidad] = useState('');
    const [error, setError] = useState('');

    const [searchQuery, setSearchQuery] = useState('');
    const [orderCriteria, setOrderCriteria] = useState(null);

    const [user, setUser] = useState({});
    const [obras, setObras] = useState([]);
    const [selectedObra, setSelectedObra] = useState({});
    const [stocks, setStocks] = useState([]);

    const [showModal, setShowModal] = useState(false);
    const [selectedOferta, setSelectedOferta] = useState(null);
    const [showAporteModal, setShowAporteModal] = useState(false);
    const [selectedAporte, setSelectedAporte] = useState(null);
    const [showUserOfertaModal, setShowUserOfertaModal] = useState(false);
    const [showTakeOfertaModal, setShowTakeOfertaModal] = useState(false);

    const [terminarOfertaConfirmation, setTerminarOfertaConfirmation] = useState(false);
    const [cancelarOfertaConfirmation, setCancelarOfertaConfirmation] = useState(false);

    useEffect(() => {
        const fetchDataAsync = async () => {
            setIsLoading(true);
            try {
                const userData = await fetchUser(navigate);
                setUser(userData);

                if (userData.is_superuser) {
                    const [stocksData, obrasData] = await Promise.all([
                        fetchData(`stock/`, token),
                        fetchData(`obra/`, token)
                    ]);
                    setStocks(stocksData);
                    setObras(obrasData);
                } else {
                    const [stocksData, obrasData] = await Promise.all([
                        fetchData(`/user/stockToken/${token}`, token),
                        fetchData(`obra/user/${token}/`, token)
                    ]);
                    setStocks(stocksData);
                    setObras(obrasData);
                }

                const [ofertasData, userOfertasData] = await Promise.all([
                    fetchData(`/oferta/${token}/`, token),
                    fetchData(`GetOfertaCreadaPorUsuario/${userData.id_usuario}`, token)
                ]);
                setOfertas(ofertasData);
                setUserOfertas(userOfertasData);

            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDataAsync();
    }, [token, navigate]);

    useEffect(() => {
        const interval = setInterval(() => {
            if (ofertaCardRef.current) {
                setIsFormValid(ofertaCardRef.current.isFormValid);
            }
        }, 100);

        return () => clearInterval(interval);
    }, [ofertaCardRef]);

    const filters = [
        { type: 'id_producto.nombre', label: 'Nombre del Producto' },
        { type: 'fechainicio', label: 'Fecha Inicio' },
        { type: 'fechavencimiento', label: 'Fecha Vencimiento' },
        { type: 'id_obra.nombre', label: 'Obra que Ofrece' },
        { type: 'id_usuario.nombre', label: 'Usuario que ofrece' },
    ];

    const filteredOfertas = ofertas.filter(oferta => {
        return (
            oferta.fechainicio?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            oferta.fechavencimiento?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            oferta.id_producto.nombre?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            oferta.id_obra.nombre?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            oferta.id_usuario.nombre?.toLowerCase().includes(searchQuery.toLowerCase())
        );
    });

    const sortedOfertas = [...filteredOfertas].sort((a, b) => {
        if (!orderCriteria) return 0;
        const getValue = (obj, path) => {
            return path.split('.').reduce((acc, part) => acc && acc[part], obj);
        };

        const aValue = getValue(a, orderCriteria);
        const bValue = getValue(b, orderCriteria);

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

    const filteredUserOfertas = userOfertas.filter(oferta => {
        return (
            oferta.fechainicio?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            oferta.fechavencimiento?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            oferta.id_producto.nombre?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            oferta.id_obra.nombre?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            oferta.id_usuario.nombre?.toLowerCase().includes(searchQuery.toLowerCase())
        );
    });

    const sortedUserOfertas = [...filteredUserOfertas].sort((a, b) => {
        if (!orderCriteria) return new Date(b.fechainicio) - new Date(a.fechainicio);

        const getValue = (obj, path) => {
            return path.split('.').reduce((acc, part) => acc && acc[part], obj);
        };

        const aValue = getValue(a, orderCriteria.replace('oferta.', ''));
        const bValue = getValue(b, orderCriteria.replace('oferta.', ''));

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

    const handleChange = (event) => {
        setCantidad(event.target.value);
        if (event.target.value === '') {
            setError('La cantidad no puede estar vacía');
        } else {
            setError('');
        }
    };

    const handleSearchChange = (value) => {
        setSearchQuery(value);
    };

    const handleCreateOferta = () => {
        if (ofertaCardRef.current) {
            const ofertaForm = ofertaCardRef.current.getOfertaForm();

            postData('crear_oferta/', ofertaForm, token).then(async () => {
                const fechaCreacion = new Date().toISOString().split('T')[0];
                const producto = await fetchData(`producto/${ofertaForm.id_producto}/`, token);
                const pendingStock = await fetchData(`stock/${ofertaForm.id_obra}/`, token);
                const pendingObra = await fetchData(`obra/${ofertaForm.id_obra}/`, token);

                await postData('SubtractDetallestockproducto/', {
                    cantidad: ofertaForm.cantidad,
                    id_stock: pendingStock[0].id_stock,
                    id_producto: ofertaForm.id_producto,
                    id_usuario: user.id_usuario
                }, token)

                const dataNotificacion = {
                    titulo: 'Nueva Oferta',
                    descripcion: `Oferta creada por ${user.nombre} ${user.apellido} de la obra ${pendingObra[0].nombre}. 
                    Se ofrecen ${ofertaForm.cantidad} ${producto[0].unidadmedida} de ${producto[0].nombre}.`,
                    id_usuario: user.id_usuario,
                    fecha_creacion: fechaCreacion
                };

                return crearNotificacion(dataNotificacion, token).then(() => {
                    window.location.reload();
                });

            }).catch((error) => {
                console.error('Error al crear la oferta:', error);
            });
        }
    };

    const createAporteOferta = async (ofertaId, usuarioId, obra, cantidad, fechaAportado) => {
        const oferta = ofertas.find(oferta => oferta.id_oferta === ofertaId);
        const cantidadRestante = oferta.cantidad - oferta.progreso;

        if (parseFloat(cantidad) > parseFloat(cantidadRestante)) {
            setError(`La cantidad ofrecida no puede exceder la cantidad restante de ${cantidadRestante} ${oferta.id_producto.unidadmedida}`);
            return false;
        }

        const data = {
            cantidad: parseInt(cantidad, 10),
            fechaAportado: fechaAportado,
            id_oferta: ofertaId,
            id_usuario: usuarioId,
            id_obra: obra.id_obra,
        };

        try {
            await postData('crear_detalle_oferta/', data, token).then(async () => {
                const fechaCreacion = new Date().toISOString().split('T')[0];
                const ofertaAportada = await fetchData(`oferta_id/${ofertaId}/`, token);

                const dataNotificacion = {
                    titulo: 'Nuevo Aporte',
                    descripcion: `Aporte de ${data.cantidad} creado por ${user.nombre} ${user.apellido} a tu oferta de ${ofertaAportada[0].id_producto.nombre}.`,
                    id_obra: selectedOferta.id_obra.id_obra,
                    fecha_creacion: fechaCreacion
                };
                crearNotificacion(dataNotificacion, token, 'User', selectedOferta.id_usuario.id_usuario).then(() => window.location.reload());
                return true;
            });
        } catch (error) {
            console.error('Error creando el aporte de la oferta:', error);
            return false;
        }
    };

    const handleDeleteOferta = (ofertaId) => {
        deleteData(`CancelOferta/${ofertaId}/`, token).then(() => {
            window.location.reload();
        }).catch(error => {
            console.error('Error deleting oferta:', error);
        });
    };

    const handleEndOferta = (ofertaId) => {
        deleteData(`EndOferta/${ofertaId}/`, token).then(() => {
            window.location.reload();
        }).catch(error => {
            console.error('Error ending oferta:', error);
        });
    };

    const handleRejectAporte = (aporte) => {
        deleteData(`delete_detalle_oferta/${aporte.id_aportePedido}/`, token).then(() => {
            window.location.reload();
        }).catch(error => {
            console.error('Error ending pedido:', error);
        });
    }

    if (isLoading) {
        return <div><FullNavbar /><Loading /></div>;
    } else if (obras.length === 0) {
        return (
            <>
                <FullNavbar selectedPage='Ofertas' />
                <div className='margen-arriba'>
                    <Breadcrumb style={{ marginLeft: "8%", fontSize: "1.2rem" }}>
                        <Breadcrumb.Item active>Ofertas</Breadcrumb.Item>
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
            <FullNavbar selectedPage='Ofertas' />
            <div className='margen-arriba'>
                {isLoading ? (
                    <Loading />
                ) : (
                    <>
                        <Breadcrumb style={{ marginLeft: "8%", fontSize: "1.2rem" }}>
                            <Breadcrumb.Item active>Ofertas</Breadcrumb.Item>
                        </Breadcrumb>
                        <SearchBar onSearchChange={handleSearchChange} onOrderChange={setOrderCriteria} filters={filters} />
                        <div className='oferta-list'>
                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '2rem', marginTop: '2rem' }}>
                                <Modal
                                    openButtonText='Crear una Oferta'
                                    openButtonWidth='10'
                                    title='Nueva Oferta'
                                    saveButtonText='Crear'
                                    handleSave={handleCreateOferta}
                                    saveButtonEnabled={isFormValid}
                                    content={
                                        <OfertaCard user={user} stocksDisponibles={stocks} ref={ofertaCardRef} />
                                    }
                                    showModal={showModal}
                                    handleCloseModal={() => setShowModal(false)}
                                />
                            </div>
                            <Tabs defaultActiveKey='ofertas' id="uncontrolled-tab-example" style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem', marginLeft: '1rem', marginRight: '1rem' }}>
                                <Tab key='user_ofertas' eventKey='user_ofertas' title={<strong className="custom-tab-title">Mis Ofertas</strong>} style={{ backgroundColor: "transparent" }}>
                                    <div className='cardCategori'>
                                        <h1>Viendo ofertas creadas por usted</h1>
                                        {Array.isArray(sortedUserOfertas) && sortedUserOfertas.length > 0 ? (
                                            sortedUserOfertas.map(oferta => (
                                                <div key={oferta.id_oferta}>
                                                    <GenericCard
                                                        onClick={() => {
                                                            setSelectedOferta(oferta);
                                                            setShowUserOfertaModal(true);
                                                        }}
                                                        hoverable={false}
                                                        titulo={`${oferta.id_producto.nombre}`}
                                                        foto={oferta.id_producto.imagen}
                                                        descrip1={<><strong>Cantidad:</strong> {oferta.progreso} / {oferta.cantidad} {oferta.id_producto.unidadmedida}</>}
                                                        descrip2={<><strong>Obra:</strong> {oferta.id_obra.nombre} <strong>Usuario:</strong> {oferta.id_usuario.nombre} {oferta.id_usuario.apellido}</>}
                                                        descrip3={<><strong>Estado:</strong> {oferta.id_estadoOferta.nombre}</>}
                                                        descrip4={<><strong>Fecha Vencimiento:</strong> {oferta.fechavencimiento ? oferta.fechavencimiento.split('-').reverse().join('/') : ''}</>}
                                                        children={
                                                            <>
                                                                <OverlayTrigger
                                                                    placement="top"
                                                                    overlay={<Tooltip style={{ fontSize: '100%' }}>Tomar la oferta</Tooltip>}
                                                                >
                                                                    <Icon className="hoverable-icon" style={{ width: "2.5rem", height: "2.5rem", position: "absolute", top: "1.1rem", right: "0.5rem", color: "#858585", transition: "transform 0.3s" }} icon="line-md:edit-twotone" />
                                                                </OverlayTrigger>
                                                                <div className='scroll-horizontal-entregas'>
                                                                    {oferta.aportes.map((aporte) => (
                                                                        <LittleCard
                                                                            key={aporte.id_aporteOferta}
                                                                            titulo={`${aporte.cantidad} ${aporte.id_oferta.id_producto.unidadmedida} de ${aporte.id_oferta.id_producto.nombre}`}
                                                                            descrip1={aporte.id_obra.nombre}
                                                                            descrip2={`${aporte.id_usuario.nombre} ${aporte.id_usuario.apellido}`}
                                                                            foto={aporte.id_obra.imagen}
                                                                            onSelect={() => {
                                                                                setSelectedAporte(aporte);
                                                                                setShowAporteModal(true);
                                                                            }}
                                                                        />
                                                                    ))}
                                                                </div>
                                                            </>
                                                        }
                                                    />
                                                </div>
                                            ))
                                        ) : (
                                            <p style={{ marginLeft: '7rem', marginTop: '1rem' }}>No hay ofertas disponibles.</p>
                                        )}
                                    </div>
                                </Tab>
                                <Tab key='ofertas' eventKey='ofertas' title={<span className="custom-tab-title">Ofertas para mi</span>} style={{ backgroundColor: "transparent" }}>
                                    <div className='cardCategori'>
                                        <h1>Viendo ofertas disponibles</h1>
                                        {Array.isArray(sortedOfertas) && sortedOfertas.length > 0 ? (
                                            sortedOfertas.map(oferta => (
                                                <div key={oferta.id_oferta}>
                                                    <GenericCard
                                                        onClick={() => {
                                                            setSelectedOferta(oferta);
                                                            setShowTakeOfertaModal(true);
                                                            if (obras.length > 1) {
                                                                const filteredObras = obras.filter(obra => oferta.id_obra && oferta.id_obra.id_obra !== obra.id_obra);
                                                                if (filteredObras.length > 0) {
                                                                    setSelectedObra(filteredObras[0]);
                                                                }
                                                            }
                                                            if (obras.length === 1) {
                                                                setSelectedObra(obras[0]);
                                                            }
                                                        }}
                                                        hoverable={false}
                                                        titulo={`${oferta.id_producto.nombre}`}
                                                        foto={oferta.id_producto.imagen}
                                                        descrip1={<><strong>Cantidad:</strong> {oferta.progreso} / {oferta.cantidad} {oferta.id_producto.unidadmedida}</>}
                                                        descrip2={<><strong>Obra:</strong> {oferta.id_obra.nombre} <strong>Usuario:</strong> {oferta.id_usuario.nombre} {oferta.id_usuario.apellido}</>}
                                                        descrip3={<><strong>Estado:</strong> {oferta.id_estadoOferta.nombre}</>}
                                                        descrip4={<><strong>Fecha Vencimiento:</strong> {oferta.fechavencimiento ? oferta.fechavencimiento.split('-').reverse().join('/') : ''}</>}
                                                        children={
                                                            <OverlayTrigger
                                                                placement="top"
                                                                overlay={<Tooltip style={{ fontSize: '100%' }}>Tomar la oferta</Tooltip>}
                                                            >
                                                                <Icon className="hoverable-icon" style={{ width: "2.5rem", height: "2.5rem", position: "absolute", top: "1.1rem", right: "0.5rem", color: "#858585", transition: "transform 0.3s" }} icon="line-md:download-outline" />
                                                            </OverlayTrigger>
                                                        }
                                                    />
                                                </div>
                                            ))
                                        ) : (
                                            <p style={{ marginLeft: '7rem', marginTop: '1rem' }}>No hay ofertas disponibles.</p>
                                        )}
                                    </div>
                                </Tab>
                            </Tabs>
                        </div>
                    </>
                )}
            </div>

            {selectedOferta && (
                <Modal
                    showButton={false}
                    showModal={showTakeOfertaModal}
                    saveButtonText='Tomar'
                    handleCloseModal={() => { setShowTakeOfertaModal(false), setSelectedOferta(null) }}
                    saveButtonShown={!(obras.length === 1 && obras[0].id_obra === selectedOferta.id_obra.id_obra)}
                    title='Tomar Oferta'
                    handleSave={() => createAporteOferta(selectedOferta.id_oferta, user.id_usuario, selectedObra, cantidad, new Date().toISOString().split('T')[0])}
                    content={
                        <div>
                            <GenericCard
                                borde={'none'}
                                shadow={'none'}
                                hoverable={false}
                                key={selectedOferta.id_oferta}
                                titulo={`${selectedOferta.id_producto.nombre}`}
                                foto={selectedOferta.id_producto.imagen}
                                descrip1={`Cantidad: ${selectedOferta.progreso} / ${selectedOferta.cantidad} ${selectedOferta.id_producto.unidadmedida}`}
                                descrip2={<><strong>Obra:</strong> {selectedOferta.id_obra.nombre}</>}
                                descrip3={<><strong>Usuario:</strong> {selectedOferta.id_usuario.nombre} {selectedOferta.id_usuario.apellido}</>}
                                descrip4={<><strong>Estado:</strong> {selectedOferta.id_estadoOferta.nombre} <strong>Cantidad:</strong> {selectedOferta.cantidad} {selectedOferta.id_producto.unidadmedida}</>}
                                descrip5={<><strong>Fecha Vencimiento:</strong> {selectedOferta.fechavencimiento ? selectedOferta.fechavencimiento.split('-').reverse().join('/') : ''}</>}
                            />

                            {!(obras.length === 1 && obras[0].id_obra === selectedOferta.id_obra.id_obra) && (
                                <>
                                    <Form.Control
                                        type='number'
                                        placeholder='Ingrese la cantidad que quiere tomar'
                                        value={cantidad}
                                        onChange={handleChange}
                                        style={{ marginTop: '1rem' }}
                                    />
                                    {obras.length === 1 ? (
                                        <Form.Label className="font-rubik" style={{ marginTop: '1rem', fontSize: '1rem' }}>
                                            Usted esta tomando esta oferta para la obra <strong>{obras[0].nombre}</strong>
                                        </Form.Label>
                                    ) : (
                                        <>
                                            <Form.Label className="font-rubik" style={{ fontSize: '0.8rem' }}>
                                                Ingrese la obra que realiza el aporte
                                            </Form.Label>
                                            <Form.Control
                                                as="select"
                                                name="obra"
                                                onChange={(event) => {
                                                    setSelectedObra(obras.find(obra => obra.id_obra === Number(event.target.value)));
                                                }}
                                            >
                                                {obras.filter(obra => selectedOferta.id_obra && selectedOferta.id_obra.id_obra !== obra.id_obra).map(obra => (
                                                    <option key={obra.id_obra} value={obra.id_obra}>
                                                        {obra.nombre}
                                                    </option>
                                                ))}
                                            </Form.Control>
                                        </>
                                    )}
                                </>
                            )}
                            {error && <p style={{ color: 'red', marginTop: '0.5rem', fontSize: '0.8rem', marginBottom: "0px" }}>{error}</p>}
                        </div>
                    }
                />
            )}

            <Modal
                showButton={false}
                showModal={showUserOfertaModal}
                title='Detalles de la Oferta'
                showDeleteButton={true}
                saveButtonText='Terminar Oferta'
                deleteButtonText='Cancelar Oferta'
                handleCloseModal={() => { setShowUserOfertaModal(false); setShowAporteModal(false); }}
                deleteFunction={() => setCancelarOfertaConfirmation(true)}
                handleSave={() => setTerminarOfertaConfirmation(true)}
                content={
                    <div>
                        {selectedOferta && selectedOferta.id_producto && (
                            <GenericCard
                                borde={'none'}
                                shadow={'none'}
                                hoverable={false}
                                key={selectedOferta.id_oferta}
                                titulo={`${selectedOferta.id_producto.nombre}`}
                                foto={selectedOferta.id_producto.imagen}
                                descrip1={`Cantidad: ${selectedOferta.progreso} / ${selectedOferta.cantidad} ${selectedOferta.id_producto.unidadmedida}`}
                                descrip2={<><strong>Obra:</strong> {selectedOferta.id_obra.nombre}</>}
                                descrip3={<><strong>Usuario:</strong> {selectedOferta.id_usuario.nombre} {selectedOferta.id_usuario.apellido}</>}
                                descrip4={<><strong>Estado:</strong> {selectedOferta.id_estadoOferta.nombre} <strong>Cantidad:</strong> {selectedOferta.cantidad} {selectedOferta.id_producto.unidadmedida}</>}
                                descrip5={<><strong>Fecha Vencimiento:</strong> {selectedOferta.fechavencimiento ? selectedOferta.fechavencimiento.split('-').reverse().join('/') : ''}</>}
                            />
                        )}
                    </div>
                }
            />
            <Modal
                showModal={showAporteModal}
                title='Detalles del Aporte'
                showDeleteButton={true}
                deleteFunction={() => handleRejectAporte(selectedAporte)}
                saveButtonShown={false}
                deleteButtonText='Devolver Aporte'
                handleCloseModal={() => { setShowUserOfertaModal(false); setShowAporteModal(false); }}
                showButton={false}
                content={
                    <div>
                        {selectedAporte && (
                            <GenericCard
                                borde={'none'}
                                shadow={'none'}
                                hoverable={false}
                                foto={selectedAporte.id_obra.imagen}
                                titulo={`${selectedAporte.cantidad} ${selectedAporte.id_oferta.id_producto.unidadmedida} de ${selectedAporte.id_oferta.id_producto.nombre}`}
                                descrip1={<><strong>Obra: </strong>{selectedAporte.id_obra.nombre}</>}
                                descrip2={<><strong>Usuario: </strong>{selectedAporte.id_usuario.nombre} {selectedAporte.id_usuario.apellido}</>}
                            />
                        )}
                    </div>
                }
            />
            <ConfirmationModal Open={terminarOfertaConfirmation} BodyText="¿Está seguro que desea terminar con esta oferta?" onClickConfirm={() => handleEndOferta(selectedOferta.id_oferta)} onClose={() => setTerminarOfertaConfirmation(false)} />
            <ConfirmationModal Open={cancelarOfertaConfirmation} BodyText="¿Está seguro que desea cancelar esta oferta?" onClickConfirm={() => handleDeleteOferta(selectedOferta.id_oferta)} onClose={() => setCancelarOfertaConfirmation(false)} />


            {user.is_superuser && (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '2rem', marginTop: '2rem' }}>
                    <SendButton onClick={() => navigate(`/informe_ofertas`)} text='Ver Informe de Ofertas' wide='14' />
                </div>
            )}
        </>
    );
}

export default Ofertas;