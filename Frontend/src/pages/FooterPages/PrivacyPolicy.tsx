import React from 'react';
import styles from '../../styles/FooterPages/PrivacyPolicy.module.css'; // Import CSS module

const PrivacyPolicy: React.FC = () => {
    return (
        <div className={styles.privacyPolicyContainer}> {/* Apply CSS module styles */}
            <h1>Privacy Policy</h1>
            <p>
                Your privacy is important to us. TinyLivingHacks collects only the data necessary to provide you with the best experience possible.
            </p>
            <p>
                We may collect your email address and website interactions for the purpose of improving our services and offering personalized content.
            </p>
            <p>
                We do not share your personal information with third parties without your consent.
            </p>
        </div>
    );
};

export default PrivacyPolicy;