import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    const alice = await prisma.customer.create({
        data: {
            name: "Alice Silva",
            phone: "(11) 99999-9999",
            transactions: {
                create: [
                    {
                        amount: 150.0,
                        type: "SALE",
                        description: "Vestido de Verão",
                        createdAt: new Date(new Date().setDate(new Date().getDate() - 5)),
                    },
                    {
                        amount: 50.0,
                        type: "PAYMENT",
                        description: "Pagamento parcial",
                        createdAt: new Date(new Date().setDate(new Date().getDate() - 2)),
                    },
                ],
            },
        },
    });

    const bob = await prisma.customer.create({
        data: {
            name: "Roberto Carlos",
            phone: "(21) 88888-8888",
            transactions: {
                create: [
                    {
                        amount: 300.0,
                        type: "SALE",
                        description: "Terno completo",
                    },
                ],
            },
        },
    });

    console.log({ alice, bob });
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
