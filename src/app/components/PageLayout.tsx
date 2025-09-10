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
    <div className="bg-gray-50 min-h-screen">
      <div className="mx-auto px-8 md:px-4 max-w-5xl">
        <div className="flex justify-between items-center mb-2 h-14">
          <div className='font-medium text-3xl'>ETApp</div>
          <div className='flex items-center gap-2'>

            <div className="flex flex-col justify-center">
              <p className='font-bold'>{userInfo?.firstName} {userInfo?.lastName}</p>
              <span className="text-gray-500 text-xs">{userInfo?.email}</span>
            </div>
            <div className='border border-slate-200 rounded-full w-10 h-10'>

            </div>
          </div>
        </div>
        <main className=''>
          <div className="flex justify-between items-center mb-6">
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
    </div>
  );
}
