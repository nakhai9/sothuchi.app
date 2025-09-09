"use client";

import { SubmitHandler, useForm } from "react-hook-form";

import { UseModalReturn } from "@/hooks/useModal";
import { SERVICES } from "@/services/service";
import { useGlobalStore } from "@/store/globalStore";

type AccountForm = {
  name: string;
  amount: number;
};

type AccountFormProps = {
  modal: UseModalReturn;
};
export default function AccountForm({ modal }: AccountFormProps) {
  const { register, handleSubmit } = useForm<AccountForm>();

  const userInfo = useGlobalStore((state) => state.userInfo);
  const onSubmit: SubmitHandler<AccountForm> = async (data: AccountForm) => {
    try {
      await SERVICES.accountService.create({
        ...data,
        isActive: true,
        userId: userInfo?.id as number,
      });
    } catch (error) {
      console.log(error);
    }

    modal?.close();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <label htmlFor="name" className="block font-bold text-gray-800 text-sm">
          Name
        </label>
        <input
          type="text"
          id="name"
          {...register("name")}
          className="px-3 py-2 border border-slate-300 focus:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        />
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
          className="px-3 py-2 border border-slate-300 focus:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        />
      </div>
      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={modal.close}
          className="bg-white hover:bg-gray-50 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 font-medium text-gray-700 text-sm"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 border border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 font-medium text-white text-sm"
        >
          Create
        </button>
      </div>
    </form>
  );
}
