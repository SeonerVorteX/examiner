'use client';

import './styles.css';
import { useEffect, useState } from 'react';
import { ImageType, QuestionType } from '@/types/types';

interface QuestionProps {
    examId: string;
    showAnswers: boolean;
    index: number;
    content: QuestionType;
    images: ImageType[];
    answers: { question: number; index: number }[];
    setAnswers: React.Dispatch<
        React.SetStateAction<{ question: number; index: number }[]>
    >;
}

export default function ActiveQuestion(props: QuestionProps) {
    const { showAnswers, index, content, images, answers, setAnswers } = props;
    const [answer, setAnswer] = useState<number>(
        answers.find((ans) => ans.question === content.row) !== undefined
            ? answers.find((ans) => ans.question === content.row)!.index
            : -1
    );

    useEffect(() => {
        if (answer !== -1) {
            let answerList = answers.filter(
                (ans) => ans.question !== content.row
            );
            answerList.push({ question: content.row, index: answer });
            setAnswers(answerList);
        }
    }, [answer]);

    useEffect(() => {
        let userAnswer = answers.find((ans) => ans.question === content.row);

        if (userAnswer) {
            setAnswer(userAnswer.index);
        } else {
            setAnswer(-1);
        }
    }, [index]);

    const convertBufferToBase64Image = (buffer: number[]) => {
        const base64 = Buffer.from(buffer).toString('base64');
        return `data:image/png;base64,${base64}`;
    };

    return (
        <article className="question">
            {content ? (
                <div className="content">
                    <div className="question-content">
                        <p className="question-text">
                            {index}) {content.question.content}
                        </p>
                        {content.question.imageId ? (
                            <div className="question-image">
                                <img
                                    src={convertBufferToBase64Image(
                                        images.find(
                                            (img) =>
                                                img.id ===
                                                content.question.imageId
                                        )!.data.data
                                    )}
                                    alt="Question"
                                />
                            </div>
                        ) : null}
                    </div>
                    <div className="options">
                        <ul>
                            {content.options.map((option, _index) => (
                                <li
                                    key={_index}
                                    className={`enableCursor ${
                                        showAnswers
                                            ? option.isCorrect
                                                ? 'correct'
                                                : 'wrong'
                                            : ''
                                    }`}
                                    onClick={() =>
                                        setAnswer(
                                            content.options.indexOf(option)
                                        )
                                    }
                                >
                                    <input
                                        type="radio"
                                        name="option"
                                        key={_index}
                                        onKeyDown={(e) => {
                                            e.preventDefault();
                                        }}
                                        checked={
                                            answer ===
                                            content.options.indexOf(option)
                                        }
                                        onClick={() =>
                                            setAnswer(
                                                content.options.indexOf(option)
                                            )
                                        }
                                    />
                                    <label
                                        htmlFor={option._id}
                                        className="enableCursor"
                                    >
                                        {option.imageId ? (
                                            <img
                                                style={{
                                                    cursor: 'pointer',
                                                }}
                                                className="enableCursor option-image"
                                                src={convertBufferToBase64Image(
                                                    images.find(
                                                        (img) =>
                                                            img.id ===
                                                            option.imageId
                                                    )!.data.data
                                                )}
                                                alt="Option"
                                            />
                                        ) : (
                                            option.content
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
