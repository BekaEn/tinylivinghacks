import React from 'react';
import type { AppProps } from 'next/app';
import Layout from '../components/Layout';
import '../styles/globals.css';

const MyApp: React.FC<AppProps> = ({ Component, pageProps }) => {
    return (
        <Layout>
            <Component {...pageProps} />
        </Layout>
    );
};

export default MyApp;