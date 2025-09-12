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

const columns = [{ title: "Description", field: "description" as const }];

const data = [
  {
    description: "hello",
  },
];
export default function Transactions() {

  const modal = useModal();

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

      <DataGrid columns={columns} data={data} />

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
