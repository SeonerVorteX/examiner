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
    const [showAnswers, setShowAnswers] = useState(false);
    const [showCurrentAnswer, setShowCurrentAnswer] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
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
                                    setShowAnswers(
                                        res.data.details.settings.showAnswer
                                    );
                                    setAnswers(res.data.userAnswers);
                                    document.title = `${res.data.details.title} | Examination`;
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

    useEffect(() => {
        if (showCurrentAnswer) {
            let btn = document.querySelector(
                ".showAnswer"
            ) as HTMLButtonElement;
            setShowCurrentAnswer(false);
            btn.classList.remove("disabled");
        }
    }, [currentQuestion]);

    const submit = (force?: boolean) => {
        if (force) {
            let btn = document.querySelector(".submit") as HTMLButtonElement;
            btn.disabled = true;
            btn.classList.add("disabled");
            setIsLoading(true);
            axios
                .get(`/exams/active/${examId}/finish`)
                .then(() => {
                    window.location.href = `/exams/finished/${examId}`;
                    setIsLoading(false);
                    btn.disabled = false;
                })
                .catch(() => {
                    setIsLoading(false);
                    btn.disabled = false;
                });
        } else if (confirm("İmtahanı bitirmək istədiyinizə əminsiniz mi?")) {
            let btn = document.querySelector(".submit") as HTMLButtonElement;
            btn.disabled = true;
            btn.classList.add("disabled");
            setIsLoading(true);
            axios
                .get(`/exams/active/${examId}/finish`)
                .then(() => {
                    window.location.href = `/exams/finished/${examId}`;
                    setIsLoading(false);
                    btn.disabled = false;
                })
                .catch(() => {
                    setIsLoading(false);
                    btn.disabled = false;
                });
        }
    };

    const timeOver = () => {
        alert("Vaxtınız bitdi!");
        submit(true);
    };

    const showAnswer = () => {
        let btn = document.querySelector(".showAnswer") as HTMLButtonElement;
        setShowCurrentAnswer(true);
        btn.classList.add("disabled");
    };

    if (!mounted) {
        return <Loading />;
    } else {
        return (
            <>
                <Navbar
                    props={{
                        isAuthenticated,
                        setIsAuthenticated,
                        finishDate: activeExam?.finishDate,
                        timeOver,
                    }}
                />
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
                        <div className="active-exam-container">
                            <Question
                                examId={examId}
                                showAnswers={showCurrentAnswer}
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

                                <div className="secondary-buttons">
                                    {showAnswers ? (
                                        <button
                                            className="btn primary-btn showAnswer"
                                            onClick={showAnswer}
                                        >
                                            <i className="fa-solid fa-lock-open"></i>{" "}
                                            Cavabı göstər
                                        </button>
                                    ) : (
                                        <></>
                                    )}
                                    <button
                                        className="btn primary-btn submit"
                                        onClick={() => submit()}
                                    >
                                        {isLoading ? (
                                            <span className="submit-btn-loader"></span>
                                        ) : (
                                            <>
                                                <i className="fa-solid fa-pencil"></i>{" "}
                                                Bitir
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </>
        );
    }
}
