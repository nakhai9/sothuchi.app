"use client";
import {
  useCallback,
  useEffect,
  useState,
} from 'react';

import clsx from 'clsx';
import {
  CirclePlus,
  SquarePen,
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
import { IconButton } from '../ui';

enum ModalName {
  Account = "account",
  Transaction = "transaction",
}

export default function Account() {
  const modal = useModal();
  const [modalName, setModalName] = useState<ModalName | null>(null);
  const [accounts, setAccounts] = useState<(AccountModel & BaseEntity)[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<
    (AccountModel & BaseEntity) | undefined
  >(undefined);
  const [account, setAccount] = useState<
    (AccountModel & BaseEntity) | undefined
  >(undefined);
  const [transactions, setTransactions] = useState<
    (TransactionModel & BaseEntity)[]
  >([]);
  const [report, setReport] = useState<AccountReport | null>(null);

  const setLoading = useGlobalStore((state) => state.setLoading);

  const accountActions = {
    create: () => {
      handleOpenModal(ModalName.Account);
    },
    edit: async (id: number) => {
      handleOpenModal(ModalName.Account);
      await fetchAccountById(id);
    },
    delete: (id: number) => {
      deleteAccount(id);
    },
  };

  const actions = [
    <IconButton
      type="button"
      key="add-account"
      icon={<CirclePlus size={20} />}
      onClick={accountActions.create}
      size="md"
      title="Add account"
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

  // Handlers
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
    }
  };

  const fetchAccountById = async (id: number) => {
    try {
      const account = await SERVICES.AccountService.getAccountById(id);
      setAccount(account);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

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
                  <div className="flex items-center">
                    <button
                      type="button"
                      className="flex justify-center items-center hover:bg-blue-100 rounded-full w-8 h-8 text-blue-600 cursor-pointer"
                      onClick={() => accountActions.edit(account.id as number)}
                    >
                      <SquarePen size={16} />
                    </button>
                    <button
                      onClick={() => accountActions.delete(account.id!)}
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
                  <div className="bg-green-500 rounded-full w-3 h-3"></div>{" "}
                  Total Income
                </h4>
                <p className="font-bold text-gray-600 md:text-xl text:sm">
                  {Utils.currency.format(report?.totalIncome ?? 0)}
                </p>
              </div>
              <div className="bg-white shadow-lg p-4 rounded-md">
                <h4 className="flex items-center gap-2 font-semibold text-gray-600 text-xs md:text-sm">
                  <div className="bg-red-500 rounded-full w-3 h-3"></div> Total
                  Expense
                </h4>
                <p className="font-bold text-gray-600 md:text-xl text:sm">
                  {Utils.currency.format(report?.totalExpense ?? 0)}
                </p>
              </div>
              <div className="bg-white shadow-lg p-4 rounded-md">
                <h4 className="flex items-center gap-2 font-semibold text-gray-600 text-xs md:text-sm">
                  <div className="bg-blue-500 rounded-full w-3 h-3"></div>{" "}
                  Balance
                </h4>
                <p className="font-bold text-gray-600 md:text-xl text:sm">
                  {Utils.currency.format(report?.balance ?? 0)}
                </p>
              </div>
            </div>
          )}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-medium text-gray-500 text-lg">
                Transaction History
              </h3>
              {accounts.length > 0 && (
                <button
                  type="button"
                  onClick={() => handleOpenModal(ModalName.Transaction)}
                  className="bg-white hover:bg-slate-50 px-4 py-1 border border-slate-300 rounded font-medium text-sm cursor-pointer"
                >
                  Add new transaction
                </button>
              )}
            </div>
            <div className="max-h-[400px] overflow-auto">
              {accounts.length > 0 && (
                <TransactionItems transactions={transactions} />
              )}
            </div>
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
          <AccountForm
            modal={modal}
            onSuccess={onAccountSubmitSuccess}
            formData={account}
          />
        ) : (
          <TransactionForm
            modal={modal}
            onSuccess={onTransactionSubmitSuccess}
            actions={formActions}
          />
        )}
      </Modal>
    </PageLayout>
  );
}
