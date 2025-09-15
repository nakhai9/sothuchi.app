import { GoogleGenerativeAI } from "@google/generative-ai";

import { Utils } from "@/lib/utils";
import { AccountModel } from "@/models/account";
import { BaseEntity, ResponseBase } from "@/models/base";
import { CategoryModel } from "@/models/category";
import { ReceiptTransaction, TransactionModel } from "@/models/transaction";
import { UserInfo, UserLogin, UserSignUp, UserToken } from "@/models/user";

import { httpService } from "./httpService";
import { log } from "console";

const BASE_URLS = {
  categories: "api/v1/categories",
  transactions: "api/v1/transactions",
  accounts: "api/v1/accounts",
  auth: {
    signIn: "auth/sign-in",
    signUp: "auth/sign-up",
  },
  user: "users",
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
    getAll: async (): Promise<CategoryModel[] | undefined> => {
      try {
        const { data } = await httpService.get<ResponseBase<CategoryModel[]>>(
          BASE_URLS.transactions
        );
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
  },

  // AI Service
  AIService: {
    scanReceiptWithAI: async (files: File[]): Promise<ReceiptTransaction[]> => {
      const systemPrompt = `
    You are an expert at extracting information from receipts.

    Task:
    - Analyze the provided receipt image
    - Extract all relevant billing information
    - Return the data as a JSON array of transactions

    Output format (TypeScript type):
    export type TransactionModel = {
      description: string; // item name, including quantity if visible (e.g., "Hong Tra Sua (x2)")
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
};
