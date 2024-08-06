import Cookies from 'js-cookie';
import React, { useEffect, useState } from "react";
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
            <Sidebar isAdmin={user.is_staff}/>
            <Cuenta/>
        </div>
    );
};
export default MiCuenta;