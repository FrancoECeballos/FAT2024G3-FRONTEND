import React from 'react';
import { useLocation } from 'react-router-dom';
import fetchData from '../../../functions/fetchData';
import postData from '../../../functions/postData.jsx';

const MiCuenta = () => {
    const location = useLocation();
    const user = location.state;

    return (
        <h1 style={{marginTop: '15rem', marginLeft: '30rem'}}>
            {`Hello, ${user.id_usuario}!`}
        </h1>
    );
};

export default MiCuenta;