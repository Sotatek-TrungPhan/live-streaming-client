import axios from "axios";

export const axiosInstance = axios.create({
    baseURL: "https://c312-14-241-121-47.ngrok-free.app/api",
    headers:{
       'Content-Type': 'application/json',
       "ngrok-skip-browser-warning": "true"
    }
})