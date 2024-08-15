import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from 'axios';

import FullNavbar from '../../components/navbar/full_navbar/FullNavbar.jsx';
import GenericCard from '../../components/cards/generic_card/GenericCard.jsx';
import SearchBar from '../../components/searchbar/searchbar.jsx';
import UploadImage from '../../components/buttons/upload_image/uploadImage.jsx';
import fetchData from '../../functions/fetchData';
import SendButton from '../../components/buttons/send_button/send_button.jsx';
import Modal from '../../components/modals/Modal.jsx';
import {Form, Dropdown} from 'react-bootstrap';

import './Autos.scss';

function AutosComponent() {
    const navigate = useNavigate();
    const { obraId } = useParams();
    const token = Cookies.get('token');

    const [currentObra, setCurrentObra] = useState(false);
    const [autoModal, setAutoModal] = useState();

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
        kilometraje: "",
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

    }, [token, navigate]);

    const handleMaintenanceRequest = async (id, description) => {
        const currentStatus = maintenanceStatus[id]?.isMaintained || false;
        const newStatus = !currentStatus;
        setMaintenanceStatus(prevState => ({
            ...prevState,
            [id]: {
                isMaintained: newStatus,
                buttonColor: newStatus ? 'green' : '#3E4692',
                buttonText: newStatus ? 'Mantenimiento realizado' : 'Solicitar Mantenimiento'
            }
        }));
        try {
            await axios.put(`http://localhost:8000/editar_transporte/${id}/`, 
                { necesita_mantenimiento: newStatus, descripcion_mantenimiento: description },
                { headers: { 'Authorization': `Token ${token}` } }
            );
            // Actualizar la lista de autos
            setAutos(prevAutos => prevAutos.map(auto =>
                auto.id_transporte === id
                ? { ...auto, necesita_mantenimiento: newStatus, descripcion_mantenimiento: description}
                : auto
            ));
        } catch (error) {
            console.error('Error updating maintenance status:', error);
            setMaintenanceStatus(prevState => ({
                ...prevState,
                [id]: {
                    ...prevState[id],
                    isMaintained: currentStatus,
                    buttonColor: currentStatus ? 'green' : '#3E4692',
                    buttonText: currentStatus ? 'Mantenimiento realizado' : 'Solicitar Mantenimiento'
                }
            }));
        }
    };

    const handleCreateAuto = async (id) => {
        try {
            const response = await axios.post(`http://localhost:8000/crear_transporte/`, 
                formData,
                { headers: { 'Authorization': `Token ${token}` } }
            );
            const autoId = response.data.id_transporte;
            await axios.post(`http://localhost:8000/crear_detalle_transporte/`, 
                { id_transporte: autoId, id_obra: obraId },
                { headers: { 'Authorization': `Token ${token}` } }
            );
            window.location.reload();
        } catch (error) {
            console.error('Error updating auto:', error);
        }
    };

    const handleFileChange = (file) => {
        setFormData((prevData) => {
          return { ...prevData, imagen: file };
        });
        console.log(formData);
      };

    const handleUpdateAuto = async (id) => {
        try {
            await axios.put(`http://localhost:8000/editar_transporte/${id}/`, 
                formData,
                { headers: { 'Authorization': `Token ${token}` } }
            );
            window.location.reload();
        } catch (error) {
            console.error('Error updating auto:', error);
        }
    };

    const handleDeleteAuto = async (id) => {
        try {
            await axios.delete(`http://localhost:8000/eliminar_detalle_transporte/${obraId}/${id}/`, 
                { headers: { 'Authorization': `Token ${token}` } }
            );
            setAutos(prevAutos => prevAutos.filter(auto => auto.id_transporte !== id));
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

    const handleInputChange = async (event) => {
        const { name, value } = event.target;
        setFormData((prevData) => {
            const updatedData = { ...prevData, [name]: value };
            console.log(updatedData);
            return updatedData;
        });
    };

    return (
        <div>
            <FullNavbar selectedPage='Autos'/>
            <div className='margen-arriba'>
                <div className="autos-navigation">
                    <h4 className="autos-link" onClick={() => navigate('/autos')}>Autos</h4>
                    <h4 className="autos-current"> // {currentObra}</h4>
                </div>
                <h2 className="autos-title">Lista de Autos</h2>
                <SearchBar onSearchChange={handleSearchChange} onOrderChange={setOrderCriteria} filters={filters} />
                <div className='auto-list'>
                    <div className="auto-modal">
                        <Modal 
                            openButtonText='¿No encuentra su auto? Añadalo' 
                            hoverableButton={true} 
                            openButtonWidth='20'
                            title='Nuevo Auto' 
                            saveButtonText='Crear' 
                            handleSave={handleCreateAuto}
                            content={
                                <div>
                                    <h2 className='centered'> Nuevo Auto </h2>
                                    <UploadImage wide='13' titulo='Imagen del auto' onFileChange={handleFileChange}/>
                                    <Form.Control name="marca" type="text" placeholder="Marca" onChange={handleInputChange} className="input-autos"/>
                                    <Form.Control name="modelo" type="text" placeholder="Modelo" onChange={handleInputChange} className="input-autos"/>
                                    <Form.Control name="patente" type="text" placeholder="Patente" onChange={handleInputChange} className="input-autos"/>
                                    <Form.Control name="kilometraje" type="text" placeholder="Kilometros" onChange={handleInputChange} className="input-autos"/>
                                </div>
                            }
                        />
                    </div>
                    {Array.isArray(sortedAutos) && sortedAutos.length > 0 ? (
                        sortedAutos.map(auto => {
                            const maintenance = maintenanceStatus[auto.id_transporte] || {};
                            const cardStyle = maintenance.isMaintained ? "card-maintained" : "";
                            const imageStyle = maintenance.isMaintained ? "image-maintained" : "";
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
                                    onClick={() => setAutoModal(auto.id_transporte)}
                                    children={
                                        <>
                                            {!maintenance.isMaintained ? (
                                                <Dropdown>
                                                    <Dropdown.Toggle as="div">
                                                        <SendButton 
                                                            wide='15'
                                                            text={maintenance.buttonText || 'Solicitar Mantenimiento'}
                                                            backcolor={maintenance.buttonColor || '#3E4692'}
                                                            letercolor='white'
                                                        />
                                                    </Dropdown.Toggle>
                                                    <Dropdown.Menu>
                                                        <div className="dropdown-menu-content">
                                                            <input
                                                                type="text"
                                                                placeholder="Añada una descripción"
                                                                value={description}
                                                                onChange={(e) => setDescription(e.target.value)}
                                                                className="description-input"
                                                                />
                                                                <SendButton
                                                                    wide='15'
                                                                    text='Enviar'
                                                                    backcolor='#3E4692'
                                                                    letercolor='white'
                                                                    onClick={() => handleMaintenanceRequest(auto.id_transporte, description)}
                                                                />
                                                            </div>
                                                        </Dropdown.Menu>
                                                    </Dropdown>
                                                ) : (
                                                    <SendButton
                                                        wide='15'
                                                        text={maintenance.buttonText || 'Mantenimiento realizado'}
                                                        backcolor={maintenance.buttonColor || 'green'}
                                                        letercolor='white'
                                                        onClick={() => handleMaintenanceRequest(auto.id_transporte, '')}
                                                    />
                                                )}
                                                    <Modal 
                                                        handleSave={() => handleUpdateAuto(auto.id_transporte)}
                                                        showButton={false}
                                                        showModal={autoModal === auto.id_transporte}
                                                        showDeleteButton={true}
                                                        deleteFunction={() => handleDeleteAuto(auto.id_transporte)}
                                                        handleShowModal={() => setAutoModal(auto.id_transporte)}
                                                        handleCloseModal={() => setAutoModal(null)}
                                                        content={
                                                            <div>
                                                                <h2 className='centered'> Actualizar Auto </h2>
                                                                <Form.Control name="marca" type="text" defaultValue= { auto.marca } onChange={handleInputChange} className="input-autos"/>
                                                                <Form.Control name="modelo" type="text" defaultValue= { auto.modelo } onChange={handleInputChange} className="input-autos"/>
                                                                <Form.Control name="patente" type="text" defaultValue= { auto.patente } onChange={handleInputChange} className="input-autos"/>
                                                                <Form.Control name="kilometraje" type="text" defaultValue= { auto.kilometraje } onChange={handleInputChange} className="input-autos"/>
                                                            </div>
                                                        }
                                                    />
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
    }
export default AutosComponent;