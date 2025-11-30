"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface TransactionFormProps {
    customerId: string;
    type: "SALE" | "PAYMENT";
    onSuccess: () => void;
    onCancel: () => void;
}

export default function TransactionForm({
    customerId,
    type,
    onSuccess,
    onCancel,
}: TransactionFormProps) {
    const [amount, setAmount] = useState("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const parsedAmount = parseFloat(amount.replace(",", "."));
        if (!parsedAmount || parsedAmount <= 0) {
            setError("Informe um valor maior que zero.");
            return;
        }

        const finalDescription = description.trim() || (type === "SALE" ? "Venda" : "Pagamento");

        setLoading(true);
        setError(null);
        try {
            const response = await fetch("/api/transactions", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    customerId,
                    amount: parsedAmount,
                    type,
                    description: finalDescription,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to create transaction");
            }

            setAmount("");
            setDescription("");
            onSuccess();
        } catch (err) {
            console.error("Failed to create transaction", err);
            setError("Erro ao registrar transação. Verifique os dados.");
        } finally {
            setLoading(false);
        }
    };

    const isSale = type === "SALE";

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md space-y-4">
                <h2 className="text-xl font-bold">
                    {isSale ? "Nova venda" : "Registrar pagamento"}
                </h2>

                {error && (
                    <div className="rounded-lg bg-red-50 border border-red-100 px-3 py-2 text-sm text-red-700">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Valor (R$)</label>
                        <Input
                            type="number"
                            step="0.01"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="0,00"
                            autoFocus
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Descrição</label>
                        <Input
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder={isSale ? "Ex: Vestido azul" : "Ex: Pagamento semanal"}
                        />
                    </div>
                    <div className="flex justify-end gap-2 pt-2">
                        <Button type="button" variant="outline" onClick={onCancel}>
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            disabled={loading}
                            className={isSale ? "bg-slate-900 hover:bg-slate-800" : "bg-green-600 hover:bg-green-700"}
                        >
                            {loading ? "Salvando..." : "Confirmar"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
