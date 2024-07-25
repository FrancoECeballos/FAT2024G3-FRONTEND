import { disableCache } from "@iconify/react/dist/iconify.js";
import React, { Children } from "react";
import { Accordion, Card } from 'react-bootstrap';
import './GenericAccordion.scss';

function GenericAccordeon({ titulo, children }) {
    return (
        <Card>
            <Accordion>
                <Accordion.Item eventKey="0">
                    <Accordion.Header>
                        <div>
                            <h5>{titulo}</h5>
                        </div>
                    </Accordion.Header>
                    <Accordion.Body>
                        <div>
                            {children}
                        </div>
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>
        </Card>
    );
}

export default GenericAccordeon;