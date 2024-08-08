import React from "react";
import "./Sidebar_perfil.scss";
import SelectableButton from "../../buttons/selectable_button/selectable_button.jsx";

const Sidebar = ({ isAdmin = false }) => {
  return (
    <div className="sidebar">
      <ul>
        <SelectableButton texto="Mi cuenta" link="/perfil/micuenta" />
        <SelectableButton
          texto="Seguridad y Privacidad"
          link="/perfil/seguridad"
        />
        <SelectableButton
          texto="Datos Personales"
          link="/perfil/datos_personales"
        />
        <SelectableButton texto="Obras" link="/obras" />
        {isAdmin ? (
          <SelectableButton texto="Administrar Usuarios" link="/selectuser" />
        ) : null}
      </ul>
    </div>
  );
};

export default Sidebar;
