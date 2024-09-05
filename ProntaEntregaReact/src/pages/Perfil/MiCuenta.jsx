import Cookies from 'js-cookie';
import React, { useEffect, useState } from "react";
import { Col, Row } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';

import Cuenta from '../../components/user/cuenta/Cuenta';
import FullNavbar from '../../components/navbar/full_navbar/FullNavbar';
import Sidebar from '../../components/user/sidebar/Sidebar_perfil';

import fetchData from '../../functions/fetchData.jsx';
import fetchUser from '../../functions/fetchUser.jsx';
import Loading from '../../components/loading/loading.jsx';

import './MiCuenta.scss';

function MiCuenta(){
    const location = useLocation();
    const token = Cookies.get('token');
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState({viewedUser: {}, viewingUser: {}, viewingOtherUser: false});

    useEffect(() => {
        const updateUser = async () => {
            try {
                const result = await fetchUser();
                if (location.state && location.state != null) {
                    const viewedUserResult = await fetchData(`/user/${location.state.user_email}`);
                    setUser({viewedUser: viewedUserResult, viewingUser: result, viewingOtherUser: true});
                } else {
                    setUser({viewedUser: result, viewingUser: result, viewingOtherUser: false});
                }
            } catch (error) {
                if (error.response.data.error === "El usuario no existe.") {
                    Cookies.remove('token');
                    navigate('/login');
                }
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
        <div  style={{backgroundColor: '#ECECEC',overflowX:"hidden", width:"100%"}}>
            <FullNavbar/>
            <Row style={{ height: "100vh" }}>
                <Col xs={12} sm={3} md={3} lg={3} xl={3} xxl={3} >
                    <Sidebar selectedPage={"micuenta"} user={user}/>
                </Col>
                <Col className='colcuenta' xs={12} sm={9} md={9} lg={6} xl={6} xxl={6} style={{overflowY: "scroll", overflowX:"hidden",height:"100vh",scrollbarWidth:"none",paddingBottom:"10rem",}} >
                    <Cuenta user={user}/>
                </Col>
            </Row>
        </div>
    );
};
export default MiCuenta;