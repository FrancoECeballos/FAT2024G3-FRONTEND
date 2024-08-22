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
import SendButton from '../../components/buttons/send_button/send_button.jsx';

import Modal from '../../components/modals/Modal.jsx';

import './Autos.scss';

function AutosComponent() {
    const navigate = useNavigate();
    const { obraId } = useParams();
    const { autoId } = useParams();
    const token = Cookies.get('token');

    const [currentObra, setCurrentObra] = useState(false);
    const [autoModal, setAutoModal] = useState(null);
    const [maintenanceModal, setMaintenanceModal] = useState(false);
    const [autos, setAutos] = useState([]);
    const [maintenanceStatus, setMaintenanceStatus] = useState({});
    const [description, setDescription] = useState('');
    const [selectedAutoId, setSelectedAutoId] = useState(null);

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
                    ? { ...auto, necesita_mantenimiento: newStatus, descripcion_mantenimiento: description }
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
        const data = new FormData();
        data.append('imagen', formData.imagen);
        data.append('marca', formData.marca);
        data.append('modelo', formData.modelo);
        data.append('patente', formData.patente);
        data.append('kilometraje', formData.kilometraje);

        try {
            await postData(`http://localhost:8000/crear_transporte/`,
                data,
                { headers: { 'Authorization': `Token ${token}` } }
            );
            console.log(autoId);
            await postData(`http://localhost:8000/crear_detalle_transporte/`,
                { id_obra: obraId, id_transporte: autoId },
                { headers: { 'Authorization': `Token ${token}` } }
            );

        } catch (error) {
            console.error('Error updating auto:', error);
        }
    };

    const handleFileChange = (event) => {
        setFormData({
            ...formData,
            imagen: event.target.files[0]
        });
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

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleMaintenanceClick = (id_transporte) => {
        setSelectedAutoId(id_transporte);
        setMaintenanceModal(true);
    };

    const handleMaintenanceSave = () => {
        handleMaintenanceRequest(selectedAutoId, description);
        setMaintenanceModal(false);
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


    return (
        <div>
            <FullNavbar selectedPage='Autos' />
            <div className='margen-arriba'>
                <div className="autos-navigation">
                    <h4 className="autos-link" onClick={() => navigate('/autos')}>Autos</h4>
                    <h4 className="autos-current"> // {currentObra}</h4>
                </div>
                <h2 className="autos-title">Lista de Autos</h2>
                <SearchBar onSearchChange={handleSearchChange} onOrderChange={setOrderCriteria} filters={[]} />
                <div className='auto-list'>
                <div className="auto-modal">
                        <Button variant="primary" onClick={() => setAutoModal('new')}>
                            ¿No encuentra su auto? Añadalo
                        </Button>
                        <Modal show={autoModal === 'new'} onHide={() => setAutoModal(null)}>
                            <Modal.Header closeButton>
                                <Modal.Title>Nuevo Auto</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <h2 className='centered'> Nuevo Auto </h2>
                                <input type="file" name="imagen" onChange={handleFileChange} />
                                <Form.Control name="marca" type="text" placeholder="Marca" onChange={handleInputChange} className="input-autos" />
                                <Form.Control name="modelo" type="text" placeholder="Modelo" onChange={handleInputChange} className="input-autos" />
                                <Form.Control name="patente" type="text" placeholder="Patente" onChange={handleInputChange} className="input-autos" />
                                <Form.Control name="kilometraje" type="text" placeholder="Kilometros" onChange={handleInputChange} className="input-autos" />
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={() => setAutoModal(null)}>
                                    Cancelar
                                </Button>
                                <Button variant="primary" onClick={handleCreateAuto}>
                                    Crear
                                </Button>
                            </Modal.Footer>
                        </Modal>
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
                                    children={
                                        <>
                                            {!maintenance.isMaintained ? (
                                                <Dropdown>
                                                    
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
                                            <Button
                                                style={{ float: 'right' }}
                                                onClick={() => handleMaintenanceClick(auto.id_transporte)}
                                            >
                                                {maintenance.buttonText || 'Solicitar Mantenimiento'}
                                            </Button>
                                            <div>
                                                <Button onClick={() => handleEditAutoClick(auto)}>Editar Auto</Button>
                                                <Modal
                                                    show={autoModal === auto.id_transporte}
                                                    onHide={() => setAutoModal(null)}
                                                >
                                                    <Modal.Header closeButton>
                                                        <Modal.Title>Actualizar Auto</Modal.Title>
                                                    </Modal.Header>
                                                    <Modal.Body>
                                                        <Form.Control name="marca" type="text" value={formData.marca} onChange={handleInputChange} className="input-autos" />
                                                        <Form.Control name="modelo" type="text" value={formData.modelo} onChange={handleInputChange} className="input-autos" />
                                                        <Form.Control name="patente" type="text" value={formData.patente} onChange={handleInputChange} className="input-autos" />
                                                        <Form.Control name="kilometraje" type="text" value={formData.kilometraje} onChange={handleInputChange} className="input-autos" />
                                                    </Modal.Body>
                                                    <Modal.Footer>
                                                        <Button variant="secondary" onClick={() => setAutoModal(null)}>
                                                            Cancelar
                                                        </Button>
                                                        <Button variant="primary" onClick={handleEditAutoSave}>
                                                            Guardar
                                                        </Button>
                                                    </Modal.Footer>
                                                </Modal>
                                            </div>
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

            {/* Modal de Mantenimiento */}
            <Modal show={maintenanceModal} onHide={() => setMaintenanceModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Solicitar Mantenimiento</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Control
                        as="textarea"
                        rows={3}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Descripción del mantenimiento"
                    />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setMaintenanceModal(false)}>
                        Cancelar
                    </Button>
                    <Button variant="primary" onClick={handleMaintenanceSave}>
                        Guardar
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};


export default AutosComponent;