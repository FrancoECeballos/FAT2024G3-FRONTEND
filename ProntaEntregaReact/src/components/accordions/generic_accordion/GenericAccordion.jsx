import React from 'react';
import { Accordion, Card } from 'react-bootstrap';

const GenericAccordion = ({ wide, titulo, children }) => {
    return (
        <div style={{marginTop:"1rem", display: 'flex', justifyContent: 'center' }}>
            <Card style={{ width: `${wide}` }}>
                <Accordion>
                    <Accordion.Item eventKey="0">
                        <Accordion.Header>
                            <div>
                                <h5>{titulo}</h5>
                            </div>
                        </Accordion.Header>
                        {children.map((child, index) => (
                            <Accordion.Body key={index}>
                                {child}
                            </Accordion.Body>
                        ))}
                    </Accordion.Item>
                </Accordion>
            </Card>
        </div>
    );
}

export default GenericAccordion;