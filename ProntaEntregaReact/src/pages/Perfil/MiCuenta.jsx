import Cookies from 'js-cookie';
import React, { useEffect, useState } from "react";
import { Col, Row } from 'react-bootstrap';

import Cuenta from '../../components/user/cuenta/Cuenta';
import FullNavbar from '../../components/navbar/full_navbar/FullNavbar';
import Sidebar from '../../components/user/sidebar/Sidebar_perfil';

import fetchData from '../../functions/fetchData.jsx';

function MiCuenta(){
    const token = Cookies.get('token');
    const [user, setUser] = useState({});
    useEffect(() => {
        fetchData(`/userToken/${token}`).then((result) => {
            setUser(result);
        });
    }, [token]);

    return (
        <div style={{backgroundColor: '#ECECEC',overflowX:"hidden", position:'fixed',width:"100%"}}>
            <FullNavbar/>
            <Row>
                <Col xs={3} sm={3} md={3} lg={3} xl={3} xxl={3}>
                    <Sidebar isAdmin={user.is_staff}/>
                </Col>
                <Col style={{overflowY: "scroll", overflowX:"hidden", width:"70%", height:"100vh",scrollbarWidth:"none"}} xs={9} sm={9} md={9} lg={9} xl={9} xxl={9}>
                    <Cuenta/>
                </Col>
            </Row>
        </div>
    );
};
export default MiCuenta;