import Cookies from 'js-cookie';
import React, { useEffect, useState } from "react";
import {Breadcrumb, Form, Col, Row} from 'react-bootstrap';

import FullNavbar from '../../components/navbar/full_navbar/FullNavbar';
import GenericCard from '../../components/cards/generic_card/GenericCard';
import LittleCard from '../../components/cards/little_card/LittleCard';
import SearchBar from '../../components/searchbar/searchbar.jsx';
import Modal from '../../components/modals/Modal.jsx';

import fetchData from '../../functions/fetchData.jsx';
import putData from '../../functions/putData.jsx';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import Loading from '../../components/loading/loading.jsx';
import fetchUser from '../../functions/fetchUser.jsx';

import './Entregas.scss';

const Entregas = () => {
    const [entregas, setEntregas] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const [aporteModal, setAporteModal] = useState(null);
    const [fechaEntrega, setFechaEntrega] = useState("");
    const [vehiculos, setVehiculos] = useState([]);
    const [selectedVehiculo, setSelectedVehiculo] = useState("medios_propios");

    const navigate = useNavigate();
    const token = Cookies.get('token');

    const [searchQuery, setSearchQuery] = useState('');
    const [orderCriteria, setOrderCriteria] = useState(null);

    useEffect(() => {
        if (!token) {
            navigate('/login');
            return;
        }
    
        fetchData('entrega/', token).then((result) => {
            setEntregas(result);
            console.log(result);
            setIsLoading(false);
        }).catch(error => {
            console.error('Error fetching entregas:', error);
        });
    }, [token, navigate]);

    const filteredEntregas = entregas.filter(entrega => {
        return (
            entrega.fechaCreacion?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (entrega.id_pedido ? 
                (
                    entrega.id_pedido.id_producto.nombre?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    entrega.id_pedido.id_obra.nombre?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    entrega.id_pedido.id_usuario.nombre?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    entrega.id_pedido.id_usuario.apellido?.toLowerCase().includes(searchQuery.toLowerCase())
                ) : 
                (
                    entrega.id_oferta.id_producto.nombre?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    entrega.id_oferta.id_obra.nombre?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    entrega.id_oferta.id_usuario.nombre?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    entrega.id_oferta.id_usuario.apellido?.toLowerCase().includes(searchQuery.toLowerCase())
                )
            )
        );
    });

    const sortedEntregas = [...filteredEntregas].sort((a, b) => {
        if (!orderCriteria) return 0;
        const getValue = (obj, path) => {
            return path.split('.').reduce((acc, part) => acc && acc[part], obj);
        };

        const aValue = getValue(a, orderCriteria);
        const bValue = getValue(b, orderCriteria);

        if (orderCriteria.includes('fechaCreacion')) {
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
        { type: 'fechaCreacion', label: 'Fecha de Creación' },
        { type: 'id_pedido.id_producto.nombre', label: 'Nombre del Producto' },
        { type: 'id_pedido.id_obra.nombre', label: 'Obra que Ofrece' },
        { type: 'id_pedido.id_usuario.nombre', label: 'Nombre del Usuario que ofrece' },
        { type: 'id_pedido.id_usuario.nombre', label: 'Apellido del Usuario que ofrece' },
    ];

    const handleFetchVehiculos = (obra) => {
        setSelectedVehiculo("medios_propios");
        fetchData(`transporte/${obra}/`, token).then((result) => {
            setVehiculos(result);
        }).catch(error => {
            console.error('Error fetching vehiculos:', error);
        });
    };

    const handleUpdateEntregaAporte = () => {
        const data = {...aporteModal, fechaEntrega: fechaEntrega || undefined, id_transporte: selectedVehiculo};
        putData(`editar_entrega_aporte/${data.id_entregaAporte}/`, data, token).then(() => {
            setAporteModal(null);
            fetchData('entrega/', token).then((result) => {
                setEntregas(result);
                console.log(result);
                setIsLoading(false);
            }).catch(error => {
                console.error('Error fetching entregas:', error);
            });
        }).catch(error => {
            console.error('Error updating entrega aporte:', error);
        });
    };

    const handleSearchChange = (value) => {
        setSearchQuery(value);
    };

    return (
        <div>
            <FullNavbar selectedPage='Entregas' />
            <div className='margen-arriba'>
                <Breadcrumb style={{ marginLeft: "8%", fontSize: "1.2rem" }}>
                    <Breadcrumb.Item active>Entregas</Breadcrumb.Item>
                </Breadcrumb>
                <SearchBar filters={filters} onSearchChange={handleSearchChange} onOrderChange={setOrderCriteria} />
                {isLoading ? (
                    <Loading />
                ) : (
                    <div style={{marginTop: '2.5rem'}}>
                        {sortedEntregas.length === 0 ? (
                            <p style={{ marginLeft: '7rem', marginTop: '1rem' }}>No hay entregas disponibles.</p>
                        ) : (
                            sortedEntregas.map((entrega) => {
                                return (
                                    <GenericCard
                                        key={entrega.id_entrega}
                                        titulo={entrega.id_pedido === null ? 'Oferta de ' + entrega.id_oferta.id_producto.nombre : 'Pedido de ' + entrega.id_pedido.id_producto.nombre}
                                        descrip1={<><strong>{entrega.id_pedido === null ? 'Ofrecido por la obra:' : 'Pedido por la obra:'}</strong> {entrega.id_pedido === null ? entrega.id_oferta.id_obra.nombre : entrega.id_pedido.id_obra.nombre}</>}
                                        descrip2={<><strong>{entrega.id_pedido === null ? 'Ofrecido por el usuario:' : 'Pedido por el usuario:'}</strong> {entrega.id_pedido === null ? entrega.id_oferta.id_usuario.nombre + ' ' + entrega.id_oferta.id_usuario.apellido : entrega.id_pedido.id_usuario.nombre + ' ' + entrega.id_pedido.id_usuario.apellido}</>}
                                        descrip3={<><strong>Creado en:</strong> {entrega.id_pedido === null ? entrega.id_oferta.fechainicio : entrega.id_pedido.fechainicio}</>}
                                        foto={entrega.id_pedido === null ? entrega.id_oferta.id_producto.imagen : entrega.id_pedido.id_producto.imagen}
                                        children={
                                            <div className='scroll-horizontal-entregas'>
                                                {entrega.entrega_aportes.map((aporte) => (
                                                    <LittleCard
                                                        key={aporte.id_entregaAporte}
                                                        titulo={aporte.id_aportePedido === null ? `${aporte.id_aporteOferta.cantidad} ${aporte.id_aporteOferta.id_oferta.id_producto.unidadmedida} tomados` : `${aporte.id_aportePedido.cantidad} ${aporte.id_aportePedido.id_pedido.id_producto.unidadmedida} dados`}
                                                        descrip1={aporte.id_aportePedido === null ? `${aporte.id_aporteOferta.id_usuario.nombre} ${aporte.id_aporteOferta.id_usuario.apellido}` : `${aporte.id_aportePedido.id_usuario.nombre} ${aporte.id_aportePedido.id_usuario.apellido}`}
                                                        descrip2={aporte.id_aportePedido === null ? aporte.id_aporteOferta.id_obra.nombre : aporte.id_aportePedido.id_obra.nombre}
                                                        foto={aporte.id_aportePedido === null ? aporte.id_aporteOferta.id_obra.imagen : aporte.id_aportePedido.id_obra.imagen}
                                                        onSelect={() => {setAporteModal(aporte); handleFetchVehiculos(aporte.id_aportePedido === null ? aporte.id_aporteOferta.id_obra.id_obra : aporte.id_aportePedido.id_obra.id_obra)}}
                                                    />
                                                ))}
                                            </div>
                                        }
                                    />
                                );
                            })
                        )}
                        <Modal
                            showButton = {false}
                            showModal = {aporteModal != null}
                            handleCloseModal={() => setAporteModal(null)}
                            handleSave={() => handleUpdateEntregaAporte()}
                            title = 'Tomar Aporte'
                            content={
                                <>
                                    <Form.Label className="font-rubik" style={{ fontSize: '0.8rem' }}>
                                        Ingrese la fecha estimada de la entrega (Opcional)
                                    </Form.Label>
                                    <Form.Control
                                        name="fechaEntrega"
                                        type="date"
                                        min={new Date().toISOString().split('T')[0]}
                                        value={fechaEntrega || ""}
                                        onChange={(e) => setFechaEntrega(e.target.value)}
                                    />
                                    <Form.Label className="font-rubik" style={{ fontSize: '0.8rem' }}>
                                        Ingrese el vehiculo con el que se realizará la entrega (Opcional)
                                    </Form.Label>
                                    <Form.Control
                                        name="id_vehiculo"
                                        as="select"
                                        value={selectedVehiculo || ""}
                                        onChange={(event) => setSelectedVehiculo(event.target.value)}
                                    >
                                        <option value="medios_propios">Medios Propios</option>
                                        {vehiculos && (
                                            vehiculos.map(vehiculo => 
                                                <option key={vehiculo.id_transporte} value={vehiculo.id_transporte}>{vehiculo.marca}, {vehiculo.modelo} {vehiculo.patente}</option>
                                            )
                                        )}
                                    </Form.Control>
                                </>
                            }
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default Entregas;