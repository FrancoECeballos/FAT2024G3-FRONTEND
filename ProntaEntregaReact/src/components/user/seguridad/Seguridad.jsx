import React from "react";
import { useState, useEffect } from "react";
import user from '../../../assets/user_default.png';

const Seguridad = ({ user }) => {
    const [userData, setUserData] = useState({});

    useEffect(() => {
        setUserData(user.viewedUser);
    }
    , [user.viewedUser]);

    return (
        <div>
        <img src={userData.imagen} className="fotoperfil" />
        <h2>Información personal</h2>
        </div>
    );
}

export default Seguridad;