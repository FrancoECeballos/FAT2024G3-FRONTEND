import React, {useState, useEffect} from "react";
import { Card, Carousel } from "react-bootstrap";
import Cookies from 'js-cookie';
import Loading from '../../loading/loading';

import fetchUser from '../../../functions/fetchUser';
import fetchData from "../../../functions/fetchData";

import './OfertaListingCard.scss';

function OfertaListingCard() {
  const [user, setUser] = useState({});
  const [ofertas, setOfertas] = useState([]);
  const token = Cookies.get('token');
  const [isLoading, setIsLoading] = useState(true);


  useEffect(() => {
    const fetchDataAsync = async () => {
        try {
            const userData = await fetchUser();
            setUser(userData);

            const ofertas = await fetchData(`GetOfertasRecientes/${userData.id_usuario}`, token);
            setOfertas(ofertas);
            console.log(ofertas);
            
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setIsLoading(false);
        }
    };
    fetchDataAsync();
  }, [token]);

  return (
    <div>
      {isLoading ? (
        <Card className="ol-card w-100 h-100" style={{minWidth:'100%', minHeight:'100%'}}>
          <Loading />
        </Card>
      ) : (
        <Card className="ol-card w-100 h-100">
            <Card.Title>Ofertas Recientes <hr /></Card.Title>
            <Card.Body>
            <Carousel>
              {Array.isArray(ofertas) && ofertas.length > 0 ? (
                ofertas.map((oferta, index) => (  
                  <Carousel.Item key={index}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <img 
                            src={oferta.id_producto.imagen} 
                            alt="" 
                            style={{
                                width: '6rem',
                                height: '6rem',
                                borderRadius: '1rem',
                                objectFit: 'scale-down'
                            }}
                        />
                        <div className="ol-derecha">
                            <div className="text-content">
                                <Card.Title>{oferta.id_obra.nombre}</Card.Title>
                                <Card.Text>{oferta.id_producto.descripcion}</Card.Text>
                                <Card.Text>{oferta.fechavencimiento}</Card.Text>
                            </div>
                        </div>
                    </div>
                </Carousel.Item>

                ))
              ):(
                <Card.Text>No hay ofertas</Card.Text>
              )}
              
            </Carousel>
            </Card.Body>
        </Card>
      )}
    </div>
  );
} export default OfertaListingCard;