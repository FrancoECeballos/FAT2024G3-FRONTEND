# Components

This is a detailed documentation with all the specifications needed to use them in the project.

## Buttons

### Send Button

Is the button used to Log In, Register, Upload a File, etc.

**Code**

> JSX

```
import React from 'react';
import Button from 'react-bootstrap/Button';

export default function SendButton({onClick, text = 'Enviar', wide = '10', children}) {
    return (
        <Button
            onClick={onClick}
            style={{
                borderRadius:'1rem',
                textAlign:'center',
                width: `${wide}rem`,
                backgroundColor: '#D9D9D9',
                borderColor:'#D9D9D9',
                color:'black',
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
```

**Calling the Component**

```
<SendButton onClick="function" text="whats displayed in the button" wide="width in numbers, translates to rem" >
    CHILDREN (anything else that you want to display inside the button; Ej: image)
</SendButton>
```

Route:

> ProntaEntregaReact/src/components/buttons/send_button/send_button.jsx

---

## NavBars

### Base Navbar

It's the navbar only with logo and color

**Code**

> JSX

```
import React from 'react';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';


import Logo from '../../../assets/Logo.png';

export default function BaseNavbar({}) {
    return (
        <Navbar
            id="base-navbar"
            expand="sm"
            fixed="top"
            style={{ backgroundColor: '#A11818', color: 'white' }}
        >
            <Container fluid>
                <Navbar.Brand>
                    <a href="login.html">
                        <img src={Logo} alt='Logo' id='logo' style={{ width: '4rem' }} />
                    </a>
                </Navbar.Brand>
            </Container>
        </Navbar>
    );
};
```

**Calling the Component**

```
<BaseNavbar />
```

Route:

> ProntaEntregaReact/src/components/navbar/base_navbar/BaseNavbar.jsx
