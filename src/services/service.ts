import { AccountModel } from "@/models/account";
import { BaseEntity, ResponseBase } from "@/models/base";
import { CategoryModel } from "@/models/category";
import { UserInfo } from "@/models/user";

import { httpService } from "./httpService";

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
};
