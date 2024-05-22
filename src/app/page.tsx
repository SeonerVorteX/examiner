"use client";

import "./styles.css";
import Main from "@/components/main/Main";
import Navbar from "@/components/navbar/Navbar";
import { useEffect, useState } from "react";
import { API as $ } from "@/utils";
import Loader from "./loading";
import axios from "@/utils/axios";

export default function Home() {
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
                    setMounted(true);
                });
        } else {
            setMounted(true);
        }
    }, []);

    if (!mounted) {
        return <Loader />;
    }

    return (
        <>
            <Navbar props={{ isAuthenticated, setIsAuthenticated }} />
            <Main props={{ isAuthenticated, setIsAuthenticated }} />
        </>
    );
}
