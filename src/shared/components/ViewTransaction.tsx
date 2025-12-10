"use client";
import clsx from 'clsx';
import Image from 'next/image';

import {
  CATEGORIES,
  UNKNOWN_CATEGORY_ICON,
} from '@/shared/lib/constants/categories';
import { Utils } from '@/shared/lib/utils';
import { BaseEntity } from '@/types/base';
import { TransactionModel } from '@/types/transaction';

type ViewTransactionProps = {
  transaction: (TransactionModel & BaseEntity) | null;
  isLoading?: boolean;
};

export default function ViewTransaction({
  transaction,
  isLoading = false,
}: ViewTransactionProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  if (!transaction) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="text-gray-500">Transaction not found</div>
      </div>
    );
  }

  const category = CATEGORIES.find(
    (cat) => cat.value.trim().toLowerCase() === transaction.category.trim().toLowerCase()
  );

  return (
    <div className="flex flex-col gap-4">
      {/* Category Icon */}
      <div className="flex justify-center">
        <div
          className="relative border border-slate-200 rounded-full w-20 h-20 overflow-hidden"
          title={category?.name || transaction.category}
        >
          <Image
            src={category?.icon ?? UNKNOWN_CATEGORY_ICON}
            alt={category?.name || transaction.category}
            fill
            className="object-contain"
          />
        </div>
      </div>

      {/* Amount */}
      <div className="flex flex-col items-center gap-1">
        <div className="text-sm text-gray-500">Amount</div>
        <div
          className={clsx(
            "text-3xl font-bold",
            transaction.type === "expense" ? "text-red-600" : "text-green-600"
          )}
        >
          {Utils.currency.format(transaction.amount)}
        </div>
      </div>

      {/* Details */}
      <div className="flex flex-col gap-3 border-t border-gray-200 pt-4">
        <div className="flex flex-col gap-1">
          <div className="text-sm font-medium text-gray-500">Description</div>
          <div className="text-base text-gray-900">{transaction.description}</div>
        </div>

        <div className="flex flex-col gap-1">
          <div className="text-sm font-medium text-gray-500">Category</div>
          <div className="text-base text-gray-900">{category?.name || transaction.category}</div>
        </div>

        <div className="flex flex-col gap-1">
          <div className="text-sm font-medium text-gray-500">Type</div>
          <div className="text-base text-gray-900 capitalize">{transaction.type}</div>
        </div>

        <div className="flex flex-col gap-1">
          <div className="text-sm font-medium text-gray-500">Paid At</div>
          <div className="text-base text-gray-900">
            {Utils.date.format(transaction.paidAt)}
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <div className="text-sm font-medium text-gray-500">Created At</div>
          <div className="text-base text-gray-900">
            {Utils.date.format(transaction.createdAt)}
          </div>
        </div>

        {transaction.updatedAt && 
         transaction.updatedAt instanceof Date && 
         !isNaN(transaction.updatedAt.getTime()) &&
         transaction.createdAt instanceof Date &&
         !isNaN(transaction.createdAt.getTime()) &&
         transaction.updatedAt.getTime() !== transaction.createdAt.getTime() && (
          <div className="flex flex-col gap-1">
            <div className="text-sm font-medium text-gray-500">Updated At</div>
            <div className="text-base text-gray-900">
              {Utils.date.format(transaction.updatedAt)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

