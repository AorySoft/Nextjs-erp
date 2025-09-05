import { MenuSection } from '@/types';

export const employeeProfilingSection: MenuSection = {
  title: 'Employee Profiling',
  icon: 'book',
  items: [
    {
      title: 'Setup',
      items: [
        { label: 'Qualification Type', isFavorite: false },
        { label: 'Qualification', isFavorite: false },
        { label: 'Skill Type', isFavorite: false },
        { label: 'Skill', isFavorite: false },
        { label: 'Position Type', isFavorite: false },
        { label: 'Skill Rating', isFavorite: false }
      ]
    },
    {
      title: 'Profiling',
      items: [
        { label: 'Employee Profile', isFavorite: false, href: '/human-resource/employee-profile' },
        { label: 'Employement', isFavorite: false }
      ]
    }
  ]
};

export const timeAttendanceSection: MenuSection = {
  title: 'Time & Attendance',
  icon: 'book',
  items: [
    {
      title: 'Setup',
      items: [
        { label: 'Holiday Type', isFavorite: false, href: '/human-resource/time-attendance/setup/holiday-type' },
    //    { label: 'Calendar Holidays', isFavorite: false },
        { label: 'Attendance Policies', isFavorite: false },
        { label: 'Shift', isFavorite: false },
   //     { label: 'Device Registration', isFavorite: false },
    //    { label: 'Attendance Policy Group', isFavorite: false },
     //   { label: 'Custom Schedule', isFavorite: false }
      ]
    },
    {
      title: 'Leave',
      items: [
        { label: 'Leave Type', isFavorite: false },
        { label: 'Leave Group', isFavorite: false },
        { label: 'Leave Adjustment Policy', isFavorite: false },
        { label: 'Leave Quota Allocation', isFavorite: false },
        { label: 'Leave Request', isFavorite: false },
        { label: 'Leave Approval', isFavorite: false },
        { label: 'Leave Adjustment', isFavorite: false }
      ]
    },
    {
      title: 'Attendance',
      items: [
        { label: 'Employee Attendance', isFavorite: false },
        { label: 'Bulk Attendance', isFavorite: false },
        { label: 'Download Attendance', isFavorite: false },
        { label: 'Upload Attendance', isFavorite: false },
        { label: 'Attendance Request', isFavorite: false }
      ]
    },
    {
      title: 'Process',
      items: [
        { label: 'Daily Attendance Process', isFavorite: false },
        { label: 'Monthly Attendance Process', isFavorite: false },
        { label: 'Daily Attendance Data', isFavorite: false },
        { label: 'Monthly Attendance Data', isFavorite: false },
        { label: 'Daily Attendance Data', isFavorite: false }
      ]
    }
  ]
};