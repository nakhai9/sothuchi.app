import { 
  Transaction, 
  CreateTransactionRequest, 
  UpdateTransactionRequest, 
  TransactionStats 
} from "@/types/transaction";
import { httpService } from "./httpService";

export class TransactionService {
  private baseUrl = "/transactions";

  async getAll(): Promise<Transaction[]> {
    return await httpService.get<Transaction[]>(this.baseUrl);
  }

  async getById(id: number): Promise<Transaction> {
    return await httpService.get<Transaction>(`${this.baseUrl}/${id}`);
  }

  async getByAccount(accountId: number): Promise<Transaction[]> {
    return await httpService.get<Transaction[]>(`${this.baseUrl}/account/${accountId}`);
  }

  async getStats(): Promise<TransactionStats> {
    return await httpService.get<TransactionStats>(`${this.baseUrl}/stats`);
  }

  async create(data: CreateTransactionRequest): Promise<Transaction> {
    return await httpService.post<Transaction>(this.baseUrl, data);
  }

  async update(id: number, data: UpdateTransactionRequest): Promise<Transaction> {
    return await httpService.patch<Transaction>(`${this.baseUrl}/${id}`, data);
  }

  async delete(id: number): Promise<void> {
    await httpService.delete(`${this.baseUrl}/${id}`);
  }
}

export const transactionService = new TransactionService();
