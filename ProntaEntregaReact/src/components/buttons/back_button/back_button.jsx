import React from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { Icon } from '@iconify/react';
import SendButton from '../send_button/send_button';

export default function BackButton({ url }) {
    return (
        <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip style={{ fontSize: '100%' }}>Volver a Ofertas</Tooltip>}
                >
                    <SendButton
                        href={url}
                        text="Volver"
                        backcolor="#D9D9D9"
                        letercolor="black"
                        shadow="0.10rem 0.3rem 0.20rem rgba(0, 0, 0, 0.3)"
                        hoverable
                        children={
                            <Icon className="hoverable-icon" style={{ width: "2rem", height: "2rem", color: "#858585"}} icon="line-md:chevron-left"/>
                        }
                    />
                </OverlayTrigger>
        
    );
}
