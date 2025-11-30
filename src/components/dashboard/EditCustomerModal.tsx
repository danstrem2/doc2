"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Customer } from "@/types";

interface EditCustomerModalProps {
    customer: Customer;
    onClose: () => void;
    onSuccess: () => void;
}

export default function EditCustomerModal({ customer, onClose, onSuccess }: EditCustomerModalProps) {
    const [name, setName] = useState(customer.name);
    const [phone, setPhone] = useState(customer.phone || "");
    const [nextPaymentDate, setNextPaymentDate] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (customer.nextPaymentDate) {
            setNextPaymentDate(new Date(customer.nextPaymentDate).toISOString().split("T")[0]);
        }
    }, [customer]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) {
            setError("Informe o nome do cliente.");
            return;
        }
        setLoading(true);
        setError(null);

        try {
            const res = await fetch(`/api/customers/${customer.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: name.trim(),
                    phone: phone.trim() || null,
                    nextPaymentDate: nextPaymentDate || null,
                }),
            });

            if (!res.ok) throw new Error("Falha ao atualizar cliente");

            onSuccess();
            onClose();
        } catch (error) {
            console.error("Failed to update customer", error);
            setError("Não foi possível salvar. Tente novamente.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-slate-400 hover:text-slate-800 transition-colors"
                >
                    <X className="h-5 w-5" />
                </button>

                <h2 className="text-2xl font-bold text-slate-900 mb-1">Editar cliente</h2>
                <p className="text-sm text-slate-500 mb-6">Atualize os dados e a data de cobrança.</p>

                {error && (
                    <div className="mb-4 rounded-lg bg-red-50 border border-red-100 px-3 py-2 text-sm text-red-700">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Nome completo</label>
                        <Input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Ex: Maria Silva"
                            className="h-11"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Telefone (WhatsApp)</label>
                        <Input
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="(00) 00000-0000"
                            className="h-11"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Data da cobrança</label>
                        <Input
                            type="date"
                            value={nextPaymentDate}
                            onChange={(e) => setNextPaymentDate(e.target.value)}
                            className="h-11"
                        />
                        <p className="text-xs text-slate-500">Defina quando este cliente deve pagar.</p>
                    </div>

                    <div className="pt-4 flex gap-3">
                        <Button type="button" variant="outline" onClick={onClose} className="flex-1 h-11">
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={loading} className="flex-1 h-11 bg-blue-600 hover:bg-blue-700">
                            {loading ? "Salvando..." : "Salvar alterações"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
