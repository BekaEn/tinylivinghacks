import React from 'react';
import styles from '../../styles/FooterPages/Contact.module.css'; // Import CSS module

const Contact: React.FC = () => {
    return (
        <div className={styles.contactPageContainer}> {/* Apply the CSS module */}
            <h1>Contact Us</h1>
            <p>
                We’d love to hear from you! Whether you have questions, feedback, or suggestions, feel free to reach out.
            </p>
            <p>Email: <a href="mailto:support@tinylivinghacks.com">support@tinylivinghacks.com</a></p>
        </div>
    );
};

export default Contact;