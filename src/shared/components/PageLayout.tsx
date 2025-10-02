"use client";
import Link from "next/link";

import { useGlobalStore } from "@/store/globalStore";

import Breadcrumb from "./Breadcrumb";
import UserInfo from "./UserInfo";

interface PageLayoutProps {
  children: React.ReactNode;
  title: string;
  description?: string;
  actions?: React.ReactNode[];
}

export default function PageLayout({
  children,
  title,
  actions,
  description,
}: PageLayoutProps) {
  const isLoading = useGlobalStore((state) => state.isLoading);

  return (
    <div className="relative bg-slate-50 min-h-screen">
      <div className="bg-white shadow w-full">
        <div className="flex justify-between items-center mx-auto px-4 max-w-6xl h-14">
          <Link
            href="/dashboard"
            className="font-medium text-amber-600 text-3xl logo"
          >
            sothuchi app
          </Link>
          <UserInfo />
        </div>
      </div>
      <main className="mx-auto mt-4 px-4 max-w-6xl max-h-[calc(100%-56px)]">
        <Breadcrumb />
        <div className="flex justify-between items-center gap-1 mb-6">
          <div>
            <h2 className="font-bold text-gray-600 text-lg md:text-3xl">
              {title}
            </h2>
            <p className="text-gray-500 text-sm">{description}</p>
          </div>
          {actions && actions.length > 0 && (
            <div className="flex items-center gap-3">
              {actions.map((action, index) => (
                <div key={index}>{action}</div>
              ))}
            </div>
          )}
        </div>
        {children}
      </main>
      {isLoading && (
        <div className="z-10 fixed inset-0 flex justify-center items-center bg-gray-300/50 h-screen">
          <div className="shadow-lg border-5 border-amber-500 border-t-transparent rounded-full w-12 h-12 animate-spin"></div>
        </div>
      )}
    </div>
  );
}
