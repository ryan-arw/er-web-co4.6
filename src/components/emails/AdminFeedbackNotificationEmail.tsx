import {
    Body,
    Container,
    Head,
    Heading,
    Hr,
    Html,
    Img,
    Link,
    Preview,
    Section,
    Text,
} from '@react-email/components';
import * as React from 'react';

interface AdminFeedbackNotificationEmailProps {
    referenceNumber: string;
    customerEmail: string;
    type: string;
    description: string;
    imageUrl?: string | null;
}

export const AdminFeedbackNotificationEmail = ({
    referenceNumber,
    customerEmail,
    type,
    description,
    imageUrl,
}: AdminFeedbackNotificationEmailProps) => (
    <Html>
        <Head />
        <Preview>New User Feedback: {referenceNumber}</Preview>
        <Body style={main}>
            <Container style={container}>
                <Section style={contentWrapper}>
                    <Heading style={h1}>📝 New User Feedback</Heading>
                    <Text style={text}>
                        A user has submitted feedback via the Feedback Center.
                    </Text>

                    <Hr style={hr} />

                    <Section style={infoRow}>
                        <Text style={label}>Reference ID:</Text>
                        <Text style={value}>{referenceNumber}</Text>
                    </Section>

                    <Section style={infoRow}>
                        <Text style={label}>From User:</Text>
                        <Text style={value}>{customerEmail}</Text>
                    </Section>

                    <Section style={infoRow}>
                        <Text style={label}>Feedback Type:</Text>
                        <Text style={value}>{type}</Text>
                    </Section>

                    <Hr style={hr} />

                    <Text style={sectionTitle}>Description:</Text>
                    <Text style={messageBox}>{description}</Text>

                    {imageUrl && (
                        <>
                            <Hr style={hr} />
                            <Text style={sectionTitle}>Attached Screenshot:</Text>
                            <Link href={imageUrl} target="_blank">
                                <Img
                                    src={imageUrl}
                                    alt="User Feedback Screenshot"
                                    style={feedbackImage}
                                />
                            </Link>
                        </>
                    )}

                    <Hr style={hr} />
                    <Text style={footer}>
                        Check the admin portal for more details and management.
                    </Text>
                </Section>
            </Container>
        </Body>
    </Html>
);

export default AdminFeedbackNotificationEmail;

const main = {
    backgroundColor: '#f6f9fc',
    fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
    backgroundColor: '#ffffff',
    margin: '0 auto',
    maxWidth: '600px',
    borderRadius: '8px',
    border: '1px solid #e6ebf1',
    marginBottom: '64px',
};

const contentWrapper = {
    padding: '40px 48px',
};

const h1 = {
    color: '#1a1a1a',
    fontSize: '24px',
    fontWeight: 'bold',
    margin: '0 0 16px',
};

const text = {
    color: '#444',
    fontSize: '16px',
    lineHeight: '24px',
    margin: '0',
};

const sectionTitle = {
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#888',
    textTransform: 'uppercase' as const,
    marginBottom: '8px',
};

const infoRow = {
    marginBottom: '16px',
};

const label = {
    fontSize: '11px',
    color: '#999',
    textTransform: 'uppercase' as const,
    margin: '0 0 4px 0',
};

const value = {
    fontSize: '15px',
    color: '#1a1a1a',
    margin: '0',
    fontWeight: 'bold',
};

const messageBox = {
    fontSize: '14px',
    color: '#333',
    backgroundColor: '#f9fafb',
    padding: '20px',
    borderRadius: '12px',
    border: '1px solid #eee',
    lineHeight: '1.6',
    margin: '8px 0',
};

const feedbackImage = {
    borderRadius: '8px',
    marginTop: '12px',
    maxWidth: '100%',
    border: '1px solid #eee',
};

const hr = {
    borderColor: '#e6ebf1',
    margin: '24px 0',
};

const footer = {
    color: '#9ca3af',
    fontSize: '12px',
    textAlign: 'center' as const,
    marginTop: '32px',
};
