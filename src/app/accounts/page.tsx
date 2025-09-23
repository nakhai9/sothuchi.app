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
import toast from 'react-hot-toast';

import { useModal } from '@/hooks';
import { Utils } from '@/lib/utils';
import { SERVICES } from '@/services/service';
import { useGlobalStore } from '@/store/globalStore';
import { AccountModel } from '@/types/account';
import { BaseEntity } from '@/types/base';
import { TransactionModel } from '@/types/transaction';

import {
  Modal,
  PageLayout,
  TransactionForm,
} from '../components';
import AccountForm from '../components/Forms/AccountForm';
import {
  DataGrid,
  IconButton,
} from '../ui';

const columns = [
  { title: "Description", field: "description" as const },
  {
    title: "Amount",
    field: "amountFormatted" as const,
    cellRender: (row: TransactionModel) => (
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
    field: 'paidAt' as const,
  }
];

enum ModalName {
  Account = 'account',
  Transaction = 'transaction'
}

export default function Account() {
  const modal = useModal();
  const [modalName, setModalName] = useState<ModalName | null>(null);
  const [accounts, setAccounts] = useState<(AccountModel & BaseEntity)[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<
    (AccountModel & BaseEntity) | null
  >(null);
  const [transactions, setTransactions] = useState<TransactionModel[]>([]);

  const setLoading = useGlobalStore((state) => state.setLoading);

  const handleOpenModal = (name: ModalName) => {
    setModalName(name);
    modal.open();
  };

  const fetchAccounts = useCallback(async () => {
    setLoading(true);
    try {

      const accounts = await SERVICES.AccountService.getAll();

      const mappedAccounts = accounts?.map(a => ({
        ...a,
        amountFormatted: Utils.currency.format(a.amount)
      })) ?? [];

      setAccounts(mappedAccounts);

      if (mappedAccounts.length > 0) {
        const first = mappedAccounts[0];
        setSelectedAccount(first);
        if (first?.id) {
          await fetchTransactionsByAccountId(first.id);
        }
      }
    } catch (error) {
      toast.error("Failed to fetch accounts");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchTransactionsByAccountId = async (accountId: number) => {
    try {
      const transactions = await SERVICES.TransactionService.getAll({
        accountId: accountId
      }) ?? [];

      const mappedTransactions = transactions?.map(t => ({
        ...t,
        amountFormatted: Utils.currency.format(t.amount)
      })) ?? []

      setTransactions([...mappedTransactions])

    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);


  const onAccountSubmitSuccess = () => {
    fetchAccounts();
  }

  const onTransactionSubmitSuccess = async () => {
    console.log("update transaction")
  }

  const deleteAccount = async (id: number | undefined) => {
    if (!id) return;
    setLoading(true);
    try {
      await SERVICES.AccountService.softDelete(id);
    } catch (error) {
      toast.error("Failed to delete account");
    } finally {
      setLoading(false);
      await fetchAccounts();
      toast.success("Account deleted successfully");
    }
  };

  const selectAccount = (account: AccountModel & BaseEntity) => {
    if (!account?.id) return;
    setSelectedAccount(account);
    fetchTransactionsByAccountId(account.id);
  }

  const actions = [
    <IconButton
      type="button"
      key="add-account"
      icon={<CirclePlus size={20} />}
      onClick={() => handleOpenModal(ModalName.Account)}
      size="md"
      title="Add account"
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
          <div className="px-4 py-2 border border-slate-100 font-medium text-gray-600 text-lg">
            Your accounts
          </div>
          <div className="flex flex-col overflow-auto">
            {accounts.length ? (
              accounts.map((account) => (
                <div
                  key={account.id}
                  onClick={() => selectAccount(account)}
                  className={clsx(
                    `group flex justify-between items-center hover:bg-amber-400 px-4 py-2 border-slate-200 border-b cursor-pointer`,
                    account.id === selectedAccount?.id && "bg-amber-500"
                  )}
                >
                  <div>
                    <p className="group-hover:text-white">{account.name}</p>
                    <span className="text-gray-700 group-hover:text-white text-lg">
                      {account.amountFormatted}
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
              <div className="p-4 text-gray-500 text-center">No data</div>
            )}
          </div>
        </div>
        <div className="flex flex-col flex-1 bg-white shadow-lg rounded-md">
          <div className="flex justify-between items-center px-4 py-2 border border-slate-100">
            <h5 className="font-medium text-gray-700 text-lg">
              Transaction History
            </h5>
            {accounts.length > 0 && (
              <button
                type="button"
                onClick={() => handleOpenModal(ModalName.Transaction)}
                className="bg-slate-100 hover:bg-slate-50 px-4 py-1 border border-slate-300 rounded font-medium text-sm cursor-pointer"
              >
                Add new transaction
              </button>
            )}
          </div>
          <div className='flex-1 p-4'>
            {accounts.length > 0 && (
              <DataGrid columns={columns} data={transactions} />
            )}
          </div>
        </div>
      </div>


      {/* Modal */}
      <Modal
        isOpen={modal.isOpen}
        onClose={modal.close}
        title={modalName === ModalName.Transaction ? 'Add Transaction' : 'Add Account'}
      >
        {
          modalName === ModalName.Account ?
            <AccountForm modal={modal} onSuccess={onAccountSubmitSuccess} />
            : <TransactionForm
              modal={modal}
              onSuccess={onTransactionSubmitSuccess}
            />
        }
      </Modal>

    </PageLayout>
  );
}
