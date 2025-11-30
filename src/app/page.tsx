"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { AlertCircle, RefreshCw, ShieldCheck, Sparkles } from "lucide-react";
import { Customer } from "@/types";

import Header from "@/components/dashboard/Header";
import StatsOverview from "@/components/dashboard/StatsOverview";
import CustomerList from "@/components/dashboard/CustomerList";
import CollectionsView from "@/components/dashboard/CollectionsView";
import NewCustomerModal from "@/components/dashboard/NewCustomerModal";
import BackupModal from "@/components/BackupModal";
import EditCustomerModal from "@/components/dashboard/EditCustomerModal";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
    const { data: session, status } = useSession();
    const router = useRouter();

    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<"dashboard" | "schedule">("dashboard");

    const [isCreating, setIsCreating] = useState(false);
    const [isBackupOpen, setIsBackupOpen] = useState(false);
    const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login");
        }
    }, [status, router]);

    const fetchCustomers = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch("/api/customers");
            if (!res.ok) throw new Error("Falha ao buscar clientes");
            const data = await res.json();
            setCustomers(data);
        } catch (err) {
            console.error("Failed to fetch customers", err);
            setError("Não conseguimos carregar os clientes. Tente novamente em instantes.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (status === "authenticated") {
            fetchCustomers();
        }
    }, [status]);

    if (status === "loading") {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="h-14 w-14 rounded-full border-4 border-blue-500 border-t-transparent animate-spin" />
            </div>
        );
    }

    if (!session) return null;

    return (
        <div className="min-h-screen">
            <Header
                onNewCustomer={() => setIsCreating(true)}
                onBackup={() => setIsBackupOpen(true)}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
            />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
                <section className="frosted rounded-3xl p-6 sm:p-8 shadow-xl shadow-blue-100/40">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                        <div className="space-y-3">
                            <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-sm text-blue-700">
                                <Sparkles className="h-4 w-4" />
                                Painel atualizado em tempo real
                            </div>
                            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">
                                Bem-vindo{session.user?.name ? `, ${session.user.name.split(" ")[0]}` : ""}!
                            </h1>
                            <p className="text-slate-600 max-w-2xl leading-relaxed">
                                Monitore vendas, cobranças agendadas e mantenha backups automáticos em um
                                painel único e responsivo.
                            </p>
                            {error && (
                                <div className="inline-flex items-center gap-3 rounded-xl bg-red-50 border border-red-100 px-3 py-2 text-sm text-red-700">
                                    <AlertCircle className="h-4 w-4" />
                                    {error}
                                    <Button size="sm" variant="secondary" onClick={fetchCustomers} className="ml-2">
                                        <RefreshCw className="h-4 w-4 mr-1" />
                                        Recarregar
                                    </Button>
                                </div>
                            )}
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full md:w-auto">
                            <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm">
                                <div className="flex items-center justify-between text-sm text-slate-500">
                                    Confiabilidade
                                    <ShieldCheck className="h-4 w-4 text-emerald-500" />
                                </div>
                                <p className="mt-2 text-lg font-semibold text-slate-900">Backups automáticos</p>
                                <p className="text-xs text-slate-500 mt-1">Configure em poucos cliques.</p>
                            </div>
                            <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-blue-600 to-indigo-600 p-4 text-white shadow-lg">
                                <p className="text-sm opacity-80">Clientes</p>
                                <p className="text-3xl font-bold mt-2">{customers.length}</p>
                                <p className="text-xs opacity-80 mt-1">ordenados por maior saldo.</p>
                            </div>
                        </div>
                    </div>
                </section>

                <StatsOverview customers={customers} />

                {activeTab === "dashboard" ? (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold text-slate-800">Todos os clientes</h2>
                            <Button size="sm" onClick={() => setIsCreating(true)}>
                                + Novo cliente
                            </Button>
                        </div>
                        <CustomerList
                            customers={customers}
                            loading={loading}
                            onCreate={() => setIsCreating(true)}
                        />
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold text-slate-800">Agenda de cobranças</h2>
                            <p className="text-sm text-slate-500">Organize atrasados, hoje e próximos.</p>
                        </div>
                        <CollectionsView customers={customers} onEditCustomer={setEditingCustomer} />
                    </div>
                )}
            </main>

            {isCreating && (
                <NewCustomerModal
                    onClose={() => setIsCreating(false)}
                    onSuccess={fetchCustomers}
                />
            )}

            {editingCustomer && (
                <EditCustomerModal
                    customer={editingCustomer}
                    onClose={() => setEditingCustomer(null)}
                    onSuccess={fetchCustomers}
                />
            )}

            {isBackupOpen && (
                <BackupModal onClose={() => setIsBackupOpen(false)} />
            )}
        </div>
    );
}
