import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";
import Providers from "./providers";

const grotesk = Space_Grotesk({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Style Ledger",
    description: "Sistema de gestão de vendas e cobranças recorrentes.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="pt-BR">
            <body className={`${grotesk.className} antialiased`}>
                <Providers>{children}</Providers>
            </body>
        </html>
    );
}
