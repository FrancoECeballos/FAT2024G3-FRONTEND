import postData from './postData';

const crearNotificacion = async (notificacionData, authToken, id_usuario, id_obra) => {
    try {
        const response = await postData('/PostNotificacion/', notificacionData, authToken);
        return response;
    } catch (error) {
        console.error('Error creando notificación:', error);
        throw error;
    }
};

export default crearNotificacion;