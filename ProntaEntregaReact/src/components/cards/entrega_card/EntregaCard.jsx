import React, { useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import { Form, Card, OverlayTrigger, Tooltip } from 'react-bootstrap';
import fetchData from '../../../functions/fetchData';
import EntregaProgressBar from '../../../components/EntrgaProgressBar/EntregaProgressBar.jsx';

import './EntregaCard.scss';

const EntregaCard = ({ recorridoModal, entrega, user }) => {
    const [estado, setEstado] = useState({ texto: '', imagen: 0 });

    useEffect(() => {
        console.log(recorridoModal);

        if (recorridoModal.id_estadoEntrega.id_estadoEntrega === 2) {
            if (recorridoModal.fechaEntrega) {
                setEstado({ texto: "Esperando la fecha de entrega", imagen: 0 });
            } else {
                setEstado({ texto: "Esperando confirmación para comenzar el viaje", imagen: 0 });
            }
        } else if (recorridoModal.id_estadoEntrega.id_estadoEntrega === 3) {
            if (recorridoModal.id_usuario.id_usuario === user.id_usuario) {
                setEstado({ texto: "La entrega esta en proceso. Haga click en 'Confirmar' para completar el envío.", imagen: 1 });
            } else if (entrega.id_usuario.id_usuario !== user.id_usuario) {
                setEstado({ texto: "La entrega esta en proceso. Haga click en 'Confirmar' para confirmar que recibiste el producto.", imagen: 1 });
            } else {
                setEstado({ texto: "La entrega esta en proceso.", imagen: 1 });
            }
        } else if (recorridoModal.id_estadoEntrega.id_estadoEntrega === 4) {
            if (entrega.id_usuario.id_usuario === user.id_usuario) {
                setEstado({ texto: "La entrega fue marcada como completada. Haga click en 'Confirmar' para confirmar que recibiste el producto.", imagen: 2 });
            } else {
                setEstado({ texto: "La entrega fue marcada como completada.", imagen: 2 });
            }
        } else if (recorridoModal.id_estadoEntrega.id_estadoEntrega === 5) {
            setEstado({ texto: "La entrega fue completada", imagen: 4 });
        } else {
            setEstado({ texto: "Estado desconocido", imagen: 0 });
        }
    }, [recorridoModal]);

    return (
        <>
            <EntregaProgressBar estado={estado.imagen} wid='29rem'/>
            <div>
                <a><br/><strong>Estado Actual:</strong> {recorridoModal.id_estadoEntrega.nombre} <br/><br/></a>
                <a><strong>Usuario a Cargo:</strong> {recorridoModal.id_usuario.nombre} {recorridoModal.id_usuario.apellido} <br/></a>
                <a><strong>Fecha de Entrega Estimada:</strong> {recorridoModal.fechaEntrega ? recorridoModal.fechaEntrega : 'No especificada'} <br/></a>
                <a><strong>Vehiculo Usado:</strong> {recorridoModal.id_transporte ? `${recorridoModal.id_transporte.marca}, ${recorridoModal.id_transporte.modelo} ${recorridoModal.id_transporte.patente}` : 'Medios Propios'}<br/><br/></a>
                <a><strong>{estado.texto}</strong></a>
            </div>
        </>
    )
} 

export default EntregaCard;