import React from 'react';
import MenuSection from '@/components/ui/MenuSection';
import { employeeProfilingSection, timeAttendanceSection } from '@/lib/menuData';

export default function HumanResource() {
  return (
    <div className="p-6">
      {/* Employee Profiling */}
      <MenuSection section={employeeProfilingSection} className="mb-8" />
      
      {/* Time & Attendance */}
      <MenuSection section={timeAttendanceSection} />
    </div>
  );
}
