"use client";
import { useEffect, useState } from "react";

import clsx from "clsx";
import { TrendingDown, TrendingUp } from "lucide-react";
import { SubmitHandler, useForm } from "react-hook-form";

import { DataGrid } from "@/app/ui";
import { UseModalReturn } from "@/hooks/useModal";
import { AccountModel } from "@/models/account";
import { BaseEntity } from "@/models/base";
import { CategoryModel } from "@/models/category";
import { ReceiptTransaction } from "@/models/transaction";
import { SERVICES } from "@/services/service";
import { useGlobalStore } from "@/store/globalStore";

import FileUploadZone from "../FileUploadZone";

type TransactionForm = {
  amount: number;
  date: Date;
  description: string;
  categoryId: number;
  accountId: number;
};
type TransactionFormProps = {
  modal: UseModalReturn;
};

const columns = [
  { title: "Description", field: "description" as const },
  { title: "Amount", field: "amount" as const },
  { title: "Date", field: "date" as const },
];

export default function TransactionForm({ modal }: TransactionFormProps) {
  const [mode, setMode] = useState<"manual" | "from-bill-image">("manual");
  const [categories, setCategories] = useState<CategoryModel[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [accounts, setAccounts] = useState<(AccountModel & BaseEntity)[]>([]);
  const [type, setType] = useState<"income" | "expense">("income");
  const userInfo = useGlobalStore((state) => state.userInfo);
  const [data, setData] = useState<ReceiptTransaction[]>([]);
  const { register, handleSubmit } = useForm<TransactionForm>({
    defaultValues: {
      amount: 0,
    },
  });

  const setLoading = useGlobalStore(state => state.setLoading);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const accounts = await SERVICES.AccountService.getAll();
        if (accounts) setAccounts(accounts);

        const categories = await SERVICES.CategoryService.getAll();
        if (categories) setCategories(categories);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  const onSubmit: SubmitHandler<TransactionForm> = async (
    data: TransactionForm
  ) => {
    setLoading(true);
    try {
      await SERVICES.TransactionService.create({
        ...data,
        type: type,
      });
    } catch (error) {
      console.error(error);
    } finally {
      modal.close();
      setLoading(false)
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
          type === "income" ? "bg-amber-200" : ""
        )}
        onClick={() => setType("income")}
      >
        <TrendingDown size={14} />
        Income
      </button>
      <button
        type="button"
        className={clsx(
          `flex items-center gap-2 px-5 py-1 rounded-full text-sm cursor-pointer`,
          type === "expense" ? "bg-amber-200" : ""
        )}
        onClick={() => setType("expense")}
      >
        <TrendingUp size={14} />
        Expense
      </button>
    </div>
  );

  const ManualForm = () => (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
      <div className="flex justify-center items-center gap-5">
        <SwitchType />
      </div>
      <div className="flex flex-col gap-1">
        <label
          htmlFor="amount"
          className="block font-bold text-gray-800 text-sm"
        >
          Amount
        </label>
        <input
          type="number"
          id="amount"
          {...register("amount", { valueAsNumber: true })}
          className="px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label
          htmlFor="description"
          className="block font-bold text-gray-800 text-sm"
        >
          Description
        </label>
        <input
          type="text"
          id="description"
          {...register("description")}
          className="px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label
          htmlFor="accountId"
          className="block font-bold text-gray-800 text-sm"
        >
          Account
        </label>
        <select
          id="accountId"
          {...register("accountId")}
          className="block px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
        >
          <option value="" disabled selected hidden>
            - Select -
          </option>
          {accounts.length ? (
            accounts.map((account) => (
              <option key={account.id} value={account.id}>
                {account.name}
              </option>
            ))
          ) : (
            <option key="other" value="0">
              Other
            </option>
          )}
        </select>
      </div>
      <div className="flex flex-col gap-1">
        <label
          htmlFor="description"
          className="block font-bold text-gray-800 text-sm"
        >
          Category
        </label>
        <select
          id="categoryId"
          {...register("categoryId")}
          className="block px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
        >
          <option value="" disabled selected hidden>
            - Select -
          </option>
          {categories.length ? (
            categories.map((cat) => <option key={cat.id}>{cat.name}</option>)
          ) : (
            <option key="other" value="0">
              Other
            </option>
          )}
        </select>
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="date" className="block font-bold text-gray-800 text-sm">
          Date
        </label>
        <input
          type="date"
          id="date"
          {...register("date")}
          className="px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
        />
      </div>

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={modal.close}
          className="bg-white hover:bg-gray-50 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 font-medium text-gray-700 text-sm cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="bg-amber-500 hover:bg-amber-600 px-4 py-2 border border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 font-medium text-white text-sm cursor-pointer"
        >
          Save
        </button>
      </div>
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
          className="block font-bold text-gray-800 text-sm"
        >
          Account
        </label>
        <select
          id="accountId"
          {...register("accountId", { valueAsNumber: true })}
          className="block px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
        >
          <option value="" disabled selected hidden>
            - Select -
          </option>
          {accounts.length ? (
            accounts.map((account) => (
              <option key={account.id} value={account.id}>
                {account.name}
              </option>
            ))
          ) : (
            <option key="other" value="0">
              Other
            </option>
          )}
        </select>
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
            <DataGrid columns={columns} data={data} />
          </>
        )}
      </div>
      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={modal.close}
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
          From bill image
        </button>
      </div>
      {mode === "manual" ? <ManualForm /> : <BillForm />}
    </div>
  );
}
