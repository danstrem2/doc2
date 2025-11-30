import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const id = params.id;
        const customer = await prisma.customer.findUnique({
            where: { id },
            include: {
                transactions: {
                    orderBy: {
                        createdAt: 'desc',
                    },
                },
            },
        });

        if (!customer) {
            return NextResponse.json(
                { error: 'Customer not found' },
                { status: 404 }
            );
        }

        const totalSales = customer.transactions
            .filter((t) => t.type === 'SALE')
            .reduce((acc, curr) => acc + curr.amount, 0);

        const totalPayments = customer.transactions
            .filter((t) => t.type === 'PAYMENT')
            .reduce((acc, curr) => acc + curr.amount, 0);

        const balance = totalSales - totalPayments;

        return NextResponse.json({
            ...customer,
            balance,
        });
    } catch (error) {
        console.error('Error fetching customer:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}

export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const id = params.id;
        const body = await request.json();
        const { name, phone, nextPaymentDate } = body;

        const customer = await prisma.customer.update({
            where: { id },
            data: {
                name,
                phone,
                nextPaymentDate: nextPaymentDate ? new Date(nextPaymentDate) : null,
            },
        });

        return NextResponse.json(customer);
    } catch (error) {
        console.error('Error updating customer:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const id = params.id;

        // Delete transactions first (cascade usually handles this but let's be safe or rely on cascade if configured, but here we just delete customer and let prisma handle it if relation allows, otherwise we might need to delete transactions first manually if cascade isn't set in schema. In SQLite/Prisma default, we might need to be explicit or set onDelete: Cascade in schema. I didn't set it. So I should delete transactions first.)
        await prisma.transaction.deleteMany({
            where: { customerId: id },
        });

        await prisma.customer.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting customer:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
