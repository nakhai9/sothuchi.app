"use client";
import {
  useCallback,
  useEffect,
  useState,
} from 'react';

import clsx from 'clsx';
import {
  CircleArrowDown,
  CircleArrowUp,
  CircleDollarSign,
  Plus,
  SquarePlus,
} from 'lucide-react';
import toast from 'react-hot-toast';

import { useModal } from '@/hooks';
import { SERVICES } from '@/services/service';
import {
  Modal,
  PageLayout,
  TransactionForm,
  TransactionItems,
} from '@/shared/components';
import AccountForm from '@/shared/components/Forms/AccountForm';
import { IconButton } from '@/shared/components/ui';
import { Utils } from '@/shared/lib/utils';
import { useGlobalStore } from '@/store/globalStore';
import {
  AccountModel,
  AccountReport,
} from '@/types/account';
import { BaseEntity } from '@/types/base';
import { TransactionModel } from '@/types/transaction';

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
    >
      <div className="flex md:flex-row flex-col gap-4">
        <div className="space-y-4 w-full md:w-66">
          <div className="bg-white shadow-lg rounded-md overflow-hidden">
            <div className="flex justify-between items-center px-3 py-2 border-slate-200 border-b">
              <h3 className="font-medium text-gray-600 text-lg">
                Your accounts
              </h3>
              <IconButton
                type="button"
                key="add-account"
                icon={<Plus size={16} />}
                onClick={accountActions.create}
                size="sm"
                title="Add account"
              />
            </div>
            {accounts.length ? (
              accounts.map((account) => (
                <div
                  key={account.id}
                  onClick={() => selectAccount(account)}
                  className={clsx(
                    `group flex flex-col justify-between hover:bg-gray-100 px-4 py-2 cursor-pointer`,
                    account.id === selectedAccount?.id && "bg-gray-200"
                  )}
                >
                  <div className="text-gray-700">
                    <p className="">{account.name}</p>
                    <span className="text-xl">{account.amountFormatted}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      className="text-blue-600 hover:text-blue-500 text-xs cursor-pointer"
                      onClick={() => accountActions.edit(account.id as number)}
                    >
                      Detail
                    </button>
                    |
                    <button
                      onClick={() => accountActions.delete(account.id!)}
                      type="button"
                      className="text-red-600 hover:text-red-500 text-xs cursor-pointer"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-4">
                <p className="text-gray-400 text-center">No Accounts Found</p>
              </div>
            )}
          </div>
        </div>

        <div className="flex-1">
          <div className="bg-white shadow-lg rounded-md">
            <div className="flex justify-between items-center mb-3 px-3 py-2 border-slate-200 border-b">
              <h3 className="font-medium text-gray-600 text-lg">
                Transaction History
              </h3>
              {accounts.length > 0 && (
                <div>
                  <IconButton
                    icon={<SquarePlus size={16} />}
                    type="button"
                    className="text-amber-500"
                    size="sm"
                    onClick={() => handleOpenModal(ModalName.Transaction)}
                  />
                </div>
              )}
            </div>
            <div className="grid md:grid-cols-3 px-3 py-2">
              <div className="flex items-center gap-2 text-lg">
                <CircleArrowDown className="bg-green-500 rounded-full text-white" />
                <span className="text-gray-600">
                  {Utils.currency.format(report?.totalIncome ?? 0)}
                </span>
              </div>
              <div className="flex items-center gap-2 text-lg">
                <CircleArrowUp className="bg-rose-500 rounded-full text-white" />
                <span className="text-gray-600">
                  {Utils.currency.format(report?.totalExpense ?? 0)}
                </span>
              </div>
              <div className="flex items-center gap-2 text-lg">
                <CircleDollarSign className="bg-blue-500 rounded-full text-white" />
                <span className="text-gray-600">
                  {Utils.currency.format(report?.balance ?? 0)}
                </span>
              </div>
            </div>
            <div className="max-h-[500px] overflow-auto">
              <TransactionItems transactions={transactions} />
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
