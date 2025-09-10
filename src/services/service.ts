import { GoogleGenerativeAI } from '@google/generative-ai';

import { Utils } from '@/lib/utils';
import { AccountModel } from '@/models/account';
import {
  BaseEntity,
  ResponseBase,
} from '@/models/base';
import { CategoryModel } from '@/models/category';
import { UserInfo } from '@/models/user';

import { httpService } from './httpService';

const BASE_URLS = {
  categories: "api/v1/categories",
  transactions: "api/v1/transactions",
  accounts: "api/v1/accounts",
};

export const SERVICES = {
  // Category Service
  categoryService: {
    getCategories: async (): Promise<CategoryModel[] | undefined> => {
      try {
        const { data } = await httpService.get<ResponseBase<CategoryModel[]>>(
          BASE_URLS.categories
        );
        return data;
      } catch (error) {
        console.log(error);
      }
    },
  },

  // Transaction Service
  transactionService: {
    getTransactions: async (): Promise<CategoryModel[] | undefined> => {
      try {
        const { data } = await httpService.get<ResponseBase<CategoryModel[]>>(
          BASE_URLS.transactions
        );
        return data;
      } catch (error) {
        console.log(error);
      }
    },
  },

  // Account Service
  accountService: {
    create: async (payload: AccountModel): Promise<void> => {
      try {
        await httpService.post(BASE_URLS.accounts, payload);
      } catch (error) {
        console.log(error);
      }
    },
    getAccounts: async (): Promise<
      (AccountModel & BaseEntity)[] | undefined
    > => {
      try {
        const { data } = await httpService.get<
          ResponseBase<(AccountModel & BaseEntity)[]>
        >(BASE_URLS.accounts);
        return data;
      } catch (error) {
        console.log(error);
      }
    },
  },

  // User Service
  userService: {
    getUserInfo: async (): Promise<UserInfo> => {
      return Promise.resolve({
        id: 1,
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
      });
    },
  },

  AIService: {
    scanReceiptWithAI: async (files: File[]) => {
      const systemPrompt = `
    You are an expert at extracting information from receipts.

    Task:
    - Analyze the provided receipt image
    - Extract all relevant billing information
    - Return the data as a JSON array of transactions

    Output format (TypeScript type):
    export type TransactionModel = {
      description: string; // item name
      amount: number;      // item price
      date: Date;          // receipt date, format YYYY-M-D (no leading zero in day or month)
    }

    Guidelines:
    - Use the receipt date for all items. If missing, return null for date.
    - Each item in the receipt must be one TransactionModel object.
    - description = item name
    - amount = item price, as a decimal number
    - Ignore restaurant name, tax, tip, or other metadata
    - Only return the list of TransactionModel objects in JSON format
    - Extract ONLY what is visible in the receipt, do not make assumptions

      
    IMPORTANT: Extract ONLY the information visible in the receipt. Do not make assumptions about missing data.
`;

      const genAI = new GoogleGenerativeAI(
        process.env.NEXT_PUBLIC_GEMINI_API_KEY ?? ""
      );
      const model = genAI.getGenerativeModel({
        model: process.env.NEXT_PUBLIC_GEMINI_MODEL ?? "",
        generationConfig: {
          responseMimeType: "application/json",
        },
      });

      const content = [
        {
          text: systemPrompt,
        },
        {
          inlineData: {
            data: await Utils.file.convertFileToBase64(files[0]),
            mimeType: `${files[0].type}`,
          },
        },
      ];

      const response = await model.generateContent(content);
      const result = response.response.text();
      return JSON.parse(result);
    },
  },
};
