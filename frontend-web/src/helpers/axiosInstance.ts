import axios from "axios";

export const http = await axios.create({
    baseURL: 'http://localhost:3000/api',
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
    }
})