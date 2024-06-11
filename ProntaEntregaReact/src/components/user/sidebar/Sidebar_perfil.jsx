import React from 'react';
import './Sidebar_perfil.scss';
import SelectableButton from '../../buttons/selectable_button/selectable_button.jsx';

const Sidebar = () => {
    return (
      <div className="sidebar">
      <ul>
        <SelectableButton texto="Mi cuenta" link="/Perfil/micuenta"/>
        <SelectableButton texto="Seguridad y Privacidad" link="/Perfil/micuenta"/>
        <SelectableButton texto="Datos Personales" link="/Perfil/micuenta"/>
        <SelectableButton texto="Casas" link="/Perfil/micuenta"/>
      </ul>
      </div>
    );
};

export default Sidebar;