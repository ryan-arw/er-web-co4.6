import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * GET: Fetch all email provider settings
 */
export async function GET() {
    try {
        const supabase = await createClient();
        const { data, error } = await supabase
            .from('email_provider_settings')
            .select('*')
            .order('display_name', { ascending: true });

        if (error) throw error;

        return NextResponse.json(data);
    } catch (error: any) {
        console.error('[Settings API] GET Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

/**
 * PUT: Update an email provider setting
 */
export async function PUT(req: Request) {
    try {
        const supabase = await createClient();
        const { email_type, provider } = await req.json();

        if (!email_type || !provider) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const { data, error } = await supabase
            .from('email_provider_settings')
            .update({
                provider,
                updated_at: new Date().toISOString()
            })
            .eq('email_type', email_type)
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json(data);
    } catch (error: any) {
        console.error('[Settings API] PUT Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
