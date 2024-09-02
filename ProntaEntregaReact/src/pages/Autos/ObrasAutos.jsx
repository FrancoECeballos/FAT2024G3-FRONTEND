import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { Breadcrumb } from 'react-bootstrap';

import SearchBar from '../../components/searchbar/searchbar.jsx';
import Footer from '../../components/footer/Footer.jsx';
import FullNavbar from '../../components/navbar/full_navbar/FullNavbar.jsx';
import GenericCard from '../../components/cards/generic_card/GenericCard.jsx';
import Loading from '../../components/loading/loading.jsx';

import './ObrasAutos.scss';

import fetchData from '../../functions/fetchData';

function ObrasAutos() {
    const navigate = useNavigate();
    const token = Cookies.get('token');
    const [obras, setObras] = useState([]);
    const [isAdmin, setIsAdmin] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [orderCriteria, setOrderCriteria] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!token) {
            navigate('/login');
            return;
        }
        fetchData(`/userToken/${token}`, token).then((result) => {
            setIsAdmin(result.is_superuser);
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
                        const uniqueObras = Array.from(new Set(obras.flat().map(obra => JSON.stringify(obra)))).map(str => JSON.parse(str));
                        console.log("Fetched Obras:", uniqueObras);
                        setObras(uniqueObras);
                    }).catch(error => {
                        console.error('Error fetching obras by ID', error);
                    });
                }).catch(error => {
                    console.error('Error fetching obra for user', error);
                });
            } 
            setIsLoading(false);
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
        const aValue = a.id_obra[orderCriteria];
        const bValue = b.id_obra[orderCriteria];
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

    if (Array.isArray(sortedObras) && sortedObras.length === 1) {
        const obra = sortedObras[0];
        navigate(`/autos/${obra.id_obra}`, {state: {id_obra: `${obra.id_obra}`}});
    }

    if (isLoading) {
        return <div><FullNavbar/><Loading /></div> ;
    }
    return (
        <div>
            <FullNavbar selectedPage='Autos'/>
            <div className='margen-arriba'>
                <Breadcrumb style={{marginLeft:"8%", fontSize:"1.2rem"}}>
                    <Breadcrumb.Item active>Autos</Breadcrumb.Item>
                </Breadcrumb>
                <SearchBar onSearchChange={handleSearchChange} onOrderChange={setOrderCriteria} filters={filters}/>
                <div className='cardstock'>
                {Array.isArray(sortedObras) && sortedObras.length > 0 ? (
                    sortedObras.map(obra => (
                        <GenericCard
                            onClick={() => navigate(`/autos/${obra.id_obra}`, {state: {id_obra: `${obra.id_obra}`}})} 
                            key={obra.id_obra}
                            foto={obra.imagen}
                            titulo={obra.nombre}
                            descrip1={`Autos Registrados: ${obra.autos_registrados}`}
                            descrip2={`${obra.id_direccion.localidad}, ${obra.id_direccion.calle}, ${obra.id_direccion.numero}`}
                        />
                    ))
                ) : (
                    <p style={{marginLeft: '7rem', marginTop: '1rem'}}>No hay obras disponibles.</p>
                )}
                </div> 
            </div>
            <Footer/>
        </div>
    );
}

export default ObrasAutos;