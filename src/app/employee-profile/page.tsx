"use client";
import React from 'react';
import DashboardLayout from '@/components/shared/DashboardLayout';
import DataTable from '@/components/ui/DataTable';
import { Edit, Trash, View } from 'lucide-react';

const EmployeeProfile = () => {
  const columns = [
    {
      key: "action",
      label: "Action",
      searchable: false,
      render: (row: any) => (
        <div className="flex gap-2">
          {/* <button
            className="px-2 py-1 bg-blue-500 text-white rounded"
            onClick={() => alert(`Editing ${row.employeeName}`)}
          >
            Edit
          </button>
          <button
            className="px-2 py-1 bg-red-500 text-white rounded"
            onClick={() => alert(`Deleting ${row.employeeName}`)}
          >
            Delete
          </button> */}
          <Trash size={20}/>
          <Edit size={20}/> 
          <View size={20}/>
        </div>
      ),
    
    },
    { key: "sno", label: "S.no", searchable: false },
    { key: "entity", label: "Entity", searchable: true },
    { key: "employeeId", label: "Employee ID", searchable: true },
    { key: "machineId", label: "Machine ID", searchable: true },
    { key: "employeeName", label: "Employee Name", searchable: true },
    { key: "empCategory", label: "Emp Category", searchable: true },
    { key: "department", label: "Department", searchable: true },
    { key: "designation", label: "Designation", searchable: true },
    { key: "contact", label: "Contact", searchable: true },
    { key: "status", label: "Status", searchable: true },
  ];

  const data = [
    {
      entity: "HR",
      employeeId: "E123",
      machineId: "M01",
      employeeName: "Asad Iqbal",
      empCategory: "Full-time",
      department: "IT",
      designation: "Developer",
      contact: "0300-1234567",
      status: "Active",
    },
    {
      entity: "Finance",
      employeeId: "E456",
      machineId: "M02",
      employeeName: "Ali Khan",
      empCategory: "Part-time",
      department: "Accounts",
      designation: "Manager",
      contact: "0311-9876543",
      status: "Inactive",
    },
  ]

  return (
    <DashboardLayout>
      <div className="p-4 h-[calc(100vh-120px)] overflow-y-auto">
        <div>btn</div>
        <DataTable columns={columns} data={data} />
      </div>
    </DashboardLayout>
  );
};

export default EmployeeProfile;
