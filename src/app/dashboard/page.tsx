"use client";
import {
  useCallback,
  useEffect,
  useState,
} from 'react';

import {
  Eye,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';
import Link from 'next/link';

import { SERVICES } from '@/services/service';
import {
  PageLayout,
  TransactionForm,
  TransactionItems,
} from '@/shared/components';
import { Utils } from '@/shared/lib/utils';
import { useGlobalStore } from '@/store/globalStore';
import { BaseEntity } from '@/types/base';
import {
  TransactionModel,
  TransactionReport,
} from '@/types/transaction';

export default function Dashboard() {
  const [report, setReport] = useState<TransactionReport | null>(null);
  const [transactions, setTransactions] = useState<
    (TransactionModel & BaseEntity)[]
  >([]);
  const setLoading = useGlobalStore((state) => state.setLoading);

  const fetchTransactionReport = useCallback(async () => {
    setLoading(true);
    const report = await SERVICES.TransactionService.getReport();
    if (report) {
      setReport(report);
    }
    setLoading(false);
  }, []);

  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    // Lấy tối đa 5 transactions có paidAt gần nhất (mới nhất)
    const transactions = await SERVICES.TransactionService.getAll({
      limit: 5,
    });
    if (transactions) {
      setTransactions(
        transactions.map((x) => ({
          ...x,
          amountFormatted: Utils.currency.format(x.amount),
          paidAtFormatted: Utils.date.format(x.paidAt),
        }))
      );
    }
    setLoading(false);
  }, []);

  const fetchData = useCallback(async () => {
    fetchTransactionReport();
    fetchTransactions();
  }, [fetchTransactionReport, fetchTransactions]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const formActions = [
    <button
      key="add"
      type="submit"
      className="bg-amber-500 hover:bg-amber-600 px-4 py-2 border border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 w-full font-medium text-white text-sm cursor-pointer"
    >
      Add Transaction
    </button>,
  ];

  const onSuccess = async () => {
    await fetchData();
  };

  return (
    <PageLayout
      title="Dashboard"
      description="Welcome to your Dashboard – an overview of your financial activities."
    >
      {/* Financial Overview Panels */}
      <div className="gap-4 grid grid-cols-2 mb-8">
        {/* Total Income Panel */}
        <div className="flex justify-between items-center bg-green-100 shadow-lg hover:shadow-xl p-4 border border-green-200 rounded-md text-green-500">
          <div>
            <h4 className="flex items-center gap-2 text-xs md:text-sm">
              Total Income
            </h4>

            <p className="font-bold text-green-700 md:text-xl text:sm">
              {Utils.currency.format(report?.totalIncome ?? 0)}
            </p>
          </div>
          <div className="bg-green-500 p-1 rounded-md text-white">
            <TrendingUp />
          </div>
        </div>

        {/* Total Expenses Panel */}
        <div className="flex justify-between items-center bg-red-100 shadow-lg hover:shadow-xl p-4 border border-red-200 rounded-md text-red-500">
          <div>
            <h4 className="flex items-center gap-2 text-xs md:text-sm">
              Total Expenses
            </h4>

            <p className="font-bold text-red-700 md:text-xl text:sm">
              {Utils.currency.format(report?.totalExpense ?? 0)}
            </p>
          </div>
          <div className="bg-red-500 p-1 rounded-md text-white">
            <TrendingDown />
          </div>
        </div>
      </div>

      {/* Additional Dashboard Content */}
      <div className="flex md:flex-row flex-col gap-4">
        <div className="w-full md:w-80">
          <div className="bg-white shadow-md p-4 rounded">
            <h3 className="mb-2 font-medium text-gray-600 text-lg">
              Add New Transaction
            </h3>

            <TransactionForm actions={formActions} onSuccess={onSuccess} />
          </div>
        </div>
        <div className="flex-1">
          <div className="bg-white shadow-md p-4 rounded">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-medium text-gray-600 text-lg">
                Recent Transactions
              </h3>
              <Link
                href="/transactions"
                className="flex items-center gap-1 font-medium text-amber-500 hover:text-amber-400 text-sm"
              >
                View all <Eye size={16} />
              </Link>
            </div>
            <div className="max-h-[400px] overflow-auto">
              <TransactionItems transactions={transactions} showActions={false} />
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
