import axios from 'axios';

const putData = async(url, body, authToken) => {
    const endpoint = `${import.meta.env.VITE_API_URL}`+ url;
    try {
        const response = await axios.put(endpoint, body, {
            headers: {
                'Authorization': `Token ${authToken}`
            }});
        const result = response.data;
        return result;
    } catch (error) {
        console.error('Error fetching data:', error);
    }
};

export default putData;