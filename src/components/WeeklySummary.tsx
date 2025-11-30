"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { startOfWeek, endOfWeek, isWithinInterval } from "date-fns";

interface Transaction {
    amount: number;
    type: string;
    createdAt: string | Date;
}

interface Customer {
    transactions: Transaction[];
}

interface WeeklySummaryProps {
    customers: Customer[];
}

export default function WeeklySummary({ customers }: WeeklySummaryProps) {
    const now = new Date();
    const start = startOfWeek(now, { weekStartsOn: 0 });
    const end = endOfWeek(now, { weekStartsOn: 0 });

    let weeklySales = 0;
    let weeklyPayments = 0;

    customers.forEach((customer) => {
        customer.transactions.forEach((t) => {
            const date = new Date(t.createdAt);
            if (isWithinInterval(date, { start, end })) {
                if (t.type === "SALE") {
                    weeklySales += t.amount;
                } else if (t.type === "PAYMENT") {
                    weeklyPayments += t.amount;
                }
            }
        });
    });

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Vendas da semana</CardTitle>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        className="h-4 w-4 text-muted-foreground"
                    >
                        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                    </svg>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{formatCurrency(weeklySales)}</div>
                    <p className="text-xs text-muted-foreground">
                        +20.1% em relação à semana passada
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Recebido da semana</CardTitle>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        className="h-4 w-4 text-muted-foreground"
                    >
                        <rect width="20" height="14" x="2" y="5" rx="2" />
                        <path d="M2 10h20" />
                    </svg>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{formatCurrency(weeklyPayments)}</div>
                    <p className="text-xs text-muted-foreground">
                        Meta semanal: {formatCurrency(weeklySales * 0.8)} (80%)
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
