import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// In-memory rate limiting (clears on restart)
const rateLimitMap = new Map<string, number>();
const RATE_LIMIT_MS = 30 * 1000; // 30s window for feedback

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { type, description, screenshotUrls, metadata } = body;

        // Rate limiting
        const ip = req.headers.get('x-forwarded-for') || 'anonymous';
        const nowTime = Date.now();
        const lastRequest = rateLimitMap.get(ip);

        if (lastRequest && (nowTime - lastRequest < RATE_LIMIT_MS)) {
            return NextResponse.json(
                { error: 'Too many submissions. Please wait 30s.' },
                { status: 429 }
            );
        }
        rateLimitMap.set(ip, nowTime);

        // Validation
        if (!type || !description) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        // 登录校验 (虽然 RLS 也会拦截，但这里加一层报错更友好)
        if (!user) {
            return NextResponse.json(
                { error: 'Authentication required' },
                { status: 401 }
            );
        }

        // Generate Reference Number (FB-YMMDDxxxx)
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
        const refId = `FB-${y}${mm}${dd}${nanoid(4)}`;

        // Save to Supabase
        const { error: dbError } = await supabase
            .from('feedback_submissions')
            .insert([
                {
                    user_id: user.id,
                    type,
                    description,
                    screenshot_urls: screenshotUrls || [],
                    reference_number: refId,
                    metadata: metadata || {},
                },
            ]);

        if (dbError) {
            console.error('Database error:', dbError);
            return NextResponse.json(
                { error: 'Failed to save feedback' },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            referenceNumber: refId,
        });
    } catch (error) {
        console.error('Feedback API Error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
