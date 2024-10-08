import React, { useState, useEffect } from 'react';
import FullNavbar from '../../components/navbar/full_navbar/FullNavbar.jsx';
import Semaforo from '../../components/semaforo/Semaforo.jsx';
import UploadImage from '../../components/buttons/upload_image/uploadImage.jsx';


const Novedades = () => {

    return (
        <div>
            <FullNavbar selectedPage='Novedades'/>
            <br/>
            <h1>Esta es la pagina de Novedades</h1>
        </div>
    );
};

export default Novedades;
