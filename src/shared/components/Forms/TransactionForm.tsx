"use client";
import React, { useState } from 'react';

import clsx from 'clsx';
import {
  RefreshCcw,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';
import {
  SubmitHandler,
  useForm,
} from 'react-hook-form';
import toast from 'react-hot-toast';
import z from 'zod';

import { UseModalReturn } from '@/hooks/useModal';
import { SERVICES } from '@/services/service';
import { CATEGORIES } from '@/shared/lib/constants/categories';
import { Utils } from '@/shared/lib/utils';
import { useGlobalStore } from '@/store/globalStore';
import { TransactionModel } from '@/types/transaction';
import { zodResolver } from '@hookform/resolvers/zod';

import FileUploadZone from '../FileUploadZone';
import TransactionItems from '../TransactionItems';

const transactionSchema = z.object({
  amount: z.number().optional(),
  description: z.string().optional(),
  paidAt: z.string().optional(),
  category: z.string().optional(),
});

export type TransactionFormData = z.infer<typeof transactionSchema>;

type TransactionFormProps = {
  modal?: UseModalReturn;
  onSuccess?: () => void;
  actions?: React.ReactNode[];
  formData?: Partial<TransactionFormData>;
  readOnly?: boolean;
  transactionType?: "income" | "expense";
  transactionId?: string | number;
};

export default function TransactionForm({
  modal,
  onSuccess,
  actions,
  formData,
  readOnly = false,
  transactionType,
  transactionId,
}: TransactionFormProps) {
  const [mode, setMode] = useState<"manual" | "from-bill-image">("manual");
  const [isScanning, setIsScanning] = useState(false);
  const [type, setType] = useState<"income" | "expense">(
    transactionType || "expense"
  );
  const [scannedTransactions, setScannedTransactions] = useState<
    TransactionModel[]
  >([]);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      amount: 0,
      description: "",
      paidAt: new Date().toISOString().slice(0, 10),
      category: "",
    },
  });

  // Reset form khi formData thay đổi
  React.useEffect(() => {
    if (formData) {
      reset({
        amount: formData.amount,
        description: formData.description,
        paidAt: formData.paidAt,
        category: formData.category,
      });
    }
  }, [formData, reset]);

  const setLoading = useGlobalStore((state) => state.setLoading);

  const onSubmit: SubmitHandler<TransactionFormData> = async (
    data: TransactionFormData
  ) => {
    setLoading(true);
    modal?.close();
    reset();
    setType("expense");
    try {
      // Nếu có transactionId thì update, không thì create
      if (transactionId) {
        await SERVICES.TransactionService.update(String(transactionId), {
          amount: data.amount!,
          description: data.description!,
          paidAt: new Date(data.paidAt!),
          type: type,
          category: data.category!,
        });
        await onSuccess?.();
        toast.success("Updated successfully");
      } else if (mode === "manual") {
        await SERVICES.TransactionService.create({
          amount: data.amount!,
          description: data.description!,
          paidAt: new Date(data.paidAt!),
          type: type,
          category: data.category!,
        });
        await onSuccess?.();
        toast.success("Created successfully");
      } else {
        await SERVICES.TransactionService.createMany(
          scannedTransactions.map((item) => ({
            amount: item.amount,
            description: item.description,
            paidAt: new Date(item.paidAt),
            type: type,
            category: item.category,
          }))
        );
        setScannedTransactions([]);
        await onSuccess?.();
        toast.success("Created successfully");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (files: File[]) => {
    if (files.length === 0) return;
    setIsScanning(true);
    try {
      const result = await SERVICES.AIService.scanReceiptWithAI(files);

      const cleanData = result.map(
        (item) =>
          ({
            ...item,
            amountFormatted: Utils.currency.format(item.amount),
            paidAtFormatted: Utils.date.format(item.paidAt),
          } as TransactionModel)
      );

      setScannedTransactions(cleanData);
    } catch (error) {
      console.error("Error scanning receipt:", error);
      toast.error("Không thể quét hóa đơn. Vui lòng thử lại");
    } finally {
      setIsScanning(false);
    }
  };

  const SwitchType = () => (
    <div className="flex shadow-md p-1 border border-slate-300 rounded-full">
      <button
        type="button"
        disabled={readOnly}
        className={clsx(
          `flex items-center gap-2 px-5 py-1 rounded-full text-sm`,
          type === "expense" ? "bg-red-200" : "",
          readOnly ? "cursor-not-allowed opacity-50" : "cursor-pointer"
        )}
        onClick={() => !readOnly && setType("expense")}
      >
        <TrendingDown className="text-red-600" size={14} />
        Expense
      </button>
      <button
        type="button"
        disabled={readOnly}
        className={clsx(
          `flex items-center gap-2 px-5 py-1 rounded-full text-sm`,
          type === "income" ? "bg-green-200" : "",
          readOnly ? "cursor-not-allowed opacity-50" : "cursor-pointer"
        )}
        onClick={() => !readOnly && setType("income")}
      >
        <TrendingUp className="text-green-600" size={14} />
        Income
      </button>
    </div>
  );

  const ManualForm = () => (
    <div className="flex flex-col gap-3">
      <div className="flex justify-center items-center gap-5">
        <SwitchType />
      </div>
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-1 w-full">
          <label
            htmlFor="amount"
            className="block font-medium text-gray-600 text-sm"
          >
            Amount
          </label>
          <input
            type="number"
            id="amount"
            {...register("amount", { valueAsNumber: true })}
            disabled={readOnly}
            className={`px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm ${
              errors.amount ? "border-red-500" : "border-slate-300"
            } ${readOnly ? "bg-gray-100 cursor-not-allowed" : ""}`}
          />
          {errors.amount && (
            <span className="text-red-500 text-xs">
              {errors.amount.message}
            </span>
          )}
        </div>
        <div className="flex flex-col gap-1 w-full">
          <label
            htmlFor="date"
            className="block font-medium text-gray-600 text-sm"
          >
            Paid at
          </label>
          <input
            type="date"
            id="date"
            {...register("paidAt")}
            disabled={readOnly}
            className={`px-3 py-2 border w-full rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm ${
              errors.paidAt ? "border-red-500" : "border-slate-300"
            } ${readOnly ? "bg-gray-100 cursor-not-allowed" : ""}`}
          />
          {errors.paidAt && (
            <span className="text-red-500 text-xs">
              {errors.paidAt.message}
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label
          htmlFor="accountId"
          className="block font-medium text-gray-600 text-sm"
        >
          Category
        </label>
        <select
          id="category"
          {...register("category")}
          disabled={readOnly}
          className={`block px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm ${
            errors.category ? "border-red-500" : "border-slate-300"
          } ${readOnly ? "bg-gray-100 cursor-not-allowed" : ""}`}
        >
          <option value="" disabled hidden>
            - Select -
          </option>
          {CATEGORIES.length &&
            CATEGORIES.filter((x) => x.type === type).map((x) => (
              <option key={x.id} value={x.value}>
                {x.name}
              </option>
            ))}
        </select>
        {errors.category && (
          <span className="text-red-500 text-xs">
            {errors.category.message}
          </span>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label
          htmlFor="description"
          className="block font-medium text-gray-600 text-sm"
        >
          Description
        </label>
        <input
          type="text"
          id="description"
          {...register("description")}
          disabled={readOnly}
          className={`px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm ${
            errors.description ? "border-red-500" : "border-slate-300"
          } ${readOnly ? "bg-gray-100 cursor-not-allowed" : ""}`}
        />
        {errors.description && (
          <span className="text-red-500 text-xs">
            {errors.description.message}
          </span>
        )}
      </div>

      {actions && actions?.length > 0 && (
        <div className="flex justify-end gap-3">
          {actions.map((action) => action)}
        </div>
      )}
    </div>
  );

  const BillForm = () => {
    // Tính tổng tiền của các transactions đã scan
    const totalAmount = scannedTransactions.reduce(
      (sum, transaction) => sum + transaction.amount,
      0
    );

    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-center items-center gap-5">
          <SwitchType />
        </div>
        
        {/* Chỉ hiển thị upload zone khi chưa scan xong */}
        {
          scannedTransactions.length === 0 && (
            <FileUploadZone onFileUpload={handleFileUpload} isLoading={isScanning} />
          )
        }

        {/* Hiển thị kết quả scan */}
        {scannedTransactions.length > 0 && (
          <div className="max-h-[400px] overflow-auto">
            <div className="flex justify-between items-center my-2">
              <h4 className="font-bold text-gray-500">
                Scanned {scannedTransactions.length} items
              </h4>
              <div className="flex items-center gap-3">
                <span className="font-bold text-lg text-amber-600">
                  Total: {Utils.currency.format(totalAmount)}
                </span>
                
              </div>
            </div>
            <TransactionItems transactions={scannedTransactions} />
            <button
              key="re-scan"
              type="button"
              className="border-amber-500 mt-4 flex items-center justify-center gap-2 hover:bg-amber-50 px-4 py-2 border bg-white rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 w-full font-medium text-amber-500 text-sm cursor-pointer"
              onClick={() => setScannedTransactions([])}
            >
              <RefreshCcw size={16} />
              Re-scan
            </button>
          </div>
        )}
        
        {actions && actions?.length > 0 && (
          <div 
            className={clsx(
              "flex justify-end gap-3",
              (isScanning || (mode === 'from-bill-image' && scannedTransactions.length === 0)) && 
                "pointer-events-none opacity-50"
            )}
          >
            {actions.map((action) => action)}
          </div>
        )}
      </div>
    );
  };

  // Khi edit hoặc view, chỉ hiển thị manual form
  React.useEffect(() => {
    if (transactionId || readOnly) {
      setMode("manual");
    }
  }, [transactionId, readOnly]);

  return (
    <div className="flex flex-col gap-4">
      {!readOnly && !transactionId && (
        <div className="flex">
          <button
            className={clsx(
              "px-6 py-2 border-slate-700 w-full font-bold text-sm cursor-pointer",
              mode === "manual" ? "border-b-2 border-slate-700" : "text-slate-300"
            )}
            onClick={() => setMode("manual")}
          >
            Manual
          </button>
          <button
            className={clsx(
              "px-6 py-2 border-slate-700 w-full font-bold text-sm cursor-pointer",
              mode === "from-bill-image"
                ? "border-b-2 border-slate-700"
                : "text-slate-300"
            )}
            onClick={() => setMode("from-bill-image")}
          >
            Scan Bill
          </button>
        </div>
      )}
      <form onSubmit={handleSubmit(onSubmit)}>
        {mode === "manual" ? <ManualForm /> : <BillForm />}
      </form>
    </div>
  );
}
