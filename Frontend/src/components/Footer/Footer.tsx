import React from 'react';
import styles from '../../styles/Footer.module.css';
import { categories } from '../../utils/categories';

const Footer: React.FC = () => {
    return (
        <footer className={styles.footer}>
            <div className={styles.footerContent}>
                {/* Left Section */}
                <div className={styles.leftSection}>
                    <h2 className={styles.brandName}>TinyLivingHacks</h2>
                    <p>Get tips and tricks for creating your ideal tiny home and living sustainably.</p>
                </div>

                {/* Middle Section */}
                <div className={styles.middleSection}>
                    <h4>Explore</h4>
                    <ul>
                        {/* Dynamically render categories */}
                        {categories.map((category, index) => (
                            <li key={index}>
                                <a href={category.link}>{category.name}</a>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Right Section */}
                <div className={styles.rightSection}>
                    <h4>About</h4>
                    <ul>
                        <li><a href="/about-us">About Us</a></li>
                        <li><a href="/terms-of-service">Terms of Service</a></li>
                        <li><a href="/privacy-policy">Privacy Policy</a></li>
                        <li><a href="/editorial-guidelines">Editorial Guidelines</a></li>
                        <li><a href="/contact">Contact</a></li>
                    </ul>
                </div>
            </div>

            {/* Bottom Section */}
            <div className={styles.footerBottom}>
                <p>© 2025 TinyLivingHacks</p>
                <p>
                    TinyLivingHacks is part of a sustainable living initiative, inspiring change in the way we live.
                </p>
                <div className={styles.socialIcons}>
                    <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
                        <i className="fab fa-instagram"></i>
                    </a>
                    <a href="https://www.tiktok.com" target="_blank" rel="noopener noreferrer">
                        <i className="fab fa-tiktok"></i>
                    </a>
                    <a href="https://www.pinterest.com" target="_blank" rel="noopener noreferrer">
                        <i className="fab fa-pinterest"></i>
                    </a>
                    <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
                        <i className="fab fa-facebook"></i>
                    </a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;