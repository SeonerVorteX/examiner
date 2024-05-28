"use client";

import "./styles.css";
import axios from "@/utils/axios";
import { useEffect, useState } from "react";
import { ExamQuestion, ImageType, QuestionType } from "@/types/types";
import Loading from "@/app/loading";
import Image from "next/image";

interface QuestionProps {
    examId: string;
    details: {
        _id: string;
        index: number;
        row: number;
    };
}

export default function Question(props: QuestionProps) {
    const { index, row } = props.details;
    const [examQuestion, setExamQuestion] = useState<QuestionType>();
    const [images, setImages] = useState<ImageType[]>([]);
    const [userAnswer, setUserAnswer] = useState<{
        question: ExamQuestion;
        index: number;
        _id: string;
    }>();
    const [mounted, setMounted] = useState(false);
    const examId = props.examId;

    const convertBufferToBase64Image = (buffer: number[]) => {
        const base64 = Buffer.from(buffer).toString("base64");
        return `data:image/png;base64,${base64}`;
    };

    useEffect(() => {
        axios
            .get(`/exams/finished/${examId}/questions/${row}`)
            .then((res) => {
                const { question, images, userAnswer } = res.data as {
                    question: QuestionType;
                    images: ImageType[];
                    userAnswer?: {
                        question: ExamQuestion;
                        index: number;
                        _id: string;
                    };
                };
                if (userAnswer) {
                    setUserAnswer(userAnswer);
                }
                setExamQuestion(question);
                setImages(images);
                setMounted(true);
            })
            .catch(() => {
                setMounted(true);
            });
    }, []);

    if (!mounted) {
        return <Loading />;
    } else {
        return (
            <article className="question finished">
                {examQuestion ? (
                    <>
                        <div className="content">
                            <div className="question-content">
                                {examQuestion.question.isBoth ? (
                                    <div className="both">
                                        <p className="both-question-text">
                                            {index}.{" "}
                                            {examQuestion.question.value}
                                        </p>
                                        <div className="question-image">
                                            <img
                                                src={convertBufferToBase64Image(
                                                    images.find(
                                                        (img) =>
                                                            img.bothId ===
                                                            examQuestion
                                                                .question
                                                                .imgValue
                                                    )!.data.data
                                                )}
                                                alt="Question"
                                            />
                                        </div>
                                    </div>
                                ) : examQuestion.question.isImage ? (
                                    <div className="question-image">
                                        <h3>{index}.</h3>
                                        <img
                                            src={convertBufferToBase64Image(
                                                images.find(
                                                    (img) =>
                                                        img.id ===
                                                        examQuestion.question
                                                            .value
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
                                    {examQuestion.options.map(
                                        (option, _index) => (
                                            <li
                                                key={_index}
                                                className={
                                                    option.isCorrect
                                                        ? "correct"
                                                        : "wrong"
                                                }
                                            >
                                                <input
                                                    type="checkbox"
                                                    name="option"
                                                    key={_index}
                                                    readOnly
                                                    checked={
                                                        userAnswer &&
                                                        userAnswer.index ==
                                                            _index
                                                            ? true
                                                            : false
                                                    }
                                                />
                                                <label htmlFor={option._id}>
                                                    {option.isImage ? (
                                                        <img
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
                                        )
                                    )}
                                </ul>
                            </div>
                        </div>
                    </>
                ) : (
                    <p>Question not found</p>
                )}
            </article>
        );
    }
}
