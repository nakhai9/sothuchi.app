"use client";
import {
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  ChevronDown,
  LogOut,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { Utils } from '@/lib/utils';
import { useGlobalStore } from '@/store/globalStore';

import Breadcrumb from './Breadcrumb';

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
  const router = useRouter();
  const userInfo = useGlobalStore((state) => state.userInfo);
  const clearUserInfo = useGlobalStore((state) => state.clearUserInfo);
  const isLoading = useGlobalStore((state) => state.isLoading);
  const setLoading = useGlobalStore((state) => state.setLoading);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = () => {
    // Add logout logic here
    setLoading(true);
    clearUserInfo();
    setIsDropdownOpen(false);
    setLoading(false);
    router.push("/");
  };

  return (
    <div className="relative min-h-screen">
      <div className="bg-amber-500 w-full">
        <div className="flex justify-between items-center mx-auto px-4 max-w-6xl h-14">
          <Link
            href="/dashboard"
            className="font-medium text-gray-700 text-3xl"
          >
            ExpApp
          </Link>
          <div className="relative" ref={dropdownRef}>
            <div
              className="flex items-center gap-2 p-2 rounded-lg transition-colors cursor-pointer"
              onClick={toggleDropdown}
            >
              <div className="flex flex-col justify-center text-gray-700">
                <p className="font-bold">{userInfo?.fullName}</p>
                <span className="text-xs">{userInfo?.email}</span>
              </div>
              <div className="flex justify-center items-center bg-white/10 border border-slate-200 rounded-full w-10 h-10">
                <span className="font-semibold text-white">
                  {userInfo?.fullName &&
                    Utils.text.getInitial(userInfo?.fullName)}
                </span>
              </div>

              <ChevronDown
                className={`w-4 h-4 transition-transform ${
                  isDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </div>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="right-0 z-50 absolute bg-white shadow-lg mt-2 py-2 border border-gray-200 rounded-lg w-56 text-gray-700">
                {/* User Info Header */}
                <div className="px-4 py-3 border-gray-100 border-b">
                  <p className="font-semibold text-gray-900">
                    {userInfo?.fullName}
                  </p>
                  <p className="text-gray-500 text-sm">{userInfo?.email}</p>
                </div>
                <div className="flex flex-col">
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex justify-between items-center gap-2 hover:bg-amber-400 px-4 py-2 cursor-pointer"
                  >
                    <span className="text-sm">Log Out</span>
                    <LogOut size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <main className="mx-auto mt-4 px-4 max-w-6xl max-h-[calc(100%-56px)]">
        <Breadcrumb />
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
