import React from "react";
import './Seguridad.scss';
import user from '../../../assets/user_default.png';

const Seguridad = () => {
    return (
        <div>
        <img src={user} className="fotoperfil" />
        <h2>Información personal</h2>
        </div>
    );
}

export default Seguridad;