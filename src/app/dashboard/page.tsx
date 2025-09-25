"use client";
import {
  useCallback,
  useEffect,
  useState,
} from 'react';

import clsx from 'clsx';
import {
  CirclePlus,
  ReceiptText,
  WalletMinimal,
} from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { useModal } from '@/hooks';
import { CATEGORIES } from '@/lib/constants/categories';
import { Utils } from '@/lib/utils';
import { SERVICES } from '@/services/service';
import { useGlobalStore } from '@/store/globalStore';
import { BaseEntity } from '@/types/base';
import {
  TransactionModel,
  TransactionReport,
} from '@/types/transaction';

import {
  Modal,
  PageLayout,
  TransactionForm,
} from '../components';
import {
  DataGrid,
  IconButton,
} from '../ui';
import Link from 'next/link';

const columns = [
  {
    title: "Category",
    field: "category" as const,
    cellRender: (row: TransactionModel & BaseEntity) => {
      return (
        <div className="relative w-8 h-8">
          <Image
            src={CATEGORIES.find((x) => x.value === row.category)?.icon ?? ""}
            alt=""
            fill
            className="object-contain"
          />
        </div>
      );
    },
  },
  { title: "Description", field: "description" as const },
  {
    title: "Amount",
    field: "amountFormatted" as const,
    cellRender: (row: TransactionModel & BaseEntity) => (
      <div
        className={clsx(
          row.type === "expense" ? "text-red-600" : "text-green-600"
        )}
      >
        {row.amountFormatted}
      </div>
    ),
  },
  {
    title: "Paid at",
    field: "paidAtFormatted" as const,
  },
];

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
      <div className="gap-6 grid grid-cols-1 md:grid-cols-2 mb-8">
        {/* Total Income Panel */}
        <div className="bg-white shadow-sm p-6 border-green-500 border-l-4 rounded-lg">
          <div>
            <p className="font-medium text-gray-600 text-sm">Total Income</p>
            <p className="font-bold text-gray-900 text-2xl">
              {Utils.currency.format(report?.totalIncome ?? 0)}
            </p>
          </div>
        </div>

        {/* Total Expenses Panel */}
        <div className="bg-white shadow-sm p-6 border-red-500 border-l-4 rounded-lg">
          <div>
            <p className="font-medium text-gray-600 text-sm">Total Expenses</p>
            <p className="font-bold text-gray-900 text-2xl">
              {Utils.currency.format(report?.totalExpense ?? 0)}
            </p>
          </div>
        </div>
      </div>

      {/* Additional Dashboard Content */}
      <div className='flex gap-6'>
        <div className='bg-white shadow-lg p-4 rounded-md w-96'>
          <TransactionForm />
        </div>
        <div className="flex-1 bg-white shadow-sm p-6 rounded-lg">
          <div className='flex justify-between items-center mb-2'>
            <h2 className="font-medium text-gray-600 text-lg">
              Recent Activity
            </h2>
            <Link href="/transactions" className='font-bold text-blue-600 hover:text-blue-400 text-sm'>See all</Link>
          </div>
          <DataGrid data={transactions} columns={columns} />
        </div>

      </div>
    </PageLayout>
  );
}
