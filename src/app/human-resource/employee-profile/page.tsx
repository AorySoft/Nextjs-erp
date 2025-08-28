"use client";
import React, { useState, useEffect, useReducer } from 'react';
import DashboardLayout from '@/components/shared/DashboardLayout';
import DataTable from '@/components/ui/DataTable';
import EmployeeProfileModal from '@/components/ui/EmployeeProfileModal';
import { Edit, Trash, View, Plus, SearchIcon } from 'lucide-react';
import { EmployeeData, employeeAPI } from '@/services/api';
import MuiDialog from '@/components/ui/DialogBox';
import Button from '@/components/ui/Button';
import CustomButton from '@/components/ui/CustomButton';
import { TextField } from '@mui/material';
import CustomTextField from '@/components/ui/CustomTextField';
import { defaultColor } from '@/utils/constant';
import CustomSelectField from '@/components/ui/CustomSelectField';

interface TableEmployee {
  name: string;
  attendance_device_id: string;
  employee_name: string;
  branch: string;
  designation: string;
  department: string;
  cell_number: string;
  custom_employment_category: string;
  employment_type: string;
}

// Interface for API response employee data
interface APIEmployee {
  name?: string;
  attendance_device_id?: string;
  employee_name?: string;
  branch?: string;
  designation?: string;
  department?: string;
  cell_number?: string;
  custom_employment_category?: string;
  employment_type?: string;
}

const EmployeeProfile = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [employees, setEmployees] = useState<TableEmployee[]>([]);
  const [loading, setLoading] = useState(false);
  const [state,setState]=useReducer((state:any,newState:any)=>({...state,...newState}),{
    employee_dialog:false,
   
    
  })

  // Fetch employees from API when component mounts
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setLoading(true);
        const apiEmployees = await employeeAPI.getEmployees();
        console.log('Fetched employees from API:', apiEmployees);
        
        // Transform API response to match our TableEmployee interface
        if (apiEmployees && Array.isArray(apiEmployees.data)) {
          const transformedEmployees = apiEmployees.data.map((emp: APIEmployee) => ({
            name: emp.name || '',
            attendance_device_id: emp.attendance_device_id || '',
            employee_name: emp.employee_name || '',
            branch: emp.branch || '',
            designation: emp.designation || '',
            department: emp.department || '',
            cell_number: emp.cell_number || '',
            custom_employment_category: emp.custom_employment_category || '',
            employment_type: emp.employment_type || '',
          }));
          setEmployees(transformedEmployees);
        }
      } catch (error) {
        console.error('Error fetching employees:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);
  const columns = [
    {
      key: "action",
      label: "Action",
      searchable: false,
      render: () => (
        <div className="flex gap-2">
          <Trash size={20}/>
          <Edit size={20}/> 
          <View size={20}/>
        </div>
      ),
    
    },
    { key: "sno", label: "S.no", searchable: false },
    { key: "name", label: "Employee ID", searchable: true },
    { key: "attendance_device_id", label: "Device ID", searchable: true },
    { key: "employee_name", label: "Employee Name", searchable: true },
    { key: "branch", label: "Branch", searchable: true },
    { key: "designation", label: "Designation", searchable: true },
    { key: "department", label: "Department", searchable: true },
    { key: "cell_number", label: "Contact", searchable: true },
    { key: "custom_employment_category", label: "Emp Category", searchable: true },
    { key: "employment_type", label: "Employment Type", searchable: true },
  ];

  // Static data removed - now fetching from API

  const handleSaveEmployee = (employeeData: EmployeeData) => {
    // Add the new employee to the list
    const newEmployee: TableEmployee = {
      name: employeeData.name || employeeData.first_name || '',
      attendance_device_id: employeeData.attendance_device_id || employeeData.machine_code || '',
      employee_name: `${employeeData.first_name || ''} ${employeeData.last_name || ''}`.trim(),
      branch: employeeData.company || "The Benchmark",
      designation: employeeData.designation || '',
      department: employeeData.department || '',
      cell_number: employeeData.contact_no || '',
      custom_employment_category: employeeData.custom_employment_category || '',
      employment_type: employeeData.employment_type || '',
    };
    
    setEmployees(prev => [...prev, newEmployee]);
  };

  return (
    <DashboardLayout>
      <div className="p-4 h-[calc(100vh-120px)] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-semibold text-gray-800">Employee Profile</h1>
          <div className="flex gap-2">
            <button
              onClick={() => window.location.reload()}
              className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Refresh
            </button>
            <button
              onClick={() => {
               setIsModalOpen(true)
                // setState({employee_dialog:true})
              }
              }
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus size={20} />
              New Employee
            </button>
          </div>
        </div>
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="text-gray-600">Loading employees...</div>
          </div>
        ) : (
          <DataTable columns={columns} data={employees} />
        )}
        
        <EmployeeProfileModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveEmployee}
        />

      </div>
      <MuiDialog
        open={state?.employee_dialog}
        onClose={(reason:any) => {
          console.log("Dialog closed:", reason);
          setState({employee_dialog:false});
        }}
        multiple_btn={true}
        title="Delete item?"
        // description="This action cannot be undone. Are/ ou sure?"
        description={false}
       
        maxWidth="sm"
      >
        <div>
        <CustomTextField
      value={state?.employee_name}
      onChange={(e:any) => setState({employee_name:e.target.value})}
      required
      error={!state?.employee_name}
      startIcon={<SearchIcon color={defaultColor.main_blue} size={16}/>}
      placeholder="Employee Name"
      label="Employee Name" 
      />
      <CustomSelectField
     options={[{value:"Teacher",label:"teacher",
      
     },
     {value:"Admin",label:"Admin"}]}
     value={state?.employee_name}
     onChange={(e:any) => setState({employee_name:e.target.value})}
      />

        <div>
          <p style={{ margin: 0 }}>
            Deleting this item will remove it from the system immediately.
          </p>
        </div>
        </div>
       
      </MuiDialog>

     
    </DashboardLayout>
  );
};

export default EmployeeProfile;
