/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect } from 'react';

import {
  SubmitHandler,
  useForm,
} from 'react-hook-form';
import toast from 'react-hot-toast';
import { z } from 'zod';

import { zodResolver } from '@hookform/resolvers/zod';

import { UseModalReturn } from '@/hooks/useModal';
import { SERVICES } from '@/services/service';
import { useGlobalStore } from '@/store/globalStore';

const accountSchema = z.object({
  name: z.string().nonempty("Name is required"),
  amount: z.coerce.number(),
});

type AccountFormData = z.infer<typeof accountSchema>;

type AccountFormProps = {
  modal: UseModalReturn;
  onSuccess?: () => void;
  formData?: any;
};
export default function AccountForm({
  modal,
  onSuccess,
  formData,
}: AccountFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(accountSchema),
    defaultValues: { name: "", amount: 0 },
    mode: "onTouched",
  });

  const setLoading = useGlobalStore((state) => state.setLoading);

  const onSubmit: SubmitHandler<AccountFormData> = async (
    data: AccountFormData
  ) => {
    setLoading(true);
    try {
      reset();

      if (formData?.id) {
        await SERVICES.AccountService.update(formData.id as number, data);
      } else {
        await SERVICES.AccountService.create({
          ...data,
        });
      }
    } catch (error) {
      toast.error("Failed to create account");
    } finally {
      setLoading(false);
      modal?.close();
      toast.success("Account created successfully");
      onSuccess?.();
    }
  };

  useEffect(() => {
    if (modal.isOpen) {
      reset({
        name: formData?.name || "",
        amount: formData?.amount || 0,
      });
    }
  }, [modal.isOpen, formData, reset]);

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
        {errors.name && (
          <p className="text-red-500 text-xs">{errors.name.message}</p>
        )}
      </div>
      <div className="flex flex-col gap-1">
        <label
          htmlFor="amount"
          className="block font-bold text-gray-800 text-sm"
        >
          Amount (You can not edit this field later)
        </label>
        <input
          type="number"
          id="amount"
          disabled={Boolean(formData?.id)}
          {...register("amount", { valueAsNumber: true })}
          className="px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm disable:no-drop"
        />
        {errors.amount && (
          <p className="text-red-500 text-xs">{errors.amount.message}</p>
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
}
