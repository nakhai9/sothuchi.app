"use client";

import React from 'react';

import Image from 'next/image';

import { CATEGORIES } from '@/lib/constants/categories';

import { PageLayout } from '../components';

export default function Categories() {
  return (
    <PageLayout title="Categories">
      <div className="flex flex-col gap-3">
        {CATEGORIES.map((x) => (
          <div
            key={x.id}
            className="flex items-center gap-3 bg-white shadow-md p-4 rounded-lg"
          >
            <div className="relative w-12 h-12">
              <Image
                className="object-contain"
                fill
                src={x.icon}
                alt={x.name}
              />
            </div>
            <div>{x.name}</div>
          </div>
        ))}
      </div>
    </PageLayout>
  );
}
