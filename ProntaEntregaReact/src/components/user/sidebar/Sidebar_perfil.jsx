import React from "react";
import "./Sidebar_perfil.scss";
import SelectableButton from "../../buttons/selectable_button/selectable_button.jsx";
import {Row, Col} from 'react-bootstrap';

const Sidebar = ({ isAdmin = false }) => {
  return (
    <div className="sidebar">
      <Row>
        <Col>
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
            <SelectableButton texto="Administrar Usuarios" link="/userlisting" />
          ) : null}
        </Col>
      </Row>
    </div>
  );
};

export default Sidebar;
