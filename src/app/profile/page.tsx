"use client";

import "./styles.css";
import { useEffect, useState } from "react";
import axios from "@/utils/axios";
import Loading from "../loading";

export default () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (token) {
            axios
                .get("/@me/verifyToken")
                .then((res) => {
                    if (res.status === 200) {
                        setIsAuthenticated(true);
                        setMounted(true);
                    }
                })
                .catch(() => {
                    setIsAuthenticated(false);
                    localStorage.removeItem("token");
                    localStorage.removeItem("user");
                    window.location.href = "/login";
                });
        } else {
            window.location.href = "/login";
        }
    }, []);

    const goBack = () => {
        window.history.back();
    };

    if (!mounted) {
        return <Loading />;
    } else {
        return (
            <div className="notready container">
                <div className="heading">
                    <h1>Səhifə Hələ Hazır Deyil</h1>
                    <p>
                        Daxil olmağa çalıştığınız səhifə hələ hazır deyil. Hal
                        hazırda üzərində çalışırıq. Yaxın zamanda istifadə üçün
                        hazır olacaq. Müvəqqəti narahatlığa görə üzr istəyirik.
                    </p>
                    <a onClick={goBack}>Geri qayıt</a>
                </div>
            </div>
        );
    }
};
