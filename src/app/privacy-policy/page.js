"use client";
import React from "react";

export default function PrivacyPolicy() {
    return (
        <div className="bg-white min-h-screen font-['Outfit',sans-serif] text-black">
            <style jsx>{`
                @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600;1,700&display=swap');
                
                .serif-font {
                    font-family: 'Cormorant Garamond', serif;
                }
                .policy-container {
                    max-width: 900px;
                    margin: 0 auto;
                    padding: 6rem 1.5rem 5rem 1.5rem;
                }
                .header-area {
                    text-align: center;
                    margin-bottom: 5rem;
                }
                .policy-subtitle {
                    font-size: 0.65rem;
                    font-weight: 900;
                    letter-spacing: 0.3em;
                    color: #9CA3AF;
                    text-transform: uppercase;
                    display: block;
                    margin-bottom: 1.5rem;
                }
                .policy-title {
                    font-size: clamp(2.5rem, 6vw, 4.5rem);
                    font-weight: 700;
                    color: #000;
                    line-height: 1;
                    letter-spacing: -0.02em;
                }
                .policy-section {
                    margin-bottom: 3rem;
                }
                .policy-section h2 {
                    font-size: 1.5rem;
                    font-weight: 700;
                    margin-bottom: 1.5rem;
                    padding-bottom: 0.5rem;
                    border-bottom: 1px solid #000;
                    color: #000;
                }
                .policy-section h3 {
                    font-size: 1.1rem;
                    font-weight: 700;
                    margin-top: 1.5rem;
                    margin-bottom: 0.75rem;
                    color: #000;
                }
                .policy-section p {
                    font-size: 1rem;
                    line-height: 1.7;
                    margin-bottom: 1.25rem;
                    color: #000;
                }
                .policy-section ul {
                    list-style-type: disc;
                    padding-left: 1.5rem;
                    margin-bottom: 1.25rem;
                }
                .policy-section li {
                    font-size: 1rem;
                    line-height: 1.7;
                    margin-bottom: 0.75rem;
                    color: #000;
                }
            `}</style>

            <main className="policy-container">
                <div className="header-area">
                    <span className="policy-subtitle">Information & Guidelines</span>
                    <h1 className="policy-title">
                        Privacy <span className="text-[#F7941E] italic serif-font font-medium">Policy</span>
                    </h1>
                </div>

                <div className="policy-section">
                    <h2>1. Introduction</h2>
                    <p>
                        This Privacy Policy explains how our platform collects, uses, stores, and protects the personal information of users who access or make purchases through our website.
                    </p>
                    <p>
                        We are committed to protecting the privacy of our customers and ensuring that their personal information is handled securely and responsibly. By using our website and purchasing books from our platform, you agree to the terms outlined in this Privacy Policy.
                    </p>
                </div>

                <div className="policy-section">
                    <h2>2. Information We Collect</h2>
                    <p>When users interact with our website or make a purchase, we may collect certain types of information, including:</p>
                    
                    <h3>Personal Information</h3>
                    <p>This may include:</p>
                    <ul>
                        <li>Full name</li>
                        <li>Email address</li>
                        <li>Contact information</li>
                        <li>Account details</li>
                    </ul>

                    <h3>Transaction Information</h3>
                    <p>When a customer purchases a book, we may collect information related to the transaction, such as:</p>
                    <ul>
                        <li>Order ID</li>
                        <li>Payment confirmation details</li>
                        <li>Purchase history</li>
                    </ul>

                    <h3>Technical Information</h3>
                    <p>We may automatically collect certain technical information when users visit our website, including:</p>
                    <ul>
                        <li>IP address</li>
                        <li>Browser type</li>
                        <li>Device information</li>
                        <li>Pages visited on the website</li>
                    </ul>
                    <p>This information helps us improve the functionality and performance of our platform.</p>
                </div>

                <div className="policy-section">
                    <h2>3. How We Use Your Information</h2>
                    <p>The information collected from users may be used for the following purposes:</p>
                    <ul>
                        <li>To process and manage book purchases</li>
                        <li>To provide customer support</li>
                        <li>To maintain user accounts</li>
                        <li>To improve website functionality and user experience</li>
                        <li>To communicate important updates related to orders or services</li>
                        <li>To prevent fraudulent activities and ensure platform security</li>
                    </ul>
                    <p>We only use user information for legitimate business purposes related to our services.</p>
                </div>

                <div className="policy-section">
                    <h2>4. Payment Information</h2>
                    <p>
                        All payments made through our platform are processed through secure payment gateways. We do not store sensitive payment information such as card numbers or banking credentials on our servers.
                    </p>
                    <p>
                        Payment providers may handle payment processing according to their own privacy and security policies.
                    </p>
                </div>

                <div className="policy-section">
                    <h2>5. Data Protection and Security</h2>
                    <p>
                        We take reasonable security measures to protect user information from unauthorized access, misuse, or disclosure. Our platform uses appropriate security technologies and practices to safeguard customer data.
                    </p>
                    <p>
                        However, while we strive to protect user information, no system can guarantee complete security.
                    </p>
                </div>

                <div className="policy-section">
                    <h2>6. Sharing of Information</h2>
                    <p>We do not sell, rent, or trade users' personal information to third parties.</p>
                    <p>User information may only be shared in the following situations:</p>
                    <ul>
                        <li>With trusted service providers that help operate our platform</li>
                        <li>When required by law or legal authorities</li>
                        <li>To protect the security and integrity of the platform</li>
                    </ul>
                    <p>Any information shared with service providers is limited to what is necessary for providing services.</p>
                </div>

                <div className="policy-section">
                    <h2>7. Cookies and Website Tracking</h2>
                    <p>
                        Our website may use cookies and similar technologies to improve user experience. Cookies help us understand how visitors interact with our website and allow certain features to function properly.
                    </p>
                    <p>
                        Users may choose to disable cookies through their browser settings, although some features of the website may not function properly if cookies are disabled.
                    </p>
                </div>

                <div className="policy-section">
                    <h2>8. User Rights</h2>
                    <p>
                        Users have the right to request access to their personal information stored on our platform. If users believe that their information is incorrect or needs to be updated, they may contact our support team.
                    </p>
                    <p>
                        We will take reasonable steps to update or correct the information when requested.
                    </p>
                </div>

                <div className="policy-section">
                    <h2>9. Policy Updates</h2>
                    <p>
                        We reserve the right to update or modify this Privacy Policy at any time. Any changes to this policy will be posted on this page.
                    </p>
                    <p>
                        Users are encouraged to review this policy periodically to stay informed about how their information is handled.
                    </p>
                </div>

                <div className="policy-section">
                    <h2>10. Contact Information</h2>
                    <p>
                        If you have any questions or concerns regarding this Privacy Policy, you may contact our support team.
                    </p>
                    <p>
                        Please include your contact details and relevant information so that we can respond to your request efficiently.
                    </p>
                </div>
            </main>
        </div>
    );
}
