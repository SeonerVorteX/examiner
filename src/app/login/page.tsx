"use client";

import "./styles.css";
import { useEffect, useState } from "react";
import { UserPayload } from "@/types/types";
import Loader from "../loading";
import axios from "@/utils/axios";
import { getErrors } from "@/utils";

export default () => {
    const [usernameValid, setUsernameValid] = useState(true);
    const [passwordValid, setPasswordValid] = useState(true);
    const [apiErrors, setApiErrors] = useState<{ message: string }[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        document.title = "Giriş | Examer";

        axios
            .get("/@me/verifyToken")
            .then((res) => {
                if (res.status === 200) {
                    window.location.href = "/";
                }
            })
            .catch(() => {
                setMounted(true);
            });
    }, []);

    const onUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.value) {
            setUsernameValid(true);
        } else {
            setUsernameValid(false);
        }
    };

    const onPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.value) {
            setPasswordValid(true);
        } else {
            setPasswordValid(false);
        }
    };

    const submit = () => {
        setApiErrors([]);
        const submitButton = document.querySelector(".submit");

        const username = document.getElementById(
            "username"
        ) as HTMLInputElement;
        const password = document.getElementById(
            "password"
        ) as HTMLInputElement;

        if (!username.value) {
            setUsernameValid(false);
        }

        if (!password.value) {
            setPasswordValid(false);
        }

        if (!username.value || !password.value) {
            return;
        }

        submitButton!.classList.add("loading");
        setIsLoading(true);

        axios
            .post("/auth/login", {
                username: username.value,
                password: password.value,
            })
            .then((res) => {
                setIsLoading(false);

                if (res.status === 200) {
                    const { user } = res.data as { user: UserPayload };
                    localStorage.setItem("user", JSON.stringify(user));
                    localStorage.setItem("token", user.accessToken);
                    window.location.href = "/";
                    submitButton!.innerHTML = "Giriş Edildi!";
                }
            })
            .catch(({ response }) => {
                setIsLoading(false);
                submitButton!.classList.remove("loading");
                const errorList = getErrors(response!);
                setApiErrors(errorList);
            });
    };

    if (!mounted) {
        return <Loader />;
    } else {
        return (
            <main className="loginForm">
                <div className="form">
                    <h1>Kabinetinə Giriş Et</h1>
                    {apiErrors.length > 0 ? (
                        <ul className="errors center">
                            {apiErrors.map((error, i) => (
                                <li key={i}>{error.message}</li>
                            ))}
                        </ul>
                    ) : null}
                    <form>
                        <label htmlFor="username">İstifadəçi Adı</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            onInput={onUsernameChange}
                            className={`${usernameValid ? "" : "invalid"}`}
                            required
                        />
                        <label htmlFor="password">Şifrə</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            onInput={onPasswordChange}
                            className={`${passwordValid ? "" : "invalid"}`}
                            required
                        />
                        <a
                            className={`submit ${
                                usernameValid && passwordValid
                                    ? ""
                                    : "btn-invalid"
                            }`}
                            onClick={submit}
                        >
                            {isLoading ? (
                                <span className="btn-loader"></span>
                            ) : (
                                "Giriş Et"
                            )}
                        </a>
                    </form>
                </div>
            </main>
        );
    }
};
