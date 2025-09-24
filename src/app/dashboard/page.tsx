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
  const modal = useModal();
  const [report, setReport] = useState<TransactionReport | null>(null);
  const [transactions, setTransactions] = useState<
    (TransactionModel & BaseEntity)[]
  >([]);

  const handleGoToPage = (url: string) => {
    router.push(url);
  };

  const handleOpenTransactionModal = () => {
    modal.open();
  };

  const fetchTransactionReport = useCallback(async () => {
    const report = await SERVICES.TransactionService.getReport();
    if (report) {
      setReport(report);
    }
  }, []);

  const fetchTransactions = useCallback(async () => {
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
  }, []);

  useEffect(() => {
    fetchTransactionReport();
    fetchTransactions();
  }, [fetchTransactionReport, fetchTransactions]);

  const actions = [
    <IconButton
      type="button"
      key="add-transaction"
      icon={<CirclePlus size={20} />}
      onClick={handleOpenTransactionModal}
      size="md"
      title="Add transaction"
    />,
    <IconButton
      type="button"
      key="transactions"
      icon={<ReceiptText size={20} />}
      onClick={() => handleGoToPage("/transactions")}
      size="md"
      title="Transactions"
    />,
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
      <div className="bg-white shadow-sm p-6 rounded-lg">
        <h2 className="mb-4 font-semibold text-gray-900 text-xl">
          Recent Activity
        </h2>
        <DataGrid data={transactions} columns={columns} />
      </div>

      <Modal
        isOpen={modal.isOpen}
        onClose={modal.close}
        title="Add New Transaction"
        description="Enter the details of your new transaction below."
      >
        <TransactionForm modal={modal} />
      </Modal>
    </PageLayout>
  );
}
