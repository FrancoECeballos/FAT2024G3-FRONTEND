import React, { useState, useEffect } from 'react';
import FullNavbar from '../../components/navbar/full_navbar/FullNavbar.jsx';
import Semaforo from '../../components/semaforo/Semaforo.jsx';
import UploadImage from '../../components/buttons/upload_image/uploadImage.jsx';


const Novedades = () => {

    return (
        <div>
            <FullNavbar selectedPage='Novedades'/>
            <h1>Novedades</h1>
            <Semaforo></Semaforo>
            <UploadImage usingIcon={true} buttonHidden={false}></UploadImage>
        </div>
    );
};

export default Novedades;
