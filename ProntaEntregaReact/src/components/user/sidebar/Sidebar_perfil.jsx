import React from 'react';
import './Sidebar_perfil.scss';

const Slidebar = () => {
    return (
    <div className="sidebar">
      <ul>
      <li><a href="#">Mi Cuenta</a></li>
        <li><a href="#">Seguridad y Privacidad</a></li>
        <li><a href="#">Datos Personales</a></li>
        <li><a href="#">Casas</a></li>
      </ul>
    </div>
    );
};

export default Slidebar;