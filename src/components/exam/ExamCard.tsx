import { ActiveExam, FinishedExam } from "@/types/types";
import moment from "moment";
import "moment/locale/az";
import "./styles.css";

interface ActiveExamProps {
    exam: ActiveExam;
}

export function ActiveExamCard(props: ActiveExamProps) {
    const { exam } = props;
    const id = exam.id;
    const title = exam.details.title;
    const startDate = moment(exam.startDate).format("LLL");
    const endDate = moment(exam.finishDate).format("LLL");

    const redirectToExam = () => {
        window.location.href = `/exams/active/${id}`;
    };

    const openExam = () => {
        window.open(`/exams/active/${id}`, "_blank");
    };

    return (
        <div id="exam-card" onClick={openExam}>
            <div className="exam-item active">
                <table>
                    <tr>
                        <th>İmtahan:</th>
                        <th>Başlama:</th>
                        <th>Bitmə:</th>
                        <th rowSpan={2}>
                            <button
                                className="btn primary-btn"
                                onClick={redirectToExam}
                            >
                                Dəvam et
                            </button>
                        </th>
                    </tr>

                    <tr>
                        <td>{title}</td>
                        <td>{startDate}</td>
                        <td>{endDate}</td>
                    </tr>
                </table>
            </div>
        </div>
    );
}

interface FinishedExamProps {
    exam: FinishedExam;
}

export function FinishedExamCard(props: FinishedExamProps) {
    const { exam } = props;
    const id = exam.id;
    const title = exam.details.title;
    const startDate = moment(exam.startDate).format("LLL");
    const finishedAt = moment(exam.finishedAt).format("LLL");
    const correctCount = exam.results.correctCount;
    const total = exam.details.settings.questionCount;
    const scorePercent = exam.results.scorePercent;

    const openExam = () => {
        window.open(`/exams/finished/${id}`, "_blank");
    };

    return (
        <div id="exam-card" onClick={openExam}>
            <div className="exam-item">
                <table>
                    <tr>
                        <th>İmtahan:</th>
                        <th>Başlama:</th>
                        <th>Bitirmə:</th>
                        <th>Nəticə:</th>
                    </tr>

                    <tr>
                        <td>{title}</td>
                        <td>{startDate}</td>
                        <td>{finishedAt}</td>
                        <td>
                            {correctCount} / {total} ({scorePercent}%)
                        </td>
                    </tr>
                </table>
            </div>
        </div>
    );
}
