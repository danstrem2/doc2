import nodemailer from "nodemailer";
import fs from "fs";
import { NextResponse } from "next/server";
import { getDatabasePath } from "@/lib/backup";

export async function POST(request: Request) {
    try {
        const { email, password } = await request.json();

        if (!email || !password) {
            return NextResponse.json(
                { error: "Email e senha de app são obrigatórios." },
                { status: 400 }
            );
        }

        const dbPath = getDatabasePath();

        if (!fs.existsSync(dbPath)) {
            return NextResponse.json(
                { error: "Banco de dados não encontrado para gerar backup." },
                { status: 404 }
            );
        }

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: email,
                pass: password,
            },
        });

        const mailOptions = {
            from: email,
            to: email,
            subject: `Backup Style Ledger - ${new Date().toLocaleDateString("pt-BR")}`,
            text: "Segue em anexo o backup do banco de dados do seu sistema.",
            attachments: [
                {
                    filename: "backup_style_ledger.db",
                    path: dbPath,
                },
            ],
        };

        await transporter.sendMail(mailOptions);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Erro no backup:", error);
        return NextResponse.json(
            { error: "Falha ao enviar e-mail. Verifique suas credenciais." },
            { status: 500 }
        );
    }
}
