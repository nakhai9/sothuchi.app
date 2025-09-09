import { ResponseBase } from "@/models/base";
import { CategoryModel } from "@/models/category";

import { httpService } from "./httpService";

const BASE_URLS = {
  categories: "api/v1/categories",
  transactions: "api/v1/transactions",
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
};
