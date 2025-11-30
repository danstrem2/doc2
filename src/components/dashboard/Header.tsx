"use client";

import { Button } from "@/components/ui/button";
import { DownloadCloud, LogOut, Plus, LayoutDashboard, CalendarDays } from "lucide-react";
import { signOut } from "next-auth/react";

interface HeaderProps {
    onNewCustomer: () => void;
    onBackup: () => void;
    activeTab: "dashboard" | "schedule";
    setActiveTab: (tab: "dashboard" | "schedule") => void;
}

export default function Header({ onNewCustomer, onBackup, activeTab, setActiveTab }: HeaderProps) {
    return (
        <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/80 backdrop-blur-xl">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-bold grid place-items-center shadow-lg shadow-blue-200">
                        SL
                    </div>
                    <div>
                        <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Style Ledger</p>
                        <h1 className="text-lg font-semibold text-slate-900">Controle de vendas e cobranças</h1>
                    </div>
                    <nav className="flex gap-2 ml-2 sm:ml-6">
                        <Button
                            variant={activeTab === "dashboard" ? "secondary" : "ghost"}
                            onClick={() => setActiveTab("dashboard")}
                            className="gap-2"
                        >
                            <LayoutDashboard className="w-4 h-4" />
                            Visão geral
                        </Button>
                        <Button
                            variant={activeTab === "schedule" ? "secondary" : "ghost"}
                            onClick={() => setActiveTab("schedule")}
                            className="gap-2"
                        >
                            <CalendarDays className="w-4 h-4" />
                            Agenda de cobranças
                        </Button>
                    </nav>
                </div>

                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" onClick={() => signOut()} className="text-slate-500 hover:text-red-600">
                        <LogOut className="w-4 h-4 mr-2" />
                        Sair
                    </Button>
                    <div className="h-6 w-px bg-slate-200 mx-2" />
                    <Button variant="outline" size="sm" onClick={onBackup} className="hidden sm:flex">
                        <DownloadCloud className="w-4 h-4 mr-2" />
                        Backup
                    </Button>
                    <Button
                        size="sm"
                        onClick={onNewCustomer}
                        className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md shadow-blue-200"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Novo cliente
                    </Button>
                </div>
            </div>
        </header>
    );
}
