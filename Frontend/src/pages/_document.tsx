// pages/_document.tsx
import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
    return (
        <Html lang="en">
            <Head>
            <link rel="icon" href="/uploads/favicon.png" />
                {/* Additional metadata or links can go here */}
            </Head>
            <body>
                <Main />
                <NextScript />
            </body>
        </Html>
    );
}