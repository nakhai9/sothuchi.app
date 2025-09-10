"use client"
import { useGlobalStore } from '@/store/globalStore';

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
  description
}: PageLayoutProps) {
  const userInfo = useGlobalStore(state => state.userInfo);
  return (
    <div className="min-h-screen">
      <div className='bg-amber-500 w-full'>
        <div className="flex justify-between items-center mx-auto px-4 max-w-6xl h-14 text-white">
          <div className='font-medium text-3xl'>ExpApp</div>
          <div className='flex items-center gap-2'>

            <div className="flex flex-col justify-center">
              <p className='font-bold'>{userInfo?.firstName} {userInfo?.lastName}</p>
              <span className="text-xs">{userInfo?.email}</span>
            </div>
            <div className='border border-slate-200 rounded-full w-10 h-10'>

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
    </div>
  );
}
