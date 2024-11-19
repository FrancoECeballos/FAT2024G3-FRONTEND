import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { Breadcrumb } from 'react-bootstrap';

import SearchBar from '../../components/searchbar/searchbar.jsx';
import Footer from '../../components/footer/Footer.jsx';
import FullNavbar from '../../components/navbar/full_navbar/FullNavbar.jsx';
import GenericCard from '../../components/cards/generic_card/GenericCard.jsx';
import Loading from '../../components/loading/loading.jsx';

import fetchData from '../../functions/fetchData';
import fetchUser from '../../functions/fetchUser';

import './Stock.scss';

function Stock() {
    const navigate = useNavigate();
    const token = Cookies.get('token');
    const [obras, setObras] = useState([]);
    const [isAdmin, setIsAdmin] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [orderCriteria, setOrderCriteria] = useState(null);
    const [isLoading, setIsLoading] = useState(true);


    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userData = await fetchUser(navigate);
                setIsAdmin(userData.is_superuser);
                const email = userData.email;
                if (userData.is_superuser) {
                    const result = await fetchData('/stock/', token);
                    setObras(result);
                } else {
                    const result = await fetchData(`/user/stockEmail/${email}/`, token);
                    const obraIds = result.map(obra => obra.id_obra.id_obra);
                    const obraPromises = obraIds.map(id => fetchData(`/stock/${id}`, token));
                    const obras = await Promise.all(obraPromises);
                    const uniqueObras = Array.from(new Set(obras.flat().map(obra => JSON.stringify(obra)))).map(str => JSON.parse(str));
                    setObras(uniqueObras);
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserData();
    }, [token, navigate]);

    const filteredObras = obras.filter(obra => {
        return (
            obra.id_obra.nombre?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            obra.id_obra.id_direccion.localidad?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            obra.id_obra.id_direccion.calle?.toLowerCase().includes(searchQuery.toLowerCase())
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

    if (Array.isArray(obras) && obras.length === 1) {
        const obra = obras[0];
        navigate(`/obra/${obra.id_stock}/categoria`, { state: { id_stock: `${obra.id_stock}` } });
    }

    return (
        <div>
            <FullNavbar selectedPage='Stock' />
            <div className='margen-arriba'>
                {isLoading ? (
                    <Loading />
                ) : (
                <>
                    <Breadcrumb style={{marginLeft:"8%", fontSize:"1.2rem"}}>
                            <Breadcrumb.Item active>Stock</Breadcrumb.Item>
                        </Breadcrumb>
                        <SearchBar onSearchChange={handleSearchChange} onOrderChange={setOrderCriteria} filters={filters} />
                        <div className='cardstock'>
                            {Array.isArray(sortedObras) && sortedObras.length > 0 ? (
                                sortedObras.map(obra => (
                                    <GenericCard
                                        onClick={() => navigate(`/obra/${obra.id_stock}/categoria`, { state: { id_stock: `${obra.id_stock}` } })}
                                        key={obra.id_stock}
                                        foto={obra.id_obra.imagen}
                                        titulo={obra.id_obra.nombre}
                                        descrip1={`Usuarios Registrados: ${obra.id_obra.usuarios_registrados}`}
                                        descrip2={`${obra.id_obra.id_direccion.localidad}, ${obra.id_obra.id_direccion.calle}, ${obra.id_obra.id_direccion.numero}`}
                                    />
                                ))
                            ) : (
                                <p style={{ marginLeft: '7rem', marginTop: '1rem' }}>No hay obras disponibles.</p>
                            )}
                        <Breadcrumb/>
                    </div>
                <Footer />
            </>)}
        </div>
    </div>
    );
}

export default Stock;
