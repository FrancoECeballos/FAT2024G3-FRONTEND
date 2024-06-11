import React from 'react';
import './Sidebar_perfil.scss';
import SelectableButton from '../../buttons/selectable_button/selectable_button.jsx';

const Sidebar = () => {
    return (
      <div className="sidebar">
      <ul>
        <SelectableButton texto="Mi cuenta" link="/perfil"/>
        <SelectableButton texto="Mi cuenta" link="/perfil"/>
        <SelectableButton texto="Mi cuenta" link="/perfil"/>
        <SelectableButton texto="Mi cuenta" link="/perfil"/>
      </ul>
      </div>
    );
};

export default Sidebar;