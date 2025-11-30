import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
    try {
        const settings = await prisma.settings.findUnique({
            where: { id: 'default' },
        });
        return NextResponse.json(settings || {});
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, appPassword, autoBackup } = body;

        const settings = await prisma.settings.upsert({
            where: { id: 'default' },
            update: { email, appPassword, autoBackup },
            create: { id: 'default', email, appPassword, autoBackup },
        });

        return NextResponse.json(settings);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 });
    }
}
