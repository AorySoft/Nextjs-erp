import React from 'react';
import DashboardLayout from '@/components/shared/DashboardLayout';

interface HumanResourceLayoutProps {
  children: React.ReactNode;
}

export default function HumanResourceLayout({ children }: HumanResourceLayoutProps) {
  const breadcrumbs = [
    { label: 'Modules', href: '/' },
    { label: 'Human Resource' }
  ];

  return (
    <DashboardLayout breadcrumbs={breadcrumbs}>
      <div className="w-full h-full overflow-auto px-6 py-4">
        {children}
      </div>
    </DashboardLayout>
  );
}
