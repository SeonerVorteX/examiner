'use client';

import { useEffect, useState } from 'react';
import './styles.css';
import {
    APIError,
    ExamQuestion,
    FinishedExam,
    ImageType,
    QuestionType,
} from '@/types/types';
import axios from '@/utils/axios';
import { AxiosError, AxiosResponse } from 'axios';
import { getErrors, redirectToLogin, seperateQuestions } from '@/utils';
import Loading from '@/app/loading';
import Navbar from '@/components/navbar/Navbar';
import Question from '@/components/question/Question';

interface FinishedExamParms {
    id: string;
}

export default function ({ params }: { params: FinishedExamParms }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [errorList, setErrorList] = useState<APIError[]>([]);
    const [finishedExam, setFinishedExam] = useState<FinishedExam>();
    const [questions, setQuestions] = useState<QuestionType[]>([]);
    const [images, setImages] = useState<ImageType[]>([]);
    const [userAnswers, setUserAnswers] = useState<
        { question: ExamQuestion; index: number }[]
    >([]);
    const [mounted, setMounted] = useState(false);
    const [questionsMounted, setQuestionsMounted] = useState(false);
    const examId = params.id;

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (token) {
            axios
                .get('/@me/verifyToken')
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
                                    axios
                                        .get(
                                            `/exams/finished/${examId}/questions`
                                        )
                                        .then((res: AxiosResponse) => {
                                            if (res.status === 200) {
                                                let questionsData = res.data
                                                    .questions as QuestionType[];
                                                let answersData = res.data
                                                    .userAnswers as {
                                                    question: ExamQuestion;
                                                    index: number;
                                                }[];
                                                let imagesData = res.data
                                                    .images as ImageType[];
                                                let { correct, wrong, empty } =
                                                    seperateQuestions(
                                                        questionsData,
                                                        answersData
                                                    );
                                                setQuestions(
                                                    wrong.concat(empty, correct)
                                                );
                                                setImages(imagesData);
                                                setUserAnswers(answersData);
                                                setQuestionsMounted(true);
                                            }
                                        })
                                        .catch(({ response }: AxiosError) => {
                                            let errorList = getErrors(
                                                response!
                                            );
                                            setErrorList(errorList);
                                            setMounted(true);
                                            setQuestionsMounted(true);
                                        });
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

    if (!mounted) {
        return <Loading />;
    } else {
        return (
            <>
                <Navbar props={{ isAuthenticated, setIsAuthenticated }} />
                <div className="container exam finished">
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
                                            {finishedExam.results.correctCount}{' '}
                                            /{' '}
                                            {
                                                finishedExam.details.settings
                                                    .questionCount
                                            }{' '}
                                            {`(${finishedExam.results.scorePercent}%)`}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="questions-heading">
                                <h2>Sualar</h2>
                            </div>
                            <div className="questions">
                                {questionsMounted ? (
                                    questions.map((question, index) => (
                                        <Question
                                            key={question._id}
                                            examId={examId}
                                            index={index + 1}
                                            userAnswer={userAnswers.find(
                                                (a) =>
                                                    a.question.row ===
                                                    question.row
                                            )}
                                            content={
                                                questions.find(
                                                    (q) =>
                                                        q.row === question.row
                                                )!
                                            }
                                            images={images.filter((img) => {
                                                let q = questions.find(
                                                    (q) =>
                                                        q.row === question.row
                                                )!;
                                                let imgValues: number[] = [];
                                                if (q.question.imageId) {
                                                    imgValues.push(
                                                        q.question.imageId
                                                    );
                                                }

                                                q.options
                                                    .filter(
                                                        (opt) => opt.imageId
                                                    )
                                                    .forEach((opt) => {
                                                        imgValues.push(
                                                            opt.imageId
                                                        );
                                                    });

                                                return imgValues.includes(
                                                    img.id
                                                );
                                            })}
                                        />
                                    ))
                                ) : (
                                    <Loading />
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </>
        );
    }
}
