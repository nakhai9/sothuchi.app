"use client";

import React from 'react';

import { CATEGORIES } from '@/lib/constants/categories';

import { PageLayout } from '../components';

export default function Categories() {
  return (
    <PageLayout title="Categories">
      <div className="flex flex-col gap-4">
        {CATEGORIES.map((x) => (
          <div
            key={x.id}
            className="flex items-center gap-3 bg-white shadow-md p-4 rounded-lg"
          >
            <div className="w-12 h-12">
              <img className="w-full h-full" src={x.icon} alt="" />
            </div>
            <div>{x.name}</div>
          </div>
        ))}
      </div>
    </PageLayout>
  );
}
