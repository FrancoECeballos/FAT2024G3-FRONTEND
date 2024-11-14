import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

import SearchBar from '../../components/searchbar/searchbar.jsx';
import FullNavbar from '../../components/navbar/full_navbar/FullNavbar.jsx';
import GenericAccordion from '../../components/accordions/generic_accordion/GenericAccordion.jsx';
import Loading from '../../components/loading/loading.jsx';

import fetchData from '../../functions/fetchData';
import fetchUser from '../../functions/fetchUser.jsx';
import LittleCard from '../../components/cards/little_card/LittleCard.jsx';

function UserListing() {
    const navigate = useNavigate();
    const [obras, setObras] = useState([]);
    const [usuariosSinObra, setUsuariosSinObra] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [orderCriteria, setOrderCriteria] = useState(null);
    const token = Cookies.get('token');

    useEffect(() => {
        const fetchObras = async () => {
            try {
                const userToken = await fetchUser(navigate);
                const userId = userToken.id_usuario;
        
                const fetchObrasWithUsuarios = async (obras) => {
                    return await Promise.all(obras.map(async obra => {
                        let usuarios = await fetchData(`/user/obra/${obra.id_obra}/`, token);
                        usuarios = usuarios.filter(usuario => usuario.id_usuario !== userId);
                        return { ...obra, usuarios };
                    }));
                };
        
                if (userToken.is_superuser) {
                    const obras = await fetchData(`/obra/`, token);
                    const obrasWithUsuarios = await fetchObrasWithUsuarios(obras);
                    setObras(obrasWithUsuarios);
                } else {
                    const obras = await fetchData(`/obra/user/${token}/`, token);
                    const obrasWithUsuarios = await fetchObrasWithUsuarios(obras);
                    setObras(obrasWithUsuarios);
                }
            } catch (error) {
                console.error('Hubo un error al obtener las obras y los usuarios', error);
            } finally {
                setIsLoading(false);
            }
        };
        
        fetchObras();
        
        fetchData(`/user/obra/null/`, token).then(result => {
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
        { type: 'nombre', label: 'Nombre de la Obra' },
        { type: 'usuario.nombre', label: 'Nombre Alfabético' },
        { type: 'usuario.apellido', label: 'Apellido Alfabético' },
        { type: 'usuario.email', label: 'Email Alfabético' },
        { type: 'usuario.id_tipousuario', label: 'Rango' },
        { type: 'usuario.documento', label: 'DNI' },
        { type: 'usuario.telefono', label: 'Teléfono' },
    ];

    const filteredObras = obras.filter(obra => {
        const obraMatches = obra.nombre?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            obra.apellido?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            obra.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            obra.documento?.toLowerCase().includes(searchQuery.toLowerCase());
    
        const usuariosMatches = obra.usuarios?.some(usuario => 
            usuario.nombre?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            usuario.apellido?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            usuario.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            usuario.documento?.toLowerCase().includes(searchQuery.toLowerCase())
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

    if (isLoading) {
        return <div><FullNavbar/><Loading /></div> ;
    }

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
