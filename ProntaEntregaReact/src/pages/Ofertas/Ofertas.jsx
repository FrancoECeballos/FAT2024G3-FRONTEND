import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { Form, Breadcrumb } from 'react-bootstrap';

import FullNavbar from '../../components/navbar/full_navbar/FullNavbar.jsx';
import GenericCard from '../../components/cards/generic_card/GenericCard.jsx';
import SearchBar from '../../components/searchbar/searchbar.jsx';
import fetchData from '../../functions/fetchData';
import fetchUser from '../../functions/fetchUser';
import Modal from '../../components/modals/Modal.jsx';
import OfertaCard from '../../components/cards/oferta_card/OfertaCard.jsx';
import postData from '../../functions/postData.jsx';
import Loading from '../../components/loading/loading.jsx';
import crearNotificacion from '../../functions/createNofiticacion.jsx';

function Ofertas() {
    const navigate = useNavigate();
    const token = Cookies.get('token');
    const [ofertas, setOfertas] = useState([]);
    const ofertaCardRef = useRef(null);
    const [isFormValid, setIsFormValid] = useState(false);

    const [selectedOferta, setSelectedOferta] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [cantidad, setCantidad] = useState('');
    const [error, setError] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [orderCriteria, setOrderCriteria] = useState(null);
    const [user, setUser] = useState({});
    const [productos, setProductos] = useState([]);
    const [obras, setObras] = useState([]);
    const [stocks, setStocks] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showTakeOfertaModal, setShowTakeOfertaModal] = useState(false);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userData = await fetchUser(navigate);
                setUser(userData);
                if (userData.is_superuser) {
                    fetchData(`stock/`, token).then((result) => {
                        setStocks(result);
                    });
                } else {
                    fetchData(`/user/stockToken/${token}`, token).then((result) => {
                        setStocks(result);
                    });
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        const fetchDataAsync = async () => {
            try {
                await fetchUserData();
                const result = await fetchData('/oferta/', token);
                setOfertas(result);
            } catch (error) {
                console.error('Error fetching offers:', error);
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

    const filters = [
        { type: 'id_producto.nombre', label: 'Nombre del Producto' },
        { type: 'fechainicio', label: 'Fecha Inicio' },
        { type: 'fechavencimiento', label: 'Fecha Vencimiento' },
        { type: 'id_obra.nombre', label: 'Obra que Ofrece' },
        { type: 'id_usuario.nombre', label: 'Usuario que ofrece' },
    ];

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
            const { producto, obra } = ofertaForm; // Asegurarse de que estos valores estén presentes
            postData('crear_oferta/', ofertaForm, token).then((result) => {
                console.log('Oferta creada:', result);

                const tituloNotificacion = ` "Notificacion Creada" - ${user.nombre} ${user.apellido}`;
                const fechaCreacion = new Date().toISOString().split('T')[0];
                const descripcionNotificacion = `Nueva oferta creada de "${productos.nombre}" por "${obras.nombre}"`;
                const dataNotificacion = {
                    titulo: tituloNotificacion,
                    descripcion: descripcionNotificacion,
                    id_usuario: user.id_usuario,
                    fecha_creacion: fechaCreacion
                };
                console.log('Datos de la notificación:', dataNotificacion);
                return crearNotificacion(dataNotificacion, token).then(() => {
                    window.location.reload();
                });
            }).catch((error) => {
                console.error('Error al crear la oferta:', error);
            });
        }
    };

    const createAporteOferta = async (ofertaId, usuarioId, fecha, cantidad) => {
        const oferta = ofertas.find(oferta => oferta.id_oferta === ofertaId);
        const cantidadRestante = oferta.cantidad - oferta.progreso;

        if (parseFloat(cantidad) > parseFloat(cantidadRestante)) {
            setError(`La cantidad ofrecida no puede exceder la cantidad restante de ${cantidadRestante} ${oferta.id_producto.unidadmedida}`);
            return false;
        }

        const data = {
            id_oferta: ofertaId,
            id_usuario: usuarioId,
            fecha: fecha,
            cantidad: cantidad
        };

        try {
            await postData('crear_detalle_oferta/', data, token).then(() => {
                console.log('Aporte de la oferta creado');
                window.location.reload();
                return true;
            });
        } catch (error) {
            console.error('Error creando el aporte de la oferta:', error);
            return false;
        }
    };

    if (isLoading) {
        return <div><FullNavbar /><Loading /></div>;
    }

    return (
        <div>
            <FullNavbar selectedPage='Ofertas' />
            <div className='margen-arriba'>
                <Breadcrumb style={{ marginLeft: "8%", fontSize: "1.2rem" }}>
                    <Breadcrumb.Item active>Ofertas</Breadcrumb.Item>
                </Breadcrumb>
                <SearchBar onSearchChange={handleSearchChange} onOrderChange={setOrderCriteria} filters={filters} />
                <div className='oferta-list'>
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '2rem', marginTop: '2rem' }}>
                        <Modal
                            openButtonText='¿No encuentra su Oferta? Añadala'
                            openButtonWidth='20'
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
                    <div className='cardCategori'>
                        {Array.isArray(sortedOfertas) && sortedOfertas.length > 0 ? (
                            sortedOfertas.map(oferta => (
                                <div key={oferta.id_oferta}>
                                    <GenericCard
                                        onClick={() => { setSelectedOferta(oferta), setShowTakeOfertaModal(true) }}
                                        titulo={`${oferta.id_producto.nombre}`}
                                        foto={oferta.id_producto.imagen}
                                        descrip1={<><strong>Cantidad:</strong> {oferta.progreso} / {oferta.cantidad} {oferta.id_producto.unidadmedida}</>}
                                        descrip2={<><strong>Obra:</strong> {oferta.id_obra.nombre} <strong>Usuario:</strong> {oferta.id_usuario.nombre} {oferta.id_usuario.apellido}</>}
                                        descrip3={<><strong>Estado:</strong> {oferta.id_estadoOferta.nombre}</>}
                                        descrip4={<><strong>Fecha Vencimiento:</strong> {oferta.fechavencimiento ? oferta.fechavencimiento.split('-').reverse().join('/') : ''}</>}
                                    />
                                </div>
                            ))
                        ) : (
                            <p style={{ marginLeft: '7rem', marginTop: '1rem' }}>No hay ofertas disponibles.</p>
                        )}
                    </div>
                </div>
            </div>

            {selectedOferta && (
                <Modal
                    showButton={false}
                    showModal={showTakeOfertaModal}
                    saveButtonText='Tomar'
                    handleCloseModal={() => { setShowTakeOfertaModal(false), setSelectedOferta(null) }}
                    title='Tomar Oferta'
                    handleSave={() => createAporteOferta(selectedOferta.id_oferta, user.id_usuario, new Date().toISOString().split('T')[0], cantidad)}
                    content={
                        <div>
                            <GenericCard
                                key={selectedOferta.id_oferta}
                                titulo={`${selectedOferta.id_producto.nombre}`}
                                foto={selectedOferta.id_producto.imagen}
                                descrip1={`Cantidad: ${selectedOferta.progreso} / ${selectedOferta.cantidad} ${selectedOferta.id_producto.unidadmedida}`}
                                descrip2={<><strong>Obra:</strong> {selectedOferta.id_obra.nombre}</>}
                                descrip3={<><strong>Usuario:</strong> {selectedOferta.id_usuario.nombre} {selectedOferta.id_usuario.apellido}</>}
                                descrip4={<><strong>Estado:</strong> {selectedOferta.id_estadoOferta.nombre} <strong>Cantidad:</strong> {selectedOferta.cantidad} {selectedOferta.id_producto.unidadmedida}</>}
                                descrip5={<><strong>Fecha Vencimiento:</strong> {selectedOferta.fechavencimiento ? selectedOferta.fechavencimiento.split('-').reverse().join('/') : ''}</>}
                            />
                            <Form.Control
                                type='number'
                                placeholder='Ingrese la cantidad que quiere tomar'
                                value={cantidad}
                                onChange={handleChange}
                                style={{ marginTop: '1rem' }}
                            />
                            {error && <p style={{ color: 'red', marginTop: '0.5rem' }}>{error}</p>}
                        </div>
                    }
                />
            )}
        </div>
    );
}

export default Ofertas;
