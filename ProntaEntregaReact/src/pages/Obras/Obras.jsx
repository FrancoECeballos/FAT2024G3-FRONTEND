import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { Icon } from '@iconify/react';

import SearchBar from '../../components/searchbar/searchbar.jsx';
import FullNavbar from '../../components/navbar/full_navbar/FullNavbar.jsx';
import GenericCard from '../../components/cards/generic_card/GenericCard.jsx';
import Modal from '../../components/modals/Modal.jsx';
import { Form, InputGroup } from 'react-bootstrap';
import UploadImage from '../../components/buttons/upload_image/uploadImage.jsx';

import fetchData from '../../functions/fetchData.jsx';
import postData from '../../functions/postData.jsx';
import putData from '../../functions/putData.jsx';

import fetchUser from '../../functions/fetchUser.jsx';

function Stock() {
    const navigate = useNavigate();
    const token = Cookies.get('token');
    const [obras, setObras] = useState([]);
    const [obraModal, setObraModal] = useState(null);

    const [obraForm, setObraForm] = useState({
        nombre: '',
        descripcion: '',
        imagen: '',
        id_direccion: {
            localidad: '',
            calle: '',
            numero: '',
        },
    });

    const [searchQuery, setSearchQuery] = useState('');
    const [orderCriteria, setOrderCriteria] = useState(null);

    useEffect(() => {
        fetchUser(navigate).then((result) => {
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

    const handleInputChange = (event) => {
        const { name, value } = event.target;
    
        if (name === 'localidad' || name === 'calle' || name === 'numero') {
            if (name === 'numero') {
                const parsedValue = parseInt(value, 10);
                if (isNaN(parsedValue)) return;
                setObraForm({ ...obraForm, id_direccion: { ...obraForm.id_direccion, [name]: parsedValue } });
            } else {
                setObraForm({ ...obraForm, id_direccion: { ...obraForm.id_direccion, [name]: value } });
            }
            console.log(obraForm);
            return;
        }
        setObraForm({ ...obraForm, [name]: value });
        console.log(obraForm);
    };

    const handleFileChange = (file) => {
        setObraForm((prevObraForm) => ({
            ...prevObraForm,
            imagen: file,
        }));
        console.log(obraForm);
    };


    const obraUpdate = async (id) => {
        let id_direc = null;

        const direc = await fetchData('/direcciones/', token);
    
        const existingDireccion = direc.find(
            (d) =>
                d.calle === obraForm.id_direccion.calle &&
                d.numero === obraForm.id_direccion.numero &&
                d.localidad === obraForm.id_direccion.localidad
        );
    
        if (!existingDireccion) {
            const url = '/crear_direccion/';
            const body = obraForm.id_direccion;
            try {
                const result = await postData(url, body);
                id_direc = result.id_direccion;
            } catch (error) {
                console.error('Error creating direccion:', error);
                return;
            }
        } else {
            id_direc = existingDireccion.id_direccion;
        }
    
        const updatedObraForm = { ...obraForm, id_direccion: id_direc };
        setObraForm(updatedObraForm);
  
        const formDataToSend = new FormData();
        Object.entries(updatedObraForm).forEach(([key, value]) => {
            formDataToSend.append(key, value);
        });

        try {
            const result = await putData(`/editar_obra/${id}/`, formDataToSend, token);
            window.location.reload();
        } catch (error) {
        console.error('Error updating obra:', error);
        }
    };

    return (
        <div>
            <FullNavbar />
            <div className='margen-arriba'>
                <SearchBar onSearchChange={handleSearchChange} onOrderChange={setOrderCriteria} filters={filters} />
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
                                            onClick={() => {
                                                setObraForm(obra);
                                                setObraModal(obra.id_obra);
                                            }}
                                        />
                                    )}
                                    <Modal
                                        showButton={false}
                                        showModal={obraModal == obra.id_obra}
                                        handleShowModal={() => setObraForm(obra)}
                                        handleCloseModal={() => setObraModal(null)}
                                        handleSave={(event) => obraUpdate(obra.id_obra)}
                                        saveButtonText={'Guardar'}
                                        title={'Editar Obra'}
                                        content={
                                            <>
                                                <UploadImage defaultImage={obra.imagen} onFileChange={handleFileChange} />
                                                <Form.Label style={{ marginTop: '1rem' }}>Informació Básica:</Form.Label>
                                                <Form.Control name="nombre" type="text" value={obraForm.nombre} onChange={handleInputChange} className="input-obra" />
                                                <Form.Control name="descripcion" type="text" value={obraForm.descripcion} onChange={handleInputChange} className="input-obra" />
                                                <Form.Group controlId="direccion">
                                                    <Form.Label style={{ marginTop: '1rem' }}>Dirección:</Form.Label>
                                                    <InputGroup>
                                                        <Form.Control
                                                            type="text" name="localidad" value={obraForm.id_direccion.localidad} onChange={handleInputChange}
                                                        />
                                                        <Form.Control
                                                            type="text" name="calle" value={obraForm.id_direccion.calle} onChange={handleInputChange}
                                                        />
                                                        <Form.Control
                                                            type="number" name="numero" value={obraForm.id_direccion.numero} onChange={handleInputChange}
                                                        />
                                                    </InputGroup>
                                                </Form.Group>
                                            </>
                                        } />
                                </>
                            }
                        />
                    ))
                ) : (
                    <p style={{ marginLeft: '7rem', marginTop: '1rem' }}>No hay obras disponibles.</p>
                )}
            </div>
        </div>
    );
}

export default Stock;