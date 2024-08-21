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
    const [usuarios, setUsuarios] = useState([]);
    const [usuarioLogueado, setUsuarioLogueado] = useState(null);

    const [formData, setFormData] = useState({
        producto: "",
        obra: "",
        usuario: "",
        urgencia: 1, // Valor inicial de urgencia
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
        fetchData('/productos', token).then(setProductos);
        fetchData(`/userToken/${token}`, token).then(setUsuarioLogueado);
    }, [token]);

    useEffect(() => {
        if (token) {
            fetchData(`/userToken/${token}`, token).then((result) => {
                const email = result.email;
                if (result.is_superuser) {
                    fetchData('/obra/', token).then((result) => {
                        setObras(result);
                    }).catch(error => {
                        console.error('Error fetching obras for admin', error);
                    });
                } else {
                    fetchData(`/user/obrasEmail/${email}/`, token).then((result) => {
                        const obraIds = result.map(obra => obra.id_obra);
                        const obraPromises = obraIds.map(id => fetchData(`/obra/${id}`, token));
                        Promise.all(obraPromises).then(obras => {
                            setObras(obras.flat());
                        }).catch(error => {
                            console.error('Error fetching obras by ID', error);
                        });
                    }).catch(error => {
                        console.error('Error fetching obras for user', error);
                    });
                }
            }).catch(error => {
                console.error('Error fetching user data:', error);
            });

        }
    }, [token]);

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
                                                <option value="">Seleccione un usuario</option>
                                                {usuarios.map((usuario, index) => (
                                                    <option key={`${usuario.id}-${index}`} value={usuario.id}>{usuario.nombre}</option>
                                                ))}
                                                {usuarioLogueado && <option value={usuarioLogueado.id}>{usuarioLogueado.nombre}</option>}
                                            </select>
                                        </label>
                                        <div>
                                            <label>Urgencia:</label>
                                            <div>
                                                <Button variant={formData.urgencia === 1 ? 'primary' : 'secondary'} onClick={() => handleUrgenciaChange(1)}>Urgencia 1</Button>
                                                <Button variant={formData.urgencia === 2 ? 'primary' : 'secondary'} onClick={() => handleUrgenciaChange(2)}>Urgencia 2</Button>
                                                <Button variant={formData.urgencia === 3 ? 'primary' : 'secondary'} onClick={() => handleUrgenciaChange(3)}>Urgencia 3</Button>
                                            </div>
                                        </div>
                                        <Form.Control name="cantidad" type="text" placeholder="Cantidad" onChange={handleInputChange} style={{ borderRadius: '10rem', backgroundColor: '#F5F5F5', boxShadow: '0.10rem 0.3rem 0.20rem rgba(0, 0, 0, 0.3)', marginTop: '1rem' }} />
                                        <button type="submit" style={{ display: 'none' }}>Crear Pedido</button>
                                    </form>
                                </div>
                            }
                        />
                    </div>
                    <div className='cardCategori'>
                        {Array.isArray(sortedPedidos) && sortedPedidos.length > 0 ? (
                            sortedPedidos.map(pedido => (
                                <GenericCard
                                    key={pedido.id_pedido}
                                    titulo={`Pedido: ${pedido.id_producto.nombre}`}
                                    foto={pedido.id_producto.imagen}
                                    descrip1={<><strong>Obra:</strong> {pedido.id_obra.nombre}</>}
                                    descrip2={<><strong>Usuario:</strong> {pedido.id_usuario.nombre} {pedido.id_usuario.apellido}</>}
                                    descrip3={<><strong>Urgencia:</strong> {pedido.urgente} <strong>Cantidad:</strong> {pedido.cantidad}</>}
                                    descrip4={<><strong>Fecha Inicio:</strong> {pedido.fechainicio ? pedido.fechainicio.split('-').reverse().join('/') : ''}</>}
                                    descrip5={<><strong>Fecha Vencimiento:</strong> {pedido.fechavencimiento ? pedido.fechavencimiento.split('-').reverse().join('/') : ''}</>}
                                />
                            ))
                        ) : (
                            <p style={{marginLeft: '7rem', marginTop: '1rem'}}> No hay pedidos disponibles.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Pedidos;