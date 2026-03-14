"use client";
import React from "react";

export default function RefundPolicy() {
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
                .divider {
                    height: 1px;
                    background: #eee;
                    margin: 2rem 0;
                }
            `}</style>

            <main className="policy-container">
                <div className="header-area">
                    <span className="policy-subtitle">Information & Guidelines</span>
                    <h1 className="policy-title">
                        Refund & <span className="text-[#F7941E] italic serif-font font-medium">Cancellation</span>
                    </h1>
                </div>

                <div className="policy-section">
                    <h2>1. Introduction</h2>
                    <p>
                        This Refund & Cancellation Policy outlines the terms and conditions under which customers may request refunds or cancellations for book purchases made through our platform. Our website provides customers with the ability to purchase books through a secure online ordering system.
                    </p>
                    <p>
                        We aim to provide a transparent and fair purchase experience for all customers. This policy explains the eligibility criteria, refund request process, processing timelines, and situations where refunds may not be granted.
                    </p>
                    <p>
                        By placing an order and purchasing books through our website, you acknowledge that you have read, understood, and agreed to this Refund & Cancellation Policy.
                    </p>
                </div>

                <div className="policy-section">
                    <h2>2. Eligibility for Refund</h2>
                    <p>
                        Customers may request a refund for a purchased book under the following conditions:
                    </p>
                    <ul>
                        <li>The refund request must be submitted within <strong>7 days from the date of purchase</strong>.</li>
                        <li>The order must be placed through our official website.</li>
                        <li>The request must include valid order details such as <strong>Order ID or transaction reference</strong>.</li>
                        <li>Refund eligibility will be determined after reviewing the request submitted by the customer.</li>
                    </ul>
                    <p>
                        All refund requests are carefully reviewed by our support team. Approval of a refund request is subject to verification of the order details and compliance with the terms outlined in this policy.
                    </p>
                </div>

                <div className="policy-section">
                    <h2>3. Order Cancellation</h2>
                    <p>
                        Customers may request cancellation of their order by contacting our support team. Cancellation requests should be submitted as soon as possible after placing the order.
                    </p>
                    <p>
                        If the cancellation request is approved, the order will be cancelled and the refund process will be initiated according to the refund processing guidelines mentioned in this policy.
                    </p>
                    <p>
                        Please note that cancellation approval may depend on the current status of the order.
                    </p>
                </div>

                <div className="policy-section">
                    <h2>4. Refund Request Process</h2>
                    <p>
                        To request a refund, customers must contact our support team and provide the following information:
                    </p>
                    <ul>
                        <li>Registered email address used during purchase</li>
                        <li>Order ID or transaction ID</li>
                        <li>Date of purchase</li>
                        <li>Reason for requesting the refund</li>
                    </ul>
                    <p>
                        Customers may submit their refund request through our support email or customer support contact channel.
                    </p>
                    <p>
                        After receiving the request, our team will review the submitted information and may contact the customer if additional details are required.
                    </p>
                </div>

                <div className="policy-section">
                    <h2>5. Refund Processing</h2>
                    <p>
                        If the refund request is approved by our team, the refund will be processed according to the following terms:
                    </p>
                    <ul>
                        <li>The refund will be issued to the <strong>original payment method used during the purchase</strong>.</li>
                        <li>Processing time may vary depending on the <strong>payment gateway, bank, or financial institution</strong> involved in the transaction.</li>
                        <li>Once the refund has been initiated, customers will receive confirmation from our support team.</li>
                    </ul>
                    <p>
                        Please note that it may take several business days for the refunded amount to reflect in the customer's account depending on the payment provider.
                    </p>
                </div>

                <div className="policy-section">
                    <h2>6. Non-Refundable Situations</h2>
                    <p>
                        Refund requests may not be approved in the following situations:
                    </p>
                    <ul>
                        <li>The refund request is submitted <strong>after 7 days from the date of purchase</strong>.</li>
                        <li>The order details provided by the customer are incomplete, incorrect, or cannot be verified.</li>
                        <li>The refund request violates our platform policies or purchase terms.</li>
                        <li>Any attempt to misuse or abuse the refund policy.</li>
                    </ul>
                    <p>
                        Our platform reserves the right to reject refund requests that do not meet the eligibility requirements mentioned in this policy.
                    </p>
                </div>

                <div className="policy-section">
                    <h2>7. Customer Responsibility</h2>
                    <p>
                        Customers are responsible for providing accurate information while placing an order on the website. Incorrect information such as wrong email address, incorrect payment details, or incomplete order information may affect refund eligibility.
                    </p>
                    <p>
                        Customers are encouraged to carefully review their order details before completing the purchase.
                    </p>
                </div>

                <div className="policy-section">
                    <h2>8. Contact Information</h2>
                    <p>
                        If you have any questions regarding this Refund & Cancellation Policy or would like to request a refund, you may contact our support team.
                    </p>
                    <p>
                        Please include the necessary order information when submitting your request so that our team can assist you more efficiently.
                    </p>
                </div>

                <div className="policy-section">
                    <h2>9. Policy Updates</h2>
                    <p>
                        We reserve the right to modify, update, or change this Refund & Cancellation Policy at any time without prior notice. Any updates to this policy will be published on this page.
                    </p>
                    <p>
                        Customers are encouraged to review this page periodically to stay informed about the latest policy terms.
                    </p>
                </div>
            </main>
        </div>
    );
}
