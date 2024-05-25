import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "UNEC | Examination",
    description: "Examination is a examination system for UNEC students.",
    keywords: [
        "Examination",
        "UNEC",
        "ADIU",
        "Semestr",
        "Kollekvium",
        "Midterm",
    ],
    authors: [{ name: "Mehdi Safarzade", url: "https://mehdisafarzade.dev" }],
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="az">
            <body>{children}</body>
        </html>
    );
}
