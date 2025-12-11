"use client";
import { useState } from 'react';

import {
  SubmitHandler,
  useForm,
} from 'react-hook-form';
import toast from 'react-hot-toast';
import z from 'zod';

import { UseModalReturn } from '@/hooks/useModal';
import { SERVICES } from '@/services/service';
import { useGlobalStore } from '@/store/globalStore';
import { zodResolver } from '@hookform/resolvers/zod';

const changeNameSchema = z.object({
  fullName: z.string().min(1, "Tên không được để trống"),
});

export type ChangeNameFormData = z.infer<typeof changeNameSchema>;

type ChangeNameFormProps = {
  modal?: UseModalReturn;
  onSuccess?: () => void;
  currentName?: string;
};

export default function ChangeNameForm({
  modal,
  onSuccess,
  currentName = "",
}: ChangeNameFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const setUserInfo = useGlobalStore((state) => state.setUserInfo);
  const userInfo = useGlobalStore((state) => state.userInfo);
  const setLoading = useGlobalStore((state) => state.setLoading);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ChangeNameFormData>({
    resolver: zodResolver(changeNameSchema),
    defaultValues: {
      fullName: currentName,
    },
  });

  const onSubmit: SubmitHandler<ChangeNameFormData> = async (data) => {
    setIsSubmitting(true);
    setLoading(true);
    try {
      await SERVICES.UserService.updateProfile({
        fullName: data.fullName,
      });

      // Cập nhật userInfo trong store
      if (userInfo) {
        setUserInfo({
          ...userInfo,
          fullName: data.fullName,
        });
      }

      toast.success("Đổi tên thành công");
      reset();
      await onSuccess?.();
      modal?.close();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Không thể đổi tên. Vui lòng thử lại";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <label
          htmlFor="fullName"
          className="block font-medium text-gray-600 text-sm"
        >
          Tên đầy đủ
        </label>
        <input
          type="text"
          id="fullName"
          {...register("fullName")}
          className={`px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm ${
            errors.fullName ? "border-red-500" : "border-slate-300"
          }`}
          placeholder="Nhập tên đầy đủ"
        />
        {errors.fullName && (
          <span className="text-red-500 text-xs">
            {errors.fullName.message}
          </span>
        )}
      </div>

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={modal?.close}
          className="bg-white hover:bg-gray-50 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 font-medium text-gray-700 text-sm cursor-pointer"
        >
          Hủy
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-amber-500 hover:bg-amber-600 px-4 py-2 border border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 font-medium text-white text-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Đang xử lý..." : "Lưu"}
        </button>
      </div>
    </form>
  );
}


