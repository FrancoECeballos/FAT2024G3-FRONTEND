import React, { useEffect, useState } from "react";
import Cookies from 'js-cookie';
import { Col, Row, Alert } from 'react-bootstrap';
import axios from 'axios';

import FullNavbar from '../../components/navbar/full_navbar/FullNavbar';
import Sidebar from '../../components/user/sidebar/Sidebar_perfil';
import fetchData from '../../functions/fetchData.jsx';
import ChangePasswordCard from "../../components/change_password/change_password_card/ChangePasswordCard.jsx";

import { useLocation } from 'react-router-dom';
import Loading from '../../components/loading/loading.jsx';
import fetchUser from "../../functions/fetchUser.jsx";
import { useNavigate } from 'react-router-dom';

function SeguridadYPrivacidad(){
    const navigate = useNavigate();
    const location = useLocation();
    const token = Cookies.get('token');
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState({viewedUser: {}, viewingUser: {}, viewingOtherUser: false});

    useEffect(() => {
        if (!token) {
            navigate('/login');
            return;
        }

        const updateUser = async () => {
            try {
                const result = await fetchUser(navigate);
                if (location.state) {
                    const viewedUserResult = await fetchData(`/user/${location.state.user_email}`, token);
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
    }, [token, navigate, location.state]);

    if (isLoading) {
        return <div><FullNavbar/><Loading /></div>;
    }
    
    return (
        <div style={{backgroundColor: '#ECECEC'}}>
            <FullNavbar/>
            <Row style={{ height: "100vh" }}>
                <Col xs={12} sm={3} md={3} lg={3} xl={3} xxl={3}>
                    <Sidebar selectedPage={"seguridad"} user={user}/>
                </Col>
                <Col xs={12} sm={9} md={9} lg={9} xl={9} xxl={9}>
                    <div>
                        <ChangePasswordCard user={user.viewingUser}/>
                    </div>
                </Col>
            </Row>
        </div>
    );
};

export default SeguridadYPrivacidad;