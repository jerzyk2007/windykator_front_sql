import axios from 'axios';
// const BASE_URL = 'http://localhost:3500';
// // const BASE_URL = 'http://localhost:3000';
// const BASE_URL = 'http://localhost';
// const BASE_URL = 'https://server.raportbl.eu';
const BASE_URL = "https://raportbl.krotoski.com:3000";
// const BASE_URL = 'http://10.8.20.11';
// 
export default axios.create({
    baseURL: BASE_URL
});
export const axiosPrivate = axios.create({
    baseURL: BASE_URL,
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true
});