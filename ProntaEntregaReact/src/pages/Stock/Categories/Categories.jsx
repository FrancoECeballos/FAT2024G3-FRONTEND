import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import './Categories.scss';

import SearchBar from '../../../components/searchbar/searchbar.jsx';
import FullNavbar from '../../../components/navbar/full_navbar/FullNavbar.jsx';
import GenericCard from '../../../components/cards/generic_card/GenericCard.jsx';
import SendButton from '../../../components/buttons/send_button/send_button.jsx';
import UploadImage from '../../../components/buttons/upload_image/uploadImage.jsx';
import Footer from '../../../components/footer/Footer.jsx';
import Loading from '../../../components/loading/loading.jsx';

import fetchData from '../../../functions/fetchData';

import Modal from '../../../components/modals/Modal.jsx';
import {Breadcrumb, Form} from 'react-bootstrap';
import postData from '../../../functions/postData.jsx';
import defaultImage from '../../../assets/no_image.png';



function Categories() {
    const navigate = useNavigate();
    const { stockId } = useParams();
    const token = Cookies.get('token');

    const [categories, setCategories] = useState([]);
    const [currentObra, setCurrentObra] = useState(false);
    const [isFormValid, setIsFormValid] = useState(false);

    const [searchQuery, setSearchQuery] = useState('');
    const [orderCriteria, setOrderCriteria] = useState(null);

    const [isLoading, setIsLoading] = useState(true);


    const [formData, setFormData] = useState({
        "imagen": null,
        "nombre": "",
        "descripcion": "",
      });

    const [errors, setErrors] = useState({
        nombre: '',
        descripcion: '',
    });
    
    useEffect(() => {
        if (!token) {
            navigate('/login');
            return;
        }

        fetchData('categoria/', token).then((result) => {
            setCategories(result);
        }).catch(error => {
            console.error('Error fetching categories:', error);
        });

        fetchData(`/stock/${stockId}`, token).then((result) => {
            setCurrentObra(result[0].id_obra.nombre);
        });
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

        setIsLoading(false);
    }, [token, navigate, stockId]);

    const filteredCategories = categories.filter(category => {
        return (
            category.nombre?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            category.descripcion?.toLowerCase().includes(searchQuery.toLowerCase())
        );
    });

    const sortedCategories = [...filteredCategories].sort((a, b) => {
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
        { type: 'cantidad_productos', label: 'Cantidad de Productos' },
    ];

    const handleSearchChange = (value) => {
        setSearchQuery(value);
    };

    const handleInputChange = async (event) => {
        const { name, value } = event.target;
        let valid = true;

        setFormData((prevData) => {
            const updatedData = { ...prevData, [name]: value };
            console.log(updatedData);
            return updatedData;
        });

        if (formData.imagen === null || formData.nombre === '' || formData.descripcion === '') {
            valid = false;
        }

        setIsFormValid(valid);

        if (name === 'nombre') {
            if (value.trim() === '') {
                setErrors((prevErrors) => ({ ...prevErrors, nombre: 'El nombre no puede estar vacio.' }));
            } else {
                setErrors((prevErrors) => ({ ...prevErrors, nombre: '' }));
            }
        } else if (name === 'descripcion') {
            if (value.trim() === '') {
                setErrors((prevErrors) => ({ ...prevErrors, descripcion: 'La descripción no puede estar vacia.' }));
            } else {
                setErrors((prevErrors) => ({ ...prevErrors, descripcion: '' }));
            }
        }

    };

    const newcategory = async () => {
        if (!formData.imagen) {
            console.error('No image file selected');
            return;
        }
    
        const data = new FormData();
        data.append('imagen', formData.imagen);
        data.append('nombre', formData.nombre);
        data.append('descripcion', formData.descripcion);
    
        try {
            await postData('crear_categoria/', data, token);
            window.location.reload();
        } catch (error) {
            console.error('Error creating category:', error);
        }
    };

    const handleFileChange = (file) => {
        setFormData((prevsetFormData) => ({
            ...prevsetFormData,
            imagen: file,
        }));
    };

    return (
        <div>
            <FullNavbar selectedPage='Stock' />
            <div className='margen-arriba'>
                {isLoading ? (
                    <Loading />
                ) : (
                <div>
                <Breadcrumb style={{marginLeft:"8%", fontSize:"1.2rem"}}>
                    <Breadcrumb.Item href="/stock">Stock</Breadcrumb.Item>
                    <Breadcrumb.Item active>{currentObra}</Breadcrumb.Item>
                </Breadcrumb>
                <SearchBar onSearchChange={handleSearchChange} onOrderChange={setOrderCriteria} filters={filters}/>
                <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '2rem', marginTop: '2rem'}}>
                    <Modal openButtonText='Añadir una categoria nueva' openButtonWidth='15' title='Crear Categoria' saveButtonText='Crear' handleSave={newcategory} saveButtonEnabled={isFormValid} content={
                        <div>
                            <h2 className='centered'> Nueva Categoria </h2>
                            <UploadImage wide='13' titulo='Imagen del Producto' onFileChange={handleFileChange} defaultImage={defaultImage}/>
                            <Form.Control name="nombre" type="text" placeholder="Nombre" onBlur={handleInputChange} onChange={handleInputChange} style={{ borderRadius: '10rem', backgroundColor: '#F5F5F5', boxShadow: '0.10rem 0.3rem 0.20rem rgba(0, 0, 0, 0.3)', marginTop: '1rem' }} />
                            <Form.Label id='errorNombre' style={{ marginBottom:"0px", fontSize: '0.8rem', color: 'red' }}>{errors.nombre}</Form.Label>
                            <Form.Control name="descripcion" type="text" placeholder="Descripción" onBlur={handleInputChange} onChange={handleInputChange} style={{ borderRadius: '10rem', backgroundColor: '#F5F5F5', boxShadow: '0.10rem 0.3rem 0.20rem rgba(0, 0, 0, 0.3)', marginTop: '1rem' }} />
                            <Form.Label id='errorDescripcion' style={{ marginBottom:"0px", fontSize: '0.8rem', color: 'red' }}>{errors.descripcion}</Form.Label>
                        </div>
                    }></Modal>
                </div>
                <div className='cardCategori'>
                {Array.isArray(sortedCategories) && sortedCategories.length > 0 ? sortedCategories.map(category => (  
                    <GenericCard 
                        onClick={() => navigate(`/obra/${stockId}/categoria/${category.id_categoria}/`, { state: { id_stock: stockId } })}
                        foto={category.imagen}
                        key={category.id_categoria}
                        titulo={category.nombre}
                        descrip1={category.descripcion}
                    />
                )) : (
                    <p style={{marginLeft: '7rem', marginTop: '1rem'}}>No hay categorías disponibles.</p>
                )}
                </div>
                <Footer/>
            </div>
            )}
        </div>
    </div>
    );
}

export default Categories;
