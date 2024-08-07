import React, { useState, useEffect } from 'react';
import FullNavbar from '../../components/navbar/full_navbar/FullNavbar.jsx';
import UploadImage from '../../components/buttons/upload_image/uploadImage.jsx';

import fetchData from '../../functions/fetchData.jsx';


const Novedades = () => {
    return (
        <div>
            <FullNavbar/>
            <UploadImage/>
        </div>
    );
};

export default Novedades;
