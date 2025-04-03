import axios from "axios";
import { HOST } from "../Config/API";
import Cookies from "js-cookie";

const httpClient = axios.create({
    baseURL: HOST,
});

httpClient.interceptors.request.use(
    async config => {
        const token = Cookies.get("userToken");
        if (token) {
            config.headers.authorization = `${token}`;
        }
        return config;
    },
    err => Promise.reject(err)
);

httpClient.interceptors.response.use(
    response => response.data,
    error => {
        const response = error.response;
        if ((response.data.message === "Access denied" && response.status === 401) ||
            (response.data.message === "Invalid token" && response.status === 401)
        ) {
            localStorage.removeItem("userToken")
            window.location = "/login"
        }
        return Promise.reject(error.response.data);
    }
);

export default httpClient;