import React, { useState } from 'react';
import styles from '../../styles/Header.module.css';
import { categories } from '../../utils/categories';

const Header: React.FC = () => {
    const [menuVisible, setMenuVisible] = useState(false); // Track dropdown visibility

    // Toggle the visibility of the menu
    const toggleMenu = () => setMenuVisible((prev) => !prev);

    return (
        <header className={styles.header}>
            <div className={styles.container}>
            <meta name="google-adsense-account" content="ca-pub-8508538336027236" />
                <div className={styles.logo}>
                    <span className={styles.menuIcon} onClick={toggleMenu}>☰</span>
                    <h1>
                        <a href="/">TinyLivingHacks</a>
                    </h1>
                </div>
                <nav className={`${styles.nav} ${menuVisible ? styles.visible : ''}`}>
                    {categories.map((category) => (
                        <a key={category.name} href={category.link}>
                            {category.name}
                        </a>
                    ))}
                </nav>
                <div className={styles.actions}>
                    <span className={styles.searchIcon}>🔍</span>
                </div>
            </div>
        </header>
    );
};

export default Header;