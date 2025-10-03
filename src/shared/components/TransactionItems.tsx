/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import clsx from 'clsx';
import { ReceiptText } from 'lucide-react';
import Image from 'next/image';

import { CATEGORIES } from '@/shared/lib/constants/categories';

type TransactionItemsProps = {
  transactions: any;
};
export default function TransactionItems({
  transactions,
}: TransactionItemsProps) {
  return (
    <div className="flex flex-col gap-2">
      {transactions.length === 0 && (
        <div className="flex flex-col justify-center items-center gap-2 px-3 py-4 text-gray-500">
          <div className="">
            <ReceiptText size={40} />
          </div>
          <div>
            <p className="text-lg text-center">No transactions found</p>
            <p className="text-gray-400 text-center">
              Start by adding your first transaction
            </p>
          </div>
        </div>
      )}

      {transactions.map((x: any, index: number) => (
        <div
          key={x.id ?? index}
          className="flex justify-between bg-white hover:bg-blue-50 px-4 py-2 rounded-md"
        >
          <div className="flex items-center gap-3">
            <div
              className="relative border border-slate-200 rounded-full w-12 h-12 overflow-hidden"
              title={x.category}
            >
              <Image
                src={
                  CATEGORIES.find((cat) => cat.value === x.category)?.icon ?? ""
                }
                alt={x.category ?? "category icon"}
                fill
                className="object-contain"
              />
            </div>

            <div className="flex flex-col justify-center">
              <div className="font-medium text-sm">{x.description}</div>
              <div className="text-gray-500 text-xs">{x.paidAtFormatted}</div>
            </div>
          </div>
          <div className="flex flex-col items-center text-right">
            <p
              className={clsx(
                "font-medium text-lg",
                x.type === "expense" ? "text-red-600" : "text-green-600"
              )}
            >
              {x.amountFormatted}
            </p>
            <div className="flex items-center gap-1">
              <button
                type="button"
                className="text-blue-500 text-sm hover:underline cursor-pointer"
              >
                Edit
              </button>
              |
              <button
                type="button"
                className="text-red-500 text-sm hover:underline cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
