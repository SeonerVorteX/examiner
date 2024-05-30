"use client";

import "./styles.css";
import { useEffect, useState } from "react";
import { UserPayload } from "@/types/types";
import Loader from "../loading";
import axios from "@/utils/axios";
import { getErrors } from "@/utils";
import Link from "next/link";

export default () => {
    const [usernameValid, setUsernameValid] = useState(true);
    const [passwordValid, setPasswordValid] = useState(true);
    const [apiErrors, setApiErrors] = useState<{ message: string }[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        document.title = "Giriş | Examination";

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
        const submitButton = document.querySelector(
            ".submit"
        ) as HTMLButtonElement;

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
        submitButton!.disabled = true;
        setIsLoading(true);

        axios
            .post("/auth/login", {
                username: username.value,
                password: password.value,
            })
            .then((res) => {
                setIsLoading(false);
                submitButton!.disabled = false;
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
                submitButton!.disabled = false;
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
                        <ul className="auth-errors center">
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
                        <p className="confirmation">
                            Giriş edərək{" "}
                            <Link href="/privacy-policy" target="_blank">
                                Məxfilik Siyasətimizi
                            </Link>{" "}
                            və{" "}
                            <Link href="/terms-of-service" target="_blank">
                                İstifadə Şərtlərimizi
                            </Link>{" "}
                            qəbul etmiş olursunuz.
                        </p>
                        <button
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
                        </button>
                    </form>
                </div>
            </main>
        );
    }
};
