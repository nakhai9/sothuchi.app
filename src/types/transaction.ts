export type TransactionModel = {
  description: string;
  amount: number;
  type: "income" | "expense";
  accountId: number;
  paidAt: Date;
  category: string;

  amountFormatted?: string;
  paidAtFormatted?: string;
};

export type ReceiptTransaction = {
  description: string;
  amount: number;
  date: Date;
};
