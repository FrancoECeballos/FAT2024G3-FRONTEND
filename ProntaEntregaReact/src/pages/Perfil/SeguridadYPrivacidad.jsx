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
                <Col xs={12} sm={3} md={3} lg={3} xl={3} xxl={3}>
                    <Sidebar selectedPage={"seguridad"} isAdmin={user.viewingUser.is_staff} user={user}/>
                </Col>
                <Col xs={12} sm={9} md={9} lg={9} xl={9} xxl={9}>
                    <Seguridad user={user}/>
                </Col>
            </Row>
        </div>
    );
};
export default SeguridadYPrivacidad;