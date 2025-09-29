"use client";
import {
  useEffect,
  useState,
} from 'react';

import clsx from 'clsx';
import {
  TrendingDown,
  TrendingUp,
} from 'lucide-react';
import {
  SubmitHandler,
  useForm,
} from 'react-hook-form';
import toast from 'react-hot-toast';
import z from 'zod';

import { zodResolver } from '@hookform/resolvers/zod';

import { UseModalReturn } from '@/hooks/useModal';
import { CATEGORIES } from '@/lib/constants/categories';
import { SERVICES } from '@/services/service';
import { useGlobalStore } from '@/store/globalStore';
import { DropdownOption } from '@/types/base';
import { ReceiptTransaction } from '@/types/transaction';

import FileUploadZone from '../FileUploadZone';

const transactionSchema = z.object({
  amount: z.number().min(1, "Amount is required"),
  description: z.string().min(1, "Description is required"),
  accountId: z.string().min(1, "Account is required"),
  paidAt: z.string().min(1, "Date is required"),
  category: z.string().min(1, "Category is required"),
});

export type TransactionFormData = z.infer<typeof transactionSchema>;

type TransactionFormProps = {
  modal?: UseModalReturn;
  onSuccess?: () => void;
  actions?: React.ReactNode[];
};

const columns = [
  { title: "Description", field: "description" as const },
  { title: "Amount", field: "amount" as const },
  { title: "Date", field: "date" as const },
];

export default function TransactionForm({
  modal,
  onSuccess,
  actions,
}: TransactionFormProps) {
  const [mode, setMode] = useState<"manual" | "from-bill-image">("manual");
  const [isLoading, setIsLoading] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [accountOptions, setAccountOptions] = useState<DropdownOption[]>([]);
  const [type, setType] = useState<"income" | "expense">("expense");
  const [data, setData] = useState<ReceiptTransaction[]>([]);
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
      accountId: "",
      paidAt: new Date().toISOString().slice(0, 10),
      category: "",
    },
  });

  const setLoading = useGlobalStore((state) => state.setLoading);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const accounts = await SERVICES.LookupService.getAccounts();
        if (accounts) setAccountOptions(accounts);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  const onSubmit: SubmitHandler<TransactionFormData> = async (
    data: TransactionFormData
  ) => {
    setLoading(true);
    try {
      await SERVICES.TransactionService.create({
        accountId: Number(data.accountId),
        amount: data.amount,
        description: data.description,
        paidAt: new Date(data.paidAt),
        type: type,
        category: data.category,
      });
      reset();
      await onSuccess?.();
      toast.success("Created successfully");
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
      modal?.close();
    }
  };

  const handleFileUpload = async (files: File[]) => {
    if (files.length === 0) return;
    setIsScanning(true);
    try {
      const result = await SERVICES.AIService.scanReceiptWithAI(files);
      setData(result);
    } catch (error) {
      console.error("Error scanning receipt:", error);
    } finally {
      setIsScanning(false);
    }
  };

  const SwitchType = () => (
    <div className="flex shadow-md p-1 border border-slate-300 rounded-full">
      <button
        type="button"
        className={clsx(
          `flex items-center gap-2 px-5 py-1 rounded-full text-sm cursor-pointer`,
          type === "expense" ? "bg-red-200" : ""
        )}
        onClick={() => setType("expense")}
      >
        <TrendingDown className="text-red-600" size={14} />
        Expense
      </button>
      <button
        type="button"
        className={clsx(
          `flex items-center gap-2 px-5 py-1 rounded-full text-sm cursor-pointer`,
          type === "income" ? "bg-green-200" : ""
        )}
        onClick={() => setType("income")}
      >
        <TrendingUp className="text-green-600" size={14} />
        Income
      </button>
    </div>
  );

  const ManualForm = () => (
    <form className="flex flex-col gap-3" onSubmit={handleSubmit(onSubmit)}>
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
            className={`px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm ${
              errors.amount ? "border-red-500" : "border-slate-300"
            }`}
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
            className={`px-3 py-2 border w-full rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm ${
              errors.paidAt ? "border-red-500" : "border-slate-300"
            }`}
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
          Account
        </label>
        <select
          id="accountId"
          {...register("accountId")}
          className={`block px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm ${
            errors.accountId ? "border-red-500" : "border-slate-300"
          }`}
        >
          <option value="" disabled hidden>
            - Select -
          </option>
          {accountOptions.length ? (
            accountOptions.map((x) => (
              <option key={x.value} value={x.value}>
                {x.label}
              </option>
            ))
          ) : (
            <option key="other" value="0">
              Other
            </option>
          )}
        </select>
        {errors.accountId && (
          <span className="text-red-500 text-xs">
            {errors.accountId.message}
          </span>
        )}
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
          className={`block px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm ${
            errors.category ? "border-red-500" : "border-slate-300"
          }`}
        >
          <option value="" disabled hidden>
            - Select -
          </option>
          {CATEGORIES.length ? (
            CATEGORIES.filter((x) => x.type === type).map((x) => (
              <option key={x.id} value={x.value}>
                {x.name}
              </option>
            ))
          ) : (
            <option key="other" value="0">
              Other
            </option>
          )}
        </select>
        {errors.accountId && (
          <span className="text-red-500 text-xs">
            {errors.accountId.message}
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
          className={`px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm ${
            errors.description ? "border-red-500" : "border-slate-300"
          }`}
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
    </form>
  );

  const BillForm = () => (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
      <div className="flex justify-center items-center gap-5">
        <SwitchType />
      </div>
      <div className="flex flex-col gap-1">
        <label
          htmlFor="accountId"
          className="block font-medium text-gray-600 text-sm"
        >
          Account
        </label>
        <select
          id="accountId"
          {...register("accountId")}
          className={`block px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm ${
            errors.accountId ? "border-red-500" : "border-slate-300"
          }`}
        >
          <option value="" disabled hidden>
            - Select -
          </option>
          {accountOptions.length ? (
            accountOptions.map((x) => (
              <option key={x.value} value={x.value}>
                {x.label}
              </option>
            ))
          ) : (
            <option key="other" value="0">
              Other
            </option>
          )}
        </select>
        {errors.accountId && (
          <span className="text-red-500 text-xs">
            {errors.accountId.message}
          </span>
        )}
      </div>
      <div className="max-h-[400px] overflow-auto">
        <FileUploadZone
          onFileUpload={handleFileUpload}
          isLoading={isScanning}
        />

        {data.length > 0 && (
          <>
            <h4 className="my-2 font-bold text-gray-500">
              Scanned Transactions
            </h4>
          </>
        )}
      </div>
      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={modal?.close}
          className="bg-white hover:bg-gray-50 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 font-medium text-gray-700 text-sm cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="bg-amber-500 hover:bg-amber-600 px-4 py-2 border border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 font-medium text-white text-sm cursor-pointer"
        >
          Save
        </button>
      </div>
    </form>
  );

  return (
    <div className="flex flex-col gap-4">
      {/* <div className="flex">
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
          From bill image
        </button>
      </div> */}
      <ManualForm />
    </div>
  );
}
