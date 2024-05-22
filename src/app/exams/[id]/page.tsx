"use client";

import type { APIError, Exam } from "@/types/types";
import { useEffect, useState } from "react";
import axios from "@/utils/axios";
import { getErrors } from "@/utils";
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
    const [showAnswer, setShowAnswer] = useState<boolean>(false);
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

    const handleIntervalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.name === "questionStart") {
            if (e.target.value) {
                if (
                    isNaN(parseInt(e.target.value)) ||
                    parseInt(e.target.value) < 1
                ) {
                    setStartPointValid(false);
                    setStartPoint(e.target.value);
                } else {
                    setStartPointValid(true);
                    setStartPoint(e.target.value);
                }
            } else {
                setStartPoint(e.target.value);
                setStartPointValid(false);
            }
        } else {
            if (e.target.value) {
                if (
                    isNaN(parseInt(e.target.value)) ||
                    parseInt(e.target.value) > exam!.questionCount
                ) {
                    setEndPointValid(false);
                    setEndPoint(e.target.value);
                } else {
                    setEndPointValid(true);
                    setEndPoint(e.target.value);
                }
            } else {
                setEndPoint(e.target.value);
                setEndPointValid(false);
            }
        }
    };

    const startExam = () => {
        if (startPointValid && endPointValid) {
            let questionCount = 50;

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
                        window.location.href = `/exams/active/${res.data.id}`;
                    }
                })
                .catch(({ response }: AxiosError) => {
                    let errorList = getErrors(response!);
                    setErrorList(errorList);
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
                                            <td>1 saat 30 dəqiqə</td>
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
                                                    className="showAnswer"
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
                                                        !startPointValid
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
                                                        !endPointValid
                                                            ? "invalid"
                                                            : ""
                                                    }`}
                                                    value={endPoint}
                                                    onChange={
                                                        handleIntervalChange
                                                    }
                                                />
                                                aralığından 50 sual
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                                <div className="exam-buttons">
                                    <button
                                        className={`startExam btn primary-btn ${
                                            startPointValid && endPointValid
                                                ? ""
                                                : "btn-invalid"
                                        }`}
                                        onClick={startExam}
                                    >
                                        Başla
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
