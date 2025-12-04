'use client';

import './styles.css';
import Main from '@/components/main/Main';
import Navbar from '@/components/navbar/Navbar';
import { useEffect, useState } from 'react';
import Loader from './loading';
import axios from '@/utils/axios';
import CookieBanner from '@/components/cookie/CookieBanner';

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
        const token = localStorage.getItem('token');
        const cookies = localStorage.getItem('cookies') as boolean | null;
        setUseCookies(cookies);

        if (token) {
            axios
                .get('/@me/verifyToken')
                .then((res) => {
                    if (res.status === 200) {
                        setIsAuthenticated(true);
                        setMounted(true);
                    }
                })
                .catch(() => {
                    setIsAuthenticated(false);
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
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
                <div className={`banner ${consentVisible ? 'visible' : ''}`}>
                    <CookieBanner />
                </div>
            ) : null}
        </>
    );
}
