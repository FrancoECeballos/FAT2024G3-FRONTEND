import axios from 'axios';

const fetchData = async(url, authToken) => {
    const endpoint = `${import.meta.env.VITE_API_URL}`+ url;
    try {
        if (authToken) {
            const response = await axios.get(endpoint, {
                headers: {
                    'Authorization': `Token ${authToken}`
                }});
            const result = response.data;
            return result;
        } else {
            const response = await axios.get(endpoint);
            const result = response.data;
            return result;
        }
    } catch (error) {
        console.error('Error fetching data:', error);
    }
};

export default fetchData;
    