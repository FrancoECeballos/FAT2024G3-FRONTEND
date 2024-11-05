import React, { useState } from 'react';
import FullNavbar from '../../components/navbar/full_navbar/FullNavbar.jsx';
import EntregaProgressBar from '../../components/EntrgaProgressBar/EntregaProgressBar.jsx';
import BackButton from '../../components/buttons/back_button/back_button.jsx';
import Popup from '../../components/alerts/popup/Popup.jsx';
import { Button } from 'react-bootstrap';

const Novedades = () => {
    const [show, setShow] = useState(false);

    return (
        <div>
            <FullNavbar selectedPage='Novedades'/>
            <br/>
            <h1>Esta es la pagina de Novedades</h1>
            <EntregaProgressBar />
            <BackButton url='/' />
            <Button onClick={() => setShow(true)}>Show Popup</Button>
            <Popup show={show} setShow={setShow} message={"Renzo es gay"} title={"Putaso"}/>
        </div>
    );
};

export default Novedades;