export type AccountModel = {
  name: string;
  amount: number;

  amountFormatted?: string;
};

export type AccountReport = {
  initial: number;
  totalIncome: number;
  totalExpense: number;
  balance: number;
};
