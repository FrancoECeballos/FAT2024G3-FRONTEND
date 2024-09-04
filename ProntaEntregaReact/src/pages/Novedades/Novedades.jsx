import React, { useState, useEffect } from 'react';
import FullNavbar from '../../components/navbar/full_navbar/FullNavbar.jsx';
import ConfirmationModal from '../../components/modals/confirmation_modal/ConfirmationModal.jsx';


const Novedades = () => {
    return (
        <div>
            <FullNavbar selectedPage='Novedades'/>
            <ConfirmationModal 
              BodyText="Esto es un modal de ejemplo" 
              style={{ backgroundColor: "blue" }} 
              OpenButtonText="Abrir" 
              CloseButtonText="Cerrar" 
              ConfirmButtonText="Aceptar" 
              onClickConfirm={() => console.log("Confirmado")} 
              onClose={() => console.log("Modal cerrado")}
            />

        </div>
    );
};

export default Novedades;
