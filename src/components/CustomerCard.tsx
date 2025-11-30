"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { User, Calendar, AlertCircle, Pencil, Phone } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Customer } from "@/types";

interface CustomerCardProps {
    customer: Customer;
    variant?: "default" | "overdue" | "today";
    onEdit?: (customer: Customer) => void;
}

export default function CustomerCard({ customer, variant = "default", onEdit }: CustomerCardProps) {
    const isDebtor = customer.balance > 0;
    const badge = {
        default: "bg-blue-50 text-blue-700 border border-blue-100",
        overdue: "bg-red-50 text-red-700 border border-red-100",
        today: "bg-amber-50 text-amber-700 border border-amber-100",
    }[variant];

    const variantStyles = {
        default: "hover:border-blue-200 hover:shadow-blue-100",
        overdue: "border-red-200 bg-red-50/40 hover:border-red-300 hover:shadow-red-100",
        today: "border-amber-200 bg-amber-50/40 hover:border-amber-300 hover:shadow-amber-100",
    };

    return (
        <div className="relative group">
            <Link href={`/customer/${customer.id}`}>
                <Card className={cn(
                    "transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md hover:-translate-y-0.5",
                    variantStyles[variant]
                )}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-bold flex items-center gap-2 text-slate-700">
                            <div className={cn("p-1.5 rounded-md bg-slate-100 text-slate-600")}>
                                <User className="h-4 w-4" />
                            </div>
                            {customer.name}
                        </CardTitle>
                        <div
                            className={cn(
                                "text-sm font-bold px-2.5 py-1 rounded-full",
                                isDebtor ? "bg-red-100 text-red-700" : "bg-emerald-100 text-emerald-700"
                            )}
                        >
                            {formatCurrency(customer.balance)}
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="text-xs text-muted-foreground flex items-center gap-2">
                            <Phone className="h-3.5 w-3.5" />
                            {customer.phone || "Sem telefone"}
                        </div>

                        {customer.nextPaymentDate && (
                            <div className={cn(
                                "mt-2 flex items-center gap-2 text-xs font-medium rounded-full px-2 py-1 w-fit",
                                badge
                            )}>
                                {variant === "overdue" ? <AlertCircle className="h-3.5 w-3.5" /> : <Calendar className="h-3.5 w-3.5" />}
                                <span>
                                    {variant === "overdue" ? "Atrasado: " : variant === "today" ? "Vence hoje: " : "Cobrança: "}
                                    {new Date(customer.nextPaymentDate).toLocaleDateString("pt-BR")}
                                </span>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </Link>
            {onEdit && (
                <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-14 opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 text-slate-400 hover:text-blue-600 hover:bg-blue-50"
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onEdit(customer);
                    }}
                >
                    <Pencil className="h-4 w-4" />
                </Button>
            )}
        </div>
    );
}
