"use client";

import type { APIError, Exam } from "@/types/types";
import { useEffect, useState } from "react";
import axios from "@/utils/axios";
import { getErrors, isNumber, redirectToLogin } from "@/utils";
import { AxiosError, AxiosResponse } from "axios";
import Loading from "@/app/loading";
import Navbar from "@/components/navbar/Navbar";
import "./styles.css";

interface ExamParms {
    id: string;
}

export default function Exam({ params }: { params: ExamParms }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [errorList, setErrorList] = useState<APIError[]>([]);
    const [exam, setExam] = useState<Exam & { questionCount: number }>();
    const [startPoint, setStartPoint] = useState<string>("1");
    const [endPoint, setEndPoint] = useState<string>();
    const [startPointValid, setStartPointValid] = useState<boolean>(true);
    const [endPointValid, setEndPointValid] = useState<boolean>(true);
    const [equationValid, setEquationValid] = useState<boolean>(true);
    const [showAnswer, setShowAnswer] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState(false);
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
                            .get(`/exams/${examId}`)
                            .then((res: AxiosResponse) => {
                                if (res.status === 200) {
                                    setExam(res.data);
                                    setEndPoint(res.data.questionCount);
                                    document.title = `${res.data.title} | Examination`;
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
                    redirectToLogin();
                });
        } else {
            redirectToLogin();
        }
    }, []);

    const handleIntervalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.name === "questionStart") {
            if (e.target.value) {
                if (
                    !isNumber(e.target.value) ||
                    parseInt(e.target.value) < 1 ||
                    parseInt(e.target.value) > exam!.questionCount
                ) {
                    setStartPointValid(false);
                    setStartPoint(e.target.value);
                } else {
                    setStartPointValid(true);
                    setStartPoint(e.target.value);
                    if (
                        endPoint &&
                        parseInt(e.target.value) > parseInt(endPoint)
                    ) {
                        setEquationValid(false);
                    } else {
                        setEquationValid(true);
                    }
                }
            } else {
                setStartPoint(e.target.value);
                setStartPointValid(false);
            }
        } else {
            if (e.target.value) {
                if (
                    !isNumber(e.target.value) ||
                    parseInt(e.target.value) > exam!.questionCount
                ) {
                    setEndPointValid(false);
                    setEndPoint(e.target.value);
                } else {
                    setEndPointValid(true);
                    setEndPoint(e.target.value);
                    if (
                        startPoint &&
                        parseInt(e.target.value) < parseInt(startPoint)
                    ) {
                        setEquationValid(false);
                    } else {
                        setEquationValid(true);
                    }
                }
            } else {
                setEndPoint(e.target.value);
                setEndPointValid(false);
            }
        }
    };

    const startExam = () => {
        if (startPointValid && endPointValid && equationValid) {
            let questionCount = 50;

            let btn = document.querySelector(".startExam") as HTMLButtonElement;
            btn.disabled = true;
            btn.classList.add("disabled");
            setIsLoading(true);

            if (
                parseInt(endPoint!) - parseInt(startPoint) + 1 <
                questionCount
            ) {
                questionCount = parseInt(endPoint!) - parseInt(startPoint) + 1;
            }

            axios
                .post(`/exams/${examId}/start`, {
                    startPoint: parseInt(startPoint),
                    endPoint: parseInt(endPoint!),
                    questionCount,
                    showAnswer,
                })
                .then((res: AxiosResponse) => {
                    if (res.status === 200) {
                        setIsLoading(false);
                        window.location.href = `/exams/active/${res.data.id}`;
                    }
                })
                .catch(({ response }: AxiosError) => {
                    let errorList = getErrors(response!);
                    btn.disabled = false;
                    btn.classList.remove("disabled");
                    setIsLoading(false);
                    alert(errorList.map((e) => e.message).join("\n"));
                });
        }
    };

    if (!mounted) {
        return <Loading />;
    } else {
        return (
            <>
                <Navbar props={{ isAuthenticated, setIsAuthenticated }} />
                <div className="container exam">
                    {!exam ? (
                        <div className="errors">
                            {errorList.map((error, index) => (
                                <div className="error" key={index}>
                                    {error.message}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="exam-container">
                            <div className="heading">
                                <h2>İmtahana Başla</h2>
                            </div>
                            <div className="exam-table">
                                <table>
                                    <tbody>
                                        <tr>
                                            <td>İmtahan adı</td>
                                            <td>{exam.title}</td>
                                        </tr>
                                        <tr>
                                            <td>İmtahan vaxtı</td>
                                            <td>1 saat 20 dəqiqə</td>
                                        </tr>
                                        <tr>
                                            <td>Sual sayı</td>
                                            <td>{exam.questionCount}</td>
                                        </tr>
                                        <tr>
                                            <td>Düzgün cavabı göstər</td>
                                            <td>
                                                <input
                                                    type="checkbox"
                                                    name="showAnswer"
                                                    className="showAnswerBox"
                                                    onChange={() =>
                                                        setShowAnswer(
                                                            !showAnswer
                                                        )
                                                    }
                                                />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Sual aralığı</td>
                                            <td className="questionInterval">
                                                <input
                                                    type="text"
                                                    name="questionStart"
                                                    className={`qinput ${
                                                        !startPointValid ||
                                                        !equationValid
                                                            ? "invalid"
                                                            : ""
                                                    }`}
                                                    value={startPoint}
                                                    onChange={
                                                        handleIntervalChange
                                                    }
                                                />
                                                -
                                                <input
                                                    type="text"
                                                    name="questionEnd"
                                                    className={`qinput ${
                                                        !endPointValid ||
                                                        !equationValid
                                                            ? "invalid"
                                                            : ""
                                                    }`}
                                                    value={endPoint}
                                                    onChange={
                                                        handleIntervalChange
                                                    }
                                                />
                                                <span className="interval-msg">
                                                    aralığından 50 sual
                                                </span>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                                <div className="note">
                                    <p>
                                        <strong>Diqqət:</strong> Əgər sualın
                                        şərti ilə variantlar arasında
                                        əlaqəsizlik görürsünüzsə və sizə verilən
                                        suallar içində belə bir sual olmadığına
                                        əminsinizsə, zəhmət olmasa sualı bizə
                                        bildirin ki, tez bir zamanda düzəliş
                                        edək.
                                    </p>
                                </div>
                                <div className="exam-buttons">
                                    <button
                                        className={`startExam btn primary-btn ${
                                            startPointValid &&
                                            endPointValid &&
                                            equationValid
                                                ? ""
                                                : "btn-invalid"
                                        }`}
                                        onClick={startExam}
                                    >
                                        {isLoading ? (
                                            <span className="start-exam-btn-loader"></span>
                                        ) : (
                                            "Başla"
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
