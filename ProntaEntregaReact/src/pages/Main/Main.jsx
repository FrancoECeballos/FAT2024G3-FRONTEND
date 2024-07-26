import React from 'react';
import { useState, useEffect } from 'react'
import { Container, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

import './Main.scss';

import FullNavbar from '../../components/navbar/full_navbar/FullNavbar'

function Main (){
 
  return (
    <div>
        <FullNavbar />
        <Container className='margen-arriba'>
  
      </Container>
    </div>
  );
};
export default Main;