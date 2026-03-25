"use client";
import React from "react";

export default function ShippingPolicy() {
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
                    <span className="policy-subtitle">Delivery & Logistics</span>
                    <h1 className="policy-title">
                        Shipping <span className="text-[#F7941E] italic serif-font font-medium">Policy</span>
                    </h1>
                </div>

                <div className="policy-section">
                    <h2>1. Shipping Overview</h2>
                    <p>
                        At Mindgym, we strive to deliver your orders accurately, in good condition, and always on time. We partner with reputable logistics providers like Shiprocket to ensure your curated books reach you safely.
                    </p>
                </div>

                <div className="policy-section">
                    <h2>2. Processing Timeline</h2>
                    <p>
                        All orders are processed within <strong>24-48 business hours</strong> of receipt. Orders placed on weekends or public holidays will be processed on the next business day.
                    </p>
                    <ul>
                        <li>Standard Processing: 1-2 Business Days</li>
                        <li>High Demand Periods: 2-3 Business Days</li>
                    </ul>
                </div>

                <div className="policy-section">
                    <h2>3. Estimated Delivery Times</h2>
                    <p>
                        Once shipped, the estimated delivery time depends on your location within India:
                    </p>
                    <ul>
                        <li><strong>Metros:</strong> 2-4 business days</li>
                        <li><strong>Rest of India:</strong> 3-7 business days</li>
                        <li><strong>Remote Locations:</strong> Up to 10 business days</li>
                    </ul>
                    <p>Please note that these are estimated timelines and actual delivery may vary based on carrier availability and external factors.</p>
                </div>

                <div className="policy-section">
                    <h2>4. Shipping Charges</h2>
                    <p>
                        Shipping costs are calculated based on order weight, dimensions, and the delivery destination.
                    </p>
                    <ul>
                        <li><strong>Free Shipping:</strong> Eligible on orders above a specified threshold (currently ₹999).</li>
                        <li><strong>Standard Shipping:</strong> A flat or calculated fee applied to orders below the FREE shipping threshold.</li>
                    </ul>
                    <p>Final shipping charges are displayed during the checkout process before payment is initialized.</p>
                </div>

                <div className="policy-section">
                    <h2>5. Order Tracking</h2>
                    <p>
                        Once your order is dispatched, you will receive an email containing your tracking number and a direct link to the logistics provider's website. You can also track your order status in real-time within the <strong>User Dashboard</strong> under the "My Orders" tab.
                    </p>
                </div>

                <div className="policy-section">
                    <h2>6. Delivery Failures & RTO</h2>
                    <p>
                        Our partners will make three delivery attempts. If the package remains undelivered due to an incorrect address, unavailability, or refusal, it will be returned to our warehouse (RTO).
                    </p>
                    <p>In such cases, we will contact you for rescheduling, and additional shipping charges may apply.</p>
                </div>

                <div className="policy-section">
                    <h2>7. Damaged Shipments</h2>
                    <p>
                        If you receive a package that is visibly damaged, please take clear photographs before opening it and contact our support team within 24 hours at <strong>support@mindgym.com</strong>.
                    </p>
                </div>

                <div className="policy-section">
                    <h2>8. Contact Information</h2>
                    <p>
                        For any queries regarding shipping or tracking, please reach out to our support team through the in-app ticketing system or library-support email.
                    </p>
                </div>
            </main>
        </div>
    );
}
