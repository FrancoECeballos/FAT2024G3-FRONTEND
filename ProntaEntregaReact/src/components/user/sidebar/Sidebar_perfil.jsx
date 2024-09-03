import { React, useState, useEffect } from "react";
import Cookies from 'js-cookie';
import "./Sidebar_perfil.scss";

import SelectableButton from "../../buttons/selectable_button/selectable_button.jsx";
import Loading from "../../loading/loading.jsx";

import { Row, Col } from 'react-bootstrap';
import fetchData from "../../../functions/fetchData.jsx";

const Sidebar = ({ isAdmin = false, selectedPage }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = Cookies.get('token');

  useEffect(() => {
    if (token) {
      fetchData(`/userToken/${token}`)
        .then((result) => {
          setUser(result);
          setLoading(false);
        })
        .catch((err) => {
          setError(err);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [token]);

  if (loading) {
    return <Loading></Loading>
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <Row>
      <Col className="sidebar">
        <div className="top">
          <h1 className="user-info">
            <img src={user.imagen} className="fotoperfil" alt="Perfil" />
            <span>{user.nombreusuario}</span>
          </h1>
        </div>
        <div className="content">
          <SelectableButton 
            selected={selectedPage === "micuenta"}
            texto="Cuenta" 
            link="/perfil/micuenta" 
          />
          <SelectableButton
            selected={selectedPage === "seguridad"}
            texto="Seguridad y Privacidad"
            link="/perfil/seguridad"
          />
          <SelectableButton
            selected={selectedPage === "datospersonales"}
            texto="Datos Personales"
            link="/perfil/datospersonales"
          />
          <SelectableButton 
            selected={selectedPage === "obras"}
            texto="Obras" 
            link="/obras" 
          />
        </div>
      </Col>
    </Row>
  );
};

export default Sidebar;