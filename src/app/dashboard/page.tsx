"use client";
import {
  CirclePlus,
  ReceiptText,
  WalletMinimal,
} from 'lucide-react';
import { useRouter } from 'next/navigation';

import { useModal } from '@/hooks';

import {
  Modal,
  PageLayout,
  TransactionForm,
} from '../components';
import { IconButton } from '../ui';

export default function Dashboard() {
  const router = useRouter();
  const addTransactionModal = useModal();

  // Mock data - replace with real data from your API
  const totalIncome = 12500.0;
  const totalExpenses = 8750.0;
  const totalBalance = totalIncome - totalExpenses;

  const handleGoToTransactionsPage = () => {
    router.push("/transactions");
  };

  const actions = [
    <IconButton
      type="button"
      key="add-transaction"
      icon={<CirclePlus size={20} />}
      onClick={addTransactionModal.open}
      size="md"
      title="Add transaction"
    />,
    <IconButton
      type="button"
      key="transactions"
      icon={<ReceiptText size={20} />}
      onClick={handleGoToTransactionsPage}
      size="md"
      title="Transactions"
    />,
    <IconButton
      type="button"
      key="wallets"
      icon={<WalletMinimal size={20} />}
      size="md"
      title="Wallets"
    />,
  ];

  return (
    <PageLayout title="Dashboard" actions={actions}>
      {/* Financial Overview Panels */}
      <div className="gap-6 grid grid-cols-1 md:grid-cols-3 mb-8">
        {/* Total Income Panel */}
        <div className="bg-white shadow-sm p-6 border-green-500 border-l-4 rounded-lg">
          <div>
            <p className="font-medium text-gray-600 text-sm">Total Income</p>
            <p className="font-bold text-gray-900 text-2xl">
              $
              {totalIncome.toLocaleString("en-US", {
                minimumFractionDigits: 2,
              })}
            </p>
          </div>
        </div>

        {/* Total Expenses Panel */}
        <div className="bg-white shadow-sm p-6 border-red-500 border-l-4 rounded-lg">
          <div>
            <p className="font-medium text-gray-600 text-sm">Total Expenses</p>
            <p className="font-bold text-gray-900 text-2xl">
              $
              {totalExpenses.toLocaleString("en-US", {
                minimumFractionDigits: 2,
              })}
            </p>
          </div>
        </div>

        {/* Total Balance Panel */}
        <div className="bg-white shadow-sm p-6 border-blue-500 border-l-4 rounded-lg">
          <div>
            <p className="font-medium text-gray-600 text-sm">Total Balance</p>
            <p
              className={`text-2xl font-bold ${
                totalBalance >= 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              $
              {totalBalance.toLocaleString("en-US", {
                minimumFractionDigits: 2,
              })}
            </p>
          </div>
        </div>
      </div>

      {/* Additional Dashboard Content */}
      <div className="bg-white shadow-sm p-6 rounded-lg">
        <h2 className="mb-4 font-semibold text-gray-900 text-xl">
          Recent Activity
        </h2>
        <p className="text-gray-600">
          Your recent transactions and activities will appear here.
        </p>
      </div>

      {/* Add Transaction Modal */}
      <Modal
        isOpen={addTransactionModal.isOpen}
        onClose={addTransactionModal.close}
        title="Add New Transaction"
        description="Enter the details of your new transaction below."
      >
        <TransactionForm />
      </Modal>
    </PageLayout>
  );
}
