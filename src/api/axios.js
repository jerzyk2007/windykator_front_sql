import axios from "axios";
// export const BASE_URL = "http://localhost:3500";
export const BASE_URL = "https://raportbl.krotoski.com:3000";

export default axios.create({
  baseURL: BASE_URL,
});

export const createAxiosInstance = () => {
  return axios.create({
    baseURL: BASE_URL,
    // Brak dodatkowych nagłówków, ciasteczek i logowania
  });
};

// Standardowy axios – bez ciasteczek, bez credentials
export const axiosPublic = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: false, // Wyłączone ciasteczka i uwierzytelnianie
});
//
export const axiosPrivate = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});
