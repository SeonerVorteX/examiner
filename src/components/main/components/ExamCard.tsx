"use client";

import Image from "next/image";
import "./styles.css";
import { Key, useState } from "react";
import Link from "next/link";

interface ExamCardProps {
    id: number;
    title: string;
    url: string;
}

export default ({ id, title, url }: ExamCardProps) => {
    return (
        <article className="exam" id={`exam-${id}`}>
            <Link href={url} target="_blank">
                <h3>{title}</h3>
            </Link>
            {/* <p className={`description-${id}`}>{description}</p> */}
            <Link className="btn primary-btn get-exam" href={url}>
                <i className="fa-solid fa-pen"></i> İmtahana Ver
            </Link>
        </article>
    );
};
