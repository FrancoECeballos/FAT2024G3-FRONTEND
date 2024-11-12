import React, { useState, useEffect } from "react";
import { Card } from "react-bootstrap";
import Cookies from 'js-cookie';

import Loading from '../../../components/loading/loading';
import NotificationCard from "../../notifications/notification_card/NotificationCard.jsx";
import GenericModal from "../../modals/Modal.jsx";

import fetchUser from '../../../functions/fetchUser';
import fetchData from "../../../functions/fetchData";

import './NotificationListingCard.scss';
import SendButton from "../../buttons/send_button/send_button.jsx";

function NotificationListingCard() {
  const token = Cookies.get('token');
  const [isLoading, setIsLoading] = useState(true);

  const [user, setUser] = useState({});
  const [notifications, setNotifications] = useState([]);

  const [selectedNotification, setSelectedNotification] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const fetchDataAsync = async () => {
    try {
      const userData = await fetchUser();
      setUser(userData);

      const notifis = await fetchData(`GetNotificacionesObrasDeUsuario/${userData.id_usuario}/`, token);
      setNotifications(notifis);
      console.log('Notifications: ', notifis);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDataAsync();
  }, [token]);
  
  const handleCloseModal = () => setShowModal(false);

  const handleNotificationClick = (notification) => {
    setSelectedNotification(notification);
    setShowModal(true);
  };

  const handleMarkAsRead = () => {
    fetchData(`/MarkNotificacionAsRead/${selectedNotification.notificacion_id}`, token).then(() => {
      setShowModal(false);
      fetchDataAsync();
    }).catch((error) => {
      console.error(error);
    });
  };

  const handleMarkAllAsRead = () => {
    fetchData(`/LeerNotificacionesDeUser/${user.id_usuario}`, token).then(() => {
      fetchDataAsync();
    }).catch((error) => {
      console.error(error);
    });
  }

  const shouldShowMarkAllAsReadButton = notifications.some(notificationGroup => notificationGroup[1].length > 0);

  return (
    <>
      <div>
        {isLoading ? (
          <Card className="nl-card w-100">
            <Loading />
          </Card>
        ) : (
          <Card className="nl-card w-100 h-100 centered">
            <Card.Title>Notificaciones <hr /></Card.Title>
            {shouldShowMarkAllAsReadButton && (
              <SendButton text="Marcar todo como Leido" wide="20" hoverable={false} onClick={() => handleMarkAllAsRead()}/>
            )}
            <Card.Body>
              {shouldShowMarkAllAsReadButton ? (
                notifications.map((notificationGroup, index) => (
                  <>
                    <div key={index}>
                      <Card.Text className="obra-text">{notificationGroup[0].nombre}</Card.Text>
                      {notificationGroup[1].map((notification, notifIndex) => (
                        <NotificationCard 
                          key={notifIndex} 
                          titulo={notification.titulo} 
                          info={notification.descripcion} 
                          showDesc={false}
                          onClick={() => handleNotificationClick(notification)} 
                        />
                      ))}
                    </div>
                    <hr />
                  </>
                ))
              ) : (
                <Card.Text>No hay notificaciones</Card.Text>
              )}
            </Card.Body>
          </Card>
        )}
      </div>
      <GenericModal
        showModal={showModal}
        handleCloseModal={handleCloseModal}
        title={selectedNotification?.titulo}
        content={
          <>
            <div>{selectedNotification?.descripcion}</div>
            <div style={{ marginTop: "2rem" }}>{selectedNotification?.fecha_creacion}</div>
          </>
        }
        saveButtonText="Marcar como leido"
        handleSave={handleMarkAsRead}
        saveButtonEnabled={true}
        saveButtonShown={true}
        showButton={false}
        position={true}
      />
    </>
  );
}

export default NotificationListingCard;