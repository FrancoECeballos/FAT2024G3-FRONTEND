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
  hoverable = true,  // hoverable es true por defecto
}) {
  return (
    <Button
      onClick={onClick}
      hidden={hid}
      href={href}
      className={hoverable ? 'send-button hoverable' : 'send-button'}
      style={{
        id: `${id}`,
        borderRadius: `${radius}rem`,
        textAlign: 'center',
        width: `${wide}rem`,
        backgroundColor: `${backcolor}`,
        borderColor: '#D9D9D9',
        color: `${letercolor}`,
        boxShadow: `${shadow}`,
        fontSize: `${size}rem`,
      }}
      variant="primary"
      type="submit"
    >
      {text}
      {children}
    </Button>
  );
}
