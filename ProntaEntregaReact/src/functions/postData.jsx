import axios from 'axios';

const postData = async(url, body) => {
    const endpoint = `${import.meta.env.VITE_API_URL}`+ url;
    try {
        const response = await axios.post(endpoint, body);
        const result = response.data;
        console.log('Data: ', result);
        return result;
    } catch (error) {
        console.error('Error fetching data:', error);
    }
};

export default postData;