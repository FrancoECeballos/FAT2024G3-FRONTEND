import Cookies from 'js-cookie';
import React, { useEffect, useState } from "react";
import Datos from '../../components/user/cuenta/Datos';
import FullNavbar from '../../components/navbar/full_navbar/FullNavbar';
import Sidebar from '../../components/user/sidebar/Sidebar_perfil';
import fetchData from '../../functions/fetchData.jsx';

function Datospersonales(){
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
            <Datos/>
        </div>
    );
};
export default Datospersonales;