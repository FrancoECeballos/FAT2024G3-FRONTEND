import Cookies from 'js-cookie';
import React, { useEffect, useState } from "react";
import { Col, Row } from 'react-bootstrap';

import Cuenta from '../../components/user/cuenta/Cuenta';
import FullNavbar from '../../components/navbar/full_navbar/FullNavbar';
import Sidebar from '../../components/user/sidebar/Sidebar_perfil';

import fetchData from '../../functions/fetchData.jsx';

import './MiCuenta.scss';

function MiCuenta(){
    const token = Cookies.get('token');
    const [user, setUser] = useState({});
    useEffect(() => {
        fetchData(`/userToken/${token}`).then((result) => {
            setUser(result);
        });
    }, [token]);

    return (
        <div  style={{backgroundColor: '#ECECEC',overflowX:"hidden", width:"100%"}}>
            <FullNavbar/>
            <Row style={{ height: "100vh" }}>
                <Col xs={12} sm={3} md={3} lg={3} xl={3} xxl={3} >
                    <Sidebar isAdmin={user.is_staff}/>
                </Col>
                <Col className='colcuenta' xs={12} sm={9} md={9} lg={6} xl={6} xxl={6} style={{overflowY: "scroll", overflowX:"hidden",height:"100vh",scrollbarWidth:"none",paddingBottom:"10rem",}} >
                    <Cuenta/>
                </Col>
            </Row>
        </div>
    );
};
export default MiCuenta;