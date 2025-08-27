"use client";
import React, { useState } from 'react';
import DashboardLayout from '@/components/shared/DashboardLayout';
import DataTable from '@/components/ui/DataTable';
import EmployeeProfileModal from '@/components/ui/EmployeeProfileModal';
import { Edit, Trash, View, Plus } from 'lucide-react';
import { EmployeeData } from '@/services/api';

interface TableEmployee {
  entity: string;
  employeeId: string;
  machineId: string;
  employeeName: string;
  empCategory: string;
  department: string;
  designation: string;
  contact: string;
  status: string;
}

const EmployeeProfile = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [employees, setEmployees] = useState<TableEmployee[]>([]);
  const columns = [
    {
      key: "action",
      label: "Action",
      searchable: false,
      render: (row: unknown) => (
        <div className="flex gap-2">
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

  const data: TableEmployee[] = [
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

  const handleSaveEmployee = (employeeData: EmployeeData) => {
    // Add the new employee to the list
    const newEmployee = {
      entity: "HR",
      employeeId: employeeData.name || '',
      machineId: employeeData.machine_code || '',
      employeeName: `${employeeData.first_name || ''} ${employeeData.last_name || ''}`.trim(),
      empCategory: employeeData.custom_employment_category || '',
      department: employeeData.department || '',
      designation: employeeData.custom_employment_category || '',
      contact: employeeData.contact_no || '',
      status: "Active",
    };
    
    setEmployees(prev => [...prev, newEmployee]);
  };

  return (
    <DashboardLayout>
      <div className="p-4 h-[calc(100vh-120px)] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-semibold text-gray-800">Employee Profile</h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={20} />
            New Employee
          </button>
        </div>
        <DataTable columns={columns} data={[...data, ...employees]} />
        
        <EmployeeProfileModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveEmployee}
        />
      </div>
    </DashboardLayout>
  );
};

export default EmployeeProfile;
