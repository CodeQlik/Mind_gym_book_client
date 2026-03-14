"use client";
import React from "react";

export default function ReturnPolicy() {
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
                        Return <span className="text-[#F7941E] italic serif-font font-medium">Policy</span>
                    </h1>
                </div>

                <div className="policy-section">
                    <h2>1. Introduction</h2>
                    <p>
                        This Return Policy explains the conditions under which customers may request a return related to book purchases made through our platform. Our platform provides books through an online purchasing system, and this policy is designed to ensure transparency and fairness for all customers.
                    </p>
                    <p>
                        By purchasing books from our website, customers agree to the terms outlined in this Return Policy.
                    </p>
                </div>

                <div className="policy-section">
                    <h2>2. Return Eligibility</h2>
                    <p>
                        Customers may request a return for a purchased book under the following conditions:
                    </p>
                    <ul>
                        <li>The return request must be submitted within <strong>7 days from the date of purchase</strong>.</li>
                        <li>The request must include valid order information such as <strong>Order ID or transaction reference</strong>.</li>
                        <li>The request will be reviewed and verified by our support team before approval.</li>
                    </ul>
                    <p>
                        Only requests that meet the eligibility criteria will be considered for further processing.
                    </p>
                </div>

                <div className="policy-section">
                    <h2>3. Return Request Process</h2>
                    <p>
                        To request a return, customers must contact our support team and provide the following details:
                    </p>
                    <ul>
                        <li>Registered email address</li>
                        <li>Order ID or transaction ID</li>
                        <li>Date of purchase</li>
                        <li>Reason for the return request</li>
                    </ul>
                    <p>
                        After receiving the request, our support team will review the request and verify the purchase details before proceeding further.
                    </p>
                </div>

                <div className="policy-section">
                    <h2>2. Return Approval</h2>
                    <p>
                        Once the return request has been reviewed:
                    </p>
                    <ul>
                        <li>If the request is approved, the return process will be initiated.</li>
                        <li>The customer will receive confirmation regarding the approval of the return request.</li>
                        <li>After approval, the refund process will be initiated according to the platform's refund policy.</li>
                    </ul>
                </div>

                <div className="policy-section">
                    <h2>5. Non-Returnable Situations</h2>
                    <p>
                        Return requests may not be approved in the following situations:
                    </p>
                    <ul>
                        <li>The return request is made <strong>after 7 days from the purchase date</strong>.</li>
                        <li>The order information provided by the customer is incomplete or incorrect.</li>
                        <li>The request violates the platform’s policies or purchase terms.</li>
                        <li>Any misuse or abuse of the return system.</li>
                    </ul>
                </div>

                <div className="policy-section">
                    <h2>6. Customer Responsibility</h2>
                    <p>
                        Customers are responsible for providing correct order details when submitting a return request. Incorrect or incomplete information may delay or prevent the return process.
                    </p>
                    <p>
                        Customers are advised to review all purchase details carefully before placing an order on the website.
                    </p>
                </div>

                <div className="policy-section">
                    <h2>7. Contact Support</h2>
                    <p>
                        If customers need assistance with a return request, they may contact our support team and provide their order details for faster resolution.
                    </p>
                    <p>
                        Our support team will review the request and provide guidance regarding the return and refund process.
                    </p>
                </div>

                <div className="policy-section">
                    <h2>8. Policy Updates</h2>
                    <p>
                        We reserve the right to modify or update this Return Policy at any time. Any updates to this policy will be reflected on this page.
                    </p>
                    <p>
                        Customers are encouraged to review this page periodically to stay informed about our latest policies.
                    </p>
                </div>
            </main>
        </div>
    );
}
