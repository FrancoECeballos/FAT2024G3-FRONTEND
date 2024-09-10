import React, { useState, useEffect } from 'react';
import FullNavbar from '../../components/navbar/full_navbar/FullNavbar.jsx';
import ConfirmationModal from '../../components/modals/confirmation_modal/ConfirmationModal.jsx';
import { Button } from 'react-bootstrap';


const Novedades = () => {
    const [openModal, setOpenModal] = useState(false);

    return (
        <div>
            <FullNavbar selectedPage='Novedades'/>
            <h1>Novedades</h1>
            <Button onClick={() => setOpenModal(true)}>Abrir</Button>
            <ConfirmationModal 
              Open={openModal}
              BodyText="Esto es un modal de ejemplo" 
              style={{ backgroundColor: "blue" }}
              CloseButtonText="Cerrar" 
              ConfirmButtonText="Aceptar" 
              onClickConfirm={() => console.log("Confirmado")} 
              onClose={() => {console.log("Modal cerrado"), setOpenModal(false)}}
            />

        </div>
    );
};

export default Novedades;
