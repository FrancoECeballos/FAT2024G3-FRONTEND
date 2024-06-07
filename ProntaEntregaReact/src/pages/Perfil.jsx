import React from 'react';
import MiCuenta from '../components/user/cuenta/MiCuenta';
import FullNavbar from '../components/navbar/full_navbar/FullNavbar';
import Slidebar from '../components/user/sidebar/Sidebar_perfil';

function Perfil(){
    return (
        <div>
            <FullNavbar />
            <Slidebar />
            <MiCuenta />
        </div>
    );
};
export default Perfil;