"use client";

import "./styles.css";
import { useEffect, useState } from "react";
import axios from "@/utils/axios";
import Loading from "../loading";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";
import { ActiveExam, FinishedExam, UserPayload } from "@/types/types";
import { ActiveExamCard, FinishedExamCard } from "@/components/exam/ExamCard";
import { redirectToLogin } from "@/utils";

export default () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [activeExams, setActiveExams] = useState<ActiveExam[]>([]);
    const [finishedExams, setFinishedExams] = useState<FinishedExam[]>([]);
    const [user, setUser] = useState<UserPayload>();
    const [examsMounted, setExamsMounted] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        document.title = "Profile | Examination";

        const token = localStorage.getItem("token");
        if (token) {
            axios
                .get("/@me/verifyToken")
                .then((res) => {
                    if (res.status === 200) {
                        setIsAuthenticated(true);

                        axios
                            .get("/@me")
                            .then((res) => {
                                if (res.status === 200) {
                                    setUser(res.data.user);
                                    setMounted(true);
                                }
                            })
                            .catch(() => {
                                setIsAuthenticated(false);
                                redirectToLogin();
                            });

                        axios
                            .get("/@me/exams")
                            .then((res) => {
                                if (res.status === 200) {
                                    const exams: {
                                        active: ActiveExam[];
                                        finished: FinishedExam[];
                                    } = res.data;

                                    setExamsMounted(true);
                                    setActiveExams(exams.active);
                                    setFinishedExams(exams.finished);
                                }
                            })
                            .catch(() => {
                                setExamsMounted(true);
                            });
                    }
                })
                .catch(() => {
                    setIsAuthenticated(false);
                    redirectToLogin();
                });
        } else {
            redirectToLogin();
        }
    }, []);

    if (!mounted) {
        return <Loading />;
    } else {
        return (
            <>
                <Navbar props={{ isAuthenticated, setIsAuthenticated }} />
                <main id="profile" className="container">
                    <div className="profile-container">
                        <div className="profile-heading">
                            <h1>Profil</h1>
                        </div>

                        <div className="profile-content">
                            <div className="profile-info">
                                <div className="profile-info-item">
                                    <label htmlFor="input">Tam Ad:</label>
                                    <input
                                        type="text"
                                        value={user?.fullname || "Tapılmadı"}
                                        readOnly
                                        disabled
                                        onFocus={(e) => e.target.blur()}
                                    />
                                </div>

                                <div className="profile-info-item">
                                    <label htmlFor="input">İxtisas:</label>
                                    <input
                                        type="text"
                                        value={user?.groupName || "Tapılmadı"}
                                        readOnly
                                        disabled
                                        onFocus={(e) => e.target.blur()}
                                    />
                                </div>

                                <div className="profile-info-item">
                                    <label htmlFor="input">Email:</label>
                                    <input
                                        type="text"
                                        value={user?.email || "Tapılmadı"}
                                        readOnly
                                        disabled
                                        onFocus={(e) => e.target.blur()}
                                    />
                                </div>
                                <div className="profile-info-item">
                                    <label htmlFor="input">Qrup:</label>
                                    <input
                                        type="text"
                                        value={user?.group || "Tapılmadı"}
                                        readOnly
                                        disabled
                                        onFocus={(e) => e.target.blur()}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="profile-exams">
                            <div className="exams-heading">
                                <h2>İmtahanlar</h2>
                            </div>
                            <div className="exams-container">
                                {examsMounted ? (
                                    activeExams.length ||
                                    finishedExams.length ? (
                                        <>
                                            {activeExams.map((exam) =>
                                                ActiveExamCard({ exam })
                                            )}
                                            {finishedExams.map((exam) =>
                                                FinishedExamCard({ exam })
                                            )}
                                        </>
                                    ) : (
                                        <div className="empty-exams">
                                            <p>Heç bir imtahan tapılmadı!</p>
                                        </div>
                                    )
                                ) : (
                                    <Loading />
                                )}
                            </div>
                        </div>
                    </div>
                </main>
                <Footer />
            </>
        );
    }
};
