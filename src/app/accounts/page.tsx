"use client";
import {
  useCallback,
  useEffect,
  useState,
} from 'react';

import clsx from 'clsx';
import {
  CirclePlus,
  Trash,
} from 'lucide-react';

import { useModal } from '@/hooks';
import { AccountModel } from '@/models/account';
import { BaseEntity } from '@/models/base';
import { SERVICES } from '@/services/service';

import {
  Modal,
  PageLayout,
} from '../components';
import AccountForm from '../components/Forms/AccountForm';
import { IconButton } from '../ui';

export default function Account() {
  const modal = useModal();
  const [accounts, setAccounts] = useState<(AccountModel & BaseEntity)[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<(AccountModel & BaseEntity) | null>(null);

  const handleOpenAccountModal = () => {
    modal.open();
  };

  const setAccount = (account: (AccountModel & BaseEntity)) => {
    setSelectedAccount(account)
  }

  const fetchAccounts = useCallback(async () => {
    setIsLoading(true);
    try {
      const accounts = await SERVICES.accountService.getAccounts();
      if (accounts) {
        setAccounts(accounts);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

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
    <PageLayout title="Accounts" description='Manage your accounts with ease – add, edit, and monitor balances for better money control.' actions={actions}>
      <div className="flex gap-8">
        <div className="flex flex-col gap-6 w-80 h-80 overflow-auto">
          {
            accounts.length ? accounts.map((account) => (<div key={account.id} onClick={() => setAccount(account)} className={clsx(`flex justify-between items-center hover:bg-amber-400 shadow-md px-6 py-2 border border-slate-300 rounded-full w-full`, account.id === selectedAccount?.id && "bg-amber-500")}>
              <div>
                <p className='text-sm'>{account.name}</p>
                <span className='text-gray-700 text-lg'>{account.amount}</span>
              </div>
              <div>
                <button type='button' className='flex justify-center items-center hover:bg-red-100 rounded-full w-8 h-8 text-red-600 cursor-pointer'><Trash size={16} /></button>
              </div>
            </div>)) : <span className='text-gray-500'>No data</span>
          }
        </div>
        <div className='flex-1'>
          Recent transactions of <span className='fw-bold'>{selectedAccount?.name}</span>
        </div>
      </div>

      <Modal isOpen={modal.isOpen} onClose={modal.close} title="Add Account">
        <AccountForm modal={modal} onSuccess={fetchAccounts} />
      </Modal>
    </PageLayout>
  );
}
