import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import Breadcrumb from './Breadcrumb';
import MainContent from './MainContent';
import Footer from './Footer';

interface DashboardLayoutProps {
  children?: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex h-screen bg-[#f8f9fa] font-sans text-[13px] text-[#333] select-none overflow-hidden">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main content */}
      <main className="flex-1 flex flex-col">
        {/* Header */}
        <Header />
        
        {/* Breadcrumb */}
        <Breadcrumb />
        
        {/* Content */}
        {children || <MainContent />}
        
        {/* Footer */}
        <Footer />
      </main>
    </div>
  );
}