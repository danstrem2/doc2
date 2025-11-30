import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { performBackup } from "@/lib/backup";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { customerId, amount, type, description } = body;
        const numericAmount = typeof amount === "number" ? amount : parseFloat(amount);

        if (
            !customerId ||
            !Number.isFinite(numericAmount) ||
            numericAmount <= 0 ||
            !type ||
            !description
        ) {
            return NextResponse.json(
                { error: "Campos obrigatórios ausentes." },
                { status: 400 }
            );
        }

        if (type !== "SALE" && type !== "PAYMENT") {
            return NextResponse.json(
                { error: "Tipo de transação inválido." },
                { status: 400 }
            );
        }

        const transaction = await prisma.transaction.create({
            data: {
                customerId,
                amount: numericAmount,
                type,
                description,
            },
        });

        // Dispara backup automático em background
        performBackup().catch((err) => console.error("Backup trigger failed", err));

        return NextResponse.json(transaction);
    } catch (error) {
        console.error("Error creating transaction:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
