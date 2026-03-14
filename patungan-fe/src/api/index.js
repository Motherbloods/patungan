import axios from "axios";

const apiClient = () => {
  const client = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    withCredentials: import.meta.env.VITE_CREDENTIALS === "true",
    headers: {
      "Content-Type": "application/json",
    },
  });

  client.interceptors.request.use(
    (config) => config,
    (err) => {
      console.log("API Request Error:", err.message || err);
      return Promise.reject(err);
    },
  );

  client.interceptors.response.use(
    (res) => res.data,
    (err) => {
      console.log(
        "API Response Error:",
        err.response?.data || err.message || err,
      );
      return Promise.reject(err);
    },
  );

  return client;
};

export default apiClient;
