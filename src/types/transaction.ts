export type TransactionModel = {
  description: string;
  amount: number;
  type: "income" | "expense";
  date: Date;
};

export type ReceiptTransaction = {
  description: string;
  amount: number;
  date: Date;
};
