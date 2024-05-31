"use client";

import "./styles.css";
import Link from "next/link";

interface ExamCardProps {
    id: number;
    title: string;
    url: string;
}

const substringTitle = (sentence: string, length: number) => {
    let list = sentence.split(" ");
    let newSentence = "";

    for (let i = 0; i < list.length; i++) {
        newSentence += list[i] + " ";
        if (newSentence.length > length) {
            break;
        }
    }

    return newSentence;
};

export default ({ id, title, url }: ExamCardProps) => {
    return (
        <article className="exam" id={`exam-${id}`}>
            <Link href={url} target="_blank">
                <h3>
                    {title.length >= 20
                        ? `${substringTitle(title, 20).trim()}...`
                        : title}
                </h3>
            </Link>
            <Link className="btn primary-btn get-exam" href={url}>
                <i className="fa-solid fa-pen"></i> İmtahan Ver
            </Link>
        </article>
    );
};
