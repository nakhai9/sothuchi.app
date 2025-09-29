"use client";
import {
  useCallback,
  useEffect,
  useState,
} from 'react';

import {
  WalletMinimal,
} from 'lucide-react';
import { useRouter } from 'next/navigation';

import { Utils } from '@/lib/utils';
import { SERVICES } from '@/services/service';
import { useGlobalStore } from '@/store/globalStore';
import { BaseEntity } from '@/types/base';
import {
  TransactionModel,
  TransactionReport,
} from '@/types/transaction';

import {
  PageLayout,
  TransactionForm,
  TransactionItems,
} from '../components';
import {
  IconButton,
} from '../ui';
import Link from 'next/link';

export default function Dashboard() {
  const router = useRouter();
  const [report, setReport] = useState<TransactionReport | null>(null);
  const [transactions, setTransactions] = useState<
    (TransactionModel & BaseEntity)[]
  >([]);
  const setLoading = useGlobalStore((state) => state.setLoading);
  const handleGoToPage = (url: string) => {
    router.push(url);
  };

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
    const transactions = await SERVICES.TransactionService.getAll({
      page: 1,
      limit: 10,
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

  useEffect(() => {
    fetchTransactionReport();
    fetchTransactions();
  }, [fetchTransactionReport, fetchTransactions]);

  const actions = [
    <IconButton
      type="button"
      key="wallets"
      onClick={() => handleGoToPage("/accounts")}
      icon={<WalletMinimal size={20} />}
      size="md"
      title="Wallets"
    />,
  ];

  return (
    <PageLayout
      title="Dashboard"
      description="Welcome to your Dashboard – an overview of your financial activities."
      actions={actions}
    >
      {/* Financial Overview Panels */}
      <div className="gap-4 grid grid-cols-2 mb-8">
        {/* Total Income Panel */}
        <div className="bg-white shadow-lg p-4 rounded-md">
          <div className='flex items-center gap-2'>
            <div className='bg-green-500 rounded-full w-3 h-3'></div>
            <h4 className="flex items-center gap-2 font-semibold text-gray-600 text-xs md:text-sm">
              Total Income
            </h4>
          </div>
          <p className="font-bold text-gray-600 md:text-xl text:sm">
            {Utils.currency.format(report?.totalIncome ?? 0)}
          </p>
        </div>


        {/* Total Expenses Panel */}
        <div className="bg-white shadow-lg p-4 rounded-md">
          <div className='flex items-center gap-2'>
            <div className='bg-red-500 rounded-full w-3 h-3'></div>
            <h4 className="flex items-center gap-2 font-semibold text-gray-600 text-xs md:text-sm">
              Total Expense
            </h4>
          </div>
          <p className="font-bold text-gray-600 md:text-xl text:sm">
            {Utils.currency.format(report?.totalExpense ?? 0)}
          </p>
        </div>

      </div>

      {/* Additional Dashboard Content */}
      <div className='flex md:flex-row flex-col gap-4'>
        <div className='w-full md:w-64'>
          <h3 className='mb-2 font-medium text-gray-500 text-lg'>
            Add New Transaction
          </h3>
          <div className='bg-white shadow p-4 rounded'>
            <TransactionForm />
            <button type='button'>
              Add
            </button>
          </div>
        </div>
        <div className="flex-1">
          <div className='flex justify-between items-center mb-2'>
            <h3 className='font-medium text-gray-500 text-lg'>
              Recent Activity
            </h3>
            <Link href="/transactions" className='font-bold text-gray-400 hover:text-gray-300 text-sm'>See all</Link>
          </div>
          <div className=''>
            <TransactionItems transactions={transactions} />
          </div>
        </div>

      </div>
    </PageLayout>
  );
}
