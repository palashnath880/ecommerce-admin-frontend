import axios from "axios";

const instance = axios.create({
  baseURL: import.meta.env.BACKEND_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default instance;
