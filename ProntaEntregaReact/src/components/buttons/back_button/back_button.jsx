import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';

export default function BackButton({ url }) {
    const navigate = useNavigate();

    return (
        <div onClick={() => navigate(url)} style={{ cursor: 'pointer' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <Icon icon='line-md:chevron-left' style={{ width: '2rem', height: '2rem' }} />
                <p style={{ margin: 0, marginLeft: '0.5rem', fontSize:"1.5rem" }}>Volver</p>
            </div>
        </div>
    );
}
