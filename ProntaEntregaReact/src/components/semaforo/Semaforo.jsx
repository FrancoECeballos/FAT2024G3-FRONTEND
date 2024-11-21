import React from "react";
import semaforoFull from "../../assets/Semaforos/SemaforoFull.png";
import semaforoRojo from "../../assets/Semaforos/SemaforoRojo.png";
import semaforoVerde from "../../assets/Semaforos/SemaforoVerde.png";
import semaforoAmarillo from "../../assets/Semaforos/SemaforoAmarillo.png";

function Semaforo({ urgencia }) {
  return (
    <div>
      {urgencia === 3 ? (
        <img src={semaforoRojo} alt="" style={{ width: "12rem" }} />
      ) : urgencia === 2 ? (
        <img src={semaforoAmarillo} alt="" style={{ width: "12rem" }} />
      ) : urgencia === 1 ? (
        <img src={semaforoVerde} alt="" style={{ width: "12rem" }} />
      ) : (
        <img src={semaforoFull} alt="" style={{ width: "12rem" }} />
      )}
    </div>
  );
}
export default Semaforo;
