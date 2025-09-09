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
        <div className="overflow-y-auto"> {children}</div>
     
    </DashboardLayout>
  );
}
