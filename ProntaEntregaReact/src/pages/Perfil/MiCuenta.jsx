import React from 'react';
import Cuenta from '../../components/user/cuenta/Cuenta';
import FullNavbar from '../../components/navbar/full_navbar/FullNavbar';
import Sidebar from '../../components/user/sidebar/Sidebar_perfil';

function MiCuenta(){
    return (
        <div style={{backgroundColor: '#ECECEC'}}>
            <Sidebar/>
            <FullNavbar/>
            <Cuenta/>
        </div>
    );
};
export default MiCuenta;