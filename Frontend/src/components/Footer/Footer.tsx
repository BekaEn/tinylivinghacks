import React from 'react';
import styles from '../../styles/Footer.module.css';
import { categories } from '../../utils/categories';

const Footer: React.FC = () => {
    return (
        <footer className={styles.footer}>
            <div className={styles.footerContent}>
                {/* Left Section */}
                <div className={styles.leftSection}>
                    <h2 className={styles.brandName}>Living Tiny, Living Smart</h2>
                    <p>Get tips and tricks for creating your ideal cozy & tiny home and living sustainably.</p>
                </div>

                {/* Middle Section */}
                <div className={styles.middleSection}>
                    <h3>Explore</h3>
                    <ul>
                        {/* Dynamically render categories */}
                        {categories.map((category, index) => (
                            <li key={index}>
                                <a href={category.link} title={`Explore ${category.name}`}>
                {category.name}
            </a>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Right Section */}
                <div className={styles.rightSection}>
                    <h4>About</h4>
                    <ul>
                    <li><a href="/about-us" title="Learn more about us">About Us</a></li>
    <li><a href="/terms-of-service" title="Read our terms of service">Terms of Service</a></li>
    <li><a href="/privacy-policy" title="Review our privacy policy">Privacy Policy</a></li>
    <li><a href="/editorial-guidelines" title="View our editorial guidelines">Editorial Guidelines</a></li>
    <li><a href="/contact" title="Get in touch with us">Contact</a></li>
                    </ul>
                </div>
            </div>

            {/* Bottom Section */}
            <div className={styles.footerBottom}>
                <p>© 2025 CozyTiny</p>
                <p>
                CozyTiny is part of a sustainable living initiative, inspiring change in the way we live.
                </p>
             
                </div>

        </footer>
    );
};

export default Footer;