import {
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  ChevronDown,
  LogOut,
  Shapes,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { Utils } from '@/shared/lib/utils';
import { useGlobalStore } from '@/store/globalStore';

/* eslint-disable @typescript-eslint/no-empty-object-type */
type UserInfoProps = {
  // TODO: Add props if needed
};
export default function UserInfo({}: UserInfoProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const userInfo = useGlobalStore((state) => state.userInfo);
  const clearUserInfo = useGlobalStore((state) => state.clearUserInfo);

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
    clearUserInfo();
    setIsDropdownOpen(false);
    router.push("/auth/sign-in");
  };
  return (
    <div className="relative" ref={dropdownRef}>
      <div
        className="flex items-center gap-2 p-2 rounded-lg transition-colors cursor-pointer"
        onClick={toggleDropdown}
      >
        <div className="hidden md:block flex flex-col justify-center text-gray-500">
          <p className="font-bold">{userInfo?.fullName}</p>
          <span className="text-xs">{userInfo?.email}</span>
        </div>
        <div className="flex justify-center items-center bg-white/10 border border-slate-200 rounded-full w-10 h-10">
          <span className="font-semibold text-gray-500">
            {userInfo?.fullName && Utils.text.getInitial(userInfo?.fullName)}
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
            <p className="font-semibold text-gray-900">{userInfo?.fullName}</p>
            <p className="text-gray-500 text-sm">{userInfo?.email}</p>
          </div>
          <div className="flex flex-col">
            <Link
              href="/categories"
              className="flex justify-between items-center gap-2 hover:bg-amber-400 px-4 py-2 text-sm cursor-pointer"
            >
              <span>Categories</span>
              <Shapes size={16} />
            </Link>
            {/* <Link
              href="/settings"
              className="flex justify-between items-center gap-2 hover:bg-amber-400 px-4 py-2 text-sm cursor-pointer"
            >
              <span>Settings</span>
              <UserCog size={16} />
            </Link> */}
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
  );
}
