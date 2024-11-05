import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { Container, Row, Col, Card } from 'react-bootstrap';
import './Main.scss';
import FullNavbar from '../../components/navbar/full_navbar/FullNavbar';
import NotificationListingCard from '../../components/cards/notification_listing_card/NotificationListingCard'
import OfertaListingCard from '../../components/cards/oferta_listing_card/OfertaListingCard';
import PedidoListingCard from '../../components/cards/pedido_listing_card/PedidoListingCard';

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
        <FullNavbar />
      <div className= "h-100 background margen-arriba">
        <Container className="h-100">
          <Row className="h-100">
            <Col md={4} className="d-flex">
              <div className='w-100'>
                <NotificationListingCard />
              </div>
            </Col>
            <Col md={4} className="d-flex">

            </Col>
            <Col md={4}>
              <Row className="h-50 d-flex">
                <Col>
                  <div className='w-100'>
                    <OfertaListingCard />
                  </div>
                </Col>
              </Row>
              <Row className="h-50 d-flex">
                <Col>
                  <div className='w-100'>
                   <PedidoListingCard />
                  </div>
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
