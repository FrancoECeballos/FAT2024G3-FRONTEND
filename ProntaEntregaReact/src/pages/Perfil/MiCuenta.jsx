import React from 'react';
import Cuenta from '../../components/user/cuenta/Cuenta';
import FullNavbar from '../../components/navbar/full_navbar/FullNavbar';
import Sidebar from '../../components/user/sidebar/Sidebar_perfil';
import { Col } from 'react-bootstrap'

function MiCuenta(){
    return (
        <div style={{backgroundColor: '#ECECEC'}}>
            <FullNavbar/>
            <Col xs={12} sm={4} md={4} lg={4} xl={4} xxl={4}>
                <Sidebar/>
            </Col>
            <Col>
                <Cuenta/>
            </Col>
        </div>
    );
};
export default MiCuenta;