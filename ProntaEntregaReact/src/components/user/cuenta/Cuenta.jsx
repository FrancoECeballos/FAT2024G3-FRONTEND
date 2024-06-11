import React, { useEffect, useRef, useState } from "react";
import fetchData from '../../../functions/fetchData';
import Cookies from 'js-cookie';
import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom';

const Cuenta = () => {
    const navigate = useNavigate();
    const token = Cookies.get('token');
    

    const [userData, setUserData] = useState({
        "nombre": "",
        "apellido": "",
        "nombreusuario": "",
        "password": "",
        "documento": "",
        "telefono": "",
        "email": "",
        "genero": "",
        "id_direccion": "",
        "id_tipousuario": "",
        "id_tipodocumento": ""
      });
      
    useEffect(() => {
        if (!token) {
            navigate('/login');
            return;
        }
        fetchData(`/userToken/${token}`).then((result) => {
            setUserData(result);
        });
    }, [token]);

    const handleLogout = () => {
        Cookies.remove('token');
        navigate('/login');
    };

    return (
        <div>
            <h1 style={{marginTop: '15rem', marginLeft: '30rem'}}>
                {`Hello, ${userData.nombreusuario}!`}
            </h1>

            <Button className="btn btn-danger" style={{marginTop: '15rem', marginLeft: '30rem'}} onClick={handleLogout}>
                Logout
            </Button>
        </div>
    );
};

export default Cuenta;
