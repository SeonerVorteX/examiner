"use client";

import "./styles.css";
import Link from "next/link";
import axios from "@/utils/axios";
import { useEffect, useState } from "react";
import { UserPayload } from "@/types/types";
import Timer from "../timer/Timer";

interface NavbarProps {
    props: {
        isAuthenticated: boolean;
        setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
        finishDate?: number;
        timeOver?: () => void;
    };
}

export default function Navbar({ props }: NavbarProps) {
    const { isAuthenticated, setIsAuthenticated, finishDate, timeOver } = props;
    const [fullName, setFullName] = useState<string>("Profile");

    const logout = () => {
        axios.get("/auth/logout").then((res) => {
            if (res.status === 200) {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                setIsAuthenticated(false);
                window.location.href = "/login";
            }
        });
    };

    useEffect(() => {
        if (isAuthenticated) {
            const user: UserPayload = JSON.parse(localStorage.getItem("user")!);
            setFullName(user.fullname);
        }
    }, []);

    return (
        <nav className="container">
            <div className="nav-heading">
                <h3>
                    <Link href="/#">Examination</Link>
                </h3>
            </div>

            <div className="nav-end">
                {isAuthenticated ? (
                    <>
                        {finishDate ? (
                            <Timer
                                finishDate={finishDate}
                                timeOver={timeOver!}
                            />
                        ) : (
                            <div className="buttons">
                                <a
                                    className="btn tertiary-btn"
                                    onClick={logout}
                                >
                                    <i className="fa-solid fa-right-from-bracket"></i>{" "}
                                    Logout
                                </a>
                                <Link
                                    className="btn primary-btn profile-btn"
                                    href="/profile"
                                >
                                    <i className="fa-solid fa-user"></i>{" "}
                                    {fullName}
                                </Link>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="buttons">
                        <Link className="btn primary-btn" href="/login">
                            <i className="fa-solid fa-right-from-bracket"></i>{" "}
                            Login
                        </Link>
                    </div>
                )}
            </div>
        </nav>
    );
}
