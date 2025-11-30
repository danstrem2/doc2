"use client";

import { useMemo, useState } from "react";
import CustomerCard from "@/components/CustomerCard";
import { Customer } from "@/types";
import { Search, Users } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface CustomerListProps {
    customers: Customer[];
    loading: boolean;
    onCreate?: () => void;
}

export default function CustomerList({ customers, loading, onCreate }: CustomerListProps) {
    const [search, setSearch] = useState("");

    const filteredCustomers = useMemo(() => {
        return customers.filter((c) =>
            c.name.toLowerCase().includes(search.toLowerCase()) ||
            (c.phone && c.phone.includes(search))
        );
    }, [customers, search]);

    if (loading) {
        return (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="h-32 bg-white/70 border border-slate-200 rounded-xl animate-pulse" />
                ))}
            </div>
        );
    }

    const showEmptyState = filteredCustomers.length === 0;

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4 bg-white rounded-xl shadow-sm border border-slate-200 px-4 py-3">
                <Search className="w-5 h-5 text-slate-400" />
                <Input
                    placeholder="Buscar cliente por nome ou telefone..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="border-none shadow-none focus-visible:ring-0 text-base"
                />
            </div>

            {showEmptyState ? (
                <div className="border border-dashed border-slate-200 rounded-2xl bg-white/70 p-8 text-center space-y-3">
                    <div className="mx-auto h-12 w-12 rounded-full bg-blue-50 text-blue-600 grid place-items-center">
                        <Users className="h-6 w-6" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900">
                        Nenhum cliente encontrado
                    </h3>
                    <p className="text-sm text-slate-500">
                        {search
                            ? "Ajuste a busca ou limpe o filtro para ver todos os clientes."
                            : "Cadastre o primeiro cliente para começar a registrar vendas e pagamentos."}
                    </p>
                    {onCreate && (
                        <Button onClick={onCreate} className="bg-blue-600 hover:bg-blue-700">
                            Adicionar cliente
                        </Button>
                    )}
                </div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {filteredCustomers.map((customer) => (
                        <CustomerCard key={customer.id} customer={customer} />
                    ))}
                </div>
            )}
        </div>
    );
}
