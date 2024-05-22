"use client";

import { APIError, ActiveExam } from "@/types/types";
import { useEffect, useState } from "react";
import { AxiosError, AxiosResponse } from "axios";
import { getErrors } from "@/utils";
import axios from "@/utils/axios";
import Navbar from "@/components/navbar/Navbar";
import Loading from "@/app/loading";
import "./styles.css";
import Question from "@/components/question/ActiveQuestion";

interface ActiveExamParms {
    id: string;
}

export default function ({ params }: { params: ActiveExamParms }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [errorList, setErrorList] = useState<APIError[]>([]);
    const [activeExam, setActiveExam] = useState<ActiveExam>();
    const [currentQuestion, setCurrentQuestion] = useState(1);
    const [answers, setAnswers] = useState<
        { question: number; index: number }[]
    >([]);
    const [mounted, setMounted] = useState(false);
    const examId = params.id;

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (token) {
            axios
                .get("/@me/verifyToken")
                .then((res) => {
                    if (res.status === 200) {
                        setIsAuthenticated(true);
                        axios
                            .get(`/exams/active/${examId}`)
                            .then((res: AxiosResponse) => {
                                if (res.status === 200) {
                                    setActiveExam(res.data);
                                    setAnswers(res.data.userAnswers);
                                    setMounted(true);
                                }
                            })
                            .catch(({ response }: AxiosError) => {
                                let errorList = getErrors(response!);
                                setErrorList(errorList);
                                setMounted(true);
                            });
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

    useEffect(() => {
        if (answers.length > 0) {
            axios
                .post(`/exams/active/${examId}/answers`, { answers })
                .catch(() => {});
        }
    }, [answers]);

    const submit = () => {
        // ask for confirmation
        if (confirm("İmtahanı bitirmək istədiyinizə əminsiniz mi?")) {
            axios
                .get(`/exams/active/${examId}/finish`)
                .then(() => {
                    window.location.href = `/exams/finished/${examId}`;
                })
                .catch(() => {});
        }
    };

    if (!mounted) {
        return <Loading />;
    } else {
        return (
            <>
                <Navbar props={{ isAuthenticated, setIsAuthenticated }} />
                <div className="container exam">
                    {!activeExam ? (
                        <div className="errors">
                            {errorList.map((error, index) => (
                                <div className="error" key={index}>
                                    {error.message}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="exam-container">
                            <Question
                                examId={examId}
                                details={{
                                    _id: activeExam.details.questions[
                                        currentQuestion - 1
                                    ]._id,
                                    row: activeExam.details.questions[
                                        currentQuestion - 1
                                    ].row,
                                    index: currentQuestion,
                                    answers,
                                    setAnswers,
                                }}
                            />

                            <div className="buttons">
                                <div className="arrows">
                                    <button
                                        className={`btn primary-btn ${
                                            currentQuestion == 1
                                                ? "disabled"
                                                : ""
                                        }`}
                                        onClick={() => {
                                            if (currentQuestion > 1) {
                                                setCurrentQuestion(
                                                    currentQuestion - 1
                                                );
                                            }
                                        }}
                                    >
                                        <i className="fa-solid fa-arrow-left"></i>
                                    </button>
                                    <button
                                        className={`btn primary-btn ${
                                            currentQuestion ==
                                            activeExam.details.settings
                                                .questionCount
                                                ? "disabled"
                                                : ""
                                        }`}
                                        onClick={() => {
                                            if (
                                                currentQuestion <
                                                activeExam.details.questions
                                                    .length
                                            ) {
                                                setCurrentQuestion(
                                                    currentQuestion + 1
                                                );
                                            }
                                        }}
                                    >
                                        <i className="fa-solid fa-arrow-right"></i>
                                    </button>
                                </div>

                                <button
                                    className="btn primary-btn submit"
                                    onClick={submit}
                                >
                                    <i className="fa-solid fa-pencil"></i> Bitir
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </>
        );
    }
}
