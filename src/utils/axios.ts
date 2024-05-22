import Axios, { AxiosError } from "axios";
import { API, getToken } from "./index";

const axios = Axios.create({
    baseURL: API(),
});

axios.interceptors.request.use(
    async (config) => {
        const token = getToken();

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
            config.headers["Content-Type"] = "application/json";
        }

        return config;
    },
    (error: AxiosError) => {
        return Promise.reject(error);
    }
);

export default axios;
