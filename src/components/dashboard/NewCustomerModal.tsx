"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";

interface NewCustomerModalProps {
    onClose: () => void;
    onSuccess: () => void;
}

export default function NewCustomerModal({ onClose, onSuccess }: NewCustomerModalProps) {
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [nextPaymentDate, setNextPaymentDate] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) {
            setError("Informe o nome do cliente.");
            return;
        }
        setLoading(true);
        setError(null);

        try {
            const res = await fetch("/api/customers", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: name.trim(),
                    phone: phone.trim() || null,
                    nextPaymentDate: nextPaymentDate || null,
                }),
            });

            if (!res.ok) throw new Error("Falha ao salvar cliente");

            onSuccess();
            onClose();
        } catch (err) {
            console.error("Failed to create customer", err);
            setError("Não foi possível salvar. Verifique os dados e tente novamente.");
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
                    aria-label="Fechar"
                >
                    <X className="h-5 w-5" />
                </button>

                <h2 className="text-2xl font-bold text-slate-900 mb-1">Novo cliente</h2>
                <p className="text-sm text-slate-500 mb-6">Cadastre um cliente para começar a vender.</p>

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
                            autoFocus
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
                        <label className="text-sm font-medium text-slate-700">Agendar cobrança (opcional)</label>
                        <Input
                            type="date"
                            value={nextPaymentDate}
                            onChange={(e) => setNextPaymentDate(e.target.value)}
                            className="h-11"
                        />
                        <p className="text-xs text-slate-500">Define quando o cliente aparece na agenda de cobranças.</p>
                    </div>

                    <div className="pt-4 flex gap-3">
                        <Button type="button" variant="outline" onClick={onClose} className="flex-1 h-11">
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={loading} className="flex-1 h-11 bg-blue-600 hover:bg-blue-700">
                            {loading ? "Salvando..." : "Cadastrar cliente"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
