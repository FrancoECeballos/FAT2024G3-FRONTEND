import Cookies from 'js-cookie';
import React, { useEffect, useState } from "react";
import Cuenta from '../../components/user/cuenta/Cuenta';
import FullNavbar from '../../components/navbar/full_navbar/FullNavbar';
import Sidebar from '../../components/user/sidebar/Sidebar_perfil';
import { Col } from 'react-bootstrap'

import fetchData from '../../functions/fetchData.jsx';

function MiCuenta(){
    const token = Cookies.get('token');
    const [user, setUser] = useState({});
    useEffect(() => {
        fetchData(`/userToken/${token}`).then((result) => {
            setUser(result);
        });
    }, [token]);

    console.log(user.is_staff);

    return (
        <div style={{backgroundColor: '#ECECEC'}}>
            <FullNavbar/>
            <Col xs={12} sm={4} md={4} lg={4} xl={4} xxl={4}>
                <Sidebar isAdmin={user.is_staff}/>
            </Col>
            <Col>
                <Cuenta/>
            </Col>
        </div>
    );
};
export default MiCuenta;