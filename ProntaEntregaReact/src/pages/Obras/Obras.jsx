import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { Icon } from '@iconify/react';

import SearchBar from '../../components/searchbar/searchbar.jsx';
import FullNavbar from '../../components/navbar/full_navbar/FullNavbar.jsx';
import GenericCard from '../../components/cards/generic_card/GenericCard.jsx';
import Modal from '../../components/modals/Modal.jsx';

import fetchData from '../../functions/fetchData.jsx';

function Stock() {
    const navigate = useNavigate();
    const token = Cookies.get('token');
    const [obras, setObras] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [orderCriteria, setOrderCriteria] = useState(null);

    useEffect(() => {
        if (!token) {
            navigate('/login');
            return;
        }
        fetchData(`/userToken/${token}`, token).then((result) => {
            if (result.is_superuser) {
                fetchData('/obra/', token).then((result) => {
                    setObras(result);
                }).catch(error => {
                    console.error('Error fetching obras for admin', error);
                });
            } else {
                fetchData(`/user/obrasEmail/${result.email}/`, token).then((result) => {
                    setObras(result);
                    console.log(result);
                }).catch(error => {
                    console.error('Error fetching obras for user', error);
                });
            }
        }).catch(error => {
            console.error('Error fetching user data:', error);
        });
    }, [token, navigate]);

    const filteredObras = obras.filter(obra => {
        return (
            obra.nombre?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            obra.id_direccion.localidad?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            obra.id_direccion.calle?.toLowerCase().includes(searchQuery.toLowerCase())
        );
    });

    const sortedObras = [...filteredObras].sort((a, b) => {
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
        { type: 'nombre', label: 'Nombre Alfabético' },
        { type: 'usuarios_registrados', label: 'Usuarios Registrados' },
    ];

    const handleSearchChange = (value) => {
        setSearchQuery(value);
    };

    return (
        <div>
            <FullNavbar />
            <div className='margen-arriba'>
                <SearchBar onSearchChange={handleSearchChange} onOrderChange={setOrderCriteria} filters={filters}/>
                {Array.isArray(sortedObras) && sortedObras.length > 0 ? (
                    sortedObras.map(obra => (
                        <GenericCard
                            key={obra.id_obra}
                            foto={obra.imagen}
                            titulo={obra.nombre}
                            descrip1={`Usuarios Registrados: ${obra.usuarios_registrados}`}
                            descrip2={`${obra.id_direccion.localidad}, ${obra.id_direccion.calle}, ${obra.id_direccion.numero}`}
                            children={
                                <>
                                    {(!obra.id_tipousuario || obra.id_tipousuario === 2) && (
                                        <Icon
                                            icon="line-md:edit-twotone"
                                            className="hoverable-icon"
                                            style={{ width: "2.5rem", height: "2.5rem", position: "absolute", top: "1rem", right: "1rem", color: "#02005E", transition: "transform 1s" }}
                                        />
                                    )}
                                    <Modal
                                        showButton={false}
                                        saveButtonText={'Tomar'}
                                        title={'Editar Obra'}
                                        content={""}
                                    />
                                </>
                            }
                        />
                    ))
                ) : (
                    <p style={{marginLeft: '7rem', marginTop: '1rem'}}>No hay obras disponibles.</p>
                )}
            </div>
        </div>
    );
}

export default Stock;