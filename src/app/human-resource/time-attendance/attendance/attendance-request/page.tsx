"use client";
import React, { useState, useEffect, useReducer } from "react";
import DashboardLayout from "@/components/shared/DashboardLayout";
import DataTable from "@/components/ui/DataTable";
import {
  Edit,
  Trash,
  View,
  Plus,
  ChevronDown,
  SquareUserRound,
} from "lucide-react";
import { EmployeeData, employeeAPI } from "@/services/api";
import MuiDialog from "@/components/ui/DialogBox";

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Grid,
  Box,
  Tabs,
  Tab,
  Typography,
} from "@mui/material";
import CustomTextField from "@/components/ui/CustomTextField";
import { defaultColor } from "@/utils/constant";
import CustomSelectField from "@/components/ui/CustomSelectField";
import CustomDateInputField from "@/components/ui/DatePicker";
import { toast } from "react-toastify";
import axios from "axios";
import apiClient from "@/services/apiClient";

interface TableEmployee {
  id: string;
  employee_name: string;
  employee_id: string;
  date: string;
  check_in: string;
  check_out: string;
  status: string;
}
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box style={{ padding: "10px" }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}
// Interface for Attendance Check-in API response
interface AttendanceCheckin {
  name: string;
  employee_name: string;
  date: string;
  employee: string;
  custom_check_in_time: string | null;
  custom_check_out_time: string | null;
  docstatus: number; // 0 = Draft, 1 = Submitted, 2 = Cancelled
  explanation?: string;
}

interface ApiResponse<T = any> {
  data: T;
  message?: string;
}

//

//

