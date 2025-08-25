import React from 'react';
import MenuSection from '../ui/MenuSection';
import { employeeProfilingSection, timeAttendanceSection } from '@/lib/menuData';

interface MainContentProps {
  className?: string;
}

export default function MainContent({ className = "" }: MainContentProps) {
  return (
    <section className={`flex-1 overflow-auto px-6 py-4 bg-[#f9fafb] ${className}`}>
      {/* Employee Profiling */}
      <MenuSection section={employeeProfilingSection} className="mb-6" />
      
      {/* Time & Attendance */}
      <MenuSection section={timeAttendanceSection} />
    </section>
  );
}