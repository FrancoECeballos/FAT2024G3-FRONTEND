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

    const [formCategoryData, setFormCategoryData] = useState({
        "nombre": "",
        "descripcion": "",
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
    }, [token, navigate]);

    const filteredOfertas = ofertas.filter(oferta => {
        return (
            oferta.fechainicio?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            oferta.fechavencimiento?.toLowerCase().includes(searchQuery.toLowerCase())
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
        setFormCategoryData((prevData) => {
            const updatedData = { ...prevData, [name]: value };
            console.log(updatedData);
            return updatedData;
        });
    };

    const nuevaoferta = () => {
        postData('/crear_oferta', formCategoryData, token).then(() => {
            window.location.reload();
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
                        <Modal openButtonText='¿No encuentra su oferta? Añadala' openButtonWidth='20' title='Nueva Oferta' saveButtonText='Crear' handleSave={nuevaoferta}  content={
                            <div>
                                <h2 className='centered'> Nueva Oferta </h2>
                                <Form.Control name="nombre" type="text" placeholder="Nombre" onChange={handleInputChange} style={{ borderRadius: '10rem', backgroundColor: '#F5F5F5', boxShadow: '0.10rem 0.3rem 0.20rem rgba(0, 0, 0, 0.3)', marginTop: '1rem' }} />
                                <Form.Control name="descripcion" type="text" placeholder="Descripción" onChange={handleInputChange} style={{ borderRadius: '10rem', backgroundColor: '#F5F5F5', boxShadow: '0.10rem 0.3rem 0.20rem rgba(0, 0, 0, 0.3)', marginTop: '1rem' }} />
                            </div>
                        }></Modal>
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
