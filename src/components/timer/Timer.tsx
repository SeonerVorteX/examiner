import "./styles.css";
import { useEffect, useState } from "react";

interface TimerProps {
    finishDate: number;
    timeOver: () => void;
}

export default function Timer(props: TimerProps) {
    const { finishDate, timeOver } = props;
    const [danger, setDanger] = useState<boolean>(false);
    const [finished, setFinished] = useState<boolean>(false);
    const [examInterval, setExamInterval] = useState<NodeJS.Timeout | null>(
        null
    );
    const [timeLeft, setTimeLeft] = useState<number>(finishDate - Date.now());

    const formatTime = (time: number) => {
        const hours = Math.floor(time / 3600000);
        const minutes = Math.floor((time % 3600000) / 60000);
        const seconds = Math.floor((time % 60000) / 1000);

        return `${hours}:${minutes}:${seconds}`;
    };

    useEffect(() => {
        const interval = setInterval(() => {
            if (!finished)
                setTimeLeft(
                    finishDate - Date.now() > 0 ? finishDate - Date.now() : 0
                );
        }, 1000);

        setExamInterval(interval);
    }, []);

    useEffect(() => {
        if (finished) return;

        if (timeLeft < 15 * 60 * 1000) {
            setDanger(true);
        }

        if (finishDate - Date.now() <= 0) {
            timeOver();
            setFinished(true);
            clearInterval(examInterval!);
        } else {
            setTimeLeft(finishDate - Date.now());
        }
    }, [timeLeft]);

    return (
        <div className="timer">
            <h3>
                Qalan Vaxt:{" "}
                <span className={`${danger ? "danger" : ""}`}>
                    {formatTime(timeLeft)}
                </span>
            </h3>
        </div>
    );
}
