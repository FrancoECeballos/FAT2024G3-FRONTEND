import Cookies from 'js-cookie';
import React, { useEffect, useState } from "react";
import { Col, Row } from 'react-bootstrap';

import Datos from '../../components/user/cuenta/Datos';
import FullNavbar from '../../components/navbar/full_navbar/FullNavbar';
import Sidebar from '../../components/user/sidebar/Sidebar_perfil';

import fetchData from '../../functions/fetchData.jsx';
import { useNavigate } from 'react-router-dom';

import { useLocation } from 'react-router-dom';
import Loading from '../../components/loading/loading.jsx';

import fetchUser from '../../functions/fetchUser.jsx';

const Entregas = () => {
    return (
        <div>
            <FullNavbar/>
            <h1>Pagina de entregas</h1>
        </div>
    );
};

export default Entregas;