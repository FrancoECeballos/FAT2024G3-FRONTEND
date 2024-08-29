import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form } from 'react-bootstrap';
import Cookies from 'js-cookie';
import { Icon } from '@iconify/react';

import FullNavbar from '../../components/navbar/full_navbar/FullNavbar.jsx';
import GenericCard from '../../components/cards/generic_card/GenericCard.jsx';
import SearchBar from '../../components/searchbar/searchbar.jsx';
import fetchData from '../../functions/fetchData';
import fetchUser from '../../functions/fetchUser';
import Modal from '../../components/modals/Modal.jsx';
import OfertaCard from '../../components/cards/oferta_card/OfertaCard.jsx';
import postData from '../../functions/postData.jsx';

function Ofertas() {
    const navigate = useNavigate();
    const token = Cookies.get('token');
    const [ofertas, setOfertas] = useState([]);
    const ofertaCardRef = useRef(null);
    const [selectedOfertaId, setSelectedOfertaId] = useState(null);

    const [cantidad, setCantidad] = useState('');
    const [error, setError] = useState('');

    const [searchQuery, setSearchQuery] = useState('');
    const [orderCriteria, setOrderCriteria] = useState(null);

    const [user, setUser] = useState({});
    const [stocks, setStocks] = useState([]);

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

        fetchUserData().then(() => {
            fetchData('/oferta/', token).then((result) => {
                setOfertas(result);
            }).catch(error => {
                console.error('Error fetching orders:', error);
            });
        });
    }, [token, navigate]);

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
        }
    };

    const createAporteOferta = (ofertaId, usuarioId, fecha, cantidad) => {
        const data = {
            id_oferta: ofertaId,
            id_usuario: usuarioId,
            fecha: fecha,
            cantidad: cantidad
        };
    
        postData('crear_detalle_oferta/', data, token).then(() => {
            console.log('Aporte de la oferta creado');
            window.location.reload();
        }).catch(error => {
            console.error('Error creating aporte oferta:', error);
        });
    };

    return (
        <div>
            <FullNavbar selectedPage='Ofertas' />
            <div className='margen-arriba'>
                <h2 style={{marginLeft: '7rem'}}>Ofertas</h2>
                <SearchBar onSearchChange={handleSearchChange} onOrderChange={setOrderCriteria} filters={filters} />
                <div className='oferta-list'>
                    <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '2rem', marginTop: '2rem'}}>
                        <Modal
                            openButtonText='¿No encuentra su oferta? Añadala' 
                            openButtonWidth='20' 
                            title='Nueva Oferta' 
                            saveButtonText='Crear' 
                            handleSave={handleCreateOferta} 
                            content={
                                <OfertaCard user={user} stocksDisponibles={stocks} ref={ofertaCardRef}/>
                            }
                        />
                    </div>
                    <div className='cardCategori'>
                        {Array.isArray(sortedOfertas) && sortedOfertas.length > 0 ? (
                            sortedOfertas.map(oferta => (
                                <GenericCard
                                    key={oferta.id_oferta}
                                    titulo={`${oferta.id_producto.nombre}`}
                                    foto={oferta.id_producto.imagen}
                                    descrip1={`Cantidad: ${oferta.progreso} / ${oferta.cantidad} ${oferta.id_producto.unidadmedida}`}
                                    descrip2={<><strong>Obra:</strong> {oferta.id_obra.nombre}</>}
                                    descrip3={<><strong>Usuario:</strong> {oferta.id_usuario.nombre} {oferta.id_usuario.apellido}</>}
                                    descrip4={<><strong>Estado:</strong> {oferta.id_estadoOferta.nombre} <strong>Cantidad:</strong> {oferta.cantidad} {oferta.id_producto.unidadmedida}</>}
                                    descrip5={<><strong>Fecha Vencimiento:</strong> {oferta.fechavencimiento ? oferta.fechavencimiento.split('-').reverse().join('/') : ''}</>}
                                    children={
                                        <>
                                          <Icon
                                            icon="line-md:edit-twotone"
                                            className="hoverable-icon"
                                            style={{ width: "2.5rem", height: "2.5rem", position: "absolute", top: "1rem", right: "1rem", color: "#02005E", transition: "transform 1s" }}
                                            onClick={() => setSelectedOfertaId(oferta.id_oferta)}
                                          />
                                          <Modal
                                            showButton={false}
                                            showModal={selectedOfertaId === oferta.id_oferta}
                                            saveButtonText={'Tomar'}
                                            handleCloseModal={() => setSelectedOfertaId(null)}
                                            title={'Tomar Oferta'}
                                            handleSave={() => createAporteOferta(oferta.id_oferta, user.id_usuario, new Date().toISOString().split('T')[0], cantidad)}
                                            content={
                                              <div>
                                                <GenericCard
                                                  key={oferta.id_oferta}
                                                  foto={oferta.id_producto.imagen}
                                                  titulo={oferta.id_producto.nombre}
                                                  descrip1={`Cantidad: ${oferta.cantidad} ${oferta.id_producto.unidadmedida}`}
                                                  descrip2={`Fecha Inicio: ${oferta.fechainicio}`}
                                                  descrip3={`Fecha Vencimiento: ${oferta.fechavencimiento}`}
                                                  descrip4={`Obra: ${oferta.id_obra.nombre}`}
                                                  descrip5={`Usuario: ${oferta.id_usuario.nombre} ${oferta.id_usuario.apellido}`}
                                                />
                                                <Form.Group className="mb-2" controlId="formBasicCantidad">
                                                <Form.Label className="font-rubik" style={{ fontSize: '0.8rem' }}>
                                                    Ingrese la cantidad que quiere aportar
                                                </Form.Label>
                                                <Form.Control
                                                    name="cantidad"
                                                    type="number"
                                                    placeholder="Ingrese la cantidad"
                                                    value={cantidad}
                                                    onChange={handleChange}
                                                    onKeyDown={(event) => {
                                                    if (
                                                        !/[0-9.]/.test(event.key) &&
                                                        !['Backspace', 'ArrowLeft', 'ArrowRight', 'Shift'].includes(event.key)
                                                    ) {
                                                        event.preventDefault();
                                                    }
                                                    }}
                                                />
                                                {error && <p style={{ color: 'red' }}>{error}</p>}
                                                </Form.Group>
                                              </div>
                                            }
                                          />
                                        </>
                                      }
                                />
                            ))
                        ) : (
                            <p style={{marginLeft: '7rem', marginTop: '1rem'}}>No hay ofertas disponibles.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Ofertas;