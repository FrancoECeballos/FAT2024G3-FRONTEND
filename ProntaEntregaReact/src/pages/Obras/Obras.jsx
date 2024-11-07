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
import defaultImage from '../../assets/WhiteLogo.png';

import fetchData from '../../functions/fetchData.jsx';
import postData from '../../functions/postData.jsx';
import putData from '../../functions/putData.jsx';
import Loading from '../../components/loading/loading.jsx';
import fetchUser from '../../functions/fetchUser.jsx';

import deleteData from '../../functions/deleteData.jsx';

function Stock() {
    const navigate = useNavigate();
    const token = Cookies.get('token');
    const [obras, setObras] = useState([]);
    const [obraModal, setObraModal] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isFormValid, setIsFormValid] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

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

    const [errors, setErrors] = useState({
        nombre: '',
        descripcion: '',
        localidad: '',
        calle: '',
        numero: '',
    });

    const [searchQuery, setSearchQuery] = useState('');
    const [orderCriteria, setOrderCriteria] = useState(null);

    useEffect(() => {
        setIsLoading(true); // Inicia el estado de carga
        fetchUser(navigate).then((result) => {
            if (result.is_superuser) {
                setIsAdmin(true);
                fetchData('/obra/', token).then((result) => {
                    setObras(result);
                }).catch(error => {
                    console.error('Error fetching obras for admin', error);
                }).finally(() => {
                    setIsLoading(false);
                });
            } else {
                fetchData(`/user/obrasEmail/${result.email}/`, token).then((result) => {
                    setObras(result);
                    console.log(result);
                }).catch(error => {
                    console.error('Error fetching obras for user', error);
                }).finally(() => {
                    setIsLoading(false);
                });
            }
        }).catch(error => {
            console.error('Error fetching user data:', error);
            setIsLoading(false); // Asegura que el estado de carga se detenga en caso de error
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

    const validateForm = (name, value) => {
        let formErrors = errors;
        let isValid = true;

        if (obraForm.nombre.trim() === '') {
            isValid = false;
        }
        if (obraForm.descripcion.trim() === '') {
            isValid = false;
        }
        if (obraForm.id_direccion.localidad.trim() === '') {
            isValid = false;
        }
        if (obraForm.id_direccion.calle.trim() === '') {
            isValid = false;
        }
        if (isNaN(parseInt(obraForm.id_direccion.numero, 10))) {
            isValid = false;
        }

        if (name === 'nombre') {
            if (value.trim() === '') {
                formErrors.nombre = 'El nombre es obligatorio';
            } else {
                formErrors.nombre = '';
            }
        } else if (name === 'descripcion') {
            if (value.trim() === '') {
                formErrors.descripcion = 'La descripción es obligatoria';
            } else {
                formErrors.descripcion = '';
            }
        } else if (name === 'localidad') {
            if (value.trim() === '') {
                formErrors.localidad = 'La localidad es obligatoria';
            } else {
                formErrors.localidad = '';
            }
        } else if (name === 'calle') {
            if (value.trim() === '') {
                formErrors.calle = 'La calle es obligatoria';
            } else {
                formErrors.calle = '';
            }
        } else if (name === 'numero') {
            const parsedValue = parseInt(value, 10);
            if (isNaN(parsedValue)) {
                formErrors.numero = 'El número debe ser un valor numérico';
            } else {
                formErrors.numero = '';
            }
        }

        setErrors(formErrors);
        setIsFormValid(isValid);
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
            validateForm(name, value);
            return;
        }
        setObraForm({ ...obraForm, [name]: value });
        validateForm(name, value);
    };

    const handleFileChange = (file) => {
        setObraForm((prevObraForm) => ({
            ...prevObraForm,
            imagen: file,
        }));
        console.log(obraForm);
    };

    const handleSaveObra = async (id = null) => {
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
            if (id) {
                await putData(`/editar_obra/${id}/`, formDataToSend, token);
            } else {
                await postData(`/crear_obra/`, formDataToSend, token);
            }
            window.location.reload();
        } catch (error) {
            console.error('Error saving obra:', error);
        }
    };

    const handleDeleteObra = async (id) => {
        try {
            await deleteData(`/DeleteObra/${id}/`, token);
            window.location.reload();
        } catch (error) {
            console.error('Error deleting obra:', error);
        }
    };

    return (
        <div>
            <FullNavbar />
            <div className='margen-arriba'>
            {isLoading ? (
                    <Loading />
                ) : (
                    <>
                            <SearchBar onSearchChange={handleSearchChange} onOrderChange={setOrderCriteria} filters={filters} />
                            {isAdmin && (
                                <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '2rem', marginTop: '2rem'}}>
                                    <Modal openButtonText='Crear una nueva obra' openButtonWidth='12' title='Nueva Obra' saveButtonText='Crear' 
                                    saveButtonEnabled={isFormValid} handleSave={() => handleSaveObra()} handleShowModal={() => {setObraForm({
                                        nombre: '',
                                        descripcion: '',
                                        imagen: '',
                                        id_direccion: {
                                            localidad: '',
                                            calle: '',
                                            numero: '',
                                        },
                                    }); setIsFormValid(false);}} content={
                                        <div>
                                            <UploadImage onFileChange={handleFileChange} defaultImage={defaultImage}/>
                                            <Form.Label style={{ marginTop: '1rem' }}>Informació Básica:</Form.Label>
                                            <Form.Control name="nombre" type="text" placeholder='Nombre de la obra' onChange={handleInputChange} onBlur={handleInputChange} className="input-obra" />
                                            <Form.Label id='errorNombre' style={{ marginBottom:"0px", fontSize: '0.8rem', color: 'red' }}>{errors.nombre}</Form.Label>
                                            <Form.Control name="descripcion" type="text" placeholder='Descripcion de la obra' onChange={handleInputChange} onBlur={handleInputChange} className="input-obra" />
                                            <Form.Label id='errorDescripcion' style={{ marginBottom:"0px", fontSize: '0.8rem', color: 'red' }}>{errors.descripcion}</Form.Label>
                                            <Form.Group controlId="direccion">
                                                <Form.Label style={{ marginTop: '1rem' }}>Dirección:</Form.Label>
                                                <InputGroup>
                                                    <Form.Control
                                                        type="text" name="localidad" placeholder='Localidad' onChange={handleInputChange} onBlur={handleInputChange}
                                                    />
                                                    <Form.Control
                                                        type="text" name="calle" placeholder='Calle' onChange={handleInputChange} onBlur={handleInputChange}
                                                    />
                                                    <Form.Control
                                                        type="number" name="numero" placeholder='Número' onChange={handleInputChange} onBlur={handleInputChange}
                                                    />
                                                </InputGroup>
                                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                    <Form.Label id='errorLocalidad' style={{ marginBottom: "0px", fontSize: '0.8rem', color: 'red' }}>
                                                        {errors.localidad}
                                                    </Form.Label>
                                                    <Form.Label id='errorCalle' style={{ marginBottom: "0px", fontSize: '0.8rem', color: 'red' }}>
                                                        {errors.calle}
                                                    </Form.Label>
                                                    <Form.Label id='errorNumero' style={{ marginBottom: "0px", fontSize: '0.8rem', color: 'red' }}>
                                                        {errors.numero}
                                                    </Form.Label>
                                                </div>
                                            </Form.Group>
                                        </div>
                                    }></Modal>
                                </div>
                            )}
                            {Array.isArray(sortedObras) && sortedObras.length > 0 ? (
                                sortedObras.map(obra => (
                                    <GenericCard
                                        key={obra.id_obra}
                                        foto={obra.imagen}
                                        titulo={obra.nombre}
                                        descrip1={`Usuarios Registrados: ${obra.usuarios_registrados}`}
                                        descrip2={`${obra.id_direccion.localidad}, ${obra.id_direccion.calle}, ${obra.id_direccion.numero}`}
                                        hoverable={!obra.id_tipousuario || obra.id_tipousuario === 2}
                                        children={
                                            <>
                                                {(!obra.id_tipousuario || obra.id_tipousuario === 2) && (
                                                    <Icon
                                                        icon="line-md:edit-twotone"
                                                        className="hoverable-icon"
                                                        style={{ width: "2.5rem", height: "2.5rem", position: "absolute", top: "1rem", right: "1rem", color: "#02005E", transition: "transform 1s" }}
                                                        onClick={() => {
                                                            setObraForm(obra);
                                                            setIsFormValid(true);
                                                            setErrors({
                                                                nombre: '',
                                                                descripcion: '',
                                                                localidad: '',
                                                                calle: '',
                                                                numero: '',
                                                            });
                                                            setObraModal(obra.id_obra);
                                                        }}
                                                    />
                                                )}
                                                <Modal
                                                    showButton={false}
                                                    showModal={obraModal == obra.id_obra}
                                                    handleShowModal={() => setObraForm(obra)}
                                                    handleCloseModal={() => setObraModal(null)}
                                                    handleSave={() => handleSaveObra(obra.id_obra)}
                                                    saveButtonText={'Guardar'}
                                                    title={'Editar Obra'}
                                                    saveButtonEnabled={isFormValid}
                                                    showDeleteButton={true}
                                                    deleteFunction={() => handleDeleteObra(obra.id_obra)}
                                                    content={
                                                        <>
                                                            <UploadImage defaultImage={obra.imagen} onFileChange={handleFileChange} />
                                                            <Form.Label style={{ marginTop: '1rem' }}>Informació Básica:</Form.Label>
                                                            <Form.Control name="nombre" type="text" placeholder='Nombre de la obra' value={obraForm.nombre} onChange={handleInputChange} onBlur={handleInputChange} className="input-obra" />
                                                            <Form.Label id='errorNombre' style={{ marginBottom:"0px", fontSize: '0.8rem', color: 'red' }}>{errors.nombre}</Form.Label>
                                                            <Form.Control name="descripcion" type="text" placeholder='Descripcion de la obra' value={obraForm.descripcion} onChange={handleInputChange} onBlur={handleInputChange} className="input-obra" />
                                                            <Form.Label id='errorDescripcion' style={{ marginBottom:"0px", fontSize: '0.8rem', color: 'red' }}>{errors.descripcion}</Form.Label>
                                                            <Form.Group controlId="direccion">
                                                                <Form.Label style={{ marginTop: '1rem' }}>Dirección:</Form.Label>
                                                                <InputGroup>
                                                                    <Form.Control
                                                                        type="text" name="localidad" placeholder='Localidad' value={obraForm.id_direccion.localidad} onChange={handleInputChange} onBlur={handleInputChange}
                                                                    />
                                                                    <Form.Control
                                                                        type="text" name="calle" placeholder='Calle' value={obraForm.id_direccion.calle} onChange={handleInputChange} onBlur={handleInputChange}
                                                                    />
                                                                    <Form.Control
                                                                        type="number" name="numero" placeholder='Número' value={obraForm.id_direccion.numero} onChange={handleInputChange} onBlur={handleInputChange}
                                                                    />
                                                                </InputGroup>
                                                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                                    <Form.Label id='errorLocalidad' style={{ marginBottom: "0px", fontSize: '0.8rem', color: 'red' }}>
                                                                        {errors.localidad}
                                                                    </Form.Label>
                                                                    <Form.Label id='errorCalle' style={{ marginBottom: "0px", fontSize: '0.8rem', color: 'red' }}>
                                                                        {errors.calle}
                                                                    </Form.Label>
                                                                    <Form.Label id='errorNumero' style={{ marginBottom: "0px", fontSize: '0.8rem', color: 'red' }}>
                                                                        {errors.numero}
                                                                    </Form.Label>
                                                                </div>
                                                            </Form.Group>
                                                        </>
                                                    } />
                                            </>
                                        }
                                    />
                                ))
                            ) : (
                                <>
                                    <br/>
                                    <p style={{ marginLeft: '7rem', marginTop: '1rem' }}>No hay obras disponibles.</p>
                                </>
                            )}
                        </>
                    )}   
            </div>
        </div>
    );
}

export default Stock;