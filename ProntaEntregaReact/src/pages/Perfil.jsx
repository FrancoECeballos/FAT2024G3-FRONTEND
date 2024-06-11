import React from 'react';
import MiCuenta from '../components/user/cuenta/MiCuenta';
import FullNavbar from '../components/navbar/full_navbar/FullNavbar';
import Sidebar from '../components/user/sidebar/Sidebar_perfil';

function Perfil(){
    return (
        <div>
            <FullNavbar />
            <Sidebar />
            <MiCuenta />
        </div>
    );
};
export default Perfil;