import postData from "./postData";

const crearNotificacion = async (
  notificacionData,
  authToken,
  operation = "All",
  id,
) => {
  try {
    if (operation === "User") {
      const response = await postData(
        `/PostNotificacionForUser/${id}/`,
        notificacionData,
        authToken,
      );
      return response;
    } else if (operation === "Obra") {
      const response = await postData(
        `/PostNotificacionForObra/${id}/`,
        notificacionData,
        authToken,
      );
      return response;
    } else {
      const response = await postData(
        `/PostNotificacionForAll/`,
        notificacionData,
        authToken,
      );
      return response;
    }
  } catch (error) {
    console.error("Error creando notificación:", error);
    throw error;
  }
};

export default crearNotificacion;
