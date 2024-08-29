import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Form } from 'react-bootstrap';
import Dropdown from 'react-bootstrap/Dropdown';
import axios from 'axios';
import Cookies from 'js-cookie';
import FullNavbar from '../../components/navbar/full_navbar/FullNavbar.jsx';
import GenericCard from '../../components/cards/generic_card/GenericCard.jsx';
import SearchBar from '../../components/searchbar/searchbar.jsx';
import UploadImage from '../../components/buttons/upload_image/uploadImage.jsx';
import fetchData from '../../functions/fetchData';
import postData from '../../functions/postData';
import putData from '../../functions/putData';
import deleteData from '../../functions/deleteData';
import SendButton from '../../components/buttons/send_button/send_button.jsx';
import Loading from '../../components/loading/loading.jsx';


import Modal from '../../components/modals/Modal.jsx';
import defaultImage from '../../assets/no_image.png';

import './Autos.scss';

function AutosComponent() {
    const navigate = useNavigate();
    const { obraId } = useParams();
    const token = Cookies.get('token');
    const [isLoading, setIsLoading] = useState(true);

    const [currentObra, setCurrentObra] = useState(false);
    const [autoModal, setAutoModal] = useState(null);
    const [autos, setAutos] = useState([]);
    const [maintenanceStatus, setMaintenanceStatus] = useState({});
    const [description, setDescription] = useState('');

    const [searchQuery, setSearchQuery] = useState('');
    const [orderCriteria, setOrderCriteria] = useState(null);
    const [formData, setFormData] = useState({
        imagen: null,
        marca: "",
        modelo: "",
        patente: "",
        kilometraje: ""
    });

    useEffect(() => {
        if (!token) {
            navigate('/login');
            return;
        }

        fetchData(`/transporte/${obraId}`, token).then((result) => {
            setAutos(result);
            const initialStatus = result.reduce((acc, auto) => {
                acc[auto.id_transporte] = {
                    isMaintained: auto.necesita_mantenimiento,
                    buttonColor: auto.necesita_mantenimiento ? 'green' : '#3E4692',
                    buttonText: auto.necesita_mantenimiento ? 'Mantenimiento realizado' : 'Solicitar Mantenimiento'
                };
                return acc;
            }, {});
            setMaintenanceStatus(initialStatus);
        }).catch(error => {
            console.error('Error fetching autos:', error);
        });

        fetchData(`/obra/${obraId}`, token).then((result) => {
            setCurrentObra(result[0].nombre);
        });
        setIsLoading(false);

        const img = new Image();
        img.src = defaultImage;
        img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        canvas.toBlob((blob) => {
            const file = new File([blob], 'no_image.png', { type: 'image/png' });
            setFormData((prevData) => ({ ...prevData, imagen: file }));
        })};

    }, [token, navigate]);

    const handleMaintenanceRequest = async (id) => {
        const currentStatus = maintenanceStatus[id]?.isMaintained || false;
        const newStatus = !currentStatus;
        const currentDescription = description || '';
    
        try {
            await putData(`editar_transporte/${id}/`, { necesita_mantenimiento: newStatus, descripcion_mantenimiento: currentDescription }, token);
            window.location.reload();
        } catch (error) {
            console.error('Error updating maintenance status:', error);
        }
    };

    const handleCreateAuto = async () => {
        if (!formData.imagen) {
            console.error('No image file selected');
            return;
        }
    
        const data = new FormData();
        data.append('imagen', formData.imagen);
        data.append('marca', formData.marca);
        data.append('modelo', formData.modelo);
        data.append('patente', formData.patente);
        data.append('kilometraje', formData.kilometraje);
    
        try {
            const result = await postData(`crear_transporte/`, data, token);
            await postData(`crear_detalle_transporte/`, { id_obra: obraId, id_transporte: result.id_transporte }, token);
            window.location.reload();
        } catch (error) {
            console.error('Error creating auto:', error);
        }
    };

    const handleFileChange = (file) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            imagen: file,
        }));
    };

    const handleUpdateAuto = async (id) => {
        try {
            await putData(`editar_transporte/${id}/`, formData, token);
            window.location.reload();
        } catch (error) {
            console.error('Error updating auto:', error);
        }
    };

    const handleDeleteAuto = async (id) => {
        try {
            await deleteData(`eliminar_detalle_transporte/${obraId}/${id}/`,token);
            setAutos(prevAutos => prevAutos.filter(auto => auto.id_transporte !== id));
            window.location.reload();
        } catch (error) {
            if (error.response && error.response.data && error.response.data.error === "No se encontró un detalle de obra transporte con el ID proporcionado.") {
                alert("No se encontró un auto con el ID proporcionado.");
            } else {
                console.error('Error deleting auto:', error);
            }
        }
    };

    const filteredAutos = autos.filter(auto => {
        return (
            auto.marca?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            auto.modelo?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            auto.patente?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            auto.kilometraje?.toString().includes(searchQuery) ||
            auto.anio?.toString().includes(searchQuery)
        );
    });

    const sortedAutos = [...filteredAutos].sort((a, b) => {
        if (a.necesita_mantenimiento === b.necesita_mantenimiento) {
            if (orderCriteria) {
                const aValue = a[orderCriteria];
                const bValue = b[orderCriteria];
                if (typeof aValue === 'string' && typeof bValue === 'string') {
                    return aValue.toLowerCase().localeCompare(bValue.toLowerCase());
                }
                if (typeof aValue === 'number' && typeof bValue === 'number') {
                    return bValue - aValue;
                }
            }
            return 0;
        }
        return a.necesita_mantenimiento ? -1 : 1;
    });

    const filters = [
        { type: 'marca', label: 'Marca' },
        { type: 'modelo', label: 'Modelo' },
        { type: 'patente', label: 'Patente' },
        { type: 'kilometraje', label: 'Kilometraje' },
        { type: 'anio', label: 'Año' },
    ];

    const handleSearchChange = (value) => {
        setSearchQuery(value);
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value
        });
        console.log(formData);
    };

    const handleEditAutoClick = (auto) => {
        setFormData({
            marca: auto.marca,
            modelo: auto.modelo,
            patente: auto.patente,
            kilometraje: auto.kilometraje
        });
        setAutoModal(auto.id_transporte);
    };

    const handleEditAutoSave = () => {
        handleUpdateAuto(autoModal);
        setAutoModal(null);
    };


    if (isLoading) {
        return <div><FullNavbar/><Loading /></div> ;
    }
    return (
        <div>
            <FullNavbar selectedPage='Autos' />
            <div className='margen-arriba'>
                <div className="autos-navigation">
                    <h4 className="autos-link" onClick={() => navigate('/autos')}>Autos</h4>
                    <h4 className="autos-current"> // {currentObra}</h4>
                </div>
                <h2 className="autos-title">Lista de Autos</h2>
                <SearchBar onSearchChange={handleSearchChange} onOrderChange={setOrderCriteria} filters={filters} />
                <div className='auto-list'>
                <div className="auto-modal">
                    <Modal title='Nuevo Auto' handleSave={handleCreateAuto} openButtonWidth='20' openButtonText='¿No encuentra su auto? Añadalo' content={
                        <>
                            <UploadImage wide='13' titulo='Imagen del Producto' onFileChange={handleFileChange} defaultImage={defaultImage}/>
                            <Form.Control name="marca" type="text" placeholder="Marca" onChange={handleInputChange} className="input-autos" />
                            <Form.Control name="modelo" type="text" placeholder="Modelo" onChange={handleInputChange} className="input-autos" />
                            <Form.Control name="patente" type="text" placeholder="Patente" onChange={handleInputChange} className="input-autos" />
                            <Form.Control name="kilometraje" type="text" placeholder="Kilometros" onChange={handleInputChange} className="input-autos" />
                        </>
                    }/>
                </div>
                    {Array.isArray(sortedAutos) && sortedAutos.length > 0 ? (
                        sortedAutos.map(auto => {
                            const maintenance = maintenanceStatus[auto.id_transporte] || {};
                            const cardStyle = maintenance.isMaintained ? { backgroundColor: 'lightgray' } : {};
                            const imageStyle = maintenance.isMaintained ? { filter: 'grayscale(100%)' } : {};
                            return (
                                <GenericCard
                                    key={auto.id_transporte}
                                    foto={auto.imagen}
                                    titulo={<><strong>Marca:</strong> {auto.marca} - <strong>Modelo:</strong> {auto.modelo}</>}
                                    descrip1={<><strong>Patente:</strong> {auto.patente}</>}
                                    descrip2={<><strong>Kilometraje:</strong> {auto.kilometraje} km</>}
                                    descrip3={auto.descripcion_mantenimiento !== '' && (<><strong>Mantenimiento:</strong> {auto.descripcion_mantenimiento}</>)}
                                    cardStyle={cardStyle}
                                    imageStyle={imageStyle}
                                    children={
                                        <>
                                            {!maintenance.isMaintained ? (
                                                <Modal title='Solicitar Mantenimiento' openButtonWidth='15' openButtonText='Solicitar Mantenimiento' handleSave={() => handleMaintenanceRequest(auto.id_transporte)} content={
                                                    <Form.Control
                                                        as="textarea"
                                                        rows={3}
                                                        defaultValue={description}
                                                        onChange={(e) => setDescription(e.target.value)}
                                                        placeholder="Descripción del mantenimiento"
                                                    />
                                                }/>
                                            ) : (
                                                <SendButton
                                                    wide='15'
                                                    text={maintenance.buttonText || 'Mantenimiento realizado'}
                                                    backcolor={maintenance.buttonColor || 'green'}
                                                    letercolor='white'
                                                    onClick={() => handleMaintenanceRequest(auto.id_transporte, '')}
                                                />
                                            )}
                                            <Modal openButtonText='Actualizar Auto' title='Actualizar Auto' handleShowModal={() => handleEditAutoClick(auto)} handleSave={handleEditAutoSave} showDeleteButton={true} deleteFunction={() => handleDeleteAuto(auto.id_transporte)} content={
                                                <>
                                                    <Form.Control name="marca" type="text" defaultValue={auto.marca} onChange={handleInputChange} className="input-autos" />
                                                    <Form.Control name="modelo" type="text" defaultValue={auto.modelo} onChange={handleInputChange} className="input-autos" />
                                                    <Form.Control name="patente" type="text" defaultValue={auto.patente} onChange={handleInputChange} className="input-autos" />
                                                    <Form.Control name="kilometraje" type="text" defaultValue={auto.kilometraje} onChange={handleInputChange} className="input-autos" />
                                                </>
                                            }/>
                                        </>
                                    }
                                />
                            );
                        })
                    ) : (
                        <p>No se encontraron autos.</p>
                    )}
                </div>
            </div>

            
        </div>
    );
};


export default AutosComponent;