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

    const [formCategoryData, setFormCategoryData] = useState({
        "nombre": "",
        "descripcion": "",
      });

    useEffect(() => {
        if (!token) {
            navigate('/login');
            return;
        }

        fetchData('/pedido/', token).then((result) => {
            setPedidos(result);
        }).catch(error => {
            console.error('Error fetching orders:', error);
        });
    }, [token, navigate]);

    const filteredPedidos = pedidos.filter(pedido => {
        return (
            pedido.fechainicio?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            pedido.fechavencimiento?.toLowerCase().includes(searchQuery.toLowerCase())
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

    const handleInputChange = async (event) => {
        const { name, value } = event.target;
        setFormCategoryData((prevData) => {
            const updatedData = { ...prevData, [name]: value };
            console.log(updatedData);
            return updatedData;
        });
    };

    const nuevopedido = () => {
        postData('/crear_pedido', formCategoryData, token).then(() => {
            window.location.reload();
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
                        <Modal openButtonText='¿No encuentra su pedido? Añadalo' openButtonWidth='20' title='Nuevo Pedido' saveButtonText='Crear' handleSave={nuevopedido}  content={
                            <div>
                                <h2 className='centered'> Nuevo Pedido </h2>
                                <Form.Control name="nombre" type="text" placeholder="Nombre" onChange={handleInputChange} style={{ borderRadius: '10rem', backgroundColor: '#F5F5F5', boxShadow: '0.10rem 0.3rem 0.20rem rgba(0, 0, 0, 0.3)', marginTop: '1rem' }} />
                                <Form.Control name="descripcion" type="text" placeholder="Descripción" onChange={handleInputChange} style={{ borderRadius: '10rem', backgroundColor: '#F5F5F5', boxShadow: '0.10rem 0.3rem 0.20rem rgba(0, 0, 0, 0.3)', marginTop: '1rem' }} />
                            </div>
                        }></Modal>
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
