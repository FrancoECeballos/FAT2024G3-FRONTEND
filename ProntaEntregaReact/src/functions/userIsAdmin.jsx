import axios from "axios";

const esAdminDeObra = async (obraId, usuarioId) => {
  try {
    const response = await axios.get(
      `/admin_obra/?id_obra=${obraId}&id_usuario=${usuarioId}`,
    );
    console.log("Respuesta del servidor:", response.data); // Agrega este log para verificar la respuesta
    const detalle = response.data;
    return detalle.es_admin; // Asegúrate de que este campo exista en la respuesta
  } catch (error) {
    console.error(
      "Error al verificar si el usuario es admin de la obra:",
      error,
    );
    return false;
  }
};

export default esAdminDeObra;
