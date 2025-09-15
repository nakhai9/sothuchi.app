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
import {
  DataGrid,
  IconButton,
} from '../ui';
import { useGlobalStore } from '@/store/globalStore';
import toast from 'react-hot-toast';

const columns = [
  { title: "Category", field: "categoryId" as const },
  { title: "Description", field: "description" as const },
  { title: "Amount", field: "amount" as const },
];

export default function Account() {
  const modal = useModal();
  const [accounts, setAccounts] = useState<(AccountModel & BaseEntity)[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<
    (AccountModel & BaseEntity) | null
  >(null);

  const setLoading = useGlobalStore(state => state.setLoading);

  const handleOpenAccountModal = () => {
    modal.open();
  };

  const setAccount = (account: AccountModel & BaseEntity) => {
    setSelectedAccount(account);
  };

  const fetchAccounts = useCallback(async () => {
    setLoading(true);
    try {
      const accounts = await SERVICES.AccountService.getAll();
      if (accounts) {
        setAccounts(accounts);
        if (accounts.length > 0) {
          setSelectedAccount(accounts[0]);
        }
      }
    } catch (error) {
      toast.error("Failed to fetch accounts");
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteAccount = async (id: number | undefined) => {
    if (!id) return;
    setLoading(true);
    try {
      await SERVICES.AccountService.softDelete(id);
    } catch (error) {
      toast.error("Failed to delete account");
    } finally {
      setLoading(false);
      toast.success("Account deleted successfully");
      fetchAccounts();
    }
  };

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
    <PageLayout
      title="Accounts"
      description="Manage your accounts with ease – add, edit, and monitor balances for better money control."
      actions={actions}
    >
      <div className="flex md:flex-row flex-col gap-4 md:gap-8">
        <div className="flex flex-col bg-white shadow-lg rounded-md w-full md:w-80 h-80">
          <div className="px-4 py-2 border border-slate-100 font-bold text-gray-600 text-lg">
            Your accounts
          </div>
          <div className="overflow-auto">
            {accounts.length ? (
              accounts.map((account) => (
                <div
                  key={account.id}
                  onClick={() => setAccount(account)}
                  className={clsx(
                    `group flex justify-between items-center hover:bg-amber-400 px-4 py-2`,
                    account.id === selectedAccount?.id && "bg-amber-500"
                  )}
                >
                  <div>
                    <p className="group-hover:text-white">{account.name}</p>
                    <span className="text-gray-700 group-hover:text-white text-lg">
                      {account.amount}
                    </span>
                  </div>
                  <div>
                    <button
                      onClick={() => deleteAccount(account.id)}
                      type="button"
                      className="flex justify-center items-center hover:bg-red-100 rounded-full w-8 h-8 text-red-600 cursor-pointer"
                    >
                      <Trash size={16} />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <span className="text-gray-500">No data</span>
            )}
          </div>
        </div>
        <div className="flex-1 bg-white shadow-lg p-4 rounded-md">
          <h5 className="mb-2 font-medium text-gray-700 text-lg">
            Transaction History
          </h5>
          <DataGrid columns={columns} data={[]} />
        </div>
      </div>

      <Modal isOpen={modal.isOpen} onClose={modal.close} title="Add Account">
        <AccountForm modal={modal} onSuccess={fetchAccounts} />
      </Modal>
    </PageLayout>
  );
}
