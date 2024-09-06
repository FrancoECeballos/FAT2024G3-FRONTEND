import fetchData from "./fetchData";
import Cookies from 'js-cookie';

const fetchUser = async (navigate) => {
    const token = Cookies.get('token');
    if (!token) {
        navigate('/login');
        return;
    }
    try {
        const result = await fetchData(`/userToken/${token}`, token);
        return result;
    } catch (error) {
        console.error('Error fetching user data:', error);
        if (error.response && error.response.status === 401) {
            Cookies.remove('token');
            navigate('/login');
        }
    }
} 

export default fetchUser;