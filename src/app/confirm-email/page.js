'use client';

import { useEffect, useState } from 'react';

export default function ConfirmEmailPage() {
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const confirmEmail = async () => {
            const urlParams = new URLSearchParams(window.location.search);
            const token = urlParams.get('token');

            if (!token) {
                setMessage('Invalid token');
                setLoading(false);
                return;
            }

            try {
                const response = await fetch(`/api/confirm-email?token=${token}`);

                if (!response.ok) {
                    const errorData = await response.json();
                    setMessage(errorData.message || 'Confirmation failed');
                } else {
                    setMessage('Email confirmed successfully!');
                }
            } catch (error) {
                console.error('Error confirming email:', error);
                setMessage('An error occurred. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        confirmEmail();
    }, []);

    if (loading) {
        return <p>Loading...</p>;
    }

    return <p>{message}</p>;
}
