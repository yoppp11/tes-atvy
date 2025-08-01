import axios from 'axios';

export const axiosInstance = axios.create({
    baseURL: 'https://f0bd5aa0db1d.ngrok-free.app',
    headers: {
    'ngrok-skip-browser-warning': 'true',
    }
})