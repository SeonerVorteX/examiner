"use client";

import "./styles.css";
import axios from "@/utils/axios";
import { useEffect, useState } from "react";
import { ImageType, QuestionType } from "@/types/types";
import Loading from "@/app/loading";
import Image from "next/image";

interface QuestionProps {
    examId: string;
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
    const { index, row, answers, setAnswers } = props.details;
    const [examQuestion, setExamQuestion] = useState<QuestionType>();
    const [images, setImages] = useState<ImageType[]>([]);
    const [answer, setAnswer] = useState<number>(-1);
    const [mounted, setMounted] = useState(false);
    const examId = props.examId;

    const convertBufferToBase64Image = (buffer: number[]) => {
        const base64 = Buffer.from(buffer).toString("base64");
        return `data:image/png;base64,${base64}`;
    };

    useEffect(() => {
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
            })
            .catch(() => {
                setMounted(true);
            });
    }, [index]);

    useEffect(() => {
        if (answer !== -1) {
            let answerList = answers.filter((ans) => ans.question !== row);
            answerList.push({ question: row, index: answer });
            setAnswers(answerList);
        }
    }, [answer]);

    if (!mounted) {
        return <Loading />;
    } else {
        return (
            <article className="question">
                {examQuestion ? (
                    <>
                        {examQuestion.question.isImage ? (
                            <div className="heading">
                                <h1>{index}.</h1>
                            </div>
                        ) : (
                            <></>
                        )}
                        <div className="content">
                            <div className="question-content">
                                {examQuestion.question.isImage ? (
                                    <Image
                                        src={convertBufferToBase64Image(
                                            images.find(
                                                (img) =>
                                                    img.id ===
                                                    examQuestion.question.value
                                            )!.data.data
                                        )}
                                        alt="Question"
                                        width={200}
                                        height={200}
                                    />
                                ) : (
                                    <p>
                                        {index}. {examQuestion.question.value}
                                    </p>
                                )}
                            </div>
                            <div className="options">
                                <ul>
                                    {examQuestion.options.map((option) => (
                                        <li key={option._id}>
                                            <input
                                                type="radio"
                                                name="option"
                                                id={option._id}
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
                                                    <Image
                                                        className="option-image"
                                                        src={convertBufferToBase64Image(
                                                            images.find(
                                                                (img) =>
                                                                    img.id ===
                                                                    option.value
                                                            )!.data.data
                                                        )}
                                                        alt="Option"
                                                        width={200}
                                                        height={200}
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
                    </>
                ) : (
                    <p>Question not found</p>
                )}
            </article>
        );
    }
}
