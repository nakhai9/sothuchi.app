"use client";
import { CirclePlus } from 'lucide-react';

import { useModal } from '@/hooks';

import {
  Modal,
  PageLayout,
  TransactionForm,
} from '../components';
import {
  DataGrid,
  IconButton,
} from '../ui';
import { useEffect, useState } from 'react';
import { useGlobalStore } from '@/store/globalStore';
import { TransactionModel } from '@/types/transaction';
import toast from 'react-hot-toast';
import { SERVICES } from '@/services/service';
import { Utils } from '@/lib/utils';
import clsx from 'clsx';

const columns = [
  { title: "Description", field: "description" as const },
  {
    title: "Amount", field: "amountFormatted" as const,
    cellRender: (row: TransactionModel) => (<div className={clsx(row.type === 'expense' ? 'text-red-600' : 'text-green-600')}>{row.amountFormatted}</div>)
  },
];

export default function Transactions() {

  const [transactions, setTransactions] = useState<TransactionModel[]>([]);
  const setLoading = useGlobalStore(state => state.setLoading);

  const modal = useModal();

  useEffect(() => {
    const fetchData = async () => {

      setLoading(true)
      try {
        const transactions = await SERVICES.TransactionService.getAll();
        if (transactions) {
          setTransactions(transactions.map(x => {
            x.amountFormatted = Utils.currency.format(x.amount)
            return x;
          }))
        }
      } catch (error) {
        toast.error('Something went wrong')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [setLoading])

  const handleOpenAccountModal = () => {
    modal.open()
  }
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

  return (
    <PageLayout title="Transactions" description='Manage your daily spending by adding, editing, and tracking transactions here.' actions={actions}>

      <DataGrid columns={columns} data={transactions} />

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
