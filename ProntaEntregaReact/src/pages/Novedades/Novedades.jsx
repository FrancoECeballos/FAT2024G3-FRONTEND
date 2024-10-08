import React, { useState, useEffect } from 'react';
import FullNavbar from '../../components/navbar/full_navbar/FullNavbar.jsx';
import EntregaProgressBar from '../../components/EntrgaProgressBar/EntregaProgressBar.jsx';


const Novedades = () => {

    return (
        <div>
            <FullNavbar selectedPage='Novedades'/>
            <br/>
            <h1>Esta es la pagina de Novedades</h1>
            <EntregaProgressBar></EntregaProgressBar>
        </div>
    );
};

export default Novedades;
