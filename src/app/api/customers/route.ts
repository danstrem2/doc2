import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
    try {
        const customers = await prisma.customer.findMany({
            include: {
                transactions: true,
            },
            orderBy: {
                name: 'asc',
            },
        });

        const customersWithBalance = customers.map((customer) => {
            const totalSales = customer.transactions
                .filter((t) => t.type === 'SALE')
                .reduce((acc, curr) => acc + curr.amount, 0);

            const totalPayments = customer.transactions
                .filter((t) => t.type === 'PAYMENT')
                .reduce((acc, curr) => acc + curr.amount, 0);

            const balance = totalSales - totalPayments;

            return {
                ...customer,
                balance,
            };
        });

        // Sort by balance descending (highest debt first)
        customersWithBalance.sort((a, b) => b.balance - a.balance);

        return NextResponse.json(customersWithBalance);
    } catch (error) {
        console.error('Error fetching customers:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, phone, nextPaymentDate } = body;

        if (!name) {
            return NextResponse.json(
                { error: 'Name is required' },
                { status: 400 }
            );
        }

        const customer = await prisma.customer.create({
            data: {
                name,
                phone,
                nextPaymentDate: nextPaymentDate ? new Date(nextPaymentDate) : null,
            },
        });

        return NextResponse.json(customer);
    } catch (error) {
        console.error('Error creating customer:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
