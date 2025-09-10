export type TransactionModel = {
  description: string;
  amount: number;
  type: "income" | "expense";
  date: Date;
  categoryId: number;
};

export type ReceiptTransaction = {
  description: string;
  amount: number;
  date: Date;
};
