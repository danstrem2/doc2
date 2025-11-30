"use client";

import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Sparkles } from "lucide-react";

export default function LoginPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 relative overflow-hidden px-4">
            <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.2) 1px, transparent 0)", backgroundSize: "24px 24px" }} />
            <div className="relative bg-white/10 border border-white/15 backdrop-blur-xl rounded-3xl p-8 max-w-md w-full shadow-2xl space-y-6">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 grid place-items-center text-white">
                        <Sparkles className="h-5 w-5" />
                    </div>
                    <div>
                        <p className="text-xs uppercase tracking-[0.25em] text-slate-200">Style Ledger</p>
                        <h1 className="text-2xl font-bold text-white">Entre para continuar</h1>
                    </div>
                </div>

                <p className="text-slate-200/80 text-sm">
                    Faça login com sua conta Google para sincronizar e proteger seus dados.
                </p>

                <Button
                    onClick={() => signIn("google", { callbackUrl: "/" })}
                    className="w-full h-12 text-lg bg-white text-slate-900 hover:bg-slate-100"
                >
                    Entrar com Google
                </Button>

                <div className="flex items-center gap-2 text-slate-200/80 text-sm">
                    <ShieldCheck className="h-4 w-4" />
                    Login seguro com Google OAuth
                </div>
            </div>
        </div>
    );
}
