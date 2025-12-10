"use client";

import './globals.css';

import { useEffect } from 'react';

import {
  getCookie,
  setCookie,
} from 'cookies-next';
import {
  Geist,
  Geist_Mono,
} from 'next/font/google';
import { useRouter } from 'next/navigation';
import { Toaster } from 'react-hot-toast';

import { supabase } from '@/shared/lib/config/supabaseClient';
import { useGlobalStore } from '@/store/globalStore';

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

  useEffect(() => {
    const fetchUserInfo = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (error || !data.session || !data.session.user) {
        router.push("/auth/sign-in");
        return;
      }

      const accessToken =
        data.session.access_token ?? getCookie("accessToken")?.toString();
      if (accessToken) {
        setCookie("accessToken", accessToken, { maxAge: 60 * 60 });
      }

      if (!userInfo) {
        const user = data.session.user;
        setUserInfo({
          email: user.email ?? "",
          fullName:
            (user.user_metadata?.fullName as string) ??
            `${user.user_metadata?.firstName ?? ""} ${user.user_metadata?.lastName ?? ""}`.trim(),
          phone: user.phone,
          photoUrl: user.user_metadata?.avatar_url,
          id: undefined,
          createdAt: new Date(user.created_at),
          updatedAt: new Date(user.updated_at ?? user.last_sign_in_at ?? user.created_at),
          isDeleted: false,
        });
      }
    };
    fetchUserInfo();
  }, []);

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Toaster position="top-right" reverseOrder={false} />
      </body>
    </html>
  );
}
