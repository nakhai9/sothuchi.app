"use client";

import "./globals.css";

import { useEffect } from "react";

import { Geist, Geist_Mono } from "next/font/google";

import { SERVICES } from "@/services/service";
import { useGlobalStore } from "@/store/globalStore";

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
  const setUserInfo = useGlobalStore((state) => state.setUserInfo);
  useEffect(() => {
    const fetchUserInfo = async () => {
      const userInfo = await SERVICES.userService.getUserInfo();
      setUserInfo(userInfo);
    };

    fetchUserInfo();
  }, [setUserInfo]);

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
