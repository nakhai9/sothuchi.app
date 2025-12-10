"use client";
import { useState } from 'react';

import { setCookie } from 'cookies-next';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

import AuthLayout from '@/shared/components/AuthLayout';
import { supabase } from '@/shared/lib/config/supabaseClient';
import { useGlobalStore } from '@/store/globalStore';

export default function SignInPage() {
  const router = useRouter();

  const [email, setEmail] = useState(
    process.env.NEXT_PUBLIC_SYSTEM_EMAIL ?? ""
  );
  const [password, setPassword] = useState(
    process.env.NEXT_PUBLIC_SYSTEM_PASSWORD ?? ""
  );
  const [showResendEmail, setShowResendEmail] = useState(false);
  const setLoading = useGlobalStore((state) => state.setLoading);
  const setUserInfo = useGlobalStore((state) => state.setUserInfo);

  const handleResendConfirmationEmail = async () => {
    if (!email) {
      toast.error("Vui lòng nhập email");
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.resend({
      type: "signup",
      email: email,
      options: {
        emailRedirectTo: `${window.location.origin}/dashboard`,
      },
    });

    if (error) {
      toast.error("Không thể gửi email xác nhận. Vui lòng thử lại");
    } else {
      toast.success("Đã gửi email xác nhận. Vui lòng kiểm tra hộp thư");
      setShowResendEmail(false);
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setShowResendEmail(false);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      if (error.message === "Email not confirmed" || error.code === "email_not_confirmed") {
        toast.error("Email chưa được xác nhận. Vui lòng kiểm tra hộp thư");
        setShowResendEmail(true);
      } else {
        toast.error(error.message || "Email hoặc mật khẩu không chính xác");
      }
      setLoading(false);
      return;
    }

    if (!data.session || !data.user) {
      toast.error("Đăng nhập thất bại. Vui lòng thử lại");
      setLoading(false);
      return;
    }

    const { session, user } = data;

    setCookie("accessToken", session.access_token, {
      maxAge: 60 * 60, // 1 giờ
    });

    setUserInfo({
      email: user.email ?? "",
      fullName:
        (user.user_metadata?.fullName as string) ??
        `${user.user_metadata?.firstName ?? ""} ${user.user_metadata?.lastName ?? ""}`.trim(),
      phone: user.phone,
      photoUrl: user.user_metadata?.avatar_url,
      id: undefined,
      createdAt: new Date(user.created_at),
      updatedAt: new Date(user.updated_at ?? user.last_sign_in_at ?? user.created_at),
      isDeleted: false,
    });

    router.push("/dashboard");
    toast.success("Đăng nhập thành công");
    setLoading(false);
  };

  return (
    <AuthLayout title="Sign in">
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="email"
            className="block font-semibold text-gray-700 text-sm"
          >
            Email
          </label>
          <input
            type="text"
            id="email"
            name="email"
            className="block shadow-sm mt-1 px-3 py-2 border border-gray-300 focus:border-amber-500 rounded-md focus:outline-none focus:ring-amber-500 w-full text-sm sm:text-base"
            placeholder="Username"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
        </div>
        <div className="mb-6">
          <label
            htmlFor="password"
            className="block font-semibold text-gray-700 text-sm"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            className="block shadow-sm mt-1 px-3 py-2 border border-gray-300 focus:border-amber-500 rounded-md focus:outline-none focus:ring-amber-500 w-full text-sm sm:text-base"
            placeholder="Your password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
        </div>
        {/* <div className="flex sm:flex-row flex-col sm:justify-between sm:items-center space-y-4 sm:space-y-0 mb-6">
          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              className="border-gray-300 rounded focus:ring-amber-500 w-4 h-4 text-amber-600"
            />
            <label
              htmlFor="remember-me"
              className="block ml-2 text-gray-900 text-sm"
            >
              Remember me
            </label>
          </div>
          <div>
            <a href="#" className="text-amber-600 hover:text-amber-800 text-sm">
              Forgotten password
            </a>
          </div>
        </div> */}
        <button
          type="submit"
          className="bg-amber-600 hover:bg-amber-700 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 w-full text-white text-sm sm:text-base cursor-pointer"
        >
          Sign in
        </button>
      </form>
      {showResendEmail && (
        <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-md">
          <p className="text-sm text-amber-800 mb-2">
            Email chưa được xác nhận. Bạn có muốn gửi lại email xác nhận không?
          </p>
          <button
            type="button"
            onClick={handleResendConfirmationEmail}
            className="text-sm text-amber-600 hover:text-amber-800 underline"
          >
            Gửi lại email xác nhận
          </button>
        </div>
      )}
      <p className="mt-4 text-gray-600 text-sm text-center">
        Do not have an account?
        <Link
          href="/auth/sign-up"
          className="ml-2 text-amber-600 hover:text-amber-800"
        >
          Sign up
        </Link>
      </p>
    </AuthLayout>
  );
}
