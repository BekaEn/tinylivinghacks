import React from 'react';
import styles from '../../styles/FooterPages/AboutUs.module.css'; // Import styles as a module

const AboutUs: React.FC = () => {
    return (
        <div className={styles.aboutUsContainer}> {/* Apply styles using the imported styles object */}
            <h1>About Us</h1>
            <p>
                Welcome to CozyTiny! Our mission is to empower people to embrace a simpler and more sustainable way of living by providing tips, tricks, and inspiration for tiny homes and eco-friendly living.
            </p>
            <p>
                Whether you're downsizing, building your dream tiny home, or simply looking for creative ways to live sustainably, we're here to help every step of the way.
            </p>
        </div>
    );
};

export default AboutUs;