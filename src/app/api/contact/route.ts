import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { resend } from '@/lib/resend';
import ContactNotificationEmail from '@/components/emails/ContactNotificationEmail';

// Simple in-memory rate limiting (Note: clears on server restart/deployment)
const rateLimitMap = new Map<string, number>();
const RATE_LIMIT_MS = 60 * 1000; // 1 minute window

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name, email, subject, orderNumber, message, _hp_website } = body;

        // 1. Honeypot Anti-Spam (方案 A)
        // If the hidden field is filled, it's likely a bot
        if (_hp_website) {
            console.log('🤖 Bot detected via Honeypot. Ignoring request.');
            return NextResponse.json({ success: true, referenceNumber: 'CF-SPAM-PROTECTED' });
        }

        // 2. Basic Rate Limiting (方案 B)
        const ip = req.headers.get('x-forwarded-for') || 'anonymous';
        const nowTime = Date.now();
        const lastRequest = rateLimitMap.get(ip);

        if (lastRequest && (nowTime - lastRequest < RATE_LIMIT_MS)) {
            const waitSeconds = Math.ceil((RATE_LIMIT_MS - (nowTime - lastRequest)) / 1000);
            return NextResponse.json(
                { error: `Too many requests. Please wait ${waitSeconds}s.` },
                { status: 429 }
            );
        }
        rateLimitMap.set(ip, nowTime);

        // 1. Validation
        if (!name || !email || !subject || !message) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        const supabase = await createClient();

        // 2. Generate Reference Number (CF-YMMDDxxxx)
        const now = new Date();
        const y = now.getFullYear().toString().slice(-1);
        const mm = (now.getMonth() + 1).toString().padStart(2, '0');
        const dd = now.getDate().toString().padStart(2, '0');

        const nanoid = (len: number) => {
            const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
            let result = '';
            for (let i = 0; i < len; i++) {
                result += chars.charAt(Math.floor(Math.random() * chars.length));
            }
            return result;
        };
        const refId = `CF-${y}${mm}${dd}${nanoid(4)}`;

        // 3. Save to Supabase
        const { data: dbData, error: dbError } = await supabase
            .from('contact_messages')
            .insert([
                {
                    name,
                    email,
                    subject,
                    message,
                    order_number: orderNumber || null,
                    reference_number: refId,
                    status: 'unread',
                },
            ])
            .select()
            .single();

        if (dbError) {
            console.error('Database insertion error:', dbError);
            return NextResponse.json(
                { error: 'Failed to save message' },
                { status: 500 }
            );
        }

        // 4. Send Email Notification via Resend
        try {
            console.log('--- Attempting to send email via Resend ---');
            console.log('To:', 'support@ezyrelife.com');
            console.log('Ref ID:', refId);

            const { data: emailData, error: emailError } = await resend.emails.send({
                from: 'EzyRelife <noreply@send.ezyrelife.com>',
                to: ['support@ezyrelife.com'],
                replyTo: email,
                subject: `[New Inquiry] ${subject} (${refId})`,
                react: ContactNotificationEmail({
                    name,
                    email,
                    subject,
                    message,
                    referenceNumber: refId,
                }),
            });

            if (emailError) {
                console.error('Resend API returned an error:', emailError);
            } else {
                console.log('Resend success! ID:', emailData?.id);
            }
        } catch (emailCatchError) {
            console.error('Critical failure in email sending loop:', emailCatchError);
        }

        return NextResponse.json({
            success: true,
            referenceNumber: refId,
        });
    } catch (error) {
        console.error('Contact API Error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
