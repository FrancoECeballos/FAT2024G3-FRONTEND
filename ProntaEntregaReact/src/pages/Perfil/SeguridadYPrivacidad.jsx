import React, { useEffect, useState } from "react";
import Cookies from 'js-cookie';
import { Col, Row } from 'react-bootstrap';

import Seguridad from '../../components/user/seguridad/Seguridad';
import FullNavbar from '../../components/navbar/full_navbar/FullNavbar';
import Sidebar from '../../components/user/sidebar/Sidebar_perfil';
import fetchData from '../../functions/fetchData.jsx';

import { useLocation } from 'react-router-dom';
import Loading from '../../components/loading/loading.jsx';

function SeguridadYPrivacidad(){
    const location = useLocation();
    const token = Cookies.get('token');
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState({viewedUser: {}, viewingUser: {}, viewingOtherUser: false});

    useEffect(() => {
        const updateUser = async () => {
            try {
                const result = await fetchData(`/userToken/${token}`);
                if (location.state) {
                    const viewedUserResult = await fetchData(`/user/${location.state.user_email}`);
                    setUser({viewedUser: viewedUserResult, viewingUser: result, viewingOtherUser: true});
                } else {
                    setUser({viewedUser: result, viewingUser: result, viewingOtherUser: false});
                }
            } catch (error) {
                console.log(error);
            } finally {
                setIsLoading(false);
            }
        };
    
        updateUser();
    }, [token]);

    if (isLoading) {
        return <div><FullNavbar/><Loading /></div>;
    }
    
    return (
        <div style={{backgroundColor: '#ECECEC'}}>
            <FullNavbar/>
            <Row>
                <Col xs={4} sm={4} md={4} lg={4} xl={4} xxl={4}>
                    <Sidebar selectedPage={"seguridad"} user={user}/>
                </Col>
                <Col xs={8} sm={8} md={8} lg={8} xl={8} xxl={8}>
                    <Seguridad user={user}/>
                </Col>
            </Row>
        </div>
    );
};
export default SeguridadYPrivacidad;