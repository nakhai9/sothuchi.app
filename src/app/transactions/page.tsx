"use client";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { CirclePlus } from 'lucide-react';
import toast from 'react-hot-toast';

import { useModal } from '@/hooks';
import { SERVICES } from '@/services/service';
import {
  DeleteModal,
  Modal,
  PageLayout,
  TransactionForm,
  TransactionItems,
} from '@/shared/components';
import { Utils } from '@/shared/lib/utils';
import { useGlobalStore } from '@/store/globalStore';
import { BaseEntity } from '@/types/base';
import { TransactionModel } from '@/types/transaction';

import { IconButton } from '../../shared/components/ui';

export default function Transactions() {
  const [transactions, setTransactions] = useState<
    (TransactionModel & BaseEntity)[]
  >([]);
  const setLoading = useGlobalStore((state) => state.setLoading);

  const modal = useModal();

  const [event, setEvent] = useState<"view" | "edit" | "delete" | "add">("add");
  const [selectedTransaction, setSelectedTransaction] = useState<
    (TransactionModel & BaseEntity) | null
  >(null);
  const [transactionDetail, setTransactionDetail] = useState<
    (TransactionModel & BaseEntity) | null
  >(null);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);
  const [paidAtFilter, setPaidAtFilter] = useState<{
    from: string;
    to: string;
  }>({ from: "", to: "" });
  const [typeFilter, setTypeFilter] = useState<"all" | "expense" | "income">("all");

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const list = await SERVICES.TransactionService.getAll();
      if (list) {
        setTransactions([
          ...list.map((x: TransactionModel & BaseEntity) => ({
            ...x,
            amountFormatted: Utils.currency.format(x.amount),
            paidAtFormatted: Utils.date.format(x.paidAt),
          })),
        ]);
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  }, [setLoading]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleFormSuccess = async () => {
    await fetchData();
    modal.close();
  };

  const handleOpenAccountModal = () => {
    modal.open();
    setEvent("add");
  };

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

  const formActions = (event: "view" | "edit" | "delete" | "add") => {
    if (event === "view") {
      return [
        <button
          key="close"
          type="button"
          onClick={modal?.close}
          className="bg-white hover:bg-gray-50 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 font-medium text-gray-700 text-sm cursor-pointer"
        >
          Close
        </button>,
      ];
    }
    return [
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
  };

  const handleEventItem = (event: "view" | "edit" | "delete", transaction: TransactionModel & BaseEntity) => {
    setEvent(event);
    setSelectedTransaction(transaction);
    modal.open();
  };

  const fetchTransactionDetail = useCallback(async (id: string | number | undefined) => {
    if (!id) return;
    
    setIsLoadingDetail(true);
    try {
      const detail = await SERVICES.TransactionService.getById(String(id));
      setTransactionDetail({
        ...detail,
        amountFormatted: Utils.currency.format(detail.amount),
        paidAtFormatted: Utils.date.format(detail.paidAt),
      });
    } catch (error) {
      toast.error("Không thể tải chi tiết transaction. Vui lòng thử lại");
      console.error("Error fetching transaction detail:", error);
    } finally {
      setIsLoadingDetail(false);
    }
  }, []);

  // Gọi API khi modal mở và event là "view" hoặc "edit"
  useEffect(() => {
    if (modal.isOpen && (event === "view" || event === "edit") && selectedTransaction?.id) {
      fetchTransactionDetail(selectedTransaction.id);
    } else if (!modal.isOpen) {
      // Reset khi modal đóng
      setTransactionDetail(null);
      setIsLoadingDetail(false);
    }
  }, [modal.isOpen, event, selectedTransaction?.id, fetchTransactionDetail]);

  const handleDeleteTransaction = async () => {
    if (!selectedTransaction || !selectedTransaction.id) return;
    
    setLoading(true);
    try {
      await SERVICES.TransactionService.delete(String(selectedTransaction.id));
      await fetchData();
      modal.close();
      setSelectedTransaction(null);
      setEvent("add");
      toast.success("Xóa transaction thành công");
    } catch (error) {
      toast.error("Không thể xóa transaction. Vui lòng thử lại");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelDelete = () => {
    modal.close();
    setSelectedTransaction(null);
    setTransactionDetail(null);
    setEvent("add");
  };

  const handleCloseModal = () => {
    modal.close();
    setSelectedTransaction(null);
    setTransactionDetail(null);
    setIsLoadingDetail(false);
    setEvent("add");
  };

  const filteredTransactions = useMemo(() => {
    return transactions.filter((transaction) => {
      // Lọc theo type
      if (typeFilter !== "all" && transaction.type !== typeFilter) {
        return false;
      }

      // Lọc theo paidAt
      if (!paidAtFilter.from && !paidAtFilter.to) return true;

      const paidDate = new Date(transaction.paidAt);
      if (Number.isNaN(paidDate.getTime())) return false;

      const fromDate = paidAtFilter.from ? new Date(paidAtFilter.from) : null;
      const toDate = paidAtFilter.to ? new Date(paidAtFilter.to) : null;

      if (fromDate && paidDate < fromDate) return false;
      if (toDate) {
        const endOfDay = new Date(toDate);
        endOfDay.setHours(23, 59, 59, 999);
        if (paidDate > endOfDay) return false;
      }

      return true;
    });
  }, [paidAtFilter.from, paidAtFilter.to, typeFilter, transactions]);

  const handleClearFilter = () => {
    setPaidAtFilter({ from: "", to: "" });
    setTypeFilter("all");
  };

  return (
    <PageLayout
      title="Transactions"
      description="Manage your daily spending by adding, editing, and tracking transactions here."
      actions={actions}
    >
      <div className="mb-4 grid grid-cols-1 sm:grid-cols-4 gap-3 bg-white shadow-lg rounded-md p-4">
        <div className="flex flex-col">
          <label className="text-sm text-gray-600 mb-1">From</label>
          <input
            type="date"
            className="border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
            value={paidAtFilter.from}
            onChange={(e) =>
              setPaidAtFilter((prev) => ({ ...prev, from: e.target.value }))
            }
          />
        </div>
        <div className="flex flex-col">
          <label className="text-sm text-gray-600 mb-1">To</label>
          <input
            type="date"
            className="border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
            value={paidAtFilter.to}
            onChange={(e) =>
              setPaidAtFilter((prev) => ({ ...prev, to: e.target.value }))
            }
          />
        </div>
        <div className="flex flex-col">
          <label className="text-sm text-gray-600 mb-1">Type</label>
          <select
            className="border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as "all" | "expense" | "income")}
          >
            <option value="all">All</option>
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
        </div>
        <div className="flex items-end gap-2">
          <button
            type="button"
            className="bg-amber-500 hover:bg-amber-600 text-white text-sm font-medium px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
            onClick={handleClearFilter}
          >
            Clear
          </button>
        </div>
      </div>
      <div className="h-[calc(100vh-56px)] overflow-auto">
        <TransactionItems transactions={filteredTransactions} onEventItem={handleEventItem} />
      </div>
      <Modal
        isOpen={modal.isOpen}
        onClose={handleCloseModal}
        title={event === "view" ? "View Transaction" : event === "edit" ? "Edit Transaction" : event === "delete" ? "Delete Transaction" : "Add Transaction"}>
        {event === "delete" ? (
          <DeleteModal
            title={`Do you want to delete "${selectedTransaction?.description}"?`}
            onCancel={handleCancelDelete}
            onAccept={handleDeleteTransaction}
          />
        ) : (
          <TransactionForm
            modal={modal}
            onSuccess={handleFormSuccess}
            actions={formActions(event)}
            readOnly={event === "view"}
            formData={
              transactionDetail
                ? {
                    amount: transactionDetail.amount,
                    description: transactionDetail.description,
                    paidAt: transactionDetail.paidAt.toISOString().slice(0, 10),
                    category: transactionDetail.category,
                  }
                : undefined
            }
            transactionType={transactionDetail?.type}
            transactionId={event === "edit" ? transactionDetail?.id : undefined}
          />
        )}
      </Modal>
    </PageLayout>
  );
}
