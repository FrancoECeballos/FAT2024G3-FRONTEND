// SendButton.js

import React from 'react';
import Button from 'react-bootstrap/Button';
import './send_button.scss';

export default function SendButton({
  onClick,
  radius = 1,
  size = 1,
  href,
  text = 'Enviar',
  wide = '10',
  children,
  backcolor = '#D9D9D9',
  letercolor = 'black',
  id,
  hid,
  shadow = '0.10rem 0.3rem 0.20rem rgba(0, 0, 0, 0.3)',
  hoverable = true,
  disabled = false,
}) {
  return (
    <Button
      onClick={onClick}
      hidden={hid}
      href={href}
      className={hoverable ? 'hoverable-send-button' : 'send-button'}
      style={{
        id: `${id}`,
        borderRadius: `${radius}rem`,
        textAlign: 'center',
        width: `${wide}rem`,
        backgroundColor: disabled ? 'grey' : backcolor,  // Cambiar color si está deshabilitado
        borderColor: '#D9D9D9',
        color: disabled ? 'white' : letercolor, // Cambiar color del texto si está deshabilitado
        boxShadow: `${shadow}`,
        fontSize: `${size}rem`,
      }}
      variant="primary"
      type="submit"
      disabled={disabled}
    >
      {text}  
      {children}
    </Button>
  );
}
