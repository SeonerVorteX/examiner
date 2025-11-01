import './styles.css';
import { ExamQuestion, ImageType, QuestionType } from '@/types/types';

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
        const base64 = Buffer.from(buffer).toString('base64');
        return `data:image/png;base64,${base64}`;
    };

    return (
        <article className="question finished">
            {content ? (
                <>
                    <div className="content">
                        <div className="question-content">
                            <p className="question-text">
                                {index}) {content.question.value}
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
                                        className={`disableCursor ${
                                            option.isCorrect
                                                ? 'correct'
                                                : 'wrong'
                                        }`}
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
                                        <label
                                            htmlFor={option._id}
                                            className="disableCursor"
                                        >
                                            {option.imageId ? (
                                                <img
                                                    className="disableCursor option-image"
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
