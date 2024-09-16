import React from 'react';
import semaforoFull from '../../assets/Semaforos/SemaforoFull.png';
import semaforoRojo from '../../assets/Semaforos/SemaforoRojo.png';
import semaforoVerde from '../../assets/Semaforos/SemaforoVerde.png';
import semaforoAmarillo from '../../assets/Semaforos/SemaforoAmarillo.png';


function Semaforo(urgencia) {
    return (
        <div>
            <img src={semaforoFull} alt="" style={{width:"20rem"}}/>
        </div>
    );
} export default Semaforo;