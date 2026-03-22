import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, CreditCard, Lock, XCircle } from 'lucide-react';

const Payment = () => {
    const [paymentSuccess, setPaymentSuccess] = useState(false);
    const [paymentLoading, setPaymentLoading] = useState(false);
    const navigate = useNavigate();

    const handlePayment = () => {
        setPaymentLoading(true);
        setTimeout(() => {
            setPaymentSuccess(true);
            setPaymentLoading(false);
            navigate('/admin');
        }, 3000);
    };

    return (
        <div style={styles.container}>
            {paymentSuccess ? (
                <div style={styles.successContainer}>
                    <CheckCircle size={60} color="#4BB543" />
                    <h2 style={styles.successTitle}>Payment Successful!</h2>
                    <p style={styles.successMessage}>Redirecting to your dashboard...</p>
                </div>
            ) : (
                <div style={styles.paymentContainer}>
                    <h2 style={styles.title}>Complete Your Payment</h2>
                    <p style={styles.subtitle}>Enter your payment details below to continue.</p>
                    <div style={styles.paymentMethods}>
                        <button style={styles.paymentButton}>
                            <CreditCard size={20} /> Credit Card
                        </button>
                        <button style={styles.paymentButton}>
                            <Lock size={20} /> PayPal
                        </button>
                    </div>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Card Number</label>
                        <input type="text" placeholder="**** **** **** ****" style={styles.input} />
                    </div>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Expiry Date</label>
                        <input type="text" placeholder="MM/YY" style={styles.input} />
                    </div>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>CVV</label>
                        <input type="text" placeholder="CVV" style={styles.input} />
                    </div>
                    <button style={styles.payButton} onClick={handlePayment} disabled={paymentLoading}>
                        {paymentLoading ? "Processing Payment..." : "Pay Now"}
                    </button>
                </div>
            )}
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: '#f0f2f5',
        padding: '20px',
    },
    paymentContainer: {
        background: '#fff',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        padding: '30px',
        width: '400px',
        maxWidth: '100%',
        textAlign: 'center',
    },
    successContainer: {
        background: '#fff',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        padding: '30px',
        width: '400px',
        maxWidth: '100%',
        textAlign: 'center',
    },
    title: {
        fontSize: '24px',
        fontWeight: 'bold',
        marginBottom: '15px',
        color: '#333',
    },
    successTitle: {
        fontSize: '24px',
        fontWeight: 'bold',
        marginBottom: '15px',
        color: '#4BB543',
    },
    successMessage: {
        fontSize: '16px',
        color: '#666',
    },
    subtitle: {
        fontSize: '16px',
        color: '#666',
        marginBottom: '30px',
    },
    paymentMethods: {
        display: 'flex',
        justifyContent: 'space-around',
        marginBottom: '20px',
    },
    paymentButton: {
        background: '#f0f0f0',
        border: 'none',
        borderRadius: '8px',
        padding: '10px 20px',
        cursor: 'pointer',
        fontSize: '14px',
        color: '#555',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
    },
    inputGroup: {
        marginBottom: '20px',
        textAlign: 'left',
    },
    label: {
        display: 'block',
        fontSize: '14px',
        color: '#333',
        marginBottom: '8px',
    },
    input: {
        width: '100%',
        padding: '12px',
        borderRadius: '8px',
        border: '1px solid #ddd',
        fontSize: '16px',
        outline: 'none',
    },
    payButton: {
        background: '#557a8c',
        color: '#fff',
        border: 'none',
        borderRadius: '8px',
        padding: '15px 30px',
        cursor: 'pointer',
        fontSize: '18px',
        fontWeight: 'bold',
        transition: 'background 0.3s ease',
    },
    error: {
        color: '#FF0000',
        marginBottom: '15px',
    },
};

export default Payment;