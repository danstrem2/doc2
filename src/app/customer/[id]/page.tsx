"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, formatDate } from "@/lib/utils";
import TransactionForm from "@/components/TransactionForm";
import { ArrowLeft, Trash2, Calendar, Phone, CalendarClock } from "lucide-react";

interface Transaction {
    id: string;
    amount: number;
    type: "SALE" | "PAYMENT";
    description: string;
    createdAt: string;
}

interface Customer {
    id: string;
    name: string;
    phone: string | null;
    balance: number;
    nextPaymentDate?: string | null;
    createdAt?: string;
    transactions: Transaction[];
}

export default function CustomerPage() {
    const params = useParams();
    const router = useRouter();
    const [customer, setCustomer] = useState<Customer | null>(null);
    const [loading, setLoading] = useState(true);
    const [transactionModal, setTransactionModal] = useState<"SALE" | "PAYMENT" | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isScheduling, setIsScheduling] = useState(false);
    const [scheduleDate, setScheduleDate] = useState("");
    const [scheduleLoading, setScheduleLoading] = useState(false);

    const fetchCustomer = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(`/api/customers/${params.id}`);
            if (!res.ok) throw new Error("Customer not found");
            const data = await res.json();
            setCustomer(data);
        } catch (err) {
            console.error(err);
            setError("Não foi possível carregar o cliente.");
        } finally {
            setLoading(false);
        }
    }, [params.id]);

    useEffect(() => {
        fetchCustomer();
    }, [fetchCustomer]);

    const handleDelete = async () => {
        if (!confirm("Tem certeza que deseja excluir este cliente e todo o histórico?")) return;
        try {
            await fetch(`/api/customers/${params.id}`, { method: "DELETE" });
            router.push("/");
        } catch (error) {
            console.error("Failed to delete", error);
            alert("Erro ao excluir. Tente novamente.");
        }
    };

    if (loading) return <div className="p-8 text-slate-500">Carregando...</div>;
    if (!customer) {
        return (
            <div className="p-8 space-y-4">
                <Button variant="ghost" onClick={() => router.push("/")}>
                    <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
                </Button>
                <div className="rounded-xl border border-dashed border-slate-300 p-6 text-slate-500">
                    {error || "Cliente não encontrado."}
                </div>
            </div>
        );
    }

    return (
        <main className="min-h-screen p-8 bg-slate-50">
            <div className="max-w-4xl mx-auto space-y-8">
                <Button variant="ghost" onClick={() => router.push("/")} className="mb-2">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
                </Button>

                {error && (
                    <div className="rounded-lg bg-red-50 border border-red-100 px-3 py-2 text-sm text-red-700">
                        {error}
                    </div>
                )}

                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex items-start justify-between gap-4">
                    <div className="space-y-2">
                        <h1 className="text-3xl font-bold text-slate-900">{customer.name}</h1>
                        <p className="text-muted-foreground flex items-center gap-2">
                            <Phone className="h-4 w-4" />
                            {customer.phone || "Sem telefone"}
                        </p>
                        {customer.nextPaymentDate && (
                            <p className="text-sm text-blue-700 bg-blue-50 border border-blue-100 rounded-full px-3 py-1 inline-flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                Próxima cobrança: {new Date(customer.nextPaymentDate).toLocaleDateString("pt-BR")}
                            </p>
                        )}
                    </div>
                    <Button variant="destructive" size="icon" onClick={handleDelete}>
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>

                <Card className="bg-gradient-to-br from-slate-900 to-slate-800 text-white border-none">
                    <CardHeader>
                        <CardTitle className="text-slate-200">Saldo devedor</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-bold">
                            {formatCurrency(customer.balance)}
                        </div>
                        <p className="text-sm text-slate-300 mt-2">
                            {customer.balance > 0
                                ? "O cliente possui débitos pendentes."
                                : "O cliente está com o pagamento em dia."}
                        </p>
                    </CardContent>
                </Card>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <Button
                        className="h-16 text-lg"
                        onClick={() => setTransactionModal("SALE")}
                    >
                        Nova venda
                    </Button>
                    <Button
                        className="h-16 text-lg bg-green-600 hover:bg-green-700"
                        onClick={() => setTransactionModal("PAYMENT")}
                    >
                        Registrar pagamento
                    </Button>
                    <Button
                        className="h-16 text-lg bg-blue-600 hover:bg-blue-700"
                        onClick={() => {
                            const current = customer.nextPaymentDate
                                ? new Date(customer.nextPaymentDate).toISOString().split("T")[0]
                                : "";
                            setScheduleDate(current);
                            setIsScheduling(true);
                        }}
                    >
                        <CalendarClock className="h-5 w-5 mr-2" />
                        Agendar cobrança
                    </Button>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold">Histórico</h2>
                        <span className="text-sm text-slate-500">
                            {customer.transactions.length} movimentações
                        </span>
                    </div>
                    <div className="space-y-2">
                        {customer.transactions.map((t) => (
                            <div
                                key={t.id}
                                className="flex items-center justify-between p-4 bg-white rounded-lg border shadow-sm"
                            >
                                <div>
                                    <p className="font-medium">{t.description}</p>
                                    <p className="text-xs text-muted-foreground">
                                        {formatDate(t.createdAt)}
                                    </p>
                                </div>
                                <div
                                    className={`font-bold ${t.type === "SALE" ? "text-red-500" : "text-green-600"
                                        }`}
                                >
                                    {t.type === "SALE" ? "+" : "-"} {formatCurrency(t.amount)}
                                </div>
                            </div>
                        ))}
                        {customer.transactions.length === 0 && (
                            <p className="text-center text-muted-foreground py-8">
                                Nenhuma transação registrada.
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {transactionModal && (
                <TransactionForm
                    customerId={customer.id}
                    type={transactionModal}
                    onSuccess={() => {
                        setTransactionModal(null);
                        fetchCustomer();
                    }}
                    onCancel={() => setTransactionModal(null)}
                />
            )}

            {isScheduling && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md space-y-4">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <h3 className="text-xl font-semibold text-slate-900">Agendar cobrança</h3>
                                <p className="text-sm text-slate-500">
                                    Defina a próxima data de cobrança para este cliente.
                                </p>
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => setIsScheduling(false)}>
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                        </div>

                        {customer.nextPaymentDate && (
                            <div className="rounded-lg bg-blue-50 border border-blue-100 px-3 py-2 text-sm text-blue-700 flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                Próxima cobrança atual: {new Date(customer.nextPaymentDate).toLocaleDateString("pt-BR")}
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Data</label>
                            <input
                                type="date"
                                value={scheduleDate}
                                onChange={(e) => setScheduleDate(e.target.value)}
                                className="w-full h-11 rounded-md border border-slate-200 px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                            />
                        </div>

                        <div className="flex justify-end gap-2 pt-2">
                            <Button variant="outline" onClick={() => setIsScheduling(false)}>
                                Cancelar
                            </Button>
                            <Button
                                disabled={scheduleLoading || !scheduleDate}
                                onClick={async () => {
                                    if (!scheduleDate) return;
                                    setScheduleLoading(true);
                                    try {
                                        const res = await fetch(`/api/customers/${customer.id}`, {
                                            method: "PUT",
                                            headers: { "Content-Type": "application/json" },
                                            body: JSON.stringify({
                                                name: customer.name,
                                                phone: customer.phone,
                                                nextPaymentDate: scheduleDate,
                                            }),
                                        });
                                        if (!res.ok) throw new Error("Falha ao salvar");
                                        await fetchCustomer();
                                        setIsScheduling(false);
                                    } catch (err) {
                                        alert("Não foi possível agendar. Tente novamente.");
                                    } finally {
                                        setScheduleLoading(false);
                                    }
                                }}
                                className="bg-blue-600 hover:bg-blue-700"
                            >
                                {scheduleLoading ? "Salvando..." : "Salvar agenda"}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}
