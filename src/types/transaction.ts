export type TransactionModel = {
  description: string;
  amount: number;
  type: "income" | "expense";
  amountFormatted?: string;
  accountId: number;
  paidAt: Date;
};

export type ReceiptTransaction = {
  description: string;
  amount: number;
  date: Date;
};
