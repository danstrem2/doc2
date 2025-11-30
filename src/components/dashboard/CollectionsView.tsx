"use client";

import { useState } from "react";
import CustomerCard from "@/components/CustomerCard";
import { Customer } from "@/types";
import { AlertCircle, CalendarCheck, CalendarClock, Calendar, X, CheckCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface CollectionsViewProps {
    customers: Customer[];
    onEditCustomer: (customer: Customer) => void;
}

export default function CollectionsView({ customers, onEditCustomer }: CollectionsViewProps) {
    const today = new Date().toISOString().split("T")[0];
    const [selectedDate, setSelectedDate] = useState("");

    if (selectedDate) {
        const filtered = customers.filter((c) => {
            if (!c.nextPaymentDate || c.balance <= 0) return false;
            const date = new Date(c.nextPaymentDate).toISOString().split("T")[0];
            return date === selectedDate;
        });

        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-slate-200">
                    <div className="flex items-center gap-4">
                        <div className="p-2 bg-blue-100 rounded-full">
                            <Calendar className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-slate-800">Filtrando por data</h2>
                            <p className="text-sm text-slate-500">
                                Cobranças para {new Date(selectedDate).toLocaleDateString("pt-BR")}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="w-auto"
                        />
                        <Button variant="ghost" size="icon" onClick={() => setSelectedDate("")}>
                            <X className="w-4 h-4" />
                        </Button>
                    </div>
                </div>

                {filtered.length > 0 ? (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {filtered.map((customer) => (
                            <CustomerCard
                                key={customer.id}
                                customer={customer}
                                variant="default"
                                onEdit={onEditCustomer}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 bg-white rounded-xl border border-dashed border-slate-300">
                        <Calendar className="mx-auto h-12 w-12 text-slate-300" />
                        <h3 className="mt-2 text-sm font-semibold text-slate-900">Nada para este dia</h3>
                        <p className="mt-1 text-sm text-slate-500">Selecione outra data ou limpe o filtro.</p>
                    </div>
                )}
            </div>
        );
    }

    const overdue = customers.filter((c) => {
        if (!c.nextPaymentDate || c.balance <= 0) return false;
        const date = new Date(c.nextPaymentDate).toISOString().split("T")[0];
        return date < today;
    });

    const dueToday = customers.filter((c) => {
        if (!c.nextPaymentDate || c.balance <= 0) return false;
        const date = new Date(c.nextPaymentDate).toISOString().split("T")[0];
        return date === today;
    });

    const upcoming = customers.filter((c) => {
        if (!c.nextPaymentDate || c.balance <= 0) return false;
        const date = new Date(c.nextPaymentDate).toISOString().split("T")[0];
        return date > today;
    });

    const hasData = overdue.length + dueToday.length + upcoming.length > 0;

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between bg-blue-50/60 p-4 rounded-xl border border-blue-100">
                <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-blue-600" />
                    <span className="text-sm font-medium text-blue-900">Filtrar por data específica:</span>
                </div>
                <Input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-auto bg-white"
                />
            </div>

            {hasData ? (
                <>
                    {overdue.length > 0 && (
                        <section>
                            <div className="flex items-center gap-2 mb-4">
                                <div className="p-2 bg-red-100 rounded-full">
                                    <AlertCircle className="w-5 h-5 text-red-600" />
                                </div>
                                <h2 className="text-xl font-bold text-slate-800">Atrasados</h2>
                                <span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-1 rounded-full">
                                    {overdue.length}
                                </span>
                            </div>
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                {overdue.map((customer) => (
                                    <CustomerCard key={customer.id} customer={customer} variant="overdue" onEdit={onEditCustomer} />
                                ))}
                            </div>
                        </section>
                    )}

                    {dueToday.length > 0 && (
                        <section>
                            <div className="flex items-center gap-2 mb-4">
                                <div className="p-2 bg-amber-100 rounded-full">
                                    <CalendarCheck className="w-5 h-5 text-amber-600" />
                                </div>
                                <h2 className="text-xl font-bold text-slate-800">Cobrar hoje</h2>
                                <span className="bg-amber-100 text-amber-700 text-xs font-bold px-2 py-1 rounded-full">
                                    {dueToday.length}
                                </span>
                            </div>
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                {dueToday.map((customer) => (
                                    <CustomerCard key={customer.id} customer={customer} variant="today" onEdit={onEditCustomer} />
                                ))}
                            </div>
                        </section>
                    )}

                    {upcoming.length > 0 && (
                        <section>
                            <div className="flex items-center gap-2 mb-4">
                                <div className="p-2 bg-blue-100 rounded-full">
                                    <CalendarClock className="w-5 h-5 text-blue-600" />
                                </div>
                                <h2 className="text-xl font-bold text-slate-800">Próximos</h2>
                                <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-1 rounded-full">
                                    {upcoming.length}
                                </span>
                            </div>
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                {upcoming.map((customer) => (
                                    <CustomerCard key={customer.id} customer={customer} variant="default" onEdit={onEditCustomer} />
                                ))}
                            </div>
                        </section>
                    )}
                </>
            ) : (
                <div className="border border-dashed border-slate-200 rounded-2xl bg-white/70 p-8 text-center space-y-3">
                    <div className="mx-auto h-12 w-12 rounded-full bg-emerald-50 text-emerald-600 grid place-items-center">
                        <CheckCircle className="h-6 w-6" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900">Nenhuma cobrança pendente</h3>
                    <p className="text-sm text-slate-500">
                        Defina datas de cobrança ao editar um cliente para vê-los aqui.
                    </p>
                </div>
            )}
        </div>
    );
}
