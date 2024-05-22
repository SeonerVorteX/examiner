"use client";

import "./styles.css";
import Link from "next/link";
import axios from "@/utils/axios";

interface NavbarProps {
    props: {
        isAuthenticated: boolean;
        setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
    };
}

export default function Navbar({ props }: NavbarProps) {
    const { isAuthenticated, setIsAuthenticated } = props;
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

    return (
        <nav className="container">
            <div className="nav-heading">
                <h3>
                    <Link href="/#">Examer</Link>
                </h3>
            </div>

            <div className="nav-end">
                {isAuthenticated ? (
                    <div className="buttons">
                        <a className="btn tertiary-btn" onClick={logout}>
                            <i className="fa-solid fa-right-from-bracket"></i>{" "}
                            Logout
                        </a>
                        <Link className="btn primary-btn" href="/profile">
                            <i className="fa-solid fa-user"></i> Profile
                        </Link>
                    </div>
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
