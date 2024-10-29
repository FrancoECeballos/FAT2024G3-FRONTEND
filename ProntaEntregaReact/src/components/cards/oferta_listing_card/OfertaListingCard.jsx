import React, {useState, useEffect} from "react";
import { Card } from "react-bootstrap";
import Cookies from 'js-cookie';
import Loading from '../../loading/loading';

import fetchUser from '../../../functions/fetchUser';
import fetchData from "../../../functions/fetchData";

import './OfertaListingCard.scss';

function OfertaListingCard() {
  const [user, setUser] = useState({});
  const [notifications, setNotifications] = useState([]);
  const token = Cookies.get('token');
  const [isLoading, setIsLoading] = useState(true);


  useEffect(() => {
    const fetchDataAsync = async () => {
        try {
            const userData = await fetchUser();
            setUser(userData);

            const notifications = await fetchData(`getNotificacion/${userData.id_usuario}`, token);
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
        <Card className="ol-card w-100 h-100" style={{minWidth:'100%', minHeight:'100%'}}>
          <Loading />
        </Card>
      ) : (
        <Card className="ol-card w-100 h-100">
            <Card.Title><h1>OfertaListingCard</h1>
            </Card.Title>
            <Card.Body>
                
            </Card.Body>
        </Card>
      )}
    </div>
  );
} export default OfertaListingCard;