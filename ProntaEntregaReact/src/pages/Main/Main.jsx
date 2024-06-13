import React from 'react';
import { useState, useEffect } from 'react'
import { Container, Row, Col } from 'react-bootstrap';

import './Main.scss';

//importacion de los renders
import FullNavbar from '../../components/navbar/full_navbar/FullNavbar'

function Main (){
  /*useEffect(() => {
    init()
  } ,[])

  const init = async() => {
    let full_url = `${import.meta.env.VITE_API_URL}/user/`;
    let result = await fetch(full_url);
    result = await result.json();

    console.log(`result`, result);
  } */

  return (
    <div>
        <FullNavbar />
        <Container className='margen-arriba'>
        <Row>
          <Col md={4}>
            Column 1
          </Col>
          <Col md={4}>
            Column 2
          </Col>
          <Col md={4}>
            <Row>
              <Col>
                Row 1 of Column 3
              </Col>
            </Row>
            <Row>
              <Col>
                Row 2 of Column 3
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </div>
  );
};
export default Main;