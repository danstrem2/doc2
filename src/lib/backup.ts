import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";
import prisma from "@/lib/prisma";

export function getDatabasePath() {
    const dbUrl = process.env.DATABASE_URL || "file:./dev.db";
    const cleaned = dbUrl.replace("file:", "");
    const candidate = path.isAbsolute(cleaned)
        ? cleaned
        : path.join(process.cwd(), cleaned || "dev.db");

    if (fs.existsSync(candidate)) return candidate;

    const fallback = path.join(
        process.cwd(),
        "prisma",
        path.basename(cleaned || "dev.db")
    );

    return fs.existsSync(fallback) ? fallback : candidate;
}

export async function performBackup() {
    try {
        const settings = await prisma.settings.findUnique({
            where: { id: "default" },
        });

        if (!settings || !settings.autoBackup || !settings.email || !settings.appPassword) {
            console.log("Auto-backup ignorado: configurações ausentes ou desligado.");
            return;
        }

        const dbPath = getDatabasePath();
        if (!fs.existsSync(dbPath)) {
            console.warn(`Auto-backup não encontrou o banco de dados em ${dbPath}`);
            return;
        }

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: settings.email,
                pass: settings.appPassword,
            },
        });

        const mailOptions = {
            from: settings.email,
            to: settings.email,
            subject: `[AUTO] Backup Style Ledger - ${new Date().toLocaleString()}`,
            text: "Backup automático enviado após uma nova movimentação no sistema.",
            attachments: [{ filename: "backup_auto.db", path: dbPath }],
        };

        await transporter.sendMail(mailOptions);
        console.log("Auto-backup enviado com sucesso.");
    } catch (error) {
        console.error("Falha no auto-backup:", error);
    }
}
