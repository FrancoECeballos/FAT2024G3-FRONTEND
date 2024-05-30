import axios from 'axios';

const fetchData = async(url) => {
    const endpoint = `${import.meta.env.VITE_API_URL}`+ url;
    try {
    const response = await axios.get(endpoint);
    const result = response.data;
    console.log('Data: ', result);
    return result;
    } catch (error) {
    console.error('Error fetching data:', error);
    }
};

export default fetchData;
    