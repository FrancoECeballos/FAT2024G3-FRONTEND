import React from 'react';
import Button from 'react-bootstrap/Button';

export default function SendButton({onClick, text = 'Enviar', wide = '10', children, backcolor = '#D9D9D9', letercolor = 'black'}) {
    return (
        <Button 
            onClick={onClick} 
            style={{
                borderRadius:'1rem', 
                textAlign:'center',
                width: `${wide}rem`, 
                backgroundColor: `${backcolor}`, 
                borderColor:'#D9D9D9', 
                color:`${letercolor}`, 
                boxShadow: '0.10rem 0.3rem 0.20rem rgba(0, 0, 0, 0.3)'
            }} 
            variant="primary" 
            type="submit"
        >
            {text}
            {children}
        </Button>
    )
}