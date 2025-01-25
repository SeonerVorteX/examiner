'use client';

import { APIError, ActiveExam, ImageType, QuestionType } from '@/types/types';
import { useEffect, useState } from 'react';
import { AxiosError, AxiosResponse } from 'axios';
import { getErrors, isNumber, redirectToLogin } from '@/utils';
import axios from '@/utils/axios';
import Navbar from '@/components/navbar/Navbar';
import Loading from '@/app/loading';
import './styles.css';
import Question from '@/components/question/ActiveQuestion';

interface ActiveExamParms {
    id: string;
}

export default function ({ params }: { params: ActiveExamParms }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [errorList, setErrorList] = useState<APIError[]>([]);
    const [activeExam, setActiveExam] = useState<ActiveExam>();
    const [questions, setQuestions] = useState<QuestionType[]>([]);
    const [images, setImages] = useState<ImageType[]>([]);
    const [currentQuestion, setCurrentQuestion] = useState(1);
    const [showAnswers, setShowAnswers] = useState(false);
    const [showCurrentAnswer, setShowCurrentAnswer] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [switchValue, setSwitchValue] = useState<number>();
    const [switchValid, setSwitchValid] = useState(true);
    const [answers, setAnswers] = useState<
        { question: number; index: number }[]
    >([]);
    const [mounted, setMounted] = useState(false);
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
                            .get(`/exams/active/${examId}`)
                            .then((res: AxiosResponse) => {
                                if (res.status === 200) {
                                    setActiveExam(res.data);
                                    document.title = `${res.data.details.title} | Examination`;
                                    setShowAnswers(
                                        res.data.details.settings.showAnswer
                                    );
                                    setAnswers(res.data.userAnswers);

                                    axios
                                        .get(
                                            `/exams/active/${examId}/questions`
                                        )
                                        .then((res: AxiosResponse) => {
                                            if (res.status === 200) {
                                                setQuestions(
                                                    res.data.questions
                                                );
                                                setImages(res.data.images);
                                                setMounted(true);
                                            }
                                        })
                                        .catch(({ response }: AxiosError) => {
                                            let errorList = getErrors(
                                                response!
                                            );
                                            setErrorList(errorList);
                                            setMounted(true);
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
                '.showAnswer'
            ) as HTMLButtonElement;
            setShowCurrentAnswer(false);
            btn.classList.remove('disabled');
        }
    }, [currentQuestion]);

    useEffect(() => {
        let executed = false;

        document.addEventListener('keydown', (e) => {
            let leftBtn = document.querySelector(
                '.left-arrow'
            ) as HTMLButtonElement;
            let rightBtn = document.querySelector(
                '.right-arrow'
            ) as HTMLButtonElement;

            if (e.key === 'ArrowLeft') {
                if (!leftBtn.disabled && !executed) {
                    leftBtn.click();
                    executed = true;
                }
            } else if (e.key === 'ArrowRight') {
                if (!rightBtn.disabled && !executed) {
                    rightBtn.click();
                    executed = true;
                }
            }
        });

        document.addEventListener('keyup', () => {
            executed = false;
        });
    }, []);

    const submit = (force?: boolean) => {
        if (force) {
            let btn = document.querySelector('.submit') as HTMLButtonElement;
            btn.disabled = true;
            btn.classList.add('disabled');
            setIsLoading(true);
            axios
                .get(`/exams/active/${examId}/finish`)
                .then(() => {
                    setIsLoading(false);
                    btn.disabled = false;
                })
                .catch(() => {
                    setIsLoading(false);
                    btn.disabled = false;
                });
        } else if (confirm('İmtahanı bitirmək istədiyinizə əminsiniz mi?')) {
            let btn = document.querySelector('.submit') as HTMLButtonElement;
            btn.disabled = true;
            btn.classList.add('disabled');
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
        submit(true);
        alert('Vaxtınız bitdi!');
        window.location.href = `/exams/finished/${examId}`;
    };

    const showAnswer = () => {
        let btn = document.querySelector('.showAnswer') as HTMLButtonElement;
        setShowCurrentAnswer(true);
        btn.classList.add('disabled');
    };

    const handleSwitcherChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value;
        let index = parseInt(value);

        if (value === '') {
            setSwitchValid(true);
            setSwitchValue(undefined);
        } else if (
            !isNumber(value) ||
            index < 1 ||
            index > activeExam!.details.settings.questionCount
        ) {
            setSwitchValid(false);
        } else {
            setSwitchValid(true);
            setSwitchValue(index);
        }
    };

    const switchQuestion = () => {
        if (switchValid && switchValue) setCurrentQuestion(switchValue);
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
                                index={currentQuestion}
                                content={questions[currentQuestion - 1]}
                                images={images.filter((img) => {
                                    let q = questions.find(
                                        (q) =>
                                            q.row ===
                                            questions[currentQuestion - 1].row
                                    )!;
                                    let imgValues: number[] = [];
                                    if (q.question.imageId) {
                                        imgValues.push(q.question.imageId);
                                    }

                                    q.options
                                        .filter((opt) => opt.imageId)
                                        .forEach((opt) => {
                                            imgValues.push(opt.imageId);
                                        });

                                    return imgValues.includes(img.id);
                                })}
                                answers={answers}
                                setAnswers={setAnswers}
                            />

                            <div className="settings">
                                <div className="question-row-search">
                                    <input
                                        className={switchValid ? '' : 'invalid'}
                                        type="text"
                                        placeholder=""
                                        onChange={handleSwitcherChange}
                                    />
                                    <p>
                                        <a onClick={switchQuestion}>
                                            nömrəli suala keç
                                        </a>
                                    </p>
                                </div>
                            </div>

                            <div className="buttons">
                                <div className="arrows">
                                    <button
                                        className={`left-arrow btn primary-btn ${
                                            currentQuestion == 1
                                                ? 'disabled'
                                                : ''
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
                                        className={`right-arrow btn primary-btn ${
                                            currentQuestion ==
                                            activeExam.details.settings
                                                .questionCount
                                                ? 'disabled'
                                                : ''
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
                                            <i className="fa-solid fa-lock-open"></i>{' '}
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
                                                <i className="fa-solid fa-pencil"></i>{' '}
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
