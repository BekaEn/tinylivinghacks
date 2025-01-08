import React from 'react';
import styles from '../../styles/FooterPages/EditorialGuidelines.module.css'; // Import CSS module

const EditorialGuidelines: React.FC = () => {
    return (
        <div className={styles.editorialGuidelinesContainer}> {/* Apply the CSS module */}
            <h1>Editorial Guidelines</h1>
            <p>
                At TinyLivingHacks, we are committed to producing high-quality, accurate, and valuable content for our readers. Our guidelines include:
            </p>
            <ul>
                <li>All content is thoroughly researched and fact-checked.</li>
                <li>We maintain transparency and integrity in our writing.</li>
                <li>Our team strives to provide up-to-date and relevant information.</li>
            </ul>
            <p>
                If you have questions or suggestions regarding our content, feel free to <a href="/contact">contact us</a>.
            </p>
        </div>
    );
};

export default EditorialGuidelines;