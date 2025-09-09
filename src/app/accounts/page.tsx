"use client";
import { useCallback, useEffect, useState } from "react";

import { CirclePlus } from "lucide-react";

import { useModal } from "@/hooks";
import { AccountModel } from "@/models/account";
import { BaseEntity } from "@/models/base";
import { SERVICES } from "@/services/service";

import { Modal, PageLayout } from "../components";
import AccountForm from "../components/Forms/AccountForm";
import { IconButton } from "../ui";

export default function Account() {
  const modal = useModal();
  const [accounts, setAccounts] = useState<(AccountModel & BaseEntity)[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleOpenAccountModal = () => {
    modal.open();
  };

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
    <PageLayout title="Accounts" actions={actions}>
      <div className="gap-4 grid grid-cols-1 md:grid-cols-4 mb-8">
        {accounts.map((account) => (
          <div
            key={account.id}
            className="shadow-md p-4 border border-slate-300 rounded-md"
          >
            <p className="font-medium text-gray-800 text-xl">{account.name}</p>
            <span className="text-gray-500 text-sm italic">
              {account.amount}
            </span>
          </div>
        ))}
      </div>

      <Modal isOpen={modal.isOpen} onClose={modal.close} title="Add Account">
        <AccountForm modal={modal} onSuccess={fetchAccounts} />
      </Modal>
    </PageLayout>
  );
}
