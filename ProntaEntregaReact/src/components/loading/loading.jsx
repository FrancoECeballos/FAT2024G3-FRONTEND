// Loading.jsx
import React from "react";
import "./loading.scss";

function Loading() {
  return (
    <div className="loading-container">
      <div className="spinner"></div>
      <p>Cargando...</p>
    </div>
  );
}

export default Loading;
