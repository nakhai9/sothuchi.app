"use client"
/* eslint-disable @typescript-eslint/no-explicit-any */
import { CATEGORIES } from "@/lib/constants/categories";
import clsx from "clsx";
import Image from "next/image";

type TransactionItemsProps = {
    transactions: any;
};
export default function TransactionItems({
    transactions,
}: TransactionItemsProps) {
    return (
        <div className="flex flex-col gap-4">
            {transactions.map((x: any) => (
                <div key={x.id} className="flex justify-between bg-white shadow-lg px-4 py-2 rounded-md">
                    <div className="flex items-center gap-3">
                        <div className="relative border border-slate-200 rounded-full w-12 h-12 overflow-hidden" title={x.category}>
                            <Image
                                src={
                                    CATEGORIES.find((cat) => cat.value === x.category)?.icon ?? ""
                                }
                                alt={x.category}
                                fill
                                className="object-contain"
                            />
                        </div>

                        <div className="flex flex-col justify-center">
                            <div className="font-medium text-sm">{x.description}</div>
                            <div className="text-gray-500 text-xs">{x.paidAtFormatted}</div>
                        </div>
                    </div>
                    <div className="flex items-center text-right">
                        <p
                            className={clsx(
                                "font-medium text-lg",
                                x.type === "expense" ? "text-red-600" : "text-green-600"
                            )}
                        >{`${x.type === "expense" ? "-" : ""} ${x.amountFormatted}`}</p>
                        <button
                            type="button"
                            className="hidden text-blue-500 text-sm hover:underline cursor-pointer"
                        >
                            Delete
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}
