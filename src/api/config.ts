import axios from "axios";

const getCookie = (name: string): string => {
  const nameEQ = name + "=";
  const decodedCookie = decodeURIComponent(document.cookie);
  const ca = decodedCookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == " ") {
      c = c.substring(1, c.length);
    }
    if (c.indexOf(nameEQ) == 0) {
      return c.substring(nameEQ.length, c.length);
    }
  }
  return "";
};

const instance = axios.create({
  baseURL: import.meta.env.VITE_APP_BACKEND_URI,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${getCookie("auth_token")}`,
  },
});

export default instance;
