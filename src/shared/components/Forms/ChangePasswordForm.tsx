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
import { supabase } from '@/shared/lib/config/supabaseClient';
import { useGlobalStore } from '@/store/globalStore';
import { zodResolver } from '@hookform/resolvers/zod';

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Mật khẩu hiện tại không được để trống"),
  newPassword: z.string().min(6, "Mật khẩu mới phải có ít nhất 6 ký tự"),
  confirmPassword: z.string().min(1, "Xác nhận mật khẩu không được để trống"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Mật khẩu mới và xác nhận mật khẩu không khớp",
  path: ["confirmPassword"],
});

export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;

type ChangePasswordFormProps = {
  modal?: UseModalReturn;
  onSuccess?: () => void;
};

export default function ChangePasswordForm({
  modal,
  onSuccess,
}: ChangePasswordFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const setLoading = useGlobalStore((state) => state.setLoading);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
  });

  const onSubmit: SubmitHandler<ChangePasswordFormData> = async (data) => {
    setIsSubmitting(true);
    setLoading(true);
    try {
      // Kiểm tra mật khẩu hiện tại bằng cách đăng nhập lại
      const userInfo = useGlobalStore.getState().userInfo;
      
      if (!userInfo?.email) {
        throw new Error("Không tìm thấy thông tin email");
      }

      // Xác thực mật khẩu hiện tại
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: userInfo.email,
        password: data.currentPassword,
      });

      if (signInError) {
        toast.error("Mật khẩu hiện tại không chính xác");
        setIsSubmitting(false);
        setLoading(false);
        return;
      }

      // Cập nhật mật khẩu mới
      await SERVICES.UserService.updatePassword(data.newPassword);

      toast.success("Đổi mật khẩu thành công");
      reset();
      await onSuccess?.();
      modal?.close();
    } catch (error: any) {
      toast.error(error.message || "Không thể đổi mật khẩu. Vui lòng thử lại");
    } finally {
      setIsSubmitting(false);
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <label
          htmlFor="currentPassword"
          className="block font-medium text-gray-600 text-sm"
        >
          Mật khẩu hiện tại
        </label>
        <input
          type="password"
          id="currentPassword"
          {...register("currentPassword")}
          className={`px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm ${
            errors.currentPassword ? "border-red-500" : "border-slate-300"
          }`}
          placeholder="Nhập mật khẩu hiện tại"
        />
        {errors.currentPassword && (
          <span className="text-red-500 text-xs">
            {errors.currentPassword.message}
          </span>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label
          htmlFor="newPassword"
          className="block font-medium text-gray-600 text-sm"
        >
          Mật khẩu mới
        </label>
        <input
          type="password"
          id="newPassword"
          {...register("newPassword")}
          className={`px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm ${
            errors.newPassword ? "border-red-500" : "border-slate-300"
          }`}
          placeholder="Nhập mật khẩu mới (ít nhất 6 ký tự)"
        />
        {errors.newPassword && (
          <span className="text-red-500 text-xs">
            {errors.newPassword.message}
          </span>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label
          htmlFor="confirmPassword"
          className="block font-medium text-gray-600 text-sm"
        >
          Xác nhận mật khẩu mới
        </label>
        <input
          type="password"
          id="confirmPassword"
          {...register("confirmPassword")}
          className={`px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm ${
            errors.confirmPassword ? "border-red-500" : "border-slate-300"
          }`}
          placeholder="Nhập lại mật khẩu mới"
        />
        {errors.confirmPassword && (
          <span className="text-red-500 text-xs">
            {errors.confirmPassword.message}
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

