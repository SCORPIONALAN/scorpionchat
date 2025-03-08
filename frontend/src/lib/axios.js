import axios from 'axios';

export const axiosInstance = axios.create({
    baseURL: "http://localhost:5001/api",
    //Mandar cookies por cada request
    withCredentials: true
})