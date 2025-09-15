"use client";

import { useGlobalStore } from "@/store/globalStore";
import "./globals.css";

import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "react-hot-toast";
import { getCookie } from "cookies-next";
import { useEffect } from "react";
import { SERVICES } from "@/services/service";
import { useRouter } from "next/navigation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const router = useRouter();

  const userInfo = useGlobalStore((state) => state.userInfo);
  const setUserInfo = useGlobalStore((state) => state.setUserInfo);

  const token = getCookie("accessToken");

  useEffect(() => {
    const fetchUserInfo = async () => {
      if (token && !userInfo) {
        const userInfo = await SERVICES.UserService.getUserInfo();
        if (userInfo) {
          setUserInfo(userInfo);
        }
      }

      if (!token && !userInfo) {
        router.push("/auth/sign-in");
      }
    };
    fetchUserInfo();
  }, []);

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Toaster position="top-right" reverseOrder={false} />
      </body>
    </html>
  );
}
