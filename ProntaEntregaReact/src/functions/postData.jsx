import axios from "axios";

const postData = async (url, body, authToken) => {
  const endpoint = `${import.meta.env.VITE_API_URL}` + url;
  try {
    const response = await axios.post(endpoint, body, {
      headers: authToken
        ? {
            Authorization: `Token ${authToken}`,
          }
        : {},
    });
    const result = response.data;
    return result;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

export default postData;
