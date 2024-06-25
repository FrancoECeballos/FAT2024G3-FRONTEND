import axios from 'axios';

const fetchData = async (url, authToken) => {
    const endpoint = `${import.meta.env.VITE_API_URL}${url}`;
    try {
        const response = await axios.get(endpoint, {
            headers: authToken ? {
                'Authorization': `Token ${authToken}`
            } : {}
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error; // Re-lanzar el error para que pueda ser manejado en el componente
    }
};

export default fetchData;
