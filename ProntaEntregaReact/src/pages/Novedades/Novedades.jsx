import React, { useState, useEffect } from 'react';
import FullNavbar from '../../components/navbar/full_navbar/FullNavbar.jsx';
import EntregaProgressBar from '../../components/EntrgaProgressBar/EntregaProgressBar.jsx';
import BackButton from '../../components/buttons/back_button/back_button.jsx';


const Novedades = () => {

    return (
        <div>
            <FullNavbar selectedPage='Novedades'/>
            <br/>
            <h1>Esta es la pagina de Novedades</h1>
            <EntregaProgressBar></EntregaProgressBar>
            <BackButton url='/'/>
        </div>
    );
};

export default Novedades;
