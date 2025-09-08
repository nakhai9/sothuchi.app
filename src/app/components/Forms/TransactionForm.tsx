"use client";
import {
  useEffect,
  useState,
} from 'react';

import clsx from 'clsx';

import { getCategories } from '@/services/categoriesService';
import { CategoryModel } from '@/types/category';

import FileUploadZone from '../FileUploadZone';

export default function TransactionForm() {
  const [type, setType] = useState<"income" | "expense">("income");
  const [mode, setMode] = useState<"manual" | "from-bill-image">("manual");
  const [categories, setCategories] = useState<CategoryModel[]>([]);

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

  const ManualForm = (
    <form className="flex flex-col gap-4">
      <div className="flex gap-5">
        <div className="flex gap-2">
          <input
            type="radio"
            checked={type === "income"}
            onChange={(e) => setType("income")}
          />
          <label htmlFor="" className="text-sm">
            Income
          </label>
        </div>
        <div className="flex gap-2">
          <input
            type="radio"
            checked={type === "expense"}
            onChange={(e) => setType("expense")}
          />
          <label htmlFor="" className="text-sm">
            Expense
          </label>
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="amount" className="block font-bold text-sm">
          Amount
        </label>
        <input
          type="text"
          id="amount"
          className="px-3 py-2 border border-slate-300 focus:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="description" className="block font-bold text-sm">
          Description
        </label>
        <input
          type="text"
          id="description"
          className="px-3 py-2 border border-slate-300 focus:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="description" className="block font-bold text-sm">
          Category
        </label>
        <select
          name=""
          id=""
          className="px-3 py-2 border border-slate-300 focus:border-slate-600 rounded-md focus:outline-none text-sm"
        >
          {categories.map((cat) => (
            <option key={cat.id}>{cat.name}</option>
          ))}
        </select>
      </div>
    </form>
  );

  const BillForm = (
    <form>
      <FileUploadZone />
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
