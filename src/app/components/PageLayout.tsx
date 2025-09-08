interface PageLayoutProps {
  children: React.ReactNode;
  title: string;
  actions?: React.ReactNode[];
}

export default function PageLayout({
  children,
  title,
  actions,
}: PageLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
          {actions && actions.length > 0 && (
            <div className="flex gap-3">
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
