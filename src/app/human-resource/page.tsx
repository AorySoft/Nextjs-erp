import React from 'react';
import DashboardLayout from '@/components/shared/DashboardLayout';
import MenuSection from '@/components/ui/MenuSection';
import { employeeProfilingSection, timeAttendanceSection } from '@/lib/menuData';

export default function HumanResource() {
  return (
    <DashboardLayout>
      <div className="p-6">
     {/*   <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Human Resource Management</h1>
          <p className="text-gray-600">Manage employee profiles, attendance, and HR processes</p>
        </div>
        */}
        {/* Employee Profiling */}
        <MenuSection section={employeeProfilingSection} className="mb-8" />
        
        {/* Time & Attendance */}
        <MenuSection section={timeAttendanceSection} />
      </div>
    </DashboardLayout>
  );
}
