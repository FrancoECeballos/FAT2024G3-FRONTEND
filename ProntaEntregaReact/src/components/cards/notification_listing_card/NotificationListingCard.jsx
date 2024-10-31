import React, {useState, useEffect} from "react";
import { Card } from "react-bootstrap";
import Cookies from 'js-cookie';
import Loading from '../../../components/loading/loading';

import fetchUser from '../../../functions/fetchUser';
import fetchData from "../../../functions/fetchData";

import './NotificationListingCard.scss';

function NotificationListingCard() {
  const [user, setUser] = useState({});
  const [notifications, setNotifications] = useState([]);
  const token = Cookies.get('token');
  const [isLoading, setIsLoading] = useState(true);


  useEffect(() => {
    const fetchDataAsync = async () => {
        try {
            const userData = await fetchUser();
            setUser(userData);

            const notifications = await fetchData(`GetNotificacionesObrasDeUsuario/${userData.id_usuario}`, token);
            setNotifications(notifications);
            console.log(notifications);
            
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
        <Card className="nl-card w-100 h-100">
          <Loading />
        </Card>
      ) : (
        <Card className="nl-card w-100 h-100">
            <Card.Title>Notificaciones <hr /></Card.Title>
            <Card.Body>
                {Array.isArray(notifications) && notifications.length > 0 ? (
                    notifications.map((notification, index) => (
                        <Card.Text key={index} className="notification-text">{notification.nombre}</Card.Text>
                    ))
                ) : (
                    <Card.Text>No hay notificaciones</Card.Text>
                )}
            </Card.Body>
        </Card>
      )}
    </div>
  );
} export default NotificationListingCard;