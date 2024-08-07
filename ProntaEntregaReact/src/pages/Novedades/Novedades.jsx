import React, { useState, useEffect } from 'react';
import FullNavbar from '../../components/navbar/full_navbar/FullNavbar.jsx';
import UploadImage from '../../components/buttons/upload_image/uploadImage.jsx';
import Cookies from 'js-cookie';

import fetchData from '../../functions/fetchData.jsx';


const Novedades = () => {
    const [unidadMedida, setUnidadMedida] = useState([]);
    const token = Cookies.get('token');
    const headers = ["id", "nombre", "descripcion", "identificador"];

    useEffect(() => {
        if (!token) {
            navigate('/login');
            return;
        }
        fetchData(`unidad_medida/`, token).then((result) => {
            setUnidadMedida(result);
        });
    });

    return (
        <div>
            <FullNavbar selectedPage='Novedades'/>
            <UploadImage/>
        </div>
    );
};

export default Novedades;
