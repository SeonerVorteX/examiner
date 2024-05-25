import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "UNEC | Examination",
    description: "Examination is an examination system for UNEC students.",
    keywords: [
        "Examination",
        "UNEC",
        "ADIU",
        "Semestr",
        "Kollekvium",
        "Midterm",
    ],
    authors: [{ name: "Mehdi Safarzade", url: "https://mehdisafarzade.dev" }],
    metadataBase: new URL("https://unec-examination.vercel.app"),
    openGraph: {
        title: "Examination System",
        type: "website",
        url: "https://unec-examination.vercel.app",
        description: "Examination system for UNEC students",
        images: [
            {
                url: "/Preview.png",
                width: 800,
                height: 600,
                alt: "Preview Image",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        site: "@SeonerVorteX",
        creator: "@SeonerVorteX",
        title: "Examination System",
        description: "Examination system for UNEC students",
        images: [
            {
                url: "/Preview.png",
                width: 800,
                height: 600,
                alt: "Preview Image",
            },
        ],
    },
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
