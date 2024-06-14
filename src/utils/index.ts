import { APIError, RedirectOptions } from "@/types/types";
import { AxiosResponse } from "axios";
import { config } from "dotenv";
import APIErrors from "@/errors/errors.json";
config();

const API_URL = process.env.API_URL!;

export const API = (path?: string): string => {
    return path ? API_URL + path : API_URL;
};

export const getToken = () => {
    return localStorage.getItem("token");
};

export const getErrors = (res: AxiosResponse) => {
    let errors =
        (res.data.errors as { [key: string]: APIError | APIError[] }) || {};
    let errorList = [] as APIError[];
    let apiErrors = new Object(APIErrors) as { [key: string]: { az: string } };

    for (let key of Object.keys(errors)) {
        let error = errors[key] as APIError | APIError[];
        if (Array.isArray(error)) {
            error.forEach((err) => {
                if (apiErrors[err.code.toString()]) {
                    err.message = apiErrors[err.code].az;
                }
            });
            errorList = errorList.concat(error);
        } else {
            if (apiErrors[error.code.toString()]) {
                error.message = apiErrors[error.code].az;
            }
            errorList = errorList.concat(error);
        }
    }

    return errorList;
};

export const handleAcceptCookie = () => {
    localStorage.setItem("cookies", "true");
    const element = document.querySelector(".cookie-banner")!;
    if (element) element.remove();
};

export const handleRejectCookie = () => {
    localStorage.setItem("cookies", "false");
    const element = document.querySelector(".cookie-banner")!;
    if (element) element.remove();
};

export const redirectToLogin = (options?: RedirectOptions) => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    if (options && options.redirect === false) {
        window.location.href = "/login";
    } else {
        window.location.href = `/login?redirect=${
            options && options.path ? options.path : window.location.pathname
        }`;
    }
};
