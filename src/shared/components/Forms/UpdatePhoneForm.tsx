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

const updatePhoneSchema = z.object({
  phone: z.string().min(10, "Số điện thoại phải có ít nhất 10 số").regex(/^[0-9]+$/, "Số điện thoại chỉ được chứa số"),
});

export type UpdatePhoneFormData = z.infer<typeof updatePhoneSchema>;

type UpdatePhoneFormProps = {
  modal?: UseModalReturn;
  onSuccess?: () => void;
  currentPhone?: string;
};

export default function UpdatePhoneForm({
  modal,
  onSuccess,
  currentPhone = "",
}: UpdatePhoneFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const setUserInfo = useGlobalStore((state) => state.setUserInfo);
  const userInfo = useGlobalStore((state) => state.userInfo);
  const setLoading = useGlobalStore((state) => state.setLoading);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UpdatePhoneFormData>({
    resolver: zodResolver(updatePhoneSchema),
    defaultValues: {
      phone: currentPhone,
    },
  });

  const onSubmit: SubmitHandler<UpdatePhoneFormData> = async (data) => {
    setIsSubmitting(true);
    setLoading(true);
    try {
      await SERVICES.UserService.updateProfile({
        phone: data.phone,
      });

      // Cập nhật userInfo trong store
      if (userInfo) {
        setUserInfo({
          ...userInfo,
          phone: data.phone,
        });
      }

      toast.success("Cập nhật số điện thoại thành công");
      reset();
      await onSuccess?.();
      modal?.close();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Không thể cập nhật số điện thoại. Vui lòng thử lại";
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
          htmlFor="phone"
          className="block font-medium text-gray-600 text-sm"
        >
          Số điện thoại
        </label>
        <input
          type="tel"
          id="phone"
          {...register("phone")}
          className={`px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm ${
            errors.phone ? "border-red-500" : "border-slate-300"
          }`}
          placeholder="Nhập số điện thoại"
        />
        {errors.phone && (
          <span className="text-red-500 text-xs">
            {errors.phone.message}
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


