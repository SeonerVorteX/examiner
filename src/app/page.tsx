"use client";

import "./styles.css";
import Main from "@/components/main/Main";
import Navbar from "@/components/navbar/Navbar";
import { useEffect, useState } from "react";
import Loader from "./loading";
import axios from "@/utils/axios";
import CookieBanner from "@/components/cookie/CookieBanner";
import Script from "next/script";

export default function HomePage() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [useCookies, setUseCookies] = useState<boolean | null>(false);
    const [consentVisible, setConsentVisible] = useState<boolean>(false);
    const [secondMount, setSecondMount] = useState<boolean>(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setTimeout(() => {
            setConsentVisible(true);
        }, 1500);
        setSecondMount(true);
    }, []);

    useEffect(() => {
        const token = localStorage.getItem("token");
        const cookies = localStorage.getItem("cookies") as boolean | null;
        setUseCookies(cookies);

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

    if (!mounted || !secondMount) {
        return <Loader />;
    }

    return (
        <>
            <Navbar props={{ isAuthenticated, setIsAuthenticated }} />
            <Main props={{ isAuthenticated, setIsAuthenticated }} />
            {useCookies === null ? (
                <div className={`banner ${consentVisible ? "visible" : ""}`}>
                    <CookieBanner />
                </div>
            ) : null}
            <Script
                async
                src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9056907287164851"
                crossOrigin="anonymous"
            ></Script>
            <ins
                className="adsbygoogle"
                style={{ display: "block" }}
                data-ad-client="ca-pub-9056907287164851"
                data-ad-slot="9563159393"
                data-ad-format="auto"
                data-full-width-responsive="true"
            ></ins>
            <Script>
                {`(adsbygoogle = window.adsbygoogle || []).push({});`}
            </Script>
        </>
    );
}
