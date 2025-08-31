import React from 'react';
import DashboardLayout from '@/components/shared/DashboardLayout';
import MenuSection from '@/components/ui/MenuSection';
import { employeeProfilingSection, timeAttendanceSection } from '@/lib/menuData';

export default function HumanResource() {
  const breadcrumbs = [
    { label: 'Modules', href: '/' },
    { label: 'Human Resource' }
  ];

  return (
    <DashboardLayout breadcrumbs={breadcrumbs}>
      <div className="p-6">
        {/* Employee Profiling */}
        <MenuSection section={employeeProfilingSection} className="mb-8" />
        
        {/* Time & Attendance */}
        <MenuSection section={timeAttendanceSection} />
      </div>
    </DashboardLayout>
  );
}
