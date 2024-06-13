import React, { useEffect, useState } from "react";
import fetchData from '../../../functions/fetchData';
import Cookies from 'js-cookie';
import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom';
import './cuenta.scss';

const GENDER_CHOICES = {
    0: 'Hombre',
    1: 'Mujer',
    2: 'Prefiero no decirlo'
};

const Cuenta = () => {
    const navigate = useNavigate();
    const token = Cookies.get('token');

    const [userData, setUserData] = useState({
        nombre: "",
        apellido: "",
        nombreusuario: "",
        password: "",
        documento: "",
        telefono: "",
        email: "",
        genero: "",
        id_direccion: "",
        id_tipousuario: "",
        id_tipodocumento: ""
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
        <div className="micuenta">
            <h1>{`Bienvenido ${userData.nombreusuario}`}</h1>
            <form>
                <div>
                    <label htmlFor="nombre">{`Nombre: ${userData.nombre}`}</label>
                </div>
                <div>
                    <label htmlFor="apellido">{`Apellido: ${userData.apellido}`}</label>
                </div>
                <div>
                    <label htmlFor="email">{`Email: ${userData.email}`}</label>
                </div>
                <div>
                    <label htmlFor="telefono">{`Telefono: ${userData.telefono}`}</label>
                </div>
                <div>
                    <label htmlFor="direccion">{`Direccion: ${userData.id_direccion.localidad}, ${userData.id_direccion.calle} ${userData.id_direccion.numero}`}</label>
                </div>
                <div>
                    <label htmlFor="genero">{`Genero: ${GENDER_CHOICES[userData.genero]}`}</label>
                </div>
                <Button type="submit">Editar</Button>
            </form>
            <Button className="btn btn-danger" style={{ marginTop: '15rem', marginLeft: '30rem' }} onClick={handleLogout}>
                Logout
            </Button>
        </div>
    );
};

export default Cuenta;
