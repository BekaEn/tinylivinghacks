import React, { useState, useEffect, useRef, useCallback } from 'react';
import Head from 'next/head'; // Import Next.js Head component
import styles from '../../styles/Header.module.css';
import { categories } from '../../utils/categories';

const Header: React.FC = () => {
    const [isVisible, setIsVisible] = useState(true); // Track header visibility
    const [lastScrollY, setLastScrollY] = useState(0); // Track last scroll position
    const [headerHeight, setHeaderHeight] = useState(0); // Track the header height
    const headerRef = useRef<HTMLDivElement>(null); // Ref for the header element

    // Ensure `controlHeader` remains stable across renders
    const controlHeader = useCallback(() => {
        if (window.scrollY > lastScrollY) {
            // Scrolling down
            setIsVisible(false);
        } else {
            // Scrolling up
            setIsVisible(true);
        }
        setLastScrollY(window.scrollY);
    }, [lastScrollY]);

    useEffect(() => {
        // Get the header height dynamically
        if (headerRef.current) {
            setHeaderHeight(headerRef.current.offsetHeight);
        }

        window.addEventListener('scroll', controlHeader);
        return () => {
            window.removeEventListener('scroll', controlHeader);
        };
    }, [controlHeader]); // Include `controlHeader` in the dependency array

    const [menuVisible, setMenuVisible] = useState(false);

    const toggleMenu = () => setMenuVisible((prev) => !prev);

    const generateSchemaOrgData = () => {
        return JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: 'Cozy Tiny Homes',
            url: 'https://cozytiny.com',
            potentialAction: {
                '@type': 'SearchAction',
                target: 'https://cozytiny.com/search?q={search_term_string}',
                'query-input': 'required name=search_term_string',
            },
            publisher: {
                '@type': 'Organization',
                name: 'Cozy Tiny Homes',
                logo: {
                    '@type': 'ImageObject',
                    url: 'https://cozytiny.com/uploads/Cozy-Tiny-Homes-Logo.svg',
                },
            },
        });
    };

    return (
        <>
            <Head>
            <title>Cozy Tiny Homes - Simplify Your Life with Sustainable Living</title>
                <script
                    dangerouslySetInnerHTML={{
                        __html: `
                            (function(w,d,s,l,i){
                                w[l]=w[l]||[];
                                w[l].push({'gtm.start': new Date().getTime(), event:'gtm.js'});
                                var f=d.getElementsByTagName(s)[0],
                                    j=d.createElement(s),
                                    dl=l!='dataLayer'?'&l='+l:'';
                                j.async=true;
                                j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;
                                f.parentNode.insertBefore(j,f);
                            })(window,document,'script','dataLayer','GTM-K6TNZPCC');
                        `,
                    }}
                ></script>

                {/* gtag.js for Google Analytics */}
                <script async src="https://www.googletagmanager.com/gtag/js?id=G-Z685G5TL50"></script>
                <script
                    dangerouslySetInnerHTML={{
                        __html: `
                            window.dataLayer = window.dataLayer || [];
                            function gtag(){dataLayer.push(arguments);}
                            gtag('js', new Date());
                            gtag('config', 'G-Z685G5TL50');
                        `,
                    }}
                ></script>

                {/* Add Schema.org structured data */}
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: generateSchemaOrgData() }}
                />
            </Head>

            <header
                ref={headerRef}
                className={`${styles.header} ${isVisible ? styles.visible : styles.hidden}`}
                aria-label="Site Header"
            >
                <div className={styles.container}>
                    <div className={styles.logo}>
                        <button
                            className={styles.menuIcon}
                            onClick={toggleMenu}
                            aria-label="Toggle Navigation Menu"
                        >
                            ☰
                        </button>
                        <a href="/" className={styles.logoLink}>
                            <img
                                src="/uploads/Cozy-Tiny-Homes-Logo.svg"
                                alt="Cozy Tiny Homes Logo"
                                className={styles.logoImage}
                            />
                        </a>
                    </div>
                    <nav
                        className={`${styles.nav} ${menuVisible ? styles.visible : ''}`}
                        aria-label="Main Navigation"
                    >
                        {categories.map((category) => (
                            <a key={category.name} href={category.link}>
                                {category.name}
                            </a>
                        ))}
                    </nav>
                    <div className={styles.actions}>
                        <button className={styles.searchIcon} aria-label="Search">
                            🔍
                        </button>
                    </div>
                </div>
            </header>
            {/* Dynamic padding for the content */}
            <div style={{ paddingTop: `${headerHeight}px` }} className="content">
                {/* Your main content here */}
            </div>
        </>
    );
};

export default Header;