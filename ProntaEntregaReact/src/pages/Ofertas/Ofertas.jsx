import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

import FullNavbar from '../../components/navbar/full_navbar/FullNavbar.jsx';
import GenericCard from '../../components/cards/generic_card/GenericCard.jsx';
import SearchBar from '../../components/searchbar/searchbar.jsx';
import fetchData from '../../functions/fetchData';
import Modal from '../../components/modals/Modal.jsx';
import {InputGroup, Form, Button} from 'react-bootstrap';
import postData from '../../functions/postData.jsx';

function Ofertas() {
    const navigate = useNavigate();
    const token = Cookies.get('token');
    const [ofertas, setOfertas] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [orderCriteria, setOrderCriteria] = useState(null);
    const [productos, setProductos] = useState([]);
    const [obras, setObras] = useState([]);
    const [usuarios, setUsuarios] = useState([]);
    const [formData, setFormData] = useState({
        producto: "",
        obra: "",
        usuario: "",
        cantidad: ""
    });

    useEffect(() => {
        if (!token) {
            navigate('/login');
            return;
        }
        fetchData('/oferta/', token).then((result) => {
            setOfertas(result);
        }).catch(error => {
            console.error('Error fetching orders:', error);
        });
        fetchData('/productos', token).then(setProductos);
        fetchData('/obra', token).then(setObras);
        fetchData('/user', token).then(setUsuarios)
            .then(response => response.json())
            .then(data => setUsuarios(data))
            .catch(error => console.error('Error al cargar los usuarios:', error));
    }, [token, navigate, formData.usuario]);

    useEffect(() => {
        const token = localStorage.getItem('token'); // O donde sea que guardes el token
        if (token) {
            const decodedToken = jwtDecode(token);
            setUsuario(decodedToken.nombre); // Ajusta esto según la estructura de tu token
        }
    }, []);

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

    const handleSearchChange = (value) => {
        setSearchQuery(value);
    };

    const handleInputChange = async (event) => {
        const { name, value } = event.target;
        setFormData((prevData) => {
            const updatedData = { ...prevData, [name]: value };
            console.log(updatedData);
            return updatedData;
        });
    };

    const handleCreateOferta = () => {
        // Verificar que todos los campos requeridos estén presentes
        postData('crear_oferta/', formData, token).then((nuevaOferta) => {
            setOfertas([...ofertas, nuevaOferta]); // Actualiza el estado con el nuevo pedido
        })
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
                            openButtonText='¿No encuentra su pedido? Añadalo' 
                            openButtonWidth='20' 
                            title='Nuevo Oferta' 
                            saveButtonText='Crear' 
                            handleSave={handleCreateOferta} 
                            content={
                                <div>
                                    <h2 className='centered'> Nuevo Oferta </h2>
                                    <form onSubmit={(e) => { e.preventDefault(); handleCreateOferta(); }}>
                                        <label>
                                            Producto:
                                            <select name="producto" onChange={handleInputChange} style={{ borderRadius: '10rem', backgroundColor: '#F5F5F5', boxShadow: '0.10rem 0.3rem 0.20rem rgba(0, 0, 0, 0.3)', marginTop: '1rem' }}>
                                                <option value="">Seleccione su producto</option>
                                                {productos.map((producto, index) => (
                                                    <option key={`${producto.id}-${index}`} value={producto.id}>{producto.nombre}</option>
                                                ))}
                                            </select>
                                        </label>
                                        <label>
                                            Obra:
                                            <select name="obra" onChange={handleInputChange} style={{ borderRadius: '10rem', backgroundColor: '#F5F5F5', boxShadow: '0.10rem 0.3rem 0.20rem rgba(0, 0, 0, 0.3)', marginTop: '1rem' }}>
                                                <option value="">Seleccione su obra</option>
                                                {obras.map((obra, index) => (
                                                    <option key={`${obra.id}-${index}`} value={obra.id}>{obra.nombre}</option>
                                                ))}
                                            </select>
                                        </label>
                                        <label>
                                            Usuario:
                                            <select name="usuario" onChange={handleInputChange} style={{ borderRadius: '10rem', backgroundColor: '#F5F5F5', boxShadow: '0.10rem 0.3rem 0.20rem rgba(0, 0, 0, 0.3)', marginTop: '1rem' }}>
                                                <option value="">Seleccione su usuario</option>
                                                {usuarios.map((usuario, index) => (
                                                    <option key={`${usuario.id}-${index}`} value={usuario.id}>{usuario.nombre}</option>
                                                ))}
                                            </select>
                                        </label>
                                        <Form.Control name="cantidad" type="text" placeholder="Cantidad" onChange={handleInputChange} style={{ borderRadius: '10rem', backgroundColor: '#F5F5F5', boxShadow: '0.10rem 0.3rem 0.20rem rgba(0, 0, 0, 0.3)', marginTop: '1rem' }} />
                                        <button type="submit" style={{ display: 'none' }}>Crear Pedido</button>
                                    </form>
                                </div>
                            }
                        />
                    </div>
                    {Array.isArray(sortedOfertas) && sortedOfertas.length > 0 ? (
                        sortedOfertas.map(oferta => (
                            <GenericCard
                                key={oferta.id_oferta}
                                titulo={`Oferta: ${oferta.id_producto.nombre}`}
                                foto={oferta.id_producto.imagen}
                                descrip1={<><strong>Obra:</strong> {oferta.id_obra.nombre}</>}
                                descrip2={<><strong>Usuario:</strong> {oferta.id_usuario.nombre} {oferta.id_usuario.apellido}</>}
                                descrip3={<><strong>Estado:</strong> {oferta.id_estadooferta.nombre} <strong>Cantidad:</strong> {oferta.cantidad}</>}
                                descrip4={<><strong>Fecha Inicio:</strong> {oferta.fechainicio ? oferta.fechainicio.split('-').reverse().join('/') : ''} {oferta.horainicio}</>}
                                descrip5={<><strong>Fecha Vencimiento:</strong> {oferta.fechavencimiento ? oferta.fechavencimiento.split('-').reverse().join('/') : ''} {oferta.horavencimiento}</>}
                            />
                        ))
                    ) : (
                        <p style={{marginLeft: '7rem', marginTop: '1rem'}}>No hay ofertas disponibles.</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Ofertas;