const AttendanceRequest = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [employees, setEmployees] = useState<TableEmployee[]>([]);
  const [loading, setLoading] = useState(false);
  const [value, setValue] = React.useState(0);

  const [state, setState] = useReducer(
    (state: any, newState: any) => ({ ...state, ...newState }),
    {
      isEditMode: false,
      editingId: '',
      //basic information
      formFields: [
        {
          input_name: "emp_id",
          input_label: "Employee ID",
          placeholder: "Enter employee id",
          type: "text",
          required: false,
          startIcon: <></>,
          grid_size: 6,
          isDisable: true,
        },
        {
          input_name: "short_code",
          input_label: "Short Code",
          placeholder: "Enter short code",
          type: "text",
          required: false,
          startIcon: <></>,
          grid_size: 6,
          isDisable: false,
        },
        {
          input_name: "machine_code",
          input_label: "Machine Code",
          placeholder: "Enter machine code",
          type: "text",
          required: false,
          startIcon: <></>,
          grid_size: 6,
          isDisable: false,
        },
        {
          input_name: "date_of_joining",
          input_label: "Joining Date",
          placeholder: "Enter joining date",
          type: "date",
          required: false,
          startIcon: <></>,
          grid_size: 6,
          isDisable: false,
        },
        {
          input_name: "first_name",
          input_label: "First Name",
          placeholder: "Enter first name",
          type: "text",
          required: false,
          startIcon: <></>,
          grid_size: 12,
          isDisable: false,
        },
        {
          input_name: "last_name",
          input_label: "Last Name",
          placeholder: "Enter last name",
          type: "text",
          required: false,
          startIcon: <></>,
          grid_size: 12,
          isDisable: false,
        },

        // ... add all 32 fields here
      ],

      //
      // personal information
      personalFormFields: [
        {
          input_name: "date_of_birth",
          input_label: "Birth Date",
          placeholder: "Enter birth date",
          type: "date",
          required: false,
          startIcon: <></>,
          grid_size: 4,
          isDisable: false,
        },
        {
          input_name: "gender",
          input_label: "Gender",
          placeholder: "Enter gender",
          type: "select",
          required: false,
          startIcon: <></>,
          grid_size: 4,
          isDisable: false,
          options: [
            { value: "male", label: "Male" },
            { value: "female", label: "Female" },
            { value: "other", label: "Other" },
          ],
        },
        {
          input_name: "custom_cnic",
          input_label: "CNIC",
          placeholder: "Enter CNIC",
          type: "text",
          required: false,
          startIcon: <></>,
          grid_size: 4,
          isDisable: false,
        },

        {
          input_name: "blood_group",
          input_label: "Blood Group",
          placeholder: "Enter blood group",
          type: "select",
          required: false,
          startIcon: <></>,
          grid_size: 4,
          isDisable: false,
          options: [
            { value: "A+", label: "A+" },
            { value: "A-", label: "A-" },
            { value: "B+", label: "B+" },
            { value: "B-", label: "B-" },
            { value: "AB+", label: "AB+" },
            { value: "AB-", label: "AB-" },
            { value: "O+", label: "O+" },
            { value: "O-", label: "O-" },
          ],
        },
        {
          input_name: "nationality",
          input_label: "Nationality",
          placeholder: "Enter nationality",
          type: "select",
          required: false,
          startIcon: <></>,
          grid_size: 4,
          isDisable: false,
          options: [
            { value: "pakistan", label: "Pakistan" },
            { value: "other", label: "Other" },
          ],
        },
        {
          input_name: "birth_country",
          input_label: "Birth Country",
          placeholder: "Enter birth country",
          type: "select",
          required: false,
          startIcon: <></>,
          grid_size: 4,
          isDisable: false,
          options: [
            { value: "pakistan", label: "Pakistan" },
            { value: "other", label: "Other" },
          ],
        },
        {
          input_name: "birth_city",
          input_label: "Birth City",
          placeholder: "Enter birth city",
          type: "select",
          required: false,
          startIcon: <></>,
          grid_size: 4,
          isDisable: false,
          options: [
            { value: "karachi", label: "Karachi" },
            { value: "other", label: "Other" },
          ],
        },

        {
          input_name: "contact_no",
          input_label: "Contact No",
          placeholder: "Enter contact no",
          type: "text",
          required: false,
          startIcon: <></>,
          grid_size: 4,
          isDisable: false,
        },
        {
          input_name: "whatsapp_no",
          input_label: "Whatsapp No",
          placeholder: "Enter whatsapp no",
          type: "text",
          required: false,
          startIcon: <></>,
          grid_size: 4,
          isDisable: false,
        },
        {
          input_name: "email",
          input_label: "Email",
          placeholder: "Enter email",
          type: "text",
          required: false,
          startIcon: <></>,
          grid_size: 4,
          isDisable: false,
        },
        {
          input_name: "caste",
          input_label: "Caste",
          placeholder: "Enter caste",
          type: "text",
          required: false,
          startIcon: <></>,
          grid_size: 4,
          isDisable: false,
        },
        // ... add all 32 fields here
      ],
      //
      employmentFormFields: [
        {
          input_name: "custom_employment_category",
          input_label: "Employment Category",
          placeholder: "Enter employment category",
          type: "select",
          required: false,
          startIcon: <></>,
          grid_size: 4,
          isDisable: false,
          options: [
            { value: "Staff", label: "Staff" },
            { value: "Admin", label: "Admin" },
            { value: "Management", label: "Management" },
            { value: "Teacher", label: "Teacher" },
          ],
        },
        {
          input_name: "reporting_to",
          input_label: "Reporting To",
          placeholder: "Enter reporting to",
          type: "select",
          required: false,
          startIcon: <></>,
          grid_size: 4,
          isDisable: false,
          options: [
            { value: "asad  ", label: "Asad" },
            { value: "ali", label: "Ali" },
            { value: "other", label: "Other" },
          ],
        },

        {
          type: "date",
          input_name: "appointment_date",
          input_label: "Appointment Date",
          placeholder: "Enter appointment date",
          required: false,
          startIcon: <></>,
          grid_size: 4,
          isDisable: false,
        },
        {
          input_name: "emp_grade",
          input_label: "Employ Grade",
          placeholder: "Enter Grade",
          type: "select",
          required: true,
          startIcon: <></>,
          grid_size: 4,
          isDisable: false,
          options: [
            { value: "12", label: "12" },
            { value: "11", label: "11" },
            { value: "10", label: "10" },
          ],
        },

        {
          input_name: "company",
          input_label: "Site",
          placeholder: "Enter site",
          type: "select",
          required: false,
          startIcon: <></>,
          grid_size: 4,
          isDisable: false,
          options: [
            { value: "site1", label: "Site 1" },
            { value: "site2", label: "Site 2" },
            { value: "site3", label: "Site 3" },
            { value: "The Benchmark", label: "The Benchmark" },
          ],
        },
        {
          input_name: "emp_status",
          input_label: "Status",
          placeholder: "Enter status",
          type: "select",
          required: false,
          startIcon: <></>,
          grid_size: 4,
          isDisable: false,
          options: [
            { value: "active", label: "Active" },
            { value: "inactive", label: "Inactive" },
          ],
        },

        // ... add all 32 fields here
      ],
      //
      employee_dialog: false,
      employee_name: "",
    }
  );
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  //

  //
  const fetchFormOptions = async () => {
    try {
      const [departmentsRes, designationsRes, employmentTypesRes]: any =
        await Promise.all([
          apiClient.get(`/resource/Department?limit=100`),
          apiClient.get(`/resource/Designation?limit=100`),
          apiClient.get(`/resource/Employment Type?limit=100`),
        ]);

      const departments_options: any =
        departmentsRes?.data?.map((item: any) => ({
          value: item.name,
          label: item.name,
        })) ?? [];
      setState({ departments_options });
      // {
      //   input_name: "department",
      //   input_label: "Department",
      //   placeholder: "Enter department",
      //   type: "select",
      //   required: true,
      //   startIcon: <></>,
      //   grid_size: 4,
      //   isDisable: false,
      //   options: [{ value: "manager", label: "manager" }],
      // },

      // {
      //   input_name: "emp_designation",
      //   input_label: "Designation",
      //   placeholder: "Enter designation",
      //   type: "select",
      //   required: true,
      //   startIcon: <></>,
      //   grid_size: 4,
      //   isDisable: false,
      //   options: [{ value: "manager", label: "manager" }],
      // },

      const designations: any =
        designationsRes?.data?.map((item: any) => ({
          value: item.name,
          label: item.name,
        })) ?? [];
      setState({ designations_options: designations });

      const employmentTypes: any =
        employmentTypesRes?.data?.map((item: any) => ({
          value: item.name,
          label: item.name,
        })) ?? [];
      setState({ employment_types_options: employmentTypes });

      // ✅ single update, no overwrite
    } catch (err) {
      console.error("❌ Error fetching form options:", err);
    }
  };
  const fetchAll = async () => {
    try {
      const res = await apiClient.get<{ data: AttendanceCheckin[] }>(
        '/resource/Attendance Check-ins?fields=["name","employee_name","date","employee","custom_check_in_time","custom_check_out_time","docstatus","explanation"]&limit_page_length=1000'
      );
      
      if (res?.data && Array.isArray(res.data)) {
        // Map the API response to your table format
        const transformedData = res.data.map((item) => ({
          id: item.name,
          employee_name: item.employee_name,
          employee_id: item.employee,
          date: item.date,
          check_in: item.custom_check_in_time || 'N/A',
          check_out: item.custom_check_out_time || 'N/A',
          status: item.docstatus === 0 ? 'Draft' : item.docstatus === 1 ? 'Approved' : 'Rejected',
          explanation: item.explanation || '',
          request_date: item.date,
          in_time: item.custom_check_in_time ? item.custom_check_in_time.split(' ')[1] : '',
          in_date: item.custom_check_in_time ? item.custom_check_in_time.split(' ')[0] : '',
          request_note: item.explanation || ''
        }));
        
        setEmployees(transformedData);
      }
    } catch (err: any) {
      console.error("Error fetching attendance check-ins:", err.response?.data || err.message);
      toast.error("Failed to load attendance data");
    }
  };

  useEffect(() => {
    fetchAll();
    fetchAllEmployees();
    // fetchFormOptions();
  }, []);

  // Format date to be more readable
  const formatDate = (dateString: string) => {
    if (!dateString || dateString === 'N/A') return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Format time to HH:MM
  const formatTime = (timeString: string) => {
    if (!timeString || timeString === 'N/A') return 'N/A';
    const [hours, minutes] = timeString.split(':');
    return `${hours}:${minutes}`;
  };

  // Get status badge with appropriate styling
  const getStatusBadge = (status: string) => {
    const statusClasses = {
      'Draft': 'bg-yellow-100 text-yellow-800',
      'Approved': 'bg-green-100 text-green-800',
      'Rejected': 'bg-red-100 text-red-800'
    };
    
    const baseClass = 'px-2 py-1 rounded-full text-xs font-medium';
    const statusClass = statusClasses[status as keyof typeof statusClasses] || 'bg-gray-100 text-gray-800';
    
    return (
      <span className={`${baseClass} ${statusClass}`}>
        {status}
      </span>
    );
  };

  const columns = [
    {
      key: "action",
      label: "Action",
      searchable: false,
      render: (row: any, index: number) => (
        <div className="flex gap-2">
          <Trash 
            size={16} 
            color={defaultColor?.main_blue} 
            className="cursor-pointer hover:opacity-70"
            onClick={(e) => {
              e.stopPropagation();
              // Handle delete if needed
            }}
          />
          <Edit 
            size={16} 
            color={defaultColor?.main_blue} 
            className="cursor-pointer hover:opacity-70"
            onClick={(e) => {
              e.stopPropagation();
              handleEditClick(row);
            }}
          />
          <SquareUserRound size={16} color={defaultColor?.main_blue} className="cursor-pointer hover:opacity-70" />
        </div>
      ),
    },
    { 
      key: "employee_name", 
      label: "Employee Name", 
      searchable: true,
      render: (row: any, index: number) => (
        <div className="font-medium">{row.employee_name}</div>
      )
    },
    { 
      key: "employee_id", 
      label: "Employee ID", 
      searchable: true,
      render: (row: any, index: number) => (
        <div className="text-gray-600">{row.employee_id}</div>
      )
    },
    { 
      key: "date", 
      label: "Date", 
      searchable: true,
      render: (row: any, index: number) => formatDate(row.date)
    },
    { 
      key: "check_in", 
      label: "Check In", 
      searchable: true,
      render: (row: any, index: number) => formatTime(row.check_in)
    },
    { 
      key: "check_out", 
      label: "Check Out", 
      searchable: true,
      render: (row: any, index: number) => formatTime(row.check_out)
    },
    { 
      key: "status", 
      label: "Status", 
      searchable: true,
      render: (row: any, index: number) => getStatusBadge(row.status)
    },
  ];
  // function for cehcking mandotary fields
  const validateForm = (formFields: any[], formState: any) => {
    for (const field of formFields) {
      if (field.required && field.isDisable == false) {
        const value = formState[field.input_name];

        if (!value || value.toString().trim() === "") {
          toast.error(`${field.input_label} is required`);
          console.log(`${field.input_label} is required`);

          return false; // stop at first missing field
        }
      }
    }
    return true; // all good
  };
  // create employee function
  const handleEditClick = (row: any) => {
    console.log('Editing row:', row);
    setState({
      employee_dialog: true,
      isEditMode: true,
      editingId: row.id,
      employee_id: row.employee_id,
      employee_name: row.employee_name,
      log_type: row.check_in !== 'N/A' ? 'IN' : 'OUT',
      reason: row.explanation || '',
      request_number: row.id,
      request_date: row.request_date || row.date,
      in_time: row.in_time || (row.check_in !== 'N/A' ? row.check_in.split(' ')[1] : ''),
      in_date: row.in_date || (row.check_in !== 'N/A' ? row.check_in.split(' ')[0] : ''),
      request_note: row.explanation || '',
      check_in: row.check_in,
      check_out: row.check_out,
      date: row.date
    });
  };

  const handleCreateEmployee = async () => {
    try {
      if (!state.employee_id || !state.log_type) {
        toast.error('Please fill in all required fields');
        return;
      }

      // Get current date and time in the required format
      const now = new Date();
      const currentDate = now.toISOString().split('T')[0];
      const currentTime = now.toTimeString().split(' ')[0];
      const currentDateTime = `${currentDate} ${currentTime}`;

      // Prepare the request data
      const requestData = {
        employee: state.employee_id,
        employee_name: state.employee_name || state.all_employees_data?.find((emp: any) => emp.name === state.employee_id)?.employee_name || '',
        date: currentDate,
        company: "The Benchmark",
        explanation: state.reason || "Manual attendance entry",
        custom_check_in_time: state.log_type === 'IN' ? currentDateTime : null,
        custom_check_out_time: state.log_type === 'OUT' ? currentDateTime : null,
        docstatus: 0 // Set as Draft by default
      };
      
      console.log("Sending attendance data:", requestData);
      
      let response;
      
      if (state.isEditMode && state.editingId) {
        // Update existing record using PATCH
        // For updates, we only need to send the docstatus
        const updateData = {
          docstatus: 1 // Set to 1 for Submitted status
        };
        
        // Encode the document name in the URL
        const encodedDocName = encodeURIComponent(state.editingId);
        response = await apiClient.patch(
          `/resource/Attendance%20Check-ins/${encodedDocName}`,
          updateData
        );
      } else {
        // Create new record
        response = await apiClient.post(
          '/resource/Attendance%20Check-ins',
          requestData
        );
      }
      
      console.log("Response from API:", response);
      
      const responseData = response as ApiResponse<AttendanceCheckin>;
      if (responseData.data) {
        toast.success(`Attendance ${state.isEditMode ? 'updated' : 'recorded'} successfully`);
        setState({ 
          employee_dialog: false,
          employee_id: '',
          employee_name: '',
          log_type: '',
          reason: '',
          isEditMode: false,
          editingId: ''
        });
        fetchAll(); // Refresh the data
      }
    } catch (error: any) {
      console.error("Error saving attendance:", error);
      toast.error(error.response?.data?.message || 'Failed to save attendance');
    }
  };
  const fetchAllEmployees = async () => {
    try {
      const res: any = await apiClient.get(
        '/resource/Employee?fields=["name","attendance_device_id","employee_name","branch","designation","department","cell_number","custom_employment_category","employment_type"]&limit_page_length=0'
      );

      if (res && Array.isArray(res.data)) {
        const transformedEmployees = res.data.map((emp: any) => ({
          name: emp.name || "",
          employee_name: emp.employee_name || "",
        }));
        setState({ all_employees_data: transformedEmployees });
      }

      // parallel or sequential fetch
    } catch (err: any) {
      console.error("API error ❌", err.response?.data || err.message);
    }
  };
  return (
    <>
      <div className="p-4 h-[calc(100vh-120px)] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-semibold text-gray-800">
            Employee Attendance
          </h1>
          <div className="flex gap-2">
            <button
              onClick={() => window.location.reload()}
              className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Refresh
            </button>
            <button
              onClick={() => {
                // setIsModalOpen(true);
                setState({ employee_dialog: true });
              }}
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
      </div>
      <MuiDialog
        open={state?.employee_dialog}
        onClose={() => {
          setState({ employee_dialog: false });
        }}
        multiple_btn={true}
        title="Attendance Request"
        // description="This action cannot be undone. Are/ ou sure?"
        description={false}
        maxWidth="lg"
        onSave={() => handleCreateEmployee()}
        onPrint={() => console.log(state, "s")}
      >
        <div id="employee_profile-parent">
          <Accordion defaultExpanded>
            <AccordionSummary
              sx={{ margin: 0, backgroundColor: defaultColor.main_grey }}
              expandIcon={<ChevronDown />}
              aria-controls="basic-info-content"
              id="basic-info-header"
            >
              <Typography
                sx={{
                  fontWeight: 600,
                  fontSize: "12px",
                  fontFamily: "sans-serif",
                  margin: 0,
                }}
              >
                Basic Information
              </Typography>
            </AccordionSummary>
            <AccordionDetails
              sx={{ margin: 0, backgroundColor: defaultColor.main_grey }}
            >
              <Grid container spacing={2}>
                <Grid
                  size={{
                    xs: 12,
                    md: 6,
                  }}
                  container
                  spacing={2}
                  key="employee_data"
                >
                     <Grid size={{ xs: 12, md: 6 }}>
                    <CustomTextField
                      input_label="Request Number"
                      input_name="request_number"
                      input_value={state.isEditMode ? state.request_number : ''}
                      onchange={(
                        e: React.ChangeEvent<
                          HTMLInputElement | HTMLTextAreaElement
                        >
                      ) => setState({ request_number: e.target.value })}
                      isDisable={true}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 12 }}>
                    <CustomSelectField
                      label="Employee"
                      value={state.employee_id}
                      options={state?.all_employees_data?.map((item: any) => ({
                        value: item.name,
                        label: item.employee_name,
                      }))}
                      onChange={(e: any) =>
                        setState({
                          employee_id: e.target.value,
                          employee_name: e.target.label,
                          checkkk: e.target.value,
                        })
                      }
                    />
                  </Grid>
                 
                  <Grid size={{ xs: 12, md: 12 }}>
                    <CustomSelectField
                      label="Activity"
                      value={state.log_type}
                      required
                      options={[
                        { value: "IN", label: "IN" },
                        { value: "OUT", label: "OUT" },
                      ]}
                      onChange={(e) => setState({ log_type: e.target.value })}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <CustomTextField
                      input_label="Request Date"
                      input_name="request_date"
                      input_value={state.request_date || new Date().toISOString().split("T")[0]}
                      onchange={(
                        e: React.ChangeEvent<
                          HTMLInputElement | HTMLTextAreaElement
                        >
                      ) => setState({ request_date: e.target.value })}
                      isDisable={false}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <CustomTextField
                      input_label="In Time"
                      input_name="in_time"
                      input_type="time"
                      input_value={state.in_time || ''}
                      onchange={(
                        e: React.ChangeEvent<
                          HTMLInputElement | HTMLTextAreaElement
                        >
                      ) => setState({ in_time: e.target.value })}
                      isDisable={!state.isEditMode}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <CustomTextField
                      input_label="In Date"
                      input_name="in_date"
                      input_type="date"
                      input_value={state.in_date || ''}
                      onchange={(
                        e: React.ChangeEvent<
                          HTMLInputElement | HTMLTextAreaElement
                        >
                      ) => setState({ in_date: e.target.value })}
                      isDisable={!state.isEditMode}
                    />
                  </Grid>
                  <CustomTextField
                      input_label="Request Note"
                      input_name="request_note"
                      input_value={state.request_note || state.explanation || ''}
                      onchange={(
                        e: React.ChangeEvent<
                          HTMLInputElement | HTMLTextAreaElement
                        >
                      ) => setState({ request_note: e.target.value, explanation: e.target.value })}
                      isDisable={false}
                    />
                </Grid>
                <Grid
                  size={{
                    xs: 12,
                  }}
                  id="employee_data_img"
                ></Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>

          {/* Content */}
        </div>
      </MuiDialog>
    </>
  );
};

export default AttendanceRequest;
