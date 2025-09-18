"use client";
import { useCallback, useEffect, useState } from "react";

import clsx from "clsx";
import { CirclePlus, Trash } from "lucide-react";
import toast from "react-hot-toast";

import { useModal } from "@/hooks";
import { Utils } from "@/lib/utils";
import { SERVICES } from "@/services/service";
import { useGlobalStore } from "@/store/globalStore";
import { AccountModel } from "@/types/account";
import { BaseEntity } from "@/types/base";

import { Modal, PageLayout, TransactionForm } from "../components";
import AccountForm from "../components/Forms/AccountForm";
import { DataGrid, IconButton } from "../ui";
import { TransactionModel } from "@/types/transaction";

const columns = [
  { title: "Description", field: "description" as const },
  {
    title: "Amount", field: "amountFormatted" as const,
    cellRender: (row: TransactionModel) => (<div className={clsx(row.type === 'expense' ? 'text-red-600' : 'text-green-600')}>{row.amountFormatted}</div>)
  },
];

export default function Account() {
  const modal = useModal();
  const [accounts, setAccounts] = useState<(AccountModel & BaseEntity)[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<
    (AccountModel & BaseEntity) | null
  >(null);
  const [transactions, setTransactions] = useState<TransactionModel[]>([]);

  const [hasTransactionModal, setHasTransactionModal] = useState<boolean>(false);

  const setLoading = useGlobalStore((state) => state.setLoading);

  const handleOpenModal = () => {
    modal.open();
  };

  const setAccount = (account: AccountModel & BaseEntity) => {
    setSelectedAccount(account);
  };

  const fetchAccountsAndTransactions = useCallback(async () => {
    setLoading(true);
    try {
      const accountList = await SERVICES.AccountService.getAll();
      if (accountList && accountList?.length > 0) {
        const mapped = accounts.map((x) => ({
          ...x,
          amountFormatted: Utils.currency.format(x.amount),
        }));
        setAccounts(mapped);

        const first = mapped[0];
        setSelectedAccount(first);

        const response = await SERVICES.TransactionService.getAll({ accountId: first.id });
        if (response) {
          const mappedTx = response.map((tx: TransactionModel) => ({
            ...tx,
            amountFormatted: Utils.currency.format(tx.amount),
          }));
          setTransactions(mappedTx);
        }
      }
    } catch (error) {
      toast.error("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAccountsAndTransactions();
  }, [fetchAccountsAndTransactions]);


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
      fetchAccountsAndTransactions();
    }
  };

  const actions = [
    <IconButton
      type="button"
      key="add-transaction"
      icon={<CirclePlus size={20} />}
      onClick={handleOpenModal}
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
              <span className="text-gray-500">No data</span>
            )}
          </div>
        </div>
        <div className="flex-1 bg-white shadow-lg p-4 rounded-md">
          <div className="flex justify-between items-center mb-2">
            <h5 className="font-medium text-gray-700 text-lg">
              Transaction History
            </h5>
            <button type="button" onClick={handleOpenModal} className="bg-slate-100 hover:bg-slate-50 px-4 py-2 border border-slate-300 rounded font-medium text-sm cursor-pointer">Add new transaction</button>
          </div>
          <DataGrid columns={columns} data={transactions} />
        </div>
      </div>

      {
        hasTransactionModal ? (<Modal isOpen={modal.isOpen} onClose={modal.close} title="Add Account">
          <AccountForm modal={modal} onSuccess={fetchAccountsAndTransactions} />
        </Modal>) : (<Modal isOpen={modal.isOpen} onClose={modal.close} title="Add Transaction">
          <TransactionForm modal={modal} onSuccess={fetchAccountsAndTransactions} />
        </Modal>)
      }
    </PageLayout>
  );
}
