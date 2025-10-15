/* eslint-disable @typescript-eslint/no-empty-object-type */
"use client";

import { PageLayout } from "@/shared/components";
import { AVATAR_PLACEHOLDER } from "@/shared/lib/constants/categories";
import { useGlobalStore } from "@/store/globalStore";
import Image from "next/image";

type SettingsPageProps = {};
export default function Settings() {
  const userInfo = useGlobalStore((state) => state.userInfo);
  return (
    <PageLayout title="Settings">
      <div className="flex md:flex-row flex-col gap-10 bg-white shadow-md p-6 rounded-lg">
        <div className="relative mx-auto border border-slate-200 rounded-full w-40 h-40 overflow-hidden">
          <Image
            className="object-contain"
            fill
            src={userInfo?.photoUrl ?? AVATAR_PLACEHOLDER}
            alt="User avatar"
          />
        </div>
        <div className="flex flex-col flex-1 gap-4 text-sm">
          <div className="flex flex-col gap-1">
            <label htmlFor="" className="font-bold">
              Full name
            </label>
            <div>{userInfo?.fullName ?? "-"}</div>
            <div className="text-blue-500 cursor-pointer">Change Name</div>
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="" className="font-bold">
              Email
            </label>
            <div>{userInfo?.email ?? "-"}</div>
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="" className="font-bold">
              Phone
            </label>
            <div>{userInfo?.phone ?? "-"}</div>
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="" className="font-bold">
              Password
            </label>
            <div>*********</div>
            <div className="text-blue-500 cursor-pointer">Change Password</div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
