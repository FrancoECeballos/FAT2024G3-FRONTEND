import React from 'react';
import Datos from '../../components/user/cuenta/Datos';
import FullNavbar from '../../components/navbar/full_navbar/FullNavbar';
import Sidebar from '../../components/user/sidebar/Sidebar_perfil';

function Datospersonales(){
    return (
        <div style={{backgroundColor: '#ECECEC'}}>
            <Sidebar/>
            <FullNavbar/>
            <Datos/>
        </div>
    );
};
export default Datospersonales;