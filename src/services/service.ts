import { Utils } from '@/shared/lib/utils';
import { BaseEntity } from '@/types/base';
import {
  TransactionModel,
  TransactionReport,
} from '@/types/transaction';
/* eslint-disable @typescript-eslint/no-explicit-any */
import { GoogleGenerativeAI } from '@google/generative-ai';

import { supabase } from '../shared/lib/config/supabaseClient';

/**
 * Helper function để lấy userId từ session hiện tại
 */
const getCurrentUserId = async (): Promise<string> => {
  const { data: sessionData } = await supabase.auth.getSession();
  if (!sessionData.session?.user) {
    throw new Error('User not authenticated');
  }
  return sessionData.session.user.id;
};

/**
 * Transaction Service - Quản lý transactions với Supabase
 */
const TransactionService = {
  /**
   * Lấy danh sách transactions của user hiện tại
   * @param params - Pagination params: { page?, limit? }
   */
  getAll: async (
    params?: { page?: number; limit?: number }
  ): Promise<(TransactionModel & BaseEntity)[]> => {
    try {
      const userId = await getCurrentUserId();

      let query = supabase
        .from('transactions')
        .select('*')
        .eq('userId', userId)
        .eq('isDeleted', false)
        .order('paidAt', { ascending: false });

      // Áp dụng pagination nếu có
      if (params?.limit) {
        query = query.limit(params.limit);
      }
      if (params?.page && params?.limit) {
        const offset = (params.page - 1) * params.limit;
        query = query.range(offset, offset + params.limit - 1);
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      if (!data) {
        return [];
      }

      return data.map((item) => ({
        id: item.id,
        description: item.description,
        amount: parseFloat(item.amount),
        type: item.type as 'income' | 'expense',
        paidAt: new Date(item.paidAt),
        category: item.category,
        createdAt: new Date(item.createdAt),
        updatedAt: item.updatedAt ? new Date(item.updatedAt) : new Date(item.createdAt),
        isDeleted: item.isDeleted,
      }));
    } catch (error) {
      console.error('Error fetching transactions:', error);
      throw error;
    }
  },

  /**
   * Tạo một transaction mới
   */
  create: async (payload: TransactionModel): Promise<void> => {
    try {
      const userId = await getCurrentUserId();

      const { error } = await supabase.from('transactions').insert({
        description: payload.description,
        amount: payload.amount.toString(),
        type: payload.type,
        paidAt: payload.paidAt.toISOString(),
        category: payload.category,
        userId: userId,
        isDeleted: false,
      });

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error('Error creating transaction:', error);
      throw error;
    }
  },

  /**
   * Tạo nhiều transactions cùng lúc (dùng khi scan bill)
   */
  createMany: async (payload: TransactionModel[]): Promise<void> => {
    try {
      const userId = await getCurrentUserId();

      const transactionsToInsert = payload.map((item) => ({
        description: item.description,
        amount: item.amount.toString(),
        type: item.type,
        paidAt: item.paidAt.toISOString(),
        category: item.category,
        userId: userId,
        isDeleted: false,
      }));

      const { error } = await supabase
        .from('transactions')
        .insert(transactionsToInsert);

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error('Error creating multiple transactions:', error);
      throw error;
    }
  },

  /**
   * Lấy báo cáo tổng hợp (total income và total expense)
   */
  getReport: async (): Promise<TransactionReport> => {
    try {
      const userId = await getCurrentUserId();

      const { data, error } = await supabase
        .from('transactions')
        .select('amount, type')
        .eq('userId', userId)
        .eq('isDeleted', false);

      if (error) {
        throw error;
      }

      const report: TransactionReport = {
        totalIncome: 0,
        totalExpense: 0,
      };

      data?.forEach((item) => {
        const amount = parseFloat(item.amount);
        if (item.type === 'income') {
          report.totalIncome += amount;
        } else if (item.type === 'expense') {
          report.totalExpense += amount;
        }
      });

      return report;
    } catch (error) {
      console.error('Error fetching transaction report:', error);
      throw error;
    }
  },

  /**
   * Lấy chi tiết một transaction theo id
   */
  getById: async (id: string): Promise<TransactionModel & BaseEntity> => {
    try {
      const userId = await getCurrentUserId();

      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('id', id)
        .eq('userId', userId)
        .eq('isDeleted', false)
        .single();

      if (error) {
        throw error;
      }

      if (!data) {
        throw new Error('Transaction not found');
      }

      return {
        id: data.id,
        description: data.description,
        amount: parseFloat(data.amount),
        type: data.type as 'income' | 'expense',
        paidAt: new Date(data.paidAt),
        category: data.category,
        createdAt: new Date(data.createdAt),
        updatedAt: data.updatedAt ? new Date(data.updatedAt) : new Date(data.createdAt),
        isDeleted: data.isDeleted,
      };
    } catch (error) {
      console.error('Error fetching transaction:', error);
      throw error;
    }
  },

  /**
   * Cập nhật một transaction
   */
  update: async (id: string, payload: TransactionModel): Promise<void> => {
    try {
      const userId = await getCurrentUserId();

      const { error } = await supabase
        .from('transactions')
        .update({
          description: payload.description,
          amount: payload.amount.toString(),
          type: payload.type,
          paidAt: payload.paidAt.toISOString(),
          category: payload.category,
        })
        .eq('id', id)
        .eq('userId', userId);

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error('Error updating transaction:', error);
      throw error;
    }
  },

  /**
   * Xóa một transaction (soft delete)
   */
  delete: async (id: string): Promise<void> => {
    try {
      const userId = await getCurrentUserId();

      const { error } = await supabase
        .from('transactions')
        .update({ isDeleted: true })
        .eq('id', id)
        .eq('userId', userId);

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error('Error deleting transaction:', error);
      throw error;
    }
  },
};

/**
 * AI Service - Quét hóa đơn và trích xuất thông tin transactions
 */
const AIService = {
  /**
   * Scan receipt image và trích xuất transactions
   */
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
      "AIzaSyAb-QCcSa6A3ZstGlAMY2VuWvf2JQdrFqQ"
    );
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      generationConfig: {
        responseMimeType: 'application/json',
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
};

/**
 * User Service - Quản lý thông tin user
 */
const UserService = {
  /**
   * Cập nhật profile của user (fullName, phone)
   */
  updateProfile: async (payload: {
    fullName?: string;
    phone?: string;
  }): Promise<void> => {
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session?.user) {
        throw new Error('User not authenticated');
      }

      const updateData: {
        data?: Record<string, any>;
        phone?: string;
      } = {};
      
      if (payload.fullName !== undefined) {
        updateData.data = { ...updateData.data, fullName: payload.fullName };
      }
      
      if (payload.phone !== undefined) {
        updateData.phone = payload.phone;
      }

      const { error } = await supabase.auth.updateUser(updateData);

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  },

  /**
   * Đổi mật khẩu của user
   */
  updatePassword: async (newPassword: string): Promise<void> => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error('Error updating password:', error);
      throw error;
    }
  },
};

/**
 * Export tất cả services
 */
export const SERVICES = {
  TransactionService,
  AIService,
  UserService,
};
