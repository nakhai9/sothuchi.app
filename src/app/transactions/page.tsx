"use client";
import {
  useCallback,
  useEffect,
  useState,
} from 'react';

import { CirclePlus } from 'lucide-react';
import toast from 'react-hot-toast';

import { useModal } from '@/hooks';
import { Utils } from '@/lib/utils';
import { SERVICES } from '@/services/service';
import { useGlobalStore } from '@/store/globalStore';
import { BaseEntity } from '@/types/base';
import { TransactionModel } from '@/types/transaction';

import {
  Modal,
  PageLayout,
  TransactionForm,
  TransactionItems,
} from '../components';
import { IconButton } from '../ui';

export default function Transactions() {
  const [transactions, setTransactions] = useState<
    (TransactionModel & BaseEntity)[]
  >([]);
  const setLoading = useGlobalStore((state) => state.setLoading);

  const modal = useModal();

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const list = await SERVICES.TransactionService.getAll();
      if (list) {
        setTransactions([
          ...list.map((x: TransactionModel & BaseEntity) => ({
            ...x,
            amountFormatted: Utils.currency.format(x.amount),
            paidAtFormatted: Utils.date.format(x.paidAt),
          })),
        ]);
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  }, [setLoading]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleFormSuccess = async () => {
    await fetchData();
    modal.close();
  };

  const handleOpenAccountModal = () => {
    modal.open();
  };

  const actions = [
    <IconButton
      type="button"
      key="add-transaction"
      icon={<CirclePlus size={20} />}
      onClick={handleOpenAccountModal}
      size="md"
      title="Add transaction"
    />,
  ];

  const formActions = [
    <button
      key="cancel"
      type="button"
      onClick={modal?.close}
      className="bg-white hover:bg-gray-50 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 font-medium text-gray-700 text-sm cursor-pointer"
    >
      Cancel
    </button>,
    <button
      key="add"
      type="submit"
      className="bg-amber-500 hover:bg-amber-600 px-4 py-2 border border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 font-medium text-white text-sm cursor-pointer"
    >
      Save
    </button>,
  ];

  return (
    <PageLayout
      title="Transactions"
      description="Manage your daily spending by adding, editing, and tracking transactions here."
      actions={actions}
    >
      <TransactionItems transactions={transactions} />
      <Modal
        isOpen={modal.isOpen}
        onClose={modal.close}
        title="Add New Transaction"
        description="Enter the details of your new transaction below."
      >
        <TransactionForm
          modal={modal}
          onSuccess={handleFormSuccess}
          actions={formActions}
        />
      </Modal>
    </PageLayout>
  );
}
