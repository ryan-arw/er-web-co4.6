import {
    Body,
    Container,
    Head,
    Heading,
    Hr,
    Html,
    Preview,
    Section,
    Text,
} from '@react-email/components';
import * as React from 'react';

interface ContactNotificationEmailProps {
    name: string;
    email: string;
    subject: string;
    message: string;
    referenceNumber: string;
}

export const ContactNotificationEmail = ({
    name,
    email,
    subject,
    message,
    referenceNumber,
}: ContactNotificationEmailProps) => (
    <Html>
        <Head />
        <Preview>New Contact Message: {subject}</Preview>
        <Body style={main}>
            <Container style={container}>
                <Heading style={h1}>New Contact Inquiry</Heading>
                <Text style={text}>
                    You have received a new message from the EzyRelife contact form.
                </Text>
                <Section style={section}>
                    <Text style={label}>Reference Number:</Text>
                    <Text style={value}>{referenceNumber}</Text>

                    <Text style={label}>From:</Text>
                    <Text style={value}>{name} ({email})</Text>

                    <Text style={label}>Subject:</Text>
                    <Text style={value}>{subject}</Text>

                    <Hr style={hr} />

                    <Text style={label}>Message:</Text>
                    <Text style={messageBox}>{message}</Text>
                </Section>
                <Text style={footer}>
                    Reply directly to {email} to respond to the customer.
                </Text>
            </Container>
        </Body>
    </Html>
);

export default ContactNotificationEmail;

const main = {
    backgroundColor: '#f6f9fc',
    fontFamily:
        '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
    backgroundColor: '#ffffff',
    margin: '0 auto',
    padding: '20px 0 48px',
    marginBottom: '64px',
};

const h1 = {
    color: '#333',
    fontSize: '24px',
    fontWeight: 'bold',
    padding: '0 48px',
};

const text = {
    color: '#555',
    fontSize: '16px',
    lineHeight: '24px',
    padding: '0 48px',
};

const section = {
    padding: '0 48px',
};

const label = {
    fontSize: '12px',
    color: '#888',
    textTransform: 'uppercase' as const,
    marginBottom: '4px',
    marginTop: '20px',
};

const value = {
    fontSize: '16px',
    color: '#333',
    margin: '0',
    fontWeight: 'bold',
};

const messageBox = {
    fontSize: '14px',
    color: '#333',
    backgroundColor: '#f9f9f9',
    padding: '16px',
    borderRadius: '8px',
    border: '1px solid #eee',
    lineHeight: '1.6',
};

const hr = {
    borderColor: '#e6ebf1',
    margin: '20px 0',
};

const footer = {
    color: '#8898aa',
    fontSize: '12px',
    lineHeight: '16px',
    padding: '0 48px',
    marginTop: '32px',
};
