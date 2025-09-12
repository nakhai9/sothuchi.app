"use client"

import React from "react";

type AuthLayoutProps = {
    title: string;
    children: React.ReactNode
}
export default function AuthLayout({ title, children }: AuthLayoutProps) {
    return (
        <div className="flex justify-center items-center bg-gray-100 px-4 sm:px-6 lg:px-8 min-h-screen">
            <div className="bg-white shadow-lg p-6 sm:p-8 rounded-lg w-full max-w-md">
                <h2 className="mb-6 font-bold text-amber-600 text-2xl sm:text-3xl text-center">
                    {title}
                </h2>
                {children}
            </div>
        </div>
    );
}
