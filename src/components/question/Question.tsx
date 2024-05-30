import "./styles.css";
import { ExamQuestion, ImageType, QuestionType } from "@/types/types";

interface QuestionProps {
    examId: string;
    index: number;
    content: QuestionType;
    images: ImageType[];
    userAnswer?: {
        question: ExamQuestion;
        index: number;
    };
}

export default function Question(props: QuestionProps) {
    const { content, images, index, userAnswer } = props;

    const convertBufferToBase64Image = (buffer: number[]) => {
        const base64 = Buffer.from(buffer).toString("base64");
        return `data:image/png;base64,${base64}`;
    };

    return (
        <article className="question finished">
            {content ? (
                <>
                    <div className="content">
                        <div className="question-content">
                            {content.question.isBoth ? (
                                <div className="both">
                                    <p className="both-question-text">
                                        {index}. {content.question.value}
                                    </p>
                                    <div className="question-image">
                                        <img
                                            src={convertBufferToBase64Image(
                                                images.find(
                                                    (img) =>
                                                        img.bothId ===
                                                        content.question
                                                            .imgValue
                                                )!.data.data
                                            )}
                                            alt="Question"
                                        />
                                    </div>
                                </div>
                            ) : content.question.isImage ? (
                                <div className="question-image">
                                    <h3>{index}.</h3>
                                    <img
                                        src={convertBufferToBase64Image(
                                            images.find(
                                                (img) =>
                                                    img.id ===
                                                    content.question.value
                                            )!.data.data
                                        )}
                                        alt="Question"
                                    />
                                </div>
                            ) : (
                                <p className="question-text">
                                    {index}. {content.question.value}
                                </p>
                            )}
                        </div>
                        <div className="options">
                            <ul>
                                {content.options.map((option, _index) => (
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
                                                userAnswer.index == _index
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
