import React, { useEffect, useState } from "react";
import Cookies from 'js-cookie';
import Seguridad from '../../components/user/seguridad/Seguridad';
import FullNavbar from '../../components/navbar/full_navbar/FullNavbar';
import Sidebar from '../../components/user/sidebar/Sidebar_perfil';
import fetchData from '../../functions/fetchData.jsx';

function SeguridadYPrivacidad(){
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
            <Sidebar isAdmin={user.is_staff}/>
            <Seguridad/>
        </div>
    );
};
export default SeguridadYPrivacidad;