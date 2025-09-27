"use client";

import React, { useState, useEffect, useReducer } from 'react';
import DataTable from '@/components/ui/DataTable';
import Breadcrumb from '@/components/shared/Breadcrumb';
import TopBar from '@/components/ui/TopBar';
import ShiftModal from '@/components/ui/ShiftModal';
import { employeeAPI, EmployeeData } from '@/services/api';
import { Edit, Menu, SquareUserRound, Trash } from 'lucide-react';
import { defaultColor } from '@/utils/constant';
import MuiDialog from '@/components/ui/DialogBox';
import apiClient from "@/services/apiClient";
import { toast } from 'react-toastify';
import AddShift from './Addshift';


interface EmployeeShiftData extends EmployeeData {
  sno?: number;
  employee_name?: string;
  designation?: string;
  shift_type?: string;
  shift_timing?: string;
  work_days?: string;
  status?: string;
  cell_number?: string;
}

const EmployeeShiftsPage: React.FC = () => {
  const [employees, setEmployees] = useState<EmployeeShiftData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(15);
  const [entityFilter, setEntityFilter] = useState("The Benchmark Hifz Campus (Boys)");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sourceTypeFilter, setSourceTypeFilter] = useState("All");
  const [isShiftModalOpen, setIsShiftModalOpen] = useState(false);
  const [state, setState] = useReducer(
    (state: any, newState: any) => ({ ...state, ...newState }),
    {
      shift_dialog: false,
      edit_employee_dialog: false,
      delete_dialog: false,
      view_employee_dialog: false,
      selected_employee: null,
      employee_name: "",
      designation: "",
      department: "",
      shift_type: "",
      shift_timing: "",
      work_days: "",
      employment_type: "",
      status: "",
      cell_number: "",
      AbsentPolicy: [
        {
          id: 1,
          period_type: "00:00",
          policy_count: 0,
          absent_count: 0,
        },
      ],
    }
  );
  // Fetch employee data on component mount
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Use the environment variable for API URL
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        if (!apiUrl) {
          throw new Error('API URL not configured. Please set NEXT_PUBLIC_API_URL environment variable.');
        }

        // Create a custom API client for this specific call
        const response = await fetch(`${apiUrl}/resource/Employee?fields=["name", "employee_name", "designation", "department", "employment_type", "status", "date_of_joining", "cell_number", "custom_employment_category"]&limit=100`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `token ${process.env.NEXT_PUBLIC_ERP_TOKEN}`,
          },
        });

        if (!response.ok) {
          throw new Error(`API Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        
        // Transform the data to include additional fields for shifts
        const transformedData: EmployeeShiftData[] = data.data?.map((emp: any, index: number) => ({
          ...emp,
          sno: index + 1,
          shift_type: emp.employment_type === 'Full Time' ? 'Regular' : 'Part Time',
          shift_timing: emp.employment_type === 'Full Time' ? '9:00 AM - 5:00 PM' : 'Flexible',
          work_days: emp.employment_type === 'Full Time' ? 'Monday - Friday' : 'As per schedule',
          status: emp.status || 'Active',
        })) || [];

        setEmployees(transformedData);
      } catch (err) {
        console.error('Error fetching employees:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch employee data');
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  // Define columns for the DataTable
  const columns = [
    {
      key: "action",
      label: "Action",
      searchable: false,
      render: (row: unknown, index: number) => {
        const employee = row as EmployeeShiftData;
        return (
          <div className="flex gap-2">
            <div title="Delete employee">
              <Trash
                size={16}
                color={defaultColor?.main_blue}
                style={{cursor:"pointer"}}
                onClick={() => handleDeleteEmployee(employee)}
              />
            </div>
            <div title="Edit employee">
              <Edit
                size={16}
                color={defaultColor?.main_blue}
                style={{cursor:"pointer"}}
                onClick={() => handleEditEmployee(employee)}
              />
            </div>
            <div title="View employee details">
              <SquareUserRound
                size={16}
                color={defaultColor?.main_blue}
                style={{cursor:"pointer"}}
                onClick={() => handleViewEmployee(employee)}
              />
            </div>
          </div>
        );
      },
    },
    {
      key: 'sno',
      label: 'S.No',
      searchable: false,
    },
    {
      key: 'employee_name',
      label: 'Employee Name',
      searchable: true,
    },
    {
      key: 'designation',
      label: 'Designation',
      searchable: true,
    },
    {
      key: 'department',
      label: 'Department',
      searchable: true,
    },
    {
      key: 'shift_type',
      label: 'Shift Type',
      searchable: true,
    },
    {
      key: 'shift_timing',
      label: 'Shift Timing',
      searchable: true,
    },
    {
      key: 'work_days',
      label: 'Work Days',
      searchable: true,
    },
    {
      key: 'employment_type',
      label: 'Employment Type',
      searchable: true,
    },
    {
      key: 'status',
      label: 'Status',
      searchable: true,
      render: (row: unknown, index: number) => {
        const employee = row as EmployeeShiftData;
        return (
          <span 
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              employee.status === 'Active' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}
          >
            {employee.status}
          </span>
        );
      },
    },
    {
      key: 'cell_number',
      label: 'Contact',
      searchable: true,
      render: (row: unknown, index: number) => {
        const employee = row as EmployeeShiftData;
        return (
          <span className="text-sm">
            {employee.cell_number || '-'}
          </span>
        );
      },
    },
  ];

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Human Resource', href: '/human-resource' },
    { label: 'Employee Shifts', href: '/human-resource/employee-shifts' },
  ];

  // TopBar handlers
  const handleNewClick = () => {
    setIsShiftModalOpen(true);
    setState({ shift_dialog: true });
  };

  const handleCloseModal = () => {
    setIsShiftModalOpen(false);
  };

  const handleSaveShift = (shiftData: any) => {
    console.log('Saving shift:', shiftData);
    // Add logic to save shift data
  };

  const handleSaveAndCloseShift = (shiftData: any) => {
    console.log('Saving and closing shift:', shiftData);
    // Add logic to save shift data and close modal
    setIsShiftModalOpen(false);
  };

  const handleFilterClick = () => {
    console.log('Filter clicked');
    // Add logic to open advanced filters
  };

  const handleRefreshClick = () => {
    console.log('Refresh clicked');
    window.location.reload();
  };

  const handleDownloadClick = () => {
    console.log('Download clicked');
    // Add logic to download data
  };

  const handleViewChangeClick = () => {
    console.log('View change clicked');
    // Add logic to change view mode
  };

  // Employee action handlers
  const handleEditEmployee = (employee: EmployeeShiftData) => {
    setState({
      edit_employee_dialog: true,
      selected_employee: employee,
      employee_name: employee.employee_name || "",
      designation: employee.designation || "",
      department: employee.department || "",
      shift_type: employee.shift_type || "",
      shift_timing: employee.shift_timing || "",
      work_days: employee.work_days || "",
      employment_type: employee.employment_type || "",
      status: employee.status || "",
      cell_number: employee.cell_number || "",
    });
  };

  const handleViewEmployee = (employee: EmployeeShiftData) => {
    setState({
      view_employee_dialog: true,
      selected_employee: employee,
    });
  };

  const handleDeleteEmployee = (employee: EmployeeShiftData) => {
    setState({
      delete_dialog: true,
      selected_employee: employee,
    });
  };

  const handleUpdateEmployee = async () => {
    try {
      // Add your update API call here
      console.log('Updating employee:', state.selected_employee);
      toast.success("Employee updated successfully");
      setState({ edit_employee_dialog: false, selected_employee: null });
    } catch (error) {
      console.error("Error updating employee:", error);
      toast.error("Failed to update employee");
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      console.log('Deleting employee:', state.selected_employee);
      
      if (!state.selected_employee?.name) {
        toast.error("Employee ID not found");
        return;
      }

      // Use the API endpoint you showed me
      const response = await fetch('/api/delete-shift-assignment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          assignment: state.selected_employee.name
        })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to delete employee shift assignment');
      }

      toast.success("Employee shift assignment deleted successfully");
      setState({ delete_dialog: false, selected_employee: null });
      
      // Refresh the data
      window.location.reload();
    } catch (error) {
      console.error("Error deleting employee:", error);
      toast.error("Failed to delete employee shift assignment");
    }
  };

  const handleEntityChange = (entity: string) => {
    setEntityFilter(entity);
    console.log('Entity changed:', entity);
  };

  const handleStatusChange = (status: string) => {
    setStatusFilter(status);
    console.log('Status changed:', status);
  };

  const handleSourceTypeChange = (sourceType: string) => {
    setSourceTypeFilter(sourceType);
    console.log('Source type changed:', sourceType);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    console.log('Page changed:', page);
  };

  const handleItemsPerPageChange = (itemsPerPage: number) => {
    setItemsPerPage(itemsPerPage);
    setCurrentPage(1); // Reset to first page when changing items per page
    console.log('Items per page changed:', itemsPerPage);
  };

  // Calculate pagination data
  const totalPages = Math.ceil(employees.length / itemsPerPage);
  const totalItems = employees.length;

  if (loading) {
    return (
      <div className="p-6">
        <Breadcrumb items={breadcrumbItems} />
        <div className="mt-6 flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading employee data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Breadcrumb items={breadcrumbItems} />
        <div className="mt-6 bg-red-50   rounded-lg p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error Loading Data</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
              <div className="mt-4">
                <button
                  onClick={() => window.location.reload()}
                  className="bg-red-100 hover:bg-red-200 text-red-800 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

    // delete row data 
    const DeleteRowData = async(row:any,index?:number) => {
      try {
        console.log(row, "state?.selectedPolicyIds");
        window.alert(`data:${row}`)
        // console.log(state?.selectedPolicyIds, "state?.selectedPolicyIds");
        return;
        // window.alert("are you sure you want to delete")
        const resp = await apiClient.deleteBody(`/method/hrms.api.roster.delete_shift_schedule_assignment`,{
          shift_schedule_assignment: "HR-SHSA-25-09-00007"
      }); 
        console.log(resp, "resp");
        toast.success("Policy deleted successfully");
        window.location.reload();
      } catch (error) {
        console.error("Error deleting policy:", error);
        toast.error("Failed to delete policy");
      }
    }
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Bar */}
      {/* <TopBar
        onNewClick={handleNewClick}
        onFilterClick={handleFilterClick}
        onRefreshClick={handleRefreshClick}
        onDownloadClick={handleDownloadClick}
        onViewChangeClick={handleViewChangeClick}
        onEntityChange={handleEntityChange}
        onStatusChange={handleStatusChange}
        onSourceTypeChange={handleSourceTypeChange}
        onPageChange={handlePageChange}
        onItemsPerPageChange={handleItemsPerPageChange}
        currentPage={currentPage}
        totalPages={totalPages}
        itemsPerPage={itemsPerPage}
        totalItems={totalItems}
        entityValue={entityFilter}
        statusValue={statusFilter}
        sourceTypeValue={sourceTypeFilter}
      /> */}
      <div className="px-6">
        {/* <Breadcrumb items={breadcrumbItems} /> */}
        
        {/* Custom Header with Two Buttons */}
        <div className="flex items-center gap-3 mt-6 mb-6">
          <div>
            <Menu width={16} height={16} strokeWidth={2.5} className='w-4 h-4 text-[#2878aa]' />
          </div>
          <button
            onClick={handleNewClick}
            className='flex font-bold text-[#2878aa] hover:text-[#1e5a7a] transition-colors'
            style={{ fontSize: '14px' }}
          >
            + New
          </button>
        </div>
        
        <div className="mt-6">
        

        {/* Summary Cards */}
        {/* <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow ">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Total Employees</p>
                <p className="text-2xl font-semibold text-gray-900">{employees.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow ">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Active Employees</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {employees.filter(emp => emp.status === 'Active').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow ">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Regular Shifts</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {employees.filter(emp => emp.shift_type === 'Regular').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow ">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Departments</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {new Set(employees.map(emp => emp.department)).size}
                </p>
              </div>
            </div>
          </div>
        </div> */}

        {/* Data Table */}
        <div className="">
          <div className=" border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Employee Shifts Data</h3>
            <p className="mt-1 text-sm text-gray-500">
              Showing {employees.length} employee records with filtering and pagination
            </p>
          </div>
          <div className="py-6">
            <DataTable 
              columns={columns} 
              data={employees} 
              defaultLimit={10}
            />
          </div>
        </div>
        </div>
      </div>

      {/* Shift Modal */}
      <ShiftModal
        isOpen={isShiftModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveShift}
        onSaveAndClose={handleSaveAndCloseShift}
      />
       <MuiDialog
              open={state?.shift_dialog}
              onClose={() => {
                setState({ shift_dialog: false });
              }}
              multiple_btn={true}
              title="Employee Profile"
              // description="This action cannot be undone. Are/ ou sure?"
              description={false}
              maxWidth="lg"
              // onSave={() => createPolicy()}
            >
           <AddShift
              isOpen={isShiftModalOpen}
              onClose={handleCloseModal}
              onSave={handleSaveShift}
              onSaveAndClose={handleSaveAndCloseShift}
            />
            </MuiDialog>
        {/* Delete Employee Confirmation Modal */}
        <MuiDialog 
          open={state?.delete_dialog} 
          multiple_btn={false}
          title="Delete Shift Assignment"
          description={false}
          maxWidth="sm"
          onClose={() => setState({ delete_dialog: false, selected_employee: null })}
        >
          <div className="p-4">
            {/* Title */}
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Delete Shift Assignment
            </h2>
        
            {/* Warning Message */}
            <div className="mb-6">
              <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex-shrink-0">
                  <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-red-800">
                    Are you sure you want to delete this shift assignment?
                  </h3>
                  <p className="mt-1 text-sm text-red-700">
                    This action cannot be undone. The shift assignment and related data will be permanently removed.
                  </p>
                </div>
              </div>
            </div>

            {/* Employee Details */}
            <div className="mb-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Name:</span>
                    <p className="text-gray-900">{state.selected_employee?.employee_name || 'N/A'}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Designation:</span>
                    <p className="text-gray-900">{state.selected_employee?.designation || 'N/A'}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Department:</span>
                    <p className="text-gray-900">{state.selected_employee?.department || 'N/A'}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Status:</span>
                    <p className="text-gray-900">{state.selected_employee?.status || 'N/A'}</p>
                  </div>
                </div>
              </div>
            </div>
        
            {/* Actions */}
            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
                onClick={() => setState({ delete_dialog: false, selected_employee: null })}
              >
                Cancel
              </button>
        
              <button
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                onClick={handleDeleteConfirm}
              >
                Delete
              </button>
            </div>
          </div>
        </MuiDialog>

        {/* Edit Employee Modal */}
        <MuiDialog 
          open={state?.edit_employee_dialog} 
          multiple_btn={false}
          title="Edit Employee"
          description={false}
          maxWidth="lg"
          onClose={() => setState({ edit_employee_dialog: false, selected_employee: null })}
        >
          <div className="p-4">
            {/* Title */}
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Edit Employee Details
            </h2>
        
            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Employee Name *
                </label>
                <input
                  type="text"
                  value={state.employee_name}
                  onChange={(e) => setState({ employee_name: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter employee name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Designation *
                </label>
                <input
                  type="text"
                  value={state.designation}
                  onChange={(e) => setState({ designation: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter designation"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Department *
                </label>
                <input
                  type="text"
                  value={state.department}
                  onChange={(e) => setState({ department: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter department"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Shift Type *
                </label>
                <select
                  value={state.shift_type}
                  onChange={(e) => setState({ shift_type: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select shift type</option>
                  <option value="Regular">Regular</option>
                  <option value="Part Time">Part Time</option>
                  <option value="Night">Night</option>
                  <option value="Flexible">Flexible</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Shift Timing *
                </label>
                <input
                  type="text"
                  value={state.shift_timing}
                  onChange={(e) => setState({ shift_timing: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., 9:00 AM - 5:00 PM"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Work Days *
                </label>
                <input
                  type="text"
                  value={state.work_days}
                  onChange={(e) => setState({ work_days: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Monday - Friday"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Employment Type *
                </label>
                <select
                  value={state.employment_type}
                  onChange={(e) => setState({ employment_type: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select employment type</option>
                  <option value="Full Time">Full Time</option>
                  <option value="Part Time">Part Time</option>
                  <option value="Contract">Contract</option>
                  <option value="Intern">Intern</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status *
                </label>
                <select
                  value={state.status}
                  onChange={(e) => setState({ status: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select status</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="On Leave">On Leave</option>
                  <option value="Terminated">Terminated</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contact Number
                </label>
                <input
                  type="text"
                  value={state.cell_number}
                  onChange={(e) => setState({ cell_number: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter contact number"
                />
              </div>
            </div>
        
            {/* Actions */}
            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
                onClick={() => setState({ edit_employee_dialog: false, selected_employee: null })}
              >
                Cancel
              </button>
        
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                onClick={handleUpdateEmployee}
              >
                Update
              </button>
            </div>
          </div>
        </MuiDialog>

        {/* View Employee Modal */}
        <MuiDialog 
          open={state?.view_employee_dialog} 
          multiple_btn={false}
          title="Employee Details"
          description={false}
          maxWidth="lg"
          onClose={() => setState({ view_employee_dialog: false, selected_employee: null })}
        >
          <div className="p-4">
            {/* Title */}
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Employee Information
            </h2>
        
            {/* Employee Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-4">
                <div>
                  <span className="text-sm font-medium text-gray-500">Employee Name:</span>
                  <p className="text-lg text-gray-900">{state.selected_employee?.employee_name || 'N/A'}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Designation:</span>
                  <p className="text-gray-900">{state.selected_employee?.designation || 'N/A'}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Department:</span>
                  <p className="text-gray-900">{state.selected_employee?.department || 'N/A'}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Employment Type:</span>
                  <p className="text-gray-900">{state.selected_employee?.employment_type || 'N/A'}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <span className="text-sm font-medium text-gray-500">Shift Type:</span>
                  <p className="text-gray-900">{state.selected_employee?.shift_type || 'N/A'}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Shift Timing:</span>
                  <p className="text-gray-900">{state.selected_employee?.shift_timing || 'N/A'}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Work Days:</span>
                  <p className="text-gray-900">{state.selected_employee?.work_days || 'N/A'}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Status:</span>
                  <span 
                    className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                      state.selected_employee?.status === 'Active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {state.selected_employee?.status || 'N/A'}
                  </span>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="border-t pt-4">
              <h3 className="text-md font-medium text-gray-800 mb-3">Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="text-sm font-medium text-gray-500">Contact Number:</span>
                  <p className="text-gray-900">{state.selected_employee?.cell_number || 'N/A'}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Employee ID:</span>
                  <p className="text-gray-900">{state.selected_employee?.name || 'N/A'}</p>
                </div>
              </div>
            </div>
        
            {/* Actions */}
            <div className="flex justify-end gap-3 mt-6">
              <button
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
                onClick={() => setState({ view_employee_dialog: false, selected_employee: null })}
              >
                Close
              </button>
            </div>
          </div>
        </MuiDialog>
    </div>
  );
};

export default EmployeeShiftsPage;