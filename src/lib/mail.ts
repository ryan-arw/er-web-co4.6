import nodemailer from 'nodemailer';
import { resend } from './resend';
import { createClient } from './supabase/server';
import { render } from '@react-email/render';
import React from 'react';

// SMTP Transport for HostGator
const smtpTransporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '465'),
    secure: process.env.SMTP_SECURE === 'true' || process.env.SMTP_PORT === '465',
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

export type EmailType =
    | 'order_confirmation'
    | 'order_shipped'
    | 'contact_notification'
    | 'low_stock_alert';

interface DispatchEmailOptions {
    emailType: EmailType;
    to: string;
    subject: string;
    reactTemplate: React.ReactElement;
    metadata?: Record<string, any>;
    fromName?: string;
    replyTo?: string;
}

/**
 * Unified Email Dispatcher
 * Dispatches email via Resend or HostGator SMTP based on database settings.
 */
export async function dispatchEmail({
    emailType,
    to,
    subject,
    reactTemplate,
    metadata = {},
    fromName = 'EzyRelife',
    replyTo,
}: DispatchEmailOptions) {
    const { supabaseAdmin } = await import('./supabase/admin');

    // 1. Fetch provider setting from DB
    const { data: setting, error: settingsError } = await supabaseAdmin
        .from('email_provider_settings')
        .select('provider, is_enabled')
        .eq('email_type', emailType)
        .single();

    if (settingsError || !setting) {
        console.warn(`[Mail] No settings found for ${emailType}. Defaulting to Resend.`);
    }

    const provider = setting?.provider || 'resend';
    const isEnabled = setting?.is_enabled ?? true;

    if (!isEnabled || provider === 'off') {
        console.log(`[Mail] Email ${emailType} is disabled or set to off.`);
        return { success: true, provider: 'off' };
    }

    let resultStatus: 'sent' | 'failed' = 'failed';
    let errorMessage: string | null = null;
    let externalId: string | null = null;

    try {
        if (provider === 'resend') {
            const { data: resendData, error: resendError } = await resend.emails.send({
                from: `${fromName} <noreply@send.ezyrelife.com>`,
                to: [to],
                subject: subject,
                react: reactTemplate,
                replyTo: 'support@ezyrelife.com', // Added Reply-To
            });

            if (resendError) {
                errorMessage = resendError.message;
            } else {
                resultStatus = 'sent';
                externalId = resendData?.id || null;
            }
        } else if (provider === 'hostgator_smtp') {
            // Render React Email to HTML string
            const html = await render(reactTemplate);

            const info = await smtpTransporter.sendMail({
                from: `${fromName} <${process.env.SMTP_USER}>`,
                to: to,
                subject: subject,
                html: html,
                replyTo: 'support@ezyrelife.com', // Added Reply-To
            });

            resultStatus = 'sent';
            externalId = info.messageId;
        }
    } catch (err: any) {
        console.error(`[Mail] Error sending via ${provider}:`, err);
        errorMessage = err.message;
    }

    // 2. Audit Log
    try {
        await supabaseAdmin.from('email_logs').insert({
            email_type: emailType,
            provider: provider,
            to_email: to,
            subject: subject,
            status: resultStatus,
            error_message: errorMessage,
            metadata: {
                ...metadata,
                external_id: externalId,
            },
        });
    } catch (auditError) {
        console.error('[Mail] Failed to write audit log:', auditError);
    }

    return {
        success: resultStatus === 'sent',
        provider,
        error: errorMessage
    };
}
