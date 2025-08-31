import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import MainContent from './MainContent';
import Footer from './Footer';

interface DashboardLayoutProps {
  children?: React.ReactNode;
  breadcrumbs?: Array<{ label: string; href?: string }>;
}

export default function DashboardLayout({ children, breadcrumbs }: DashboardLayoutProps) {
  // Default breadcrumbs if none provided
  const defaultBreadcrumbs = [
    { label: 'Modules', href: '/' },
    { label: 'Human Resource' }
  ];

  return (
    <div className="flex h-screen bg-[#f8f9fa] font-sans text-[13px] text-[#333] select-none overflow-hidden">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main content */}
      <main className="flex-1 flex flex-col">
        {/* Header with integrated breadcrumbs */}
        <Header breadcrumbs={breadcrumbs || defaultBreadcrumbs} />
        
        {/* Content */}
        {children || <MainContent />}
        
        {/* Footer */}
        <Footer />
      </main>
    </div>
  );
}