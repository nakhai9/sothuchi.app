"use client";
import {
  useEffect,
  useState,
} from 'react';

import clsx from 'clsx';
import {
  SubmitHandler,
  useForm,
} from 'react-hook-form';

import { useModal } from '@/hooks';
import { getCategories } from '@/services/categoriesService';
import { CategoryModel } from '@/types/category';

import FileUploadZone from '../FileUploadZone';

type TransactionForm = {
  type: "income" | "expense",
  amount: number;
  date: Date;
  description: string;
  categoryId: number;
}

export default function TransactionForm() {
  const [mode, setMode] = useState<"manual" | "from-bill-image">("manual");
  const [categories, setCategories] = useState<CategoryModel[]>([]);
  const { register, handleSubmit } = useForm<TransactionForm>({
    defaultValues: {
      type: "income",
      amount: 0
    },
  })

  const modal = useModal();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categories = await getCategories();
        console.log("categories", categories);
        if (categories) {
          setCategories(categories);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchCategories();
  }, []);

  const onSubmit: SubmitHandler<TransactionForm> = async (data) => console.log(data)

  const ManualForm = (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
      <div className="flex gap-5">
        <div className="flex gap-2">
          <input
            type="radio"
            value="income"
            {...register("type")}
            id="type-income"
          />
          <label htmlFor="type-income" className="text-sm">
            Income
          </label>
        </div>
        <div className="flex gap-2">
          <input
            type="radio"
            value="expense"
            {...register("type")}
            id="type-expense"
          />
          <label htmlFor="type-expense" className="text-sm">
            Expense
          </label>
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="amount" className="block font-bold text-gray-800 text-sm">
          Amount
        </label>
        <input
          type="number"
          id="amount"
          {...register("amount", { valueAsNumber: true })}
          className="px-3 py-2 border border-slate-300 focus:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="description" className="block font-bold text-gray-800 text-sm">
          Description
        </label>
        <input
          type="text"
          id="description"
          {...register("description")}
          className="px-3 py-2 border border-slate-300 focus:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="description" className="block font-bold text-gray-800 text-sm">
          Category
        </label>
        <select id="categoryId"
          {...register("categoryId", { valueAsNumber: true })} className="block px-3 py-2 border border-slate-300 focus:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm">
          {categories.length ? categories.map((cat) => (
            <option key={cat.id}>{cat.name}</option>
          )) : <option key="other" value="0">Other</option>}

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
          className="px-3 py-2 border border-slate-300 focus:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        />
      </div>

      <div className="flex justify-end gap-3">
        <button
          type='button'
          onClick={modal.close}
          className="bg-white hover:bg-gray-50 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 font-medium text-gray-700 text-sm"
        >
          Cancel
        </button>
        <button
          type='submit'
          onClick={modal.close}
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 border border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 font-medium text-white text-sm"
        >
          Save
        </button>

      </div>
    </form>
  );

  const BillForm = (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
      <FileUploadZone />
      <div className="flex justify-end gap-3">
        <button
          type='button'
          onClick={modal.close}
          className="bg-white hover:bg-gray-50 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 font-medium text-gray-700 text-sm"
        >
          Cancel
        </button>
        <button
          type='submit'
          onClick={modal.close}
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 border border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 font-medium text-white text-sm"
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
      {mode === "manual" ? ManualForm : BillForm}
    </div>
  );
}
