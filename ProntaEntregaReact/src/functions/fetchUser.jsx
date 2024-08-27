import fetchData from "./fetchData";
import Cookies from 'js-cookie';

const fetchUser = async () => {
    const token = Cookies.get('token');
    if (!token) {
        return;
    }
    try {
        const result = await fetchData(`/userToken/${token}`, token);
        return result;
    } catch (error) {
        console.error('Error fetching user data:', error);
    }
} 

export default fetchUser;