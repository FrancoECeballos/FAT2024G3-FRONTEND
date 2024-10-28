import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { Container, Row, Col, Card } from 'react-bootstrap';
import './Main.scss';
import FullNavbar from '../../components/navbar/full_navbar/FullNavbar';

import background from '../../assets/backgroundImage.png';

function Main() {
  const navigate = useNavigate();
  const token = Cookies.get('token');

  useEffect(() => {
    if (!token) {
      navigate('/landing');
      return;
    }
  }, [token, navigate]);

  return (
    <div className="full-height-container">
      <div className= "background">
        <FullNavbar />
        <Container className="margen-arriba h-100">
          <Row className="h-100">
            <Col md={4} className="d-flex">
              <Card className="custom-card w-100">
                <Card.Body>Card in Progress</Card.Body>
              </Card>
            </Col>
            <Col md={4} className="d-flex">

            </Col>
            <Col md={4}>
              <Row className="h-50 d-flex">
                <Col>
                  <Card className="custom-card w-100 h-50">
                    <Card.Body>Card in Progress</Card.Body>
                  </Card>
                </Col>
              </Row>
              <Row className="h-50 d-flex">
                <Col>
                  <Card className="custom-card w-100 h-50">
                    <Card.Body>Card in Progress</Card.Body>
                  </Card>
                </Col>
              </Row>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
}

export default Main;
