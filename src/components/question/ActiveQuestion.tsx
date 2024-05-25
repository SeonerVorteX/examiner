"use client";

import "./styles.css";
import axios from "@/utils/axios";
import { useEffect, useState } from "react";
import { ImageType, QuestionType } from "@/types/types";
import Loading from "@/app/loading";

interface QuestionProps {
    examId: string;
    showAnswers: boolean;
    details: {
        _id: string;
        index: number;
        row: number;
        answers: { question: number; index: number }[];
        setAnswers: React.Dispatch<
            React.SetStateAction<{ question: number; index: number }[]>
        >;
    };
}

export default function ActiveQuestion(props: QuestionProps) {
    const { showAnswers } = props;
    const { index, row, answers, setAnswers } = props.details;
    const [examQuestion, setExamQuestion] = useState<QuestionType>();
    const [cachedQuestions, setCachedQuestions] = useState<
        {
            question: QuestionType;
            images: ImageType[];
        }[]
    >([]);
    const [images, setImages] = useState<ImageType[]>([]);
    const [answer, setAnswer] = useState<number>(-1);
    const [mounted, setMounted] = useState(false);
    const examId = props.examId;

    const convertBufferToBase64Image = (buffer: number[]) => {
        const base64 = Buffer.from(buffer).toString("base64");
        return `data:image/png;base64,${base64}`;
    };

    useEffect(() => {
        setMounted(false);
        let cachedQuestion = cachedQuestions.find(
            (q) => q.question.row === row
        );

        if (cachedQuestion) {
            setExamQuestion(cachedQuestion.question);
            setImages(cachedQuestion.images);
            setMounted(true);
        } else {
            axios
                .get(`/exams/active/${examId}/questions/${row}`)
                .then((res) => {
                    const { question, images } = res.data as {
                        question: QuestionType;
                        images: ImageType[];
                    };
                    if (answers.find((ans) => ans.question === row)) {
                        setAnswer(
                            answers.find((ans) => ans.question === row)!.index
                        );
                    } else {
                        setAnswer(-1);
                    }
                    setExamQuestion(question);
                    setImages(images);
                    setMounted(true);
                    setCachedQuestions([
                        ...cachedQuestions,
                        { question, images },
                    ]);
                })
                .catch(() => {
                    setMounted(true);
                });
        }
    }, [index]);

    useEffect(() => {
        if (answer !== -1) {
            let answerList = answers.filter((ans) => ans.question !== row);
            answerList.push({ question: row, index: answer });
            setAnswers(answerList);
        }
    }, [answer]);

    if (!mounted) {
        return (
            <article className="question loading">
                <Loading />;
            </article>
        );
    } else {
        return (
            <article className="question">
                {examQuestion ? (
                    <div className="content">
                        <div className="question-content">
                            {examQuestion.question.isImage ? (
                                <div className="question-image">
                                    <h3>{index}.</h3>
                                    <img
                                        src={convertBufferToBase64Image(
                                            images.find(
                                                (img) =>
                                                    img.id ===
                                                    examQuestion.question.value
                                            )!.data.data
                                        )}
                                        alt="Question"
                                    />
                                </div>
                            ) : (
                                <p className="question-text">
                                    {index}. {examQuestion.question.value}
                                </p>
                            )}
                        </div>
                        <div className="options">
                            <ul>
                                {examQuestion.options.map((option, _index) => (
                                    <li
                                        key={_index}
                                        className={
                                            showAnswers
                                                ? option.isCorrect
                                                    ? "correct"
                                                    : "wrong"
                                                : ""
                                        }
                                    >
                                        <input
                                            type="radio"
                                            name="option"
                                            key={_index}
                                            checked={
                                                answer ===
                                                examQuestion.options.indexOf(
                                                    option
                                                )
                                            }
                                            onClick={() =>
                                                setAnswer(
                                                    examQuestion.options.indexOf(
                                                        option
                                                    )
                                                )
                                            }
                                        />
                                        <label htmlFor={option._id}>
                                            {option.isImage ? (
                                                <img
                                                    className="option-image"
                                                    src={convertBufferToBase64Image(
                                                        images.find(
                                                            (img) =>
                                                                img.id ===
                                                                option.value
                                                        )!.data.data
                                                    )}
                                                    alt="Option"
                                                />
                                            ) : (
                                                option.value
                                            )}
                                        </label>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                ) : (
                    <p>Question not found</p>
                )}
            </article>
        );
    }
}
