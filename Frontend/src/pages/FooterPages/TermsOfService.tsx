import React from 'react';
import styles from '../../styles/FooterPages/TermsOfService.module.css'; // Import CSS module

const TermsOfService: React.FC = () => {
    return (
        <div className={styles.termsOfServiceContainer}> {/* Apply CSS module styles */}
            <h1>Terms of Service</h1>
            <p>
                By using CozyTiny, you agree to comply with the following terms:
            </p>
            <ul>
                <li>You will use our website for lawful purposes only.</li>
                <li>Content provided on the site is for informational purposes only.</li>
                <li>We reserve the right to update these terms at any time.</li>
            </ul>
            <p>
                Please read our full terms carefully before using our website.
            </p>
        </div>
    );
};

export default TermsOfService;