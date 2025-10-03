/* eslint-disable @typescript-eslint/no-explicit-any */
import { GoogleGenerativeAI } from '@google/generative-ai';

import { Utils } from '@/shared/lib/utils';
import {
  AccountModel,
  AccountReport,
} from '@/types/account';
import {
  BaseEntity,
  DropdownOption,
  ResponseBase,
} from '@/types/base';
import { CategoryModel } from '@/types/category';
import {
  TransactionModel,
  TransactionReport,
} from '@/types/transaction';
import {
  UserInfo,
  UserLogin,
  UserSignUp,
  UserToken,
} from '@/types/user';

import { httpService } from '../shared/lib/config/httpService';

const API_PREFIX = "api/v1";

const BASE_URLS = {
  categories: `${API_PREFIX}/categories`,
  transactions: `${API_PREFIX}/transactions`,
  accounts: `${API_PREFIX}/accounts`,
  auth: {
    signIn: `auth/sign-in`,
    signUp: `auth/sign-up`,
  },
  user: `${API_PREFIX}/users`,
  lookup: `${API_PREFIX}/lookup`,
};

export const SERVICES = {
  // Category Service
  CategoryService: {
    getAll: async (): Promise<CategoryModel[] | undefined> => {
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
  TransactionService: {
    getAll: async (
      params?: any
    ): Promise<(TransactionModel & BaseEntity)[] | undefined> => {
      try {
        let url = `${BASE_URLS.transactions}`;
        if (params) {
          const queryString = new URLSearchParams(params).toString();
          url = `${url}?${queryString}`;
        }
        const { data } = await httpService.get<
          ResponseBase<(TransactionModel & BaseEntity)[]>
        >(url);
        return data;
      } catch (error) {
        console.log(error);
      }
    },
    create: async (payload: TransactionModel): Promise<void> => {
      try {
        await httpService.post(BASE_URLS.transactions, payload);
      } catch (error) {
        console.error(error);
      }
    },
    createMany: async (payload: TransactionModel[]): Promise<void> => {
      try {
        await httpService.post(BASE_URLS.transactions, payload);
      } catch (error) {
        console.error(error);
      }
    },
    getReport: async (): Promise<TransactionReport | undefined> => {
      try {
        const { data } = await httpService.get<ResponseBase<TransactionReport>>(
          `${BASE_URLS.transactions}/report`
        );
        return data;
      } catch (error) {
        console.log(error);
      }
    },
  },

  // Account Service
  AccountService: {
    create: async (payload: AccountModel): Promise<void> => {
      try {
        await httpService.post(BASE_URLS.accounts, payload);
      } catch (error) {
        console.log(error);
      }
    },
    getAll: async (): Promise<(AccountModel & BaseEntity)[] | undefined> => {
      try {
        const { data } = await httpService.get<
          ResponseBase<(AccountModel & BaseEntity)[]>
        >(BASE_URLS.accounts);
        return data;
      } catch (error) {
        console.log(error);
      }
    },
    softDelete: async (id: number): Promise<void> => {
      try {
        await httpService.delete(`${BASE_URLS.accounts}/${id}`);
      } catch (error) {
        console.log(error);
      }
    },
    getReport: async (id: number): Promise<AccountReport | undefined> => {
      try {
        const { data } = await httpService.get<ResponseBase<AccountReport>>(
          `${BASE_URLS.accounts}/${id}/report`
        );
        return data;
      } catch (error) {
        console.log(error);
      }
    },
    getAccountById: async (
      id: number
    ): Promise<(AccountModel & BaseEntity) | undefined> => {
      try {
        const { data } = await httpService.get<
          ResponseBase<AccountModel & BaseEntity>
        >(`${BASE_URLS.accounts}/${id}`);
        return data;
      } catch (error) {
        console.log(error);
      }
    },
    update: async (id: number, payload: AccountModel): Promise<void> => {
      try {
        await httpService.put(`${BASE_URLS.accounts}/${id}`, payload);
      } catch (error) {
        console.log(error);
      }
    },
  },

  // AI Service
  AIService: {
    scanReceiptWithAI: async (files: File[]): Promise<TransactionModel[]> => {
      const systemPrompt = `
    You are an expert at extracting information from receipts.

      CATEGORIES = [
      {
        name: "Drink",
        type: "expense",
        value: "drink",
      },
      {
        name: "Food",
        type: "expense",
        value: "food",
      },
      {
        name: "Wifi & Internet",
        type: "expense",
        value: "internet",
      },
      {
        name: "Entertainment",
        type: "expense",
        value: "entertainment",
      },
      {
        name: "Beauty",
        type: "expense",
        value: "beauty",
      },
      {
        name: "Fitness & Gym",
        type: "expense",
        value: "fitness",
      },
      {
        name: "Travel",
        type: "expense",
        value: "travel",
      },
      {
        name: "Fuel",
        type: "expense",
        value: "fuel",
      },
      {
        name: "Gifts",
        type: "expense",
        value: "gifts",
      },
      {
        name: "Shopping",
        type: "expense",
        value: "shopping",
      },
      {
        name: "Salary",
        type: "income",
        value: "salary",
      },
      {
        name: "Health care",
        type: "expense",
        value: "health",
      },
      {
        name: "Rent & Housing",
        type: "expense",
        value: "rent_housing",
      },
      {
        name: "Repair",
        type: "expense",
        value: "repair",
      },
      {
        name: "Electronics",
        type: "expense",
        value: "electronics",
      },
      {
        name: "Water",
        type: "expense",
        value: "water",
      },
      {
        name: "Loan",
        type: "expense",
        value: "loan",
      },
      {
        name: "Debt",
        type: "income",
        value: "debt",
      },
      {
        name: "Tips or Donation",
        type: "income",
        value: "tips_or_donation",
      },
      {
        name: "Saving",
        type: "income",
        value: "saving",
      },
      {
        name: "Transfer In",
        type: "income",
        value: "transfer_in",
      },
      {
        name: "Transfer Out",
        type: "expense",
        value: "transfer_out",
      },
      {
        name: "Income Default",
        type: "income",
        value: "income_default",
      },
      {
        name: "Expense Default",
        type: "expense",
        value: "expense_default",
      },
    ];

    Task:
    - Analyze the provided receipt image
    - Extract all relevant billing information
    - Return the data as a JSON array of transactions

    Output format (TypeScript type):
    export type TransactionModel = {
      description: string; // item's name, store's name, including quantity if visible (e.g., "Hong Tra Sua (x2) - Shop Store")
      amount: number;      // item price
      date: Date;          // receipt date, format YYYY-M-D (no leading zero in day or month)
      type: "income" | "expense";
      paidAt: Date;
      category: string;    // use the 'value' field from CATEGORIES above, choose the most appropriate one
    };    

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

  // Auth Service

  AuthService: {
    signIn: async (userLogin: UserLogin): Promise<UserToken> => {
      try {
        const { data } = await httpService.post<ResponseBase<UserToken>>(
          BASE_URLS.auth.signIn,
          userLogin
        );
        return data;
      } catch (error) {
        throw error;
      }
    },
    signUp: async (userSignUp: UserSignUp): Promise<void> => {
      try {
        console.log(userSignUp);

        await httpService.post(BASE_URLS.auth.signUp, userSignUp);
      } catch (error) {
        throw error;
      }
    },
  },

  UserService: {
    getUserInfo: async (): Promise<UserInfo> => {
      try {
        const { data } = await httpService.get<ResponseBase<UserInfo>>(
          `${BASE_URLS.user}/me`
        );
        return data;
      } catch (error) {
        throw error;
      }
    },
  },

  LookupService: {
    getAccounts: async (): Promise<DropdownOption[]> => {
      try {
        const { data } = await httpService.get<ResponseBase<DropdownOption[]>>(
          `${BASE_URLS.lookup}/accounts`
        );
        return data;
      } catch (error) {
        throw error;
      }
    },
  },
};
