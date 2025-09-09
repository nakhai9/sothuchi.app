import { BaseEntity } from "./base";

export type TransactionModel = {
  description: string;
  amount: number;
  type: "income" | "expense";
  date: Date;
  categoryId: number;
} & BaseEntity;
