import "./globals.css";
import type { Metadata } from "next";
import Script from "next/script";

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
            <head>
                <script
                    async
                    src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9056907287164851"
                    crossOrigin="anonymous"
                ></script>
            </head>
            <body>{children}</body>
            <Script
                src={`https://www.googletagmanager.com/gtag/js?id=${process.env
                    .NEXT_PUBLIC_GOOGLE_ANALYTICS!}`}
            ></Script>
            <Script>
                {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS!}');
            `}
            </Script>
        </html>
    );
}
