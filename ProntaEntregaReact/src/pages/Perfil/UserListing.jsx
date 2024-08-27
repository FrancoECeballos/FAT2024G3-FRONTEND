import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

import SearchBar from '../../components/searchbar/searchbar.jsx';
import FullNavbar from '../../components/navbar/full_navbar/FullNavbar.jsx';
import GenericAccordion from '../../components/accordions/generic_accordion/GenericAccordion.jsx';

import fetchData from '../../functions/fetchData';
import LittleCard from '../../components/cards/little_card/LittleCard.jsx';

function UserListing() {
    const navigate = useNavigate();
    const [obras, setObras] = useState([]);
    const [usuariosSinObra, setUsuariosSinObra] = useState([]);

    const [searchQuery, setSearchQuery] = useState('');
    const [orderCriteria, setOrderCriteria] = useState(null);
    const token = Cookies.get('token');

    useEffect(() => {
        if (!token) {
            navigate('/login');
            return;
        }
    
        fetchData(`userToken/${token}/`, token).then(result => {
            if (result.is_superuser) {
                fetchData(`obra/`, token).then(result => {
                    const obrasWithUsuarios = result.map(async obra => {
                        const usuarios = await fetchData(`/user/obra/${obra.id_obra}/`, token);
                        return { ...obra, usuarios };
                    });
                    Promise.all(obrasWithUsuarios).then(updatedObras => {
                        setObras(updatedObras);
                        console.log(updatedObras);
                    }).catch(error => {
                        console.error('Hubo un error al obtener los usuarios para las obras', error);
                    });
                });
            } else {
                fetchData(`/obra/user/${token}/`, token).then(result => {
                    const obrasWithUsuarios = result.map(async obra => {
                        const usuarios = await fetchData(`/user/obra/${obra.id_obra}/`, token);
                        return { ...obra, usuarios };
                    });
                    Promise.all(obrasWithUsuarios).then(updatedObras => {
                        setObras(updatedObras);
                        console.log(updatedObras);
                    }).catch(error => {
                        console.error('Hubo un error al obtener los usuarios para las obras', error);
                    });
                });
            }
        }).catch(error => {
            console.error('Hubo un error al obtener el token del usuario', error);
        });

        fetchData(`user/obra/null/`, token).then(result => {
            setUsuariosSinObra(result);
            console.log(result);
        }).catch(error => {
            console.error('Hubo un error al obtener los usuarios sin obra', error);
        });

    }, [token, navigate]);

    const handleSearchChange = (value) => {
        setSearchQuery(value);
    };

    const filters = [
        { type: 'nombre', label: 'Nombre Alfabético' },
        { type: 'apellido', label: 'Apellido Alfabético' },
        { type: 'email', label: 'Email Alfabético' },
        { type: 'id_tipousuario', label: 'Rango' },
        { type: 'documento', label: 'DNI' },
        { type: 'telefono', label: 'Teléfono' },
    ];

    const filteredObras = obras.filter(obra => {
        // Verificar las propiedades de la obra
        const obraMatches = obra.nombre?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            obra.apellido?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            obra.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            obra.documento?.toLowerCase().includes(searchQuery.toLowerCase());
    
        // Verificar los nombres de los usuarios asociados a la obra
        const usuariosMatches = obra.usuarios?.some(usuario => 
            usuario.nombre?.toLowerCase().includes(searchQuery.toLowerCase())
        );
    
        return obraMatches || usuariosMatches;
    });
    
    const sortedObras = [...filteredObras].sort((a, b) => {
        if (!orderCriteria) return 0;
        if (a[orderCriteria]?.toLowerCase() < b[orderCriteria]?.toLowerCase()) return -1;
        if (a[orderCriteria]?.toLowerCase() > b[orderCriteria]?.toLowerCase()) return 1;
        return 0;
    });

    const filteredUsuariosSinObra = usuariosSinObra.filter(usuario => 
        usuario.nombre?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        usuario.apellido?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        usuario.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        usuario.documento?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div>
            <FullNavbar />
            <div className='margen-arriba'>
                <SearchBar 
                    onSearchChange={handleSearchChange} 
                    onOrderChange={setOrderCriteria} 
                    filters={filters}
                />
                <div style={{marginTop: '1rem'}}>
                    {sortedObras.map(obra => (
                        <div key={obra.id_obra} style={{ marginBottom: '0.1rem' }}>
                            <GenericAccordion
                                wide={'80%'}
                                titulo={obra.nombre}
                                foto={obra.imagen}
                                descrip1={obra.descripcion}
                                descrip2={obra.usuarios_registrados}
                            >
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                                    {obra.usuarios.map(usuario => (
                                        <div key={usuario.id_usuario} style={{ flex: '', boxSizing: 'border-box' }}>
                                            <LittleCard
                                                foto={usuario.imagen}
                                                titulo={`${usuario.nombre} ${usuario.apellido}`}
                                                descrip1={usuario.email}
                                                descrip2={usuario.documento}
                                                descrip3={usuario.telefono}
                                                onSelect={() => navigate(`/perfil/micuenta`, { state: { user_email: usuario.email } })}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </GenericAccordion>
                        </div>
                    ))}
                    {filteredUsuariosSinObra.length > 0 && (
                        <div key='NoObra' style={{ marginBottom: '0.1rem' }}>
                            <GenericAccordion
                                wide={'80%'}
                                titulo='Usuarios sin Obra'
                            >
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                                    {filteredUsuariosSinObra.map(usuario => (
                                        <div key={usuario.id_usuario} style={{ flex: '', boxSizing: 'border-box' }}>
                                            <LittleCard
                                                foto={usuario.imagen}
                                                titulo={`${usuario.nombre} ${usuario.apellido}`}
                                                descrip1={usuario.email}
                                                descrip2={usuario.documento}
                                                descrip3={usuario.telefono}
                                                onSelect={() => navigate(`/perfil/micuenta`, { state: { user_email: usuario.email } })}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </GenericAccordion>
                        </div>
                    )}
                    {sortedObras.length === 0 && filteredUsuariosSinObra.length === 0 && (
                        <p style={{ marginLeft: '7rem', marginTop: '1rem' }}>No hay obras y/o usuarios disponibles.</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default UserListing;