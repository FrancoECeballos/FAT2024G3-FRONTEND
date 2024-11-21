import React from "react";
import { useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";

function BackButton({ url }) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(url)}
      style={{ cursor: "pointer", marginTop: "2rem" }}
    >
      <div
        style={{ display: "flex", alignItems: "center", marginLeft: "2rem" }}
      >
        <Icon
          icon="line-md:chevron-left"
          style={{ width: "1.5rem", height: "1.5rem" }}
        />
        <p style={{ margin: 0, marginLeft: "0.5rem", fontSize: "1.2rem" }}>
          Volver
        </p>
      </div>
      <div className="centered">
        <hr style={{ width: "95%" }} />
      </div>
    </div>
  );
}
export default BackButton;
