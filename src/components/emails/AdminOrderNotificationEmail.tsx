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

interface OrderItem {
    name: string;
    quantity: number;
    price: string;
}

interface AdminOrderNotificationEmailProps {
    orderNumber: string;
    customerEmail: string;
    totalAmount: string;
    orderDate: string;
    items: OrderItem[];
    shippingAddress: any;
}

export const AdminOrderNotificationEmail = ({
    orderNumber,
    customerEmail,
    totalAmount,
    orderDate,
    items,
    shippingAddress,
}: AdminOrderNotificationEmailProps) => (
    <Html>
        <Head />
        <Preview>New Order Received: #{orderNumber}</Preview>
        <Body style={main}>
            <Container style={container}>
                <Section style={contentWrapper}>
                    <Heading style={h1}>💰 New Order Received</Heading>
                    <Text style={text}>
                        A new order has been placed on EzyRelife.
                    </Text>

                    <Hr style={hr} />

                    <Section style={infoGrid}>
                        <div style={infoRow}>
                            <Text style={label}>Order Number:</Text>
                            <Text style={value}>#{orderNumber}</Text>
                        </div>
                        <div style={infoRow}>
                            <Text style={label}>Customer Email:</Text>
                            <Text style={value}>{customerEmail}</Text>
                        </div>
                    </Section>

                    <Hr style={hr} />

                    {/* Order Details Table */}
                    <Text style={sectionTitle}>Ordered Items</Text>
                    <table style={table}>
                        <thead>
                            <tr>
                                <th style={th}>Product</th>
                                <th style={thCenter}>Qty</th>
                                <th style={thRight}>Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item, idx) => (
                                <tr key={idx}>
                                    <td style={td}>{item.name}</td>
                                    <td style={tdCenter}>{item.quantity}</td>
                                    <td style={tdRight}>{item.price}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <Section style={totalBox}>
                        <Text style={totalLabel}>TOTAL AMOUNT</Text>
                        <Text style={totalValue}>{totalAmount}</Text>
                    </Section>

                    <Hr style={hr} />

                    <Text style={sectionTitle}>Shipping Address</Text>
                    <div style={addressBox}>
                        <Text style={addressText}><strong>{shippingAddress.name}</strong></Text>
                        <Text style={addressText}>{shippingAddress.line1}</Text>
                        {shippingAddress.line2 && <Text style={addressText}>{shippingAddress.line2}</Text>}
                        <Text style={addressText}>{shippingAddress.city}, {shippingAddress.state} {shippingAddress.zip}</Text>
                        <Text style={addressText}>{shippingAddress.country}</Text>
                        {shippingAddress.phone && <Text style={addressText}>📞 {shippingAddress.phone}</Text>}
                    </div>

                    <Hr style={hr} />
                    <Text style={footer}>
                        Please log in to the admin dashboard to process this order.
                    </Text>
                </Section>
            </Container>
        </Body>
    </Html>
);

export default AdminOrderNotificationEmail;

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
    marginBottom: '12px',
};

const infoGrid = {
    padding: '10px 0',
};

const infoRow = {
    marginBottom: '10px',
};

const label = {
    fontSize: '11px',
    color: '#999',
    textTransform: 'uppercase' as const,
    margin: '0',
};

const value = {
    fontSize: '15px',
    color: '#1a1a1a',
    margin: '0',
    fontWeight: 'bold',
};

const table = {
    width: '100%',
    borderCollapse: 'collapse' as const,
    marginBottom: '20px',
};

const th = {
    textAlign: 'left' as const,
    fontSize: '11px',
    color: '#888',
    textTransform: 'uppercase' as const,
    paddingBottom: '8px',
    borderBottom: '1px solid #eee',
};

const thCenter = { ...th, textAlign: 'center' as const };
const thRight = { ...th, textAlign: 'right' as const };

const td = {
    padding: '10px 0',
    fontSize: '14px',
    color: '#333',
    borderBottom: '1px solid #f9f9f9',
};

const tdCenter = { ...td, textAlign: 'center' as const };
const tdRight = { ...td, textAlign: 'right' as const };

const totalBox = {
    backgroundColor: '#fef3f2',
    padding: '16px',
    borderRadius: '8px',
    textAlign: 'right' as const,
    margin: '10px 0',
};

const totalLabel = {
    fontSize: '10px',
    fontWeight: 'black',
    color: '#b91c1c',
    margin: '0',
};

const totalValue = {
    fontSize: '20px',
    fontWeight: 'black',
    color: '#b91c1c',
    margin: '0',
};

const addressBox = {
    padding: '16px',
    backgroundColor: '#f9fafb',
    borderRadius: '8px',
    border: '1px solid #eee',
};

const addressText = {
    fontSize: '13px',
    color: '#444',
    margin: '2px 0',
    lineHeight: '1.4',
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
