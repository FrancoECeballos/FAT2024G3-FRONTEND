import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { Form } from 'react-bootstrap';

import FullNavbar from '../../components/navbar/full_navbar/FullNavbar.jsx';
import GenericCard from '../../components/cards/generic_card/GenericCard.jsx';
import SearchBar from '../../components/searchbar/searchbar.jsx';
import fetchData from '../../functions/fetchData';
import fetchUser from '../../functions/fetchUser';
import Modal from '../../components/modals/Modal.jsx';
import OfertaCard from '../../components/cards/oferta_card/OfertaCard.jsx';
import postData from '../../functions/postData.jsx';
import Loading from '../../components/loading/loading.jsx';

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
    const [stocks, setStocks] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showTakeOfertaModal, setShowTakeOfertaModal] = useState(false);

    useEffect(() => {
        if (!token) {
            navigate('/login');
            return;
        }

        const fetchUserData = async () => {
            try {
                const userData = await fetchUser();
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
        const aValue = a[orderCriteria];
        const bValue = b[orderCriteria];
        if (typeof aValue === 'string' && typeof bValue === 'string') {
            return aValue.toLowerCase().localeCompare(bValue.toLowerCase());
        }
        if (typeof aValue === 'number' && typeof bValue === 'number') {
            return bValue - aValue;
        }
        return 0;
    });

    const filters = [
        { type: 'fechainicio', label: 'Fecha Inicio' },
        { type: 'fechavencimiento', label: 'Fecha Vencimiento' }
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
            postData('crear_oferta/', ofertaForm, token).then((result) => {
                console.log('Oferta creada:', result);
            }).catch((error) => {
                console.error('Error al crear la oferta:', error);
            });
            window.location.reload();
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
            await postData('crear_detalle_oferta/', data, token);
            console.log('Aporte de la oferta creado');
            window.location.reload();
            return true;
        } catch (error) {
            console.error('Error creando el aporte de la oferta:', error);
            return false;
        }
    };

    if (isLoading) {
        return <div><FullNavbar/><Loading /></div>;
    }

    return (
        <div>
            <FullNavbar selectedPage='Ofertas' />
            <div className='margen-arriba'>
                <h2 style={{marginLeft: '7rem'}}>Ofertas</h2>
                <SearchBar onSearchChange={handleSearchChange} onOrderChange={setOrderCriteria} filters={filters} />
                <div className='oferta-list'>
                    <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '2rem', marginTop: '2rem'}}>
                        <Modal
                            openButtonText='¿No encuentra su oferta? Añádala'
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
                                        onClick={() => {setSelectedOferta(oferta), setShowTakeOfertaModal(true)}}
                                        titulo={`${oferta.id_producto.nombre}`}
                                        foto={oferta.id_producto.imagen}
                                        descrip1={`Cantidad: ${oferta.progreso} / ${oferta.cantidad} ${oferta.id_producto.unidadmedida}`}
                                        descrip2={<><strong>Obra:</strong> {oferta.id_obra.nombre}</>}
                                        descrip3={<><strong>Usuario:</strong> {oferta.id_usuario.nombre} {oferta.id_usuario.apellido}</>}
                                        descrip4={<><strong>Estado:</strong> {oferta.id_estadoOferta.nombre} <strong>Cantidad:</strong> {oferta.cantidad} {oferta.id_producto.unidadmedida}</>}
                                        descrip5={<><strong>Fecha Vencimiento:</strong> {oferta.fechavencimiento ? oferta.fechavencimiento.split('-').reverse().join('/') : ''}</>}
                                    />
                                </div>
                            ))
                        ) : (
                            <p style={{marginLeft: '7rem', marginTop: '1rem'}}>No hay ofertas disponibles.</p>
                        )}
                    </div>
                </div>
            </div>

            {selectedOferta && (
                <Modal
                    showButton={false}
                    showModal={showTakeOfertaModal}
                    saveButtonText='Tomar'
                    handleCloseModal={() => {setShowTakeOfertaModal(false), setSelectedOferta(null)}}
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
                                placeholder='Ingrese la cantidad a aportar'
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
