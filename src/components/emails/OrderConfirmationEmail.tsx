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

interface OrderItem {
    name: string;
    quantity: number;
    price: string;
}

interface OrderConfirmationEmailProps {
    customerName: string;
    orderNumber: string;
    orderDate: string;
    items: OrderItem[];
    totalAmount: string;
    shippingAddress: any;
}

export const OrderConfirmationEmail = ({
    customerName,
    orderNumber,
    orderDate,
    items,
    totalAmount,
    shippingAddress,
}: OrderConfirmationEmailProps) => {
    return (
        <Html>
            <Head />
            <Preview>Order Confirmation - #{orderNumber}</Preview>
            <Body style={main}>
                <Container style={container}>
                    <Section style={header}>
                        <Heading style={h1}>Thank You for Your Order!</Heading>
                        <Text style={text}>
                            Hi {customerName}, we've received your order and are getting it ready for shipment.
                        </Text>
                    </Section>

                    <Hr style={hr} />

                    <Section style={section}>
                        <Text style={heading}>Order Summary</Text>
                        <Text style={subtext}>Order Number: <strong>#{orderNumber}</strong></Text>
                        <Text style={subtext}>Date: {orderDate}</Text>

                        <div style={tableContainer}>
                            <table style={table}>
                                <thead>
                                    <tr>
                                        <th style={th}>Item</th>
                                        <th style={thCenter}>Qty</th>
                                        <th style={thRight}>Price</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {items.map((item, index) => (
                                        <tr key={index}>
                                            <td style={td}>{item.name}</td>
                                            <td style={tdCenter}>{item.quantity}</td>
                                            <td style={tdRight}>{item.price}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <Hr style={hrSmall} />

                        <div style={totalContainer}>
                            <Text style={totalText}>
                                <strong>Total: {totalAmount}</strong>
                            </Text>
                        </div>
                    </Section>

                    <Hr style={hr} />

                    <Section style={section}>
                        <Text style={heading}>Shipping Address</Text>
                        <div style={addressBox}>
                            {typeof shippingAddress === 'object' ? (
                                <>
                                    <Text style={addressText}><strong>{shippingAddress.name}</strong></Text>
                                    <Text style={addressText}>{shippingAddress.line1}</Text>
                                    {shippingAddress.line2 && <Text style={addressText}>{shippingAddress.line2}</Text>}
                                    <Text style={addressText}>{shippingAddress.city}, {shippingAddress.state} {shippingAddress.zip}</Text>
                                    <Text style={addressText}>{shippingAddress.country}</Text>
                                </>
                            ) : (
                                <Text style={addressText}>{shippingAddress}</Text>
                            )}
                        </div>
                    </Section>

                    <Section style={footer}>
                        <Text style={footerText}>
                            If you have any questions, please contact our support team at support@ezyrelife.com
                        </Text>
                        <Text style={footerText}>
                            © 2026 EzyRelife. All rights reserved.
                        </Text>
                    </Section>
                </Container>
            </Body>
        </Html>
    );
};

export default OrderConfirmationEmail;

const main = {
    backgroundColor: '#f6f9fc',
    fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
    backgroundColor: '#ffffff',
    margin: '0 auto',
    padding: '40px 20px',
    maxWidth: '600px',
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
};

const header = {
    textAlign: 'center' as const,
};

const h1 = {
    color: '#1a1a1a',
    fontSize: '28px',
    fontWeight: 'bold',
    margin: '30px 0',
};

const text = {
    color: '#4a4a4a',
    fontSize: '16px',
    lineHeight: '1.6',
};

const subtext = {
    color: '#666',
    fontSize: '14px',
    margin: '4px 0',
};

const section = {
    padding: '20px 0',
};

const heading = {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: '15px',
};

const hr = {
    borderColor: '#e6ebf1',
    margin: '30px 0',
};

const hrSmall = {
    borderColor: '#f0f0f0',
    margin: '15px 0',
};

const tableContainer = {
    marginTop: '20px',
};

const table = {
    width: '100%',
    borderCollapse: 'collapse' as const,
};

const th = {
    textAlign: 'left' as const,
    fontSize: '12px',
    color: '#888',
    textTransform: 'uppercase' as const,
    paddingBottom: '10px',
};

const thCenter = { ...th, textAlign: 'center' as const };
const thRight = { ...th, textAlign: 'right' as const };

const td = {
    padding: '12px 0',
    fontSize: '14px',
    color: '#333',
    borderBottom: '1px solid #f9f9f9',
};

const tdCenter = { ...td, textAlign: 'center' as const };
const tdRight = { ...td, textAlign: 'right' as const };

const totalContainer = {
    textAlign: 'right' as const,
    marginTop: '10px',
};

const totalText = {
    fontSize: '18px',
    color: '#1a1a1a',
};

const addressBox = {
    padding: '16px',
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
    border: '1px solid #e6ebf1',
};

const addressText = {
    fontSize: '14px',
    color: '#4a4a4a',
    margin: '2px 0',
    lineHeight: '1.4',
};

const footer = {
    textAlign: 'center' as const,
    marginTop: '40px',
};

const footerText = {
    color: '#8898aa',
    fontSize: '12px',
    lineHeight: '1.5',
    margin: '8px 0',
};
