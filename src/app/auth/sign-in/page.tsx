"use client";
import { SERVICES } from "@/services/service";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { setCookie } from "cookies-next";
import Link from "next/link";
import { AuthLayout } from "@/app/components";
import { useGlobalStore } from "@/store/globalStore";
import toast from "react-hot-toast";
export default function SignInPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const setLoading = useGlobalStore((state) => state.setLoading);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = await SERVICES.authService.signIn({ email, password });
      if (token.accessToken.length > 0) {
        setCookie("accessToken", token.accessToken, {
          maxAge: 60 * 60,
        });
        router.push("/dashboard");
      }
    } catch (error: any) {
      const msg =
        error?.response?.data?.message ||
        "Something went wrong. Please try again!";
      toast.error(msg);
    } finally {
      setLoading(false);
      toast.success("Logged successfully");
    }
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
          />
        </div>
        <div className="flex sm:flex-row flex-col sm:justify-between sm:items-center space-y-4 sm:space-y-0 mb-6">
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
        </div>
        <button
          type="submit"
          className="bg-amber-600 hover:bg-amber-700 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 w-full text-white text-sm sm:text-base cursor-pointer"
        >
          Sign in
        </button>
      </form>
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
