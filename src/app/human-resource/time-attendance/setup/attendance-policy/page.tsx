"use client";
import React, { useState, useEffect, useReducer } from "react";
import DashboardLayout from "@/components/shared/DashboardLayout";
import DataTable from "@/components/ui/DataTable";
import { Edit, Trash, View, Plus, ChevronDown, SquareUserRound } from "lucide-react";
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
import EditableDataTable from "@/components/ui/EditableDataTable";

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

//

//

const AttendancePolicy = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [employees, setEmployees] = useState<TableEmployee[]>([]);
  const [loading, setLoading] = useState(false);
  const [value, setValue] = React.useState(0);

  const [state, setState] = useReducer(
    (state: any, newState: any) => ({ ...state, ...newState }),
    {
      //basic information
      //
      employee_dialog: false,
      
    }
  );
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  //
  const fetchFormOptions = async () => {
    try {
      const [departmentsRes, designationsRes, employmentTypesRes]:any = await Promise.all([
        apiClient.get(`/resource/Department?limit=100`),
        apiClient.get(`/resource/Designation?limit=100`),
        apiClient.get(`/resource/Employment Type?limit=100`),
      ]);
  
      const departments_options:any = departmentsRes?.data?.map((item: any) => ({
        value: item.name,
        label: item.name,
      })) ?? [];
      setState({departments_options});
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



  
      const designations:any = designationsRes?.data?.map((item: any) => ({
        value: item.name,
        label: item.name,
      })) ?? [];
      setState({designations_options:designations});
  
      const employmentTypes:any = employmentTypesRes?.data?.map((item: any) => ({
        value: item.name,
        label: item.name,
      })) ?? [];
      setState({employment_types_options:employmentTypes});
  
      // ✅ single update, no overwrite
   
  
    } catch (err) {
      console.error("❌ Error fetching form options:", err);
    }
  };
  
  
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const res: any = await apiClient.get(
          '/resource/Attendance Policies'
        );
        console.log(res,"resp");
  
  
        if (res && Array.isArray(res.data)) {
          const transformedEmployees = res.data.map((emp: APIEmployee) => ({
            name: emp.name || "",
            attendance_device_id: emp.attendance_device_id || "",
            employee_name: emp.employee_name || "",
            branch: emp.branch || "",
            designation: emp.designation || "",
            department: emp.department || "",
            cell_number: emp.cell_number || "",
            custom_employment_category: emp.custom_employment_category || "",
            employment_type: emp.employment_type || "",
          }));
          setEmployees(transformedEmployees);
        }
  
        // parallel or sequential fetch
      fetchFormOptions();
      } catch (err: any) {
        console.error("API error ❌", err.response?.data || err.message);
      }
    };
  
    fetchAll();
    fetchFormOptions();
  }, []);

  
  const columns = [
    {
      key: "action",
      label: "Action",
      searchable: false,
      render: () => (
        <div className="flex gap-2">
          <Trash size={16} color={defaultColor?.main_blue} />
          <Edit size={16} color={defaultColor?.main_blue} />
          <SquareUserRound size={16} color={defaultColor?.main_blue} />
        </div>
      ),
    },
    { key: "sno", label: "S.no", searchable: false },
    { key: "code", label: "Code", searchable: false },
    { key: "policy_name", label: "Policy Name", searchable: false },
    { key: "policy_type", label: "Policy Type", searchable: false },

   
  ];
  // function for cehcking mandotary fields

  // create employee function

  // eidtable datable work
  const columns_edit:any = [
    { key: "name", label: "Name", editable: true, type: "input" },
    {
      key: "status",
      label: "Status",
      editable: true,
      type: "select",
      options: ["Active", "Inactive", "Pending"],
    },
    { key: "role", label: "Role", editable: false }, // Non-editable field
  ];
  const initialData = [
    { id: 1, name: "Alice", status: "Active", role: "Admin" },
    { id: 2, name: "Bob", status: "Inactive", role: "User" },
    { id: 3, name: "Charlie", status: "Pending", role: "Manager" },
  ];

  const handleDataChange = (updatedData: any[]) => {
    console.log("Updated Table Data:", updatedData);
  };
  //


 
  return (
    <DashboardLayout>
      <div className="p-4 h-[calc(100vh-120px)] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-semibold text-gray-800">
            Attendance Policy
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
              New 
            </button>
          </div>
        </div>
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="text-gray-600">Loading...</div>
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
        title="Employee Profile"
        // description="This action cannot be undone. Are/ ou sure?"
        description={false}
        maxWidth="lg"
        // onSave={() => handleCreateEmployee()}
      >
        <div id="employee_profile-parent">
         
          <Box sx={{ width: "100%" }}>
            {/* Tabs header */}
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label="basic tabs example"
            >
              <Tab label="Personal Information" />
              <Tab label="Employment " />
            </Tabs>

            {/* Tab panels */}
            <TabPanel value={value} index={0}>
              <Grid container spacing={2}>
                <Grid
                  size={{
                    xs: 12,
                    md: 12,
                  }}
                  container
                  spacing={2}
                  key="employee_data"
                >
                  {state?.personalFormFields?.map(
                    (field: any, index: number) => {
                      return (
                        <Grid
                          key={field.input_name || `personal-${index}`}
                          size={{
                            xs: 12,
                            md: field.grid_size,
                          }}
                        >
                          {field?.type === "date" ? (
                            <CustomDateInputField
                              input_label={field.input_label}
                              input_name={field.input_name}
                              input_value={state[field.input_name]}
                              onchange={(
                                e: React.ChangeEvent<
                                  HTMLInputElement | HTMLTextAreaElement
                                >
                              ) =>
                                setState({
                                  ...state,
                                  [field.input_name]: e.target.value,
                                })
                              }
                              required
                            />
                          ) : field?.type === "select" ? (
                            <CustomSelectField
                              name="country"
                              label={field.input_label}
                              value={state[field.input_name]}
                              onChange={(e) =>
                                setState({
                                  ...state,
                                  [field.input_name]: e.target.value,
                                })
                              }
                              placeholder="Pays"
                              options={field.options}
                            />
                          ) : (
                            <CustomTextField
                              input_value={state[field.input_name]}
                              onchange={(
                                e: React.ChangeEvent<
                                  HTMLInputElement | HTMLTextAreaElement
                                >
                              ) =>
                                setState({
                                  ...state,
                                  [field.input_name]: e.target.value,
                                })
                              }
                              required
                              input_name={field.input_name}
                              error={!state[field.input_name]}
                              startIcon={field.startIcon}
                              placeholder={field.placeholder}
                              input_label={field.input_label}
                              isDisable={field.isDisable}
                            />
                          )}
                        </Grid>
                      );
                    }
                  )}
                </Grid>
              </Grid>
            </TabPanel>
            <TabPanel value={value} index={1}>
              <Grid container spacing={2}>
              <EditableDataTable
        columns={[
          { key: "name", label: "Name", editable: true, type: "input" },
          {
            key: "status",
            label: "Status",
            editable: true,
            type: "select",
            options: ["Active", "Inactive", "Pending"],
          },
          { key: "role", label: "Role", editable: false }, // Non-editable field
        ]}
        data={initialData}
        onDataChange={handleDataChange}
      />
              </Grid>
            </TabPanel>
          </Box>

         
        </div>
      </MuiDialog>
    </DashboardLayout>
  );
};

export default AttendancePolicy;
