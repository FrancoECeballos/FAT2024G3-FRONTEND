import React from 'react';
import MiCuenta from '../components/user/cuenta/MiCuenta';
import FullNavbar from '../components/navbar/full_navbar/FullNavbar';

function Perfil(){
    return (
        <div>
            <FullNavbar />
            <MiCuenta />
        </div>
    );
};
export default Perfil;