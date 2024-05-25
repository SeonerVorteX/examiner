"use client";

import { useEffect, useState } from "react";
import "./styles.css";
import { APIError, FinishedExam } from "@/types/types";
import axios from "@/utils/axios";
import { AxiosError, AxiosResponse } from "axios";
import { getErrors } from "@/utils";
import Loading from "@/app/loading";
import Navbar from "@/components/navbar/Navbar";
import Question from "@/components/question/Question";

interface FinishedExamParms {
    id: string;
}

export default function ({ params }: { params: FinishedExamParms }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [errorList, setErrorList] = useState<APIError[]>([]);
    const [finishedExam, setFinishedExam] = useState<FinishedExam>();
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
                            .get(`/exams/finished/${examId}`)
                            .then((res: AxiosResponse) => {
                                if (res.status === 200) {
                                    setFinishedExam(res.data);
                                    document.title = `${res.data.details.title} | Nəticə | Examination`;
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

    if (!mounted) {
        return <Loading />;
    } else {
        return (
            <>
                <Navbar props={{ isAuthenticated, setIsAuthenticated }} />
                <div className="container exam">
                    {!finishedExam ? (
                        <div className="errors">
                            {errorList.map((error, index) => (
                                <div className="error" key={index}>
                                    {error.message}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="exam-container">
                            <div className="exam-heading">
                                <h2>İmtahana Nəticələri</h2>
                            </div>
                            <div className="exam-content">
                                <div className="results">
                                    <div className="result">
                                        <h3>İmtahan</h3>
                                        <p>{finishedExam.details.title}</p>
                                    </div>
                                    <div className="result">
                                        <h3>Başlama Tarixi</h3>
                                        <p>
                                            {new Date(
                                                finishedExam.startDate
                                            ).toLocaleString()}
                                        </p>
                                    </div>
                                    <div className="result">
                                        <h3>Bitirilən Tarix</h3>
                                        <p>
                                            {new Date(
                                                finishedExam.finishedAt
                                            ).toLocaleString()}
                                        </p>
                                    </div>
                                    <div className="result">
                                        <h3>Nəticə</h3>
                                        <p>
                                            {finishedExam.results.correctCount}{" "}
                                            /{" "}
                                            {
                                                finishedExam.details.settings
                                                    .questionCount
                                            }{" "}
                                            {`(${finishedExam.results.scorePercent}%)`}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="questions-heading">
                                <h2>Sualar</h2>
                            </div>
                            <div className="questions">
                                {finishedExam.details.questions.map(
                                    (question, index) => (
                                        <Question
                                            key={question._id}
                                            examId={examId}
                                            details={{
                                                _id: question._id,
                                                row: question.row,
                                                index: index + 1,
                                            }}
                                        />
                                    )
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </>
        );
    }
}
