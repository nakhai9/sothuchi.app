"use client";
import { useState } from "react";

import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { SERVICES } from "@/services/service";
import AuthLayout from "@/shared/components/AuthLayout";
import { useGlobalStore } from "@/store/globalStore";

export default function SignUpPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const setLoading = useGlobalStore((state) => state.setLoading);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await SERVICES.AuthService.signUp({
        email,
        firstName,
        lastName,
        password,
      });
      router.push("/auth/sign-in");
      toast.success("Created new a user");
    } catch (error) {
      toast.error("Cannot create new a user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Sign up">
      <form onSubmit={handleSubmit}>
        <div className="flex gap-3">
          <div className="mb-4">
            <label
              htmlFor="firstName"
              className="block font-semibold text-gray-700 text-sm"
            >
              First name
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              className="block shadow-sm mt-1 px-3 py-2 border border-gray-300 focus:border-amber-500 rounded-md focus:outline-none focus:ring-amber-500 w-full text-sm sm:text-base"
              placeholder="First name"
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="lastName"
              className="block font-semibold text-gray-700 text-sm"
            >
              Last name
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              className="block shadow-sm mt-1 px-3 py-2 border border-gray-300 focus:border-amber-500 rounded-md focus:outline-none focus:ring-amber-500 w-full text-sm sm:text-base"
              placeholder="Last name"
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
        </div>
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
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="mb-4">
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

        <button
          type="submit"
          className="bg-amber-600 hover:bg-amber-700 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 w-full text-white text-sm sm:text-base cursor-pointer"
        >
          Sign up
        </button>
      </form>
    </AuthLayout>
  );
}
