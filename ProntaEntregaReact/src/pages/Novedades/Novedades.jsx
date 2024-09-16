import React, { useState, useEffect } from 'react';
import FullNavbar from '../../components/navbar/full_navbar/FullNavbar.jsx';
import Semaforo from '../../components/semaforo/Semaforo.jsx';

const Novedades = () => {

    return (
        <div>
            <FullNavbar selectedPage='Novedades'/>
            <h1>Novedades</h1>
            <Semaforo></Semaforo>
        </div>
    );
};

export default Novedades;
