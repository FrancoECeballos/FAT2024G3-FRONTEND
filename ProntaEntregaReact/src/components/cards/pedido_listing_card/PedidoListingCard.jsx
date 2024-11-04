import React, {useState, useEffect} from "react";
import { Card, Carousel } from "react-bootstrap";
import Cookies from 'js-cookie';
import Loading from '../../loading/loading';

import fetchUser from '../../../functions/fetchUser';
import fetchData from "../../../functions/fetchData";

import './PedidoListingCard.scss';

function PedidoListingCard() {
  const [user, setUser] = useState({});
  const [pedidos, setPedidos] = useState([]);
  const token = Cookies.get('token');
  const [isLoading, setIsLoading] = useState(true);


  useEffect(() => {
    const fetchDataAsync = async () => {
        try {
            const userData = await fetchUser();
            setUser(userData);

            const pedidos = await fetchData(`GetPedidoCreadoPorUsuario/${userData.id_usuario}`, token);
            setPedidos(pedidos);
            console.log(pedidos);
            
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
        <Card className="pl-card w-100 h-100">
          <Loading />
        </Card>
      ) : (
        <Card className="pl-card w-100 h-100">
            <Card.Title>Pedidos Recientes <hr /></Card.Title>
            <Card.Body>
            <Carousel>
              {Array.isArray(pedidos) && pedidos.length > 0 ? (
                pedidos.map((pedido, index) => (  
                  <Carousel.Item key={index}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <img 
                            src={pedido.id_producto.imagen} 
                            alt="" 
                            style={{
                                width: '6rem',
                                height: '6rem',
                                borderRadius: '1rem',
                                objectFit: 'scale-down'
                            }}
                        />
                        <div className="pl-derecha">
                            <div className="text-content">
                                <Card.Title>{pedido.id_obra.nombre}</Card.Title>
                                <Card.Text>{pedido.id_producto.descripcion}</Card.Text>
                                <Card.Text>{pedido.fechavencimiento}</Card.Text>
                                <Card.Text>{pedido.urgente_label}</Card.Text>
                            </div>
                        </div>
                    </div>
                </Carousel.Item>

                ))
              ):(
                <Card.Text>No hay pedidos</Card.Text>
              )}
              
            </Carousel>
            </Card.Body>
        </Card>
      )}
    </div>
  );
} export default PedidoListingCard;