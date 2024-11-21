import axios from "axios";

const deleteData = async (url, authToken) => {
  const endpoint = `${import.meta.env.VITE_API_URL}` + url;
  try {
    const response = await axios.delete(endpoint, {
      headers: {
        Authorization: `Token ${authToken}`,
      },
    });
    const result = response.data;
    return result;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

export default deleteData;
