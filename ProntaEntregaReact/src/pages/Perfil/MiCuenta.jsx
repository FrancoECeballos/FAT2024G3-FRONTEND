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
        <div style={{backgroundColor: '#ECECEC'}}>
            <FullNavbar/>
            <Row>
                <Col xs={4} sm={4} md={4} lg={4} xl={4} xxl={4}>
                    <Sidebar isAdmin={user.is_staff}/>
                </Col>
                <Col xs={8} sm={8} md={8} lg={8} xl={8} xxl={8}>
                    <Cuenta/>
                </Col>
            </Row>
        </div>
    );
};
export default MiCuenta;