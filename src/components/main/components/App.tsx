import { SyntheticEvent, useEffect, useState } from "react";
import "./styles.css";
import ExamCard from "./ExamCard";
import { Exam } from "@/types/types";
import { API as $ } from "@/utils";
import Loading from "@/app/loading";
import axios from "@/utils/axios";

export default () => {
    const [exams, setExams] = useState<Exam[]>([]);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        axios.get("/exams/all").then((res) => {
            if (res.status === 200) {
                setExams(res.data);
                setMounted(true);
            }
        });
    }, []);

    if (!mounted) {
        return <Loading />;
    }

    return (
        <div className="container app">
            <div className="header">
                <h2>Aktif İmtahanlar</h2>
            </div>

            <div className="exams">
                {exams.map((exam, index) => (
                    <ExamCard
                        id={exam.id}
                        title={exam.title}
                        url={`/exams/${exam.id}`}
                        key={index}
                    />
                ))}
            </div>
        </div>
    );
};
