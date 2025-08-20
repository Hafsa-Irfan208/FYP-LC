import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: 'smtp.zoho.com',
    port: 465,
    secure: true,
    auth: {
        user: 'leetconnect3@zohomail.com', 
        pass: 'U7cwXqjXjbpB', 
    },
});

/**
 * Send confirmation email
 * @param {string} to - Recipient's email address
 * @param {string} subject - Email subject
 * @param {string} html - HTML content for the email
 */
export const sendEmail = async (to, subject, html) => {
    try {
        await transporter.sendMail({
            from: '"LeetConnect" <leetconnect3@zohomail.com>', // Sender address
            to, // Recipient address
            subject, // Subject line
            html, // HTML body content
        });
        console.log(`Email sent to ${to}`);
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
};
