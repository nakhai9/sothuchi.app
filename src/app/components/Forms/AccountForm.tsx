"use client";

import { useState } from 'react';

import {
  SubmitHandler,
  useForm,
} from 'react-hook-form';

import { UseModalReturn } from '@/hooks/useModal';
import { SERVICES } from '@/services/service';
import { useGlobalStore } from '@/store/globalStore';

type AccountForm = {
  name: string;
  amount: number;
};

type AccountFormProps = {
  modal: UseModalReturn;
  onSuccess?: () => void;
};
export default function AccountForm({ modal, onSuccess }: AccountFormProps) {
  const { register, handleSubmit } = useForm<AccountForm>();

  const userInfo = useGlobalStore((state) => state.userInfo);
  const setLoading = useGlobalStore(state => state.setLoading);
  const onSubmit: SubmitHandler<AccountForm> = async (data: AccountForm) => {
    setLoading(true);
    try {
      await SERVICES.accountService.create({
        ...data,
        isActive: true,
        createdById: userInfo?.id as number,
      });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
      modal?.close();
      onSuccess?.();
    }
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
          className="px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
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
          className="bg-amber-500 hover:bg-amber-600 px-4 py-2 border border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 font-medium text-white text-sm cursor-pointer"
        >
          Save
        </button>
      </div>
    </form>
  );
}
