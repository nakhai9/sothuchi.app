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
import {
  AccountModel,
  AccountReport,
} from '@/types/account';
import { BaseEntity } from '@/types/base';
import { TransactionModel } from '@/types/transaction';

import {
  Modal,
  PageLayout,
  TransactionForm,
  TransactionItems,
} from '../components';
import AccountForm from '../components/Forms/AccountForm';
import {
  IconButton,
} from '../ui';

enum ModalName {
  Account = "account",
  Transaction = "transaction",
}

export default function Account() {
  const modal = useModal();
  const [modalName, setModalName] = useState<ModalName | null>(null);
  const [accounts, setAccounts] = useState<(AccountModel & BaseEntity)[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<
    (AccountModel & BaseEntity) | null
  >(null);
  const [transactions, setTransactions] = useState<
    (TransactionModel & BaseEntity)[]
  >([]);
  const [report, setReport] = useState<AccountReport | null>(null);

  const setLoading = useGlobalStore((state) => state.setLoading);

  const handleOpenModal = (name: ModalName) => {
    setModalName(name);
    modal.open();
  };

  const fetchAccounts = useCallback(async () => {
    setLoading(true);
    try {
      const accounts = await SERVICES.AccountService.getAll();

      const mappedAccounts =
        accounts?.map((a) => ({
          ...a,
          amountFormatted: Utils.currency.format(a.amount),
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
      const transactions =
        (await SERVICES.TransactionService.getAll({
          accountId: accountId,
        })) ?? [];

      const report = await fetchAccountReport(accountId);
      if (report) {
        setReport(report);
      }

      const mappedTransactions =
        transactions?.map((t) => ({
          ...t,
          amountFormatted: Utils.currency.format(t.amount),
          paidAtFormatted: Utils.date.format(t.paidAt),
        })) ?? [];

      setTransactions([...mappedTransactions]);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchAccountReport = async (accountId: number) => {
    try {
      const report = await SERVICES.AccountService.getReport(accountId);
      return report;
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  const onAccountSubmitSuccess = () => {
    fetchAccounts();
  };

  const onTransactionSubmitSuccess = async () => {
    if (!selectedAccount?.id) return;
    await fetchTransactionsByAccountId(selectedAccount.id);
  };

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
  };

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
                    account.id === selectedAccount?.id && "bg-amber-300"
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
        <div className="flex flex-col flex-1 gap-4">
          {accounts.length > 0 && (
            <div className="gap-4 grid grid-cols-3">
              <div className="bg-white shadow-lg p-4 rounded-md">
                <h4 className="flex items-center gap-2 font-semibold text-gray-600 text-xs md:text-sm">
                  <div className='bg-green-500 rounded-full w-3 h-3'></div> Total Income
                </h4>
                <p className="font-bold text-gray-600 md:text-xl text:sm">
                  {Utils.currency.format(report?.totalIncome ?? 0)}
                </p>
              </div>
              <div className="bg-white shadow-lg p-4 rounded-md">
                <h4 className="flex items-center gap-2 font-semibold text-gray-600 text-xs md:text-sm">
                  <div className='bg-red-500 rounded-full w-3 h-3'></div> Total Expense
                </h4>
                <p className="font-bold text-gray-600 md:text-xl text:sm">
                  {Utils.currency.format(report?.totalExpense ?? 0)}
                </p>
              </div>
              <div className="bg-white shadow-lg p-4 rounded-md">
                <h4 className="flex items-center gap-2 font-semibold text-gray-600 text-xs md:text-sm">
                  <div className='bg-blue-500 rounded-full w-3 h-3'></div> Balance
                </h4>
                <p className="font-bold text-gray-600 md:text-xl text:sm">
                  {Utils.currency.format(report?.balance ?? 0)}
                </p>
              </div>
            </div>
          )}
          <div className="space-y-4">
            <h3 className='font-semibold text-gray-500 text-xl'>
              Transaction History
            </h3>
            {accounts.length > 0 && <TransactionItems transactions={transactions} />}

          </div>
        </div>
      </div>

      {/* Modal */}
      <Modal
        isOpen={modal.isOpen}
        onClose={modal.close}
        title={
          modalName === ModalName.Transaction
            ? "Add Transaction"
            : "Add Account"
        }
      >
        {modalName === ModalName.Account ? (
          <AccountForm modal={modal} onSuccess={onAccountSubmitSuccess} />
        ) : (
          <TransactionForm
            modal={modal}
            onSuccess={onTransactionSubmitSuccess}
          />
        )}
      </Modal>
    </PageLayout>
  );
}
