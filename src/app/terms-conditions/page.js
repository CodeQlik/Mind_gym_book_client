"use client";
import React from "react";

export default function TermsConditions() {
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
                    line-height: 1.1;
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
                        Terms & <span className="text-[#F7941E] italic serif-font font-medium">Conditions</span>
                    </h1>
                </div>

                <div className="policy-section">
                    <h2>1. Introduction</h2>
                    <p>
                        Welcome to our platform. These Terms and Conditions govern the use of our website and the purchase of books through our platform. By accessing our website or placing an order, you agree to comply with and be bound by these Terms and Conditions.
                    </p>
                    <p>
                        If you do not agree with any part of these terms, you should not use our website or purchase products from our platform.
                    </p>
                </div>

                <div className="policy-section">
                    <h2>2. Use of the Website</h2>
                    <p>
                        Users agree to use the website only for lawful purposes. Any activity that may harm, disrupt, or misuse the platform is strictly prohibited.
                    </p>
                    <p>Users must not:</p>
                    <ul>
                        <li>Attempt to gain unauthorized access to the website or its systems</li>
                        <li>Use the platform for fraudulent or illegal activities</li>
                        <li>Interfere with the proper functioning of the website</li>
                    </ul>
                    <p>
                        Violation of these rules may result in suspension or termination of access to the platform.
                    </p>
                </div>

                <div className="policy-section">
                    <h2>3. Account Responsibility</h2>
                    <p>
                        If users create an account on our platform, they are responsible for maintaining the confidentiality of their account information.
                    </p>
                    <p>Users are responsible for:</p>
                    <ul>
                        <li>Providing accurate information during registration</li>
                        <li>Maintaining the security of their login credentials</li>
                        <li>All activities that occur under their account</li>
                    </ul>
                    <p>
                        If users suspect unauthorized access to their account, they should contact support immediately.
                    </p>
                </div>

                <div className="policy-section">
                    <h2>4. Product Information</h2>
                    <p>
                        Our platform offers books for purchase through the website. We strive to ensure that all product information displayed on the website is accurate and up to date.
                    </p>
                    <p>
                        However, we do not guarantee that all descriptions, images, or information are completely error-free. We reserve the right to correct errors or update product information at any time.
                    </p>
                    
                </div>

                <div className="policy-section">
                    <h2>5. Orders and Payments</h2>
                    <p>
                        When customers place an order on our website, they agree to provide accurate payment and order information.
                    </p>
                    <p>
                        Payments must be completed through the available payment methods provided on the website. Orders will only be confirmed after successful payment processing.
                    </p>
                    <p>
                        We reserve the right to cancel or refuse any order if fraudulent activity or incorrect information is detected.
                    </p>
                </div>

                <div className="policy-section">
                    <h2>6. Refunds</h2>
                    <p>
                        Refund requests must follow the conditions described in our Refund Policy. Customers may request refunds within the specified time period according to the refund rules provided on our platform.
                    </p>
                    <p>
                        All refund requests are subject to review and approval.
                    </p>
                </div>

                <div className="policy-section">
                    <h2>7. Intellectual Property</h2>
                    <p>
                        All content available on this website, including text, graphics, design, logos, and platform features, is the property of the platform owner or its licensors.
                    </p>
                    <p>
                        Users may not copy, reproduce, distribute, or modify any content from this website without prior permission.
                    </p>
                    <p>
                        Unauthorized use of website content may result in legal action.
                    </p>
                </div>

                <div className="policy-section">
                    <h2>8. Limitation of Liability</h2>
                    <p>
                        We make reasonable efforts to ensure that the website functions properly and provides accurate information. However, we are not responsible for any damages, losses, or issues that may arise from the use of the website or the purchase of products.
                    </p>
                    <p>
                        Users access and use the website at their own risk.
                    </p>
                </div>

                <div className="policy-section">
                    <h2>9. Third-Party Services</h2>
                    <p>
                        Our website may use third-party services such as payment gateways or external service providers to process transactions or provide certain features.
                    </p>
                    <p>
                        These services may have their own terms and privacy policies, and users are encouraged to review them before using those services.
                    </p>
                </div>

                <div className="policy-section">
                    <h2>10. Changes to Terms and Conditions</h2>
                    <p>
                        We reserve the right to modify or update these Terms and Conditions at any time. Any updates will be posted on this page.
                    </p>
                    <p>
                        Continued use of the website after changes have been made will be considered acceptance of the updated terms.
                    </p>
                </div>

                <div className="policy-section">
                    <h2>11. Contact Information</h2>
                    <p>
                        If you have any questions regarding these Terms and Conditions, you may contact our support team for assistance.
                    </p>
                </div>
            </main>
        </div>
    );
}
