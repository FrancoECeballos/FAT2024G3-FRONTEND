import { React, useState, useEffect } from "react";
import Cookies from "js-cookie";
import "./Sidebar_perfil.scss";

import SelectableButton from "../../buttons/selectable_button/selectable_button.jsx";
import Loading from "../../loading/loading.jsx";

import { Row, Col } from "react-bootstrap";
import fetchData from "../../../functions/fetchData.jsx";

const Sidebar = ({ selectedPage, user }) => {
  const [viewedUser, setViewedUser] = useState({});
  const [viewingUser, setViewingUser] = useState({});
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = Cookies.get("token");

  useEffect(() => {
    console.log(user);
    const fetchUserData = async () => {
      try {
        if (user) {
          setViewedUser(user.viewedUser);
          setViewingUser(user.viewingUser);
        } else if (token) {
          const result = await fetchData(`/userToken/${token}`);
          setViewingUser(result);
        }

        const obrasResult = await fetchData(`/user/obrasToken/${token}`, token);
        const isAdmin =
          obrasResult.is_superuser ||
          user.viewingUser.is_superuser ||
          obrasResult.some((item) => item.id_tipousuario === 2);
        setIsAdmin(isAdmin);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [token, user]);

  if (loading) {
    return <Loading></Loading>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <Row>
      <Col className="sidebar">
        <div className="top" style={{ marginTop: "2rem" }}>
          {!user.viewingOtherUser && (
            <h1 className="user-info">
              <img
                src={viewingUser.imagen}
                className="fotoperfil"
                alt="Perfil"
              />
              <span>{viewingUser.nombreusuario}</span>
            </h1>
          )}
          {user.viewingOtherUser && (
            <h1 className="user-info-viewing">
              <img
                src={viewedUser.imagen}
                className="fotoperfil"
                alt="Perfil"
              />
              <span>Viendo a: {viewedUser.nombreusuario}</span>
            </h1>
          )}
        </div>
        <div className="content">
          <SelectableButton
            selected={selectedPage === "micuenta"}
            texto="Cuenta"
            link="/perfil/micuenta"
            locationStore={
              user.viewingOtherUser
                ? { user_email: viewedUser.email }
                : undefined
            }
          />
          <SelectableButton
            selected={selectedPage === "seguridad"}
            texto="Cambiar Contraseña"
            link="/perfil/seguridad"
            locationStore={
              user.viewingOtherUser
                ? { user_email: viewedUser.email }
                : undefined
            }
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
