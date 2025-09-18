"use client";

import { useGlobalStore } from "@/store/globalStore";
import { Info } from "lucide-react";
import React from "react";

type AuthLayoutProps = {
  title: string;
  children: React.ReactNode;
};
export default function AuthLayout({ title, children }: AuthLayoutProps) {
  const isLoading = useGlobalStore((state) => state.isLoading);

  return (
    <div className="relative">
      <div className="top-4 left-1/2 fixed flex gap-2 bg-yellow-50 p-3 border-2 border-yellow-400 rounded-md max-w-96 font-medium text-yellow-800 text-sm -translate-x-1/2">
        <div>
          <Info />
        </div><p >Our system uses a free WebService hosted on Render. As a result, it may take approximately 5–10 minutes to &quot;wake up&quot; and function properly after being accessed.
          We apologize for the inconvenience, and thank you for your patience.</p></div>
      <div className="flex justify-center items-center bg-gray-100 px-4 sm:px-6 lg:px-8 min-h-screen">
        <div className="bg-white shadow-lg p-6 sm:p-8 rounded-lg w-full max-w-md">
          <h2 className="mb-6 font-bold text-amber-600 text-2xl sm:text-3xl text-center">
            {title}
          </h2>
          {children}
        </div>
      </div>
      {isLoading && (
        <div className="z-10 fixed inset-0 flex justify-center items-center bg-gray-300/50 h-screen">
          <div className="shadow-lg border-5 border-amber-500 border-t-transparent rounded-full w-12 h-12 animate-spin"></div>
        </div>
      )}
    </div>
  );
}
