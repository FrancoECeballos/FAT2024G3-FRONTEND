import React, { useState } from 'react';
import Alert from 'react-bootstrap/Alert';
import './GenericAlert.scss';

function GenericAlert({ title, description, type, show, setShow}) {

    if (show) {
        return (
            <Alert variant={type} onClose={() => setShow(false)} dismissible>
                <Alert.Heading>{title}</Alert.Heading>
                <p>{description}</p>
            </Alert>
        );
    }
}

export default GenericAlert;