import React from 'react';
import Seguridad from '../../components/user/seguridad/Seguridad';
import FullNavbar from '../../components/navbar/full_navbar/FullNavbar';
import Sidebar from '../../components/user/sidebar/Sidebar_perfil';

function SeguridadYPrivacidad(){
    return (
        <div style={{backgroundColor: '#ECECEC'}}>
            <Sidebar/>
            <FullNavbar/>
            <Seguridad/>
        </div>
    );
};
export default SeguridadYPrivacidad;