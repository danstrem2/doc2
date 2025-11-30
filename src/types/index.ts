export interface Transaction {
    id: string;
    amount: number;
    type: 'SALE' | 'PAYMENT';
    description: string;
    createdAt: string;
    customerId: string;
}

export interface Customer {
    id: string;
    name: string;
    phone: string | null;
    balance: number;
    nextPaymentDate?: string | null;
    transactions: Transaction[];
}
