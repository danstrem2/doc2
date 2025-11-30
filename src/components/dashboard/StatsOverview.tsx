import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { Customer } from "@/types";
import { ArrowUpCircle, ArrowDownCircle, Wallet } from "lucide-react";

interface StatsOverviewProps {
    customers: Customer[];
}

export default function StatsOverview({ customers }: StatsOverviewProps) {
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    let weeklySales = 0;
    let weeklyPayments = 0;
    let totalReceivable = 0;

    customers.forEach((c) => {
        if (c.balance > 0) totalReceivable += c.balance;

        c.transactions.forEach((t) => {
            const tDate = new Date(t.createdAt);
            if (tDate >= startOfWeek) {
                if (t.type === "SALE") weeklySales += t.amount;
                if (t.type === "PAYMENT") weeklyPayments += t.amount;
            }
        });
    });

    const coverage = weeklySales > 0 ? Math.min((weeklyPayments / weeklySales) * 100, 999) : 0;

    return (
        <div className="grid gap-4 md:grid-cols-3">
            <Card className="bg-white/80 shadow-sm hover:shadow-md transition-shadow border-slate-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-slate-500">Vendas da semana</CardTitle>
                    <ArrowUpCircle className="h-5 w-5 text-emerald-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-3xl font-bold text-slate-900">{formatCurrency(weeklySales)}</div>
                    <p className="text-xs text-muted-foreground mt-1">Contabiliza domingo até hoje.</p>
                </CardContent>
            </Card>

            <Card className="bg-white/80 shadow-sm hover:shadow-md transition-shadow border-slate-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-slate-500">Pagamentos recebidos</CardTitle>
                    <ArrowDownCircle className="h-5 w-5 text-blue-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-3xl font-bold text-slate-900">{formatCurrency(weeklyPayments)}</div>
                    <p className="text-xs text-muted-foreground mt-1">
                        Cobertura das vendas: {coverage.toFixed(0)}%
                    </p>
                </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-lg border-none">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-white/70">Total a receber</CardTitle>
                    <Wallet className="h-5 w-5 text-amber-300" />
                </CardHeader>
                <CardContent>
                    <div className="text-3xl font-bold">{formatCurrency(totalReceivable)}</div>
                    <p className="text-xs text-white/70 mt-1">Clientes ordenados por maior saldo devedor.</p>
                </CardContent>
            </Card>
        </div>
    );
}
