"use client";

import "./styles.css";
import Link from "next/link";
import axios from "@/utils/axios";
import { useEffect, useState } from "react";
import { UserPayload } from "@/types/types";
import Timer from "../timer/Timer";
import { redirectToLogin } from "@/utils";

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
    const [fullName, setFullName] = useState<string>("Profil");

    useEffect(() => {
        document.addEventListener("scroll", () => {
            const check = document.getElementById("check") as HTMLInputElement;
            if (check && check.checked) {
                check.checked = false;
            }
        });
    }, []);

    const logout = () => {
        axios
            .get("/auth/logout")
            .then((res) => {
                if (res.status === 200) {
                    redirectToLogin({ redirect: false });
                    setIsAuthenticated(false);
                }
            })
            .catch(() => {
                redirectToLogin({ redirect: false });
                setIsAuthenticated(false);
            });
    };

    useEffect(() => {
        if (isAuthenticated) {
            const user: UserPayload = JSON.parse(localStorage.getItem("user")!);
            setFullName(user.fullname);
        }
    }, []);

    return (
        <nav>
            <div className="container">
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
                                <>
                                    <input type="checkbox" id="check" />
                                    <label htmlFor="check" className="checkbtn">
                                        <i className="fas fa-bars"></i>
                                    </label>
                                    <div className="buttons menu">
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
                                </>
                            )}
                        </>
                    ) : (
                        <div className="buttons">
                            <Link className="btn primary-btn" href="/login">
                                <i className="fa-solid fa-right-from-bracket"></i>{" "}
                                Giriş
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}
