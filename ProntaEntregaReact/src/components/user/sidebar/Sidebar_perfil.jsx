import { React, useState, useEffect } from "react";
import Cookies from 'js-cookie';
import "./Sidebar_perfil.scss";

import SelectableButton from "../../buttons/selectable_button/selectable_button.jsx";
import Loading from "../../loading/loading.jsx";

import { Row, Col } from 'react-bootstrap';
import fetchData from "../../../functions/fetchData.jsx";

const Sidebar = ({ isAdmin = false, selectedPage, user }) => {
  const [viewedUser, setViewedUser] = useState({});
  const [viewingUser, setViewingUser] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = Cookies.get('token');

  useEffect(() => {
    if (user) {
      setViewedUser(user.viewedUser);
      setViewingUser(user.viewingUser);
      setLoading(false);
    } else if (token) {
      fetchData(`/userToken/${token}`)
        .then((result) => {
          setViewingUser(result);
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
        {!user.viewingOtherUser && (
          <h1 className="user-info">
            <img src={viewingUser.imagen} className="fotoperfil" alt="Perfil" />
            <span>{viewingUser.nombreusuario}</span>
          </h1>
        )}
        {user.viewingOtherUser && (
          <h1 className="user-info-viewing">
            <img src={viewedUser.imagen} className="fotoperfil" alt="Perfil" />
            <span>Viendo a: {viewedUser.nombreusuario}</span>
          </h1>
        )}
        </div>
        <div className="content">
          <SelectableButton 
            selected={selectedPage === "micuenta"}
            texto="Cuenta" 
            link="/perfil/micuenta" 
            locationStore={{ user_email: viewedUser.email }}
          />
          <SelectableButton
            selected={selectedPage === "seguridad"}
            texto="Seguridad y Privacidad"
            link="/perfil/seguridad"
            locationStore={{ user_email: viewedUser.email }}
          />
          <SelectableButton
            selected={selectedPage === "datos_personales"}
            texto="Datos Personales"
            link="/perfil/datos_personales"
            locationStore={{ user_email: viewedUser.email }}
          />
          <SelectableButton 
            selected={selectedPage === "obras"}
            texto="Obras" 
            link="/obras" 
          />
          {isAdmin && (
            <SelectableButton
              selected={selectedPage === "administrarUsuarios"}
              texto="Administrar Usuarios"
              link="/userlisting"
            />
          )}
        </div>
      </Col>
    </Row>
  );
};

export default Sidebar;