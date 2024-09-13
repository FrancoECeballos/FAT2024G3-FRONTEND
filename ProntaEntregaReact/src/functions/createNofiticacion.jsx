import postData from './postData';

const crearNotificacion = async (notificacionData, authToken) => {
    const url = '/PostNotificacion/';
    try {
        const response = await postData(url, notificacionData, authToken);
        return response;
    } catch (error) {
        console.error('Error creando notificación:', error);
        throw error;
    }
};

export default crearNotificacion;