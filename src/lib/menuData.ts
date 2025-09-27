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
       { label: 'Calendar Holidays', isFavorite: false, href: '/human-resource/time-attendance/setup/calendar-holidays'  },
        { label: 'Attendance Policies', isFavorite: false , href: '/human-resource/time-attendance/setup/attendance-policy'},
        { label: 'Shift', isFavorite: false, href: '/human-resource/time-attendance/setup/employee-shifts' },
   //     { label: 'Device Registration', isFavorite: false },
    //    { label: 'Attendance Policy Group', isFavorite: false },
     //   { label: 'Custom Schedule', isFavorite: false }
      ]
    },
    {
      title: 'Leave',
      items: [
        { label: 'Leave Type', isFavorite: false, href: '/human-resource/time-attendance/leave/leave-type' },
        { label: 'Leave Group', isFavorite: false, href: '/human-resource/time-attendance/leave/leave-group' },
        { label: 'Leave Adjustment Policy', isFavorite: false, href: '/human-resource/time-attendance/leave/leave-adjustment-policy' },
        { label: 'Leave Quota Allocation', isFavorite: false, href:'/human-resource/time-attendance/leave/leave-quota-allocation' },
        { label: 'Leave Request', isFavorite: false, href:'/human-resource/time-attendance/leave/leave-request' },
        { label: 'Leave Approval', isFavorite: false },
        { label: 'Leave Adjustment', isFavorite: false, href: '/human-resource/time-attendance/leave/leave-adjustment' }
      ]
    },
    {
      title: 'Attendance',
      items: [
        { label: 'Employee Attendance', isFavorite: false, href: '/human-resource/time-attendance/attendance/employee-attendance' },
        { label: 'Bulk Attendance', isFavorite: false, },
        { label: 'Download Attendance', isFavorite: false,},
        { label: 'Upload Attendance', isFavorite: false },
        { label: 'Attendance Request', isFavorite: false, href: '/human-resource/time-attendance/attendance/attendance-request' }
      ]
    },
    {
      title: 'Process',
      items: [
        { label: 'Daily Attendance Process', isFavorite: false, href: '/human-resource/time-attendance/process/daily-attendance-process' },
        { label: 'Monthly Attendance Process', isFavorite: false },
        { label: 'Daily Attendance Data', isFavorite: false },
        { label: 'Monthly Attendance Data', isFavorite: false },
        { label: 'Daily Attendance Data', isFavorite: false }
      ]
    }
  ]
};