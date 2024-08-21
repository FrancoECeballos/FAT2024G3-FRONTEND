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

function Pedidos() {
    const navigate = useNavigate();
    const token = Cookies.get('token');
    const [pedidos, setPedidos] = useState([]);

    const [searchQuery, setSearchQuery] = useState('');
    const [orderCriteria, setOrderCriteria] = useState(null);
    const [productos, setProductos] = useState([]);
    const [obras, setObras] = useState([]);
    const [usuario, setUsuario] = useState('');

    const [formData, setFormData] = useState({
        producto: "",
        obra: "",
        usuario: "",
        urgencia: "",
        cantidad: ""
    });

    useEffect(() => {
        if (!token) {
            navigate('/login');
            return;
        }
    
        fetchData('/pedido/', token).then((result) => {
            setPedidos(result);
        }).catch(error => {
            console.error('Error fetching pedidos:', error);
        });
    }, [token]);

    useEffect(() => {
        // Obtener productos y usuarios desde el backend
        fetchData('/productos', token).then(setProductos);
        fetchData('user', token).then(setUsuario);
    }, [token]);

    useEffect(() => {
        const token = localStorage.getItem('token'); // O donde sea que guardes el token
        if (token) {
            const decodedToken = jwtDecode(token);
            setUsuario(decodedToken.nombre); // Ajusta esto según la estructura de tu token

            // Obtener obras del usuario
            fetchData('obra', token).then((obras) => {
                const obrasFiltradas = obras.filter(obra => obra.usuarioId === decodedToken.id);
                setObras(obrasFiltradas);
            });
        }
    }, []);

    const filteredPedidos = pedidos.filter(pedido => {
        return (
            pedido?.fechainicio?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            pedido?.fechavencimiento?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            pedido?.id_producto?.nombre?.toLowerCase().includes(searchQuery.toLowerCase()) || 
            pedido?.id_obra?.nombre?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            pedido?.id_usuario?.nombre?.toLowerCase().includes(searchQuery.toLowerCase())
        );
    });

    const sortedPedidos = [...filteredPedidos].sort((a, b) => {
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

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevData) => {
            const updatedData = { ...prevData, [name]: value };
            console.log(updatedData);
            return updatedData;
        });
    };

    const handleCreatePedido = () => {
        // Verificar que todos los campos requeridos estén presentes
        if (!formData.obra || !formData.producto || !formData.usuario) {
            alert("Todos los campos son obligatorios.");
            return;
        }

        const fechaInicio = new Date();
        const fechaVencimiento = new Date();
        fechaVencimiento.setMonth(fechaVencimiento.getMonth() + 1);

        const pedidoData = {
            ...formData,
            fechainicio: fechaInicio.toISOString().split('T')[0],
            fechavencimiento: fechaVencimiento.toISOString().split('T')[0]
        };

        postData('crear_pedido/', pedidoData, token).then((nuevoPedido) => {
            setPedidos([...pedidos, nuevoPedido]); // Actualiza el estado con el nuevo pedido
        });
    };

    return (
        <div>
            <FullNavbar selectedPage='Pedidos'/>
            <div className='margen-arriba'>
                <h2 style={{marginLeft: '7rem'}}>Pedidos</h2>
                <SearchBar onSearchChange={handleSearchChange} onOrderChange={setOrderCriteria} filters={filters} />
                <div className='pedido-list'>
                    <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '2rem', marginTop: '2rem'}}>
                        <Modal 
                            openButtonText='¿No encuentra su pedido? Añadalo' 
                            openButtonWidth='20' 
                            title='Nuevo Pedido' 
                            saveButtonText='Crear' 
                            handleSave={handleCreatePedido} 
                            content={
                                <div>
                                    <h2 className='centered'> Nuevo Pedido </h2>
                                    <form onSubmit={(e) => { e.preventDefault(); handleCreatePedido(); }}>
                                        <label>
                                            Producto:
                                            <select name="producto" onChange={handleInputChange} style={{ borderRadius: '10rem', backgroundColor: '#F5F5F5', boxShadow: '0.10rem 0.3rem 0.20rem rgba(0, 0, 0, 0.3)', marginTop: '1rem' }}>
                                                {productos.map((producto, index) => (
                                                    <option key={`${producto.id}-${index}`} value={producto.id}>{producto.nombre}</option>
                                                ))}
                                            </select>
                                        </label>
                                        <label>
                                            Obra:
                                            <select name="obra" onChange={handleInputChange} style={{ borderRadius: '10rem', backgroundColor: '#F5F5F5', boxShadow: '0.10rem 0.3rem 0.20rem rgba(0, 0, 0, 0.3)', marginTop: '1rem' }}>
                                                {obras.map((obra, index) => (
                                                    <option key={`${obra.id}-${index}`} value={obra.id}>{obra.nombre}</option>
                                                ))}
                                            </select>
                                        </label>
                                        <label>
                                            Usuario:
                                            <input
                                                type="text"
                                                name="usuario"
                                                value={usuario ? usuario.nombre : ''}
                                                readOnly
                                                style={{ borderRadius: '10rem', backgroundColor: '#F5F5F5', boxShadow: '0.10rem 0.3rem 0.20rem rgba(0, 0, 0, 0.3)', marginTop: '1rem' }}
                                            />
                                        </label>
                                        <Form.Control name="urgencia" type="text" placeholder="Urgencia" onChange={handleInputChange} style={{ borderRadius: '10rem', backgroundColor: '#F5F5F5', boxShadow: '0.10rem 0.3rem 0.20rem rgba(0, 0, 0, 0.3)', marginTop: '1rem' }} />
                                        <Form.Control name="cantidad" type="text" placeholder="Cantidad" onChange={handleInputChange} style={{ borderRadius: '10rem', backgroundColor: '#F5F5F5', boxShadow: '0.10rem 0.3rem 0.20rem rgba(0, 0, 0, 0.3)', marginTop: '1rem' }} />
                                        <button type="submit" style={{ display: 'none' }}>Crear Pedido</button>
                                    </form>
                                </div>
                            }
                        />
                    </div>
    
                    {Array.isArray(sortedPedidos) && sortedPedidos.length > 0 ? (
                        sortedPedidos.map(pedido => (
                            <GenericCard
                                key={pedido.id_pedido}
                                titulo={`Pedido: ${pedido.id_producto.nombre}`}
                                foto={pedido.id_producto.imagen}
                                descrip1={<><strong>Obra:</strong> {pedido.id_obra.nombre}</>}
                                descrip2={<><strong>Usuario:</strong> {pedido.id_usuario.nombre} {pedido.id_usuario.apellido}</>}
                                descrip3={<><strong>Urgencia:</strong> {pedido.urgente} <strong>Cantidad:</strong> {pedido.cantidad}</>}
                                descrip4={<><strong>Fecha Inicio:</strong> {pedido.fechainicio ? pedido.fechainicio.split('-').reverse().join('/') : ''} {pedido.horainicio}</>}
                                descrip5={<><strong>Fecha Vencimiento:</strong> {pedido.fechavencimiento ? pedido.fechavencimiento.split('-').reverse().join('/') : ''} {pedido.horavencimiento}</>}
                            />
                        ))
                    ) : (
                        <p style={{marginLeft: '7rem', marginTop: '1rem'}}> No hay pedidos disponibles.</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Pedidos;