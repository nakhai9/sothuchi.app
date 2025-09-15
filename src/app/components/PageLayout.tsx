"use client";
import { useGlobalStore } from "@/store/globalStore";
import Link from "next/link";

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
  const userInfo = useGlobalStore((state) => state.userInfo);
  return (
    <div className="relative min-h-screen">
      <div className="bg-amber-500 w-full">
        <div className="flex justify-between items-center mx-auto px-4 max-w-6xl h-14 text-white">
          <Link href={"/"} className="font-medium text-3xl">ExpApp</Link>
          <div className="flex items-center gap-2">
            <div className="flex flex-col justify-center">
              <p className="font-bold">{userInfo?.fullName}</p>
              <span className="text-xs">{userInfo?.email}</span>
            </div>
            <div className="border border-slate-200 rounded-full w-10 h-10">
              <img src={userInfo?.photoUrl} alt="Image" />
            </div>
          </div>
        </div>
      </div>
      <main className="mx-auto mt-4 px-4 max-w-6xl max-h-[calc(100%-56px)]">
        <div className="flex justify-between items-center gap-1 mb-6">
          <div>
            <h1 className="font-bold text-gray-600 text-3xl">{title}</h1>
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
