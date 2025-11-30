"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, ShieldCheck } from "lucide-react";

interface BackupModalProps {
    onClose: () => void;
}

export default function BackupModal({ onClose }: BackupModalProps) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [autoBackup, setAutoBackup] = useState(false);
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
    const [message, setMessage] = useState("");

    useEffect(() => {
        fetch("/api/settings")
            .then((res) => res.json())
            .then((data) => {
                if (data.email) setEmail(data.email);
                if (data.appPassword) setPassword(data.appPassword);
                if (data.autoBackup) setAutoBackup(data.autoBackup);
            })
            .catch((err) => console.error("Failed to load settings", err));
    }, []);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setStatus("idle");
        setMessage("");

        try {
            const res = await fetch("/api/settings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, appPassword: password, autoBackup }),
            });

            if (res.ok) {
                setStatus("success");
                setMessage("Configurações salvas! O backup será disparado a cada venda ou pagamento.");
            } else {
                setStatus("error");
                setMessage("Erro ao salvar configurações.");
            }
        } catch (error) {
            setStatus("error");
            setMessage("Erro de conexão ao salvar.");
        } finally {
            setLoading(false);
        }
    };

    const handleManualBackup = async () => {
        setLoading(true);
        setStatus("idle");
        try {
            const res = await fetch("/api/backup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });
            if (res.ok) {
                setStatus("success");
                setMessage("Backup manual enviado com sucesso!");
            } else {
                setStatus("error");
                setMessage("Erro ao enviar backup manual.");
            }
        } catch (e) {
            setStatus("error");
            setMessage("Erro ao enviar backup.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md space-y-4 relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-slate-500 hover:text-slate-800"
                >
                    <X className="h-4 w-4" />
                </button>

                <div className="flex items-center gap-2">
                    <div className="h-10 w-10 rounded-full bg-blue-50 text-blue-600 grid place-items-center">
                        <ShieldCheck className="h-5 w-5" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold">Backup automático</h2>
                        <p className="text-sm text-muted-foreground">Envie o banco via Gmail sempre que houver mudanças.</p>
                    </div>
                </div>

                <form onSubmit={handleSave} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Seu Gmail</label>
                        <Input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="exemplo@gmail.com"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Senha de app</label>
                        <Input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="xxxx xxxx xxxx xxxx"
                            required
                        />
                        <a
                            href="https://myaccount.google.com/apppasswords"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-blue-600 hover:underline"
                        >
                            Criar senha de app no Google
                        </a>
                    </div>

                    <div className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            id="autoBackup"
                            checked={autoBackup}
                            onChange={(e) => setAutoBackup(e.target.checked)}
                            className="h-4 w-4 rounded border-gray-300 text-slate-900 focus:ring-slate-900"
                        />
                        <label htmlFor="autoBackup" className="text-sm font-medium leading-none">
                            Ativar backup automático
                        </label>
                    </div>

                    {status === "success" && (
                        <div className="p-3 bg-green-50 text-green-700 rounded-md text-sm border border-green-100">
                            {message}
                        </div>
                    )}

                    {status === "error" && (
                        <div className="p-3 bg-red-50 text-red-700 rounded-md text-sm border border-red-100">
                            {message}
                        </div>
                    )}

                    <div className="flex justify-end gap-2 pt-2">
                        <Button type="button" variant="secondary" onClick={handleManualBackup} disabled={loading}>
                            Testar envio agora
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? "Salvando..." : "Salvar configuração"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
