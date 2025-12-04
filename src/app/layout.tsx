// import './globals.css';
// import type { Metadata } from 'next';
// import Script from 'next/script';
// import { GoogleTagManager } from '@next/third-parties/google';
import { redirect } from 'next/navigation';
import { NEW_APP_URL } from '@/utils';

// export const metadata: Metadata = {
//     title: 'Examination',
//     description: 'Examination system for students.',
//     keywords: [
//         'Examination',
//         'UNEC',
//         'ADIU',
//         'Semestr İmtahanı',
//         'Final İmahanı',
//         'Kollekvium İmtahanı',
//         'Midterm İmtahanı',
//     ],
//     authors: [{ name: 'Mehdi Safarzade', url: 'https://mehdisafarzade.dev' }],
//     metadataBase: new URL('https://examination.az'),
//     openGraph: {
//         title: 'Examination System',
//         type: 'website',
//         url: 'https://examination.az',
//         description: 'Examination system for students',
//         images: [
//             {
//                 url: '/Preview.png',
//                 width: 800,
//                 height: 600,
//                 alt: 'Preview Image',
//             },
//         ],
//     },
//     twitter: {
//         card: 'summary_large_image',
//         site: '@SeonerVorteX',
//         creator: '@SeonerVorteX',
//         title: 'Examination System',
//         description: 'Examination system for students',
//         images: [
//             {
//                 url: '/Preview.png',
//                 width: 800,
//                 height: 600,
//                 alt: 'Preview Image',
//             },
//         ],
//     },
// };

export default function RootLayout({
    // children,
}: Readonly<{
    // children: React.ReactNode;
}>) {

    return redirect(NEW_APP_URL);
    // return (
    //     <html lang="az">
    //         <head>
    //             <script
    //                 async
    //                 src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9056907287164851"
    //                 crossOrigin="anonymous"
    //             ></script>
    //         </head>
    //         <body>{/*children*/}</body>
    //         <GoogleTagManager
    //             gtmId={process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER!}
    //         />
    //         <Script>
    //             {`
    //             let cookies = localStorage.getItem("cookies");
    //             window.dataLayer = window.dataLayer || [];
    //             function gtag(){dataLayer.push(arguments);}
    //             gtag('js', new Date());
    //             gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS!}');

    //             if(cookies === true || cookies === "true") {
    //                 gtag('consent', 'update', {
    //                     'ad_storage': 'granted',
    //                     'ad_user_data': 'granted',
    //                     'ad_personalization': 'granted',
    //                     'analytics_storage': 'granted'
    //                 });
    //             } else {
    //                 gtag('consent', 'default', {
    //                     'ad_storage': 'denied',
    //                     'ad_user_data': 'denied',
    //                     'ad_personalization': 'denied',
    //                     'analytics_storage': 'denied'
    //                 });
    //             }
    //         `}
    //         </Script>
    //         <Script
    //             src={`https://www.googletagmanager.com/gtag/js?id=${process.env
    //                 .NEXT_PUBLIC_GOOGLE_ANALYTICS!}`}
    //         ></Script>
    //     </html>
    // );
}
