import React from 'react';
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Cookies from 'js-cookie';

import './Main.scss';

import FullNavbar from '../../components/navbar/full_navbar/FullNavbar'

function Main (){
  const navigate = useNavigate();
  const token = Cookies.get('token');

  useEffect(() => {
      if (!token) {
        navigate('/landing');
        return;
    }
  });
 
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