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
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="mx-auto px-4 py-8 max-w-5xl">
        <div className="flex justify-between items-center mb-8">
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
      </div>
    </div>
  );
}
