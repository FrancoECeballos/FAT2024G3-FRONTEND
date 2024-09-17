import React, { useState, useEffect } from 'react';
import FullNavbar from '../../components/navbar/full_navbar/FullNavbar.jsx';
import Semaforo from '../../components/semaforo/Semaforo.jsx';
import UploadImage from '../../components/buttons/upload_image/uploadImage.jsx';
import UploadImagee from '../../components/buttons/upload_image/uploadImageButton.jsx';


const Novedades = () => {

    return (
        <div>
            <FullNavbar selectedPage='Novedades'/>
            <h1>Novedades</h1>
            <Semaforo></Semaforo>
            <UploadImage></UploadImage>
            <UploadImagee></UploadImagee>
        </div>
    );
};

export default Novedades;
